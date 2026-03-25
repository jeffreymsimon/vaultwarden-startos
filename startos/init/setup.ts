import { setAdminToken } from '../actions/admin-token'
import { configJson } from '../fileModels/config.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { getVaultInterfaceUrls } from '../utils'

export const setup = sdk.setupOnInit(async (effects) => {
  const urls = await getVaultInterfaceUrls(effects)

  const config = await configJson
    .read((c) => ({ domain: c.domain, admin_token: c.admin_token }))
    .const(effects)

  if (!config?.domain) {
    // Only set domain on first run when no domain is configured.
    // Once set (via "Set Primary Domain" action or config), preserve it
    // across restarts — even if the interface URL list hasn't populated yet.
    const defaultUrl = urls[0]
    if (defaultUrl) {
      await configJson.merge(
        effects,
        { domain: defaultUrl },
        { allowWriteAfterConst: true },
      )
    }
  }

  if (!config?.admin_token) {
    await sdk.action.createOwnTask(effects, setAdminToken, 'critical', {
      reason: i18n('Create your Vaultwarden admin portal token'),
    })
  }
})
