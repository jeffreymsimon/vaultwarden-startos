import { configJson } from '../fileModels/config.json'
import { sdk } from '../sdk'
import { i18n } from '../i18n'

const { InputSpec, Value } = sdk

export const ssoInputSpec = InputSpec.of({
  sso_enabled: Value.toggle({
    name: i18n('Enable SSO (OIDC)'),
    description: i18n(
      'Enable Single Sign-On via OpenID Connect. Requires an OIDC provider like Authentik.',
    ),
    default: false,
  }),
  sso_only: Value.toggle({
    name: i18n('SSO Only (Disable Password Login)'),
    description: i18n(
      'When enabled, users can only log in via SSO. Password login is disabled. Note: BW CLI does not support SSO.',
    ),
    default: false,
  }),
  sso_client_id: Value.text({
    name: i18n('OIDC Client ID'),
    description: i18n('Client ID from your OIDC provider'),
    required: false,
    default: '',
    placeholder: 'e.g. Pll2gRlozZOmwenblHfM...',
    masked: false,
    inputmode: 'text',
    patterns: [],
  }),
  sso_client_secret: Value.text({
    name: i18n('OIDC Client Secret'),
    description: i18n('Client secret from your OIDC provider'),
    required: false,
    default: '',
    placeholder: '',
    masked: true,
    inputmode: 'text',
    patterns: [],
  }),
  sso_authority: Value.text({
    name: i18n('OIDC Authority URL'),
    description: i18n(
      'Base URL of the OIDC provider with auto-discovery. Must end with trailing slash.',
    ),
    required: false,
    default: '',
    placeholder:
      'e.g. https://authentik.example.com/application/o/vaultwarden/',
    masked: false,
    inputmode: 'url',
    patterns: [],
  }),
  sso_pkce: Value.toggle({
    name: i18n('Enable PKCE'),
    description: i18n(
      'Use Proof Key for Code Exchange for additional security',
    ),
    default: true,
  }),
})

export const configureSso = sdk.Action.withInput(
  'configure-sso',

  async ({ effects }) => ({
    name: i18n('Configure SSO'),
    description: i18n(
      'Set up Single Sign-On via OpenID Connect (e.g. Authentik, Keycloak). Requires a restart to take effect.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  ssoInputSpec,

  async ({ effects }) => {
    const config = await configJson
      .read((c) => ({
        sso_enabled: c.sso_enabled,
        sso_only: c.sso_only,
        sso_client_id: c.sso_client_id,
        sso_client_secret: c.sso_client_secret,
        sso_authority: c.sso_authority,
        sso_pkce: c.sso_pkce,
      }))
      .once()
    return {
      sso_enabled: config?.sso_enabled ?? false,
      sso_only: config?.sso_only ?? false,
      sso_client_id: config?.sso_client_id ?? '',
      sso_client_secret: config?.sso_client_secret ?? '',
      sso_authority: config?.sso_authority ?? '',
      sso_pkce: config?.sso_pkce ?? true,
    }
  },

  async ({ effects, input }) => {
    await configJson.merge(effects, {
      sso_enabled: input.sso_enabled,
      sso_only: input.sso_only,
      sso_client_id: input.sso_client_id || undefined,
      sso_client_secret: input.sso_client_secret || undefined,
      sso_authority: input.sso_authority || undefined,
      sso_pkce: input.sso_pkce,
    })

    return {
      version: '1',
      title: i18n('SSO Configuration Saved'),
      message: i18n(
        'SSO settings have been saved. Restart Vaultwarden for changes to take effect.',
      ),
      result: null,
    }
  },
)
