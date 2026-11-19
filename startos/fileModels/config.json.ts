import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.looseObject({
  domain: z.string().optional().catch(undefined),
  ip_header: z.string().catch('X-Forwarded-For'),
  admin_token: z.string().optional().catch(undefined),
  signups_allowed: z.boolean().catch(false),
  smtp_host: z.string().optional().catch(undefined),
  smtp_security: z.enum(['starttls', 'force_tls']).catch('starttls'),
  smtp_port: z.number().int().nonnegative().optional().catch(undefined),
  smtp_from: z.string().optional().catch(undefined),
  smtp_from_name: z.string().optional().catch(undefined),
  smtp_username: z.string().optional().catch(undefined),
  smtp_password: z.string().optional().catch(undefined),
  // 10fir fork: SSO / OpenID Connect (set by the Configure SSO action)
  sso_enabled: z.boolean().catch(false),
  sso_only: z.boolean().catch(false),
  sso_client_id: z.string().optional().catch(undefined),
  sso_client_secret: z.string().optional().catch(undefined),
  sso_authority: z.string().optional().catch(undefined),
  sso_pkce: z.boolean().catch(true),
})

export const configJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: '/config.json' },
  shape,
)
