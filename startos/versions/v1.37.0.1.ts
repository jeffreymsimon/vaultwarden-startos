import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_1_37_0_1 = VersionInfo.of({
  version: '1.37.0:1',
  releaseNotes: {
    en_US: `**Required update for Bitwarden clients 2026.7.0 and later.** The 2026.7.0 Bitwarden clients (browser extension, desktop, and mobile) changed what they expect from the server API; against older Vaultwarden they fail at login with "an unexpected error has occurred". Vaultwarden 1.37.0 restores compatibility.

**After updating, force a sync in each client**, or log out and back in.

**Security fixes.** 1.37.0 resolves eight upstream advisories, all rated Medium: SSRF via the icon endpoint, cross-organization cipher access, cross-organization secret sharing, organization policy bypass on directory import, organization import authorization, organization data enumeration via the Manager role, Send access-count bypass, and unauthenticated WebSocket flooding.

Upstream release notes: https://github.com/dani-garcia/vaultwarden/releases/tag/1.37.0`,
  },
  // Binary-only bump (1.35.4-alpine -> 1.37.0-alpine). Vaultwarden migrates its
  // own SQLite schema on first start, so there is nothing for us to do here.
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
