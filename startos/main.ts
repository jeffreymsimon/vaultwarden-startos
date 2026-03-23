import { configJson } from './fileModels/config.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Vaultwarden!'))

  const config = await configJson.read().const(effects)
  if (!config) throw new Error('No config.json')

  const shellEscape = (s: string | number | boolean) => {
    return `'${String(s).replace(/'/g, "'\\''")}'`
  }

  // Build environment variables for SSO configuration
  const envVarsList: string[] = []

  if (
    config.sso_enabled &&
    config.sso_client_id &&
    config.sso_client_secret &&
    config.sso_authority
  ) {
    envVarsList.push(
      `SSO_ENABLED=true`,
      `SSO_ONLY=${config.sso_only ? 'true' : 'false'}`,
      `SSO_CLIENT_ID=${shellEscape(config.sso_client_id)}`,
      `SSO_CLIENT_SECRET=${shellEscape(config.sso_client_secret)}`,
      `SSO_AUTHORITY=${shellEscape(config.sso_authority)}`,
      `SSO_PKCE=${config.sso_pkce ? 'true' : 'false'}`,
      `SSO_SCOPES='email profile offline_access'`,
      `SSO_SIGNUPS_MATCH_EMAIL=true`,
      `SSO_CLIENT_CACHE_EXPIRATION=0`,
    )
  }

  // Set DOMAIN env var if configured
  if (config.domain) {
    envVarsList.push(`DOMAIN=${shellEscape(config.domain)}`)
  }

  const envVars =
    envVarsList.length > 0 ? envVarsList.join(' ') + ' ' : ''

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
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
      command:
        envVarsList.length > 0
          ? ['/bin/sh', '-c', `${envVars}exec /start.sh`]
          : sdk.useEntrypoint(),
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
