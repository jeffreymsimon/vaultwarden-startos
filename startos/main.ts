import { configJson } from './fileModels/config.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info(i18n('Starting Vaultwarden!'))

  const config = await configJson.read().const(effects)
  if (!config) throw new Error('No config.json')

  // 10fir fork: SSO / OIDC. Vaultwarden also reads the sso_* keys from
  // /data/config.json, but the scope/signup/cache settings below exist only as
  // env vars here, so the whole SSO block is passed as environment.
  const ssoEnv: Record<string, string> =
    config.sso_enabled &&
    config.sso_client_id &&
    config.sso_client_secret &&
    config.sso_authority
      ? {
          SSO_ENABLED: 'true',
          SSO_ONLY: config.sso_only ? 'true' : 'false',
          SSO_CLIENT_ID: config.sso_client_id,
          SSO_CLIENT_SECRET: config.sso_client_secret,
          SSO_AUTHORITY: config.sso_authority,
          SSO_PKCE: config.sso_pkce ? 'true' : 'false',
          SSO_SCOPES: 'email profile offline_access',
          SSO_SIGNUPS_MATCH_EMAIL: 'true',
          SSO_CLIENT_CACHE_EXPIRATION: '0',
        }
      : {}

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'vaultwarden' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      }),
      'vaultwarden-sub',
    ),
    exec: {
      command: sdk.useEntrypoint(),
      env: ssoEnv,
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})
