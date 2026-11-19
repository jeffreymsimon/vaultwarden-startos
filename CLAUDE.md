@AGENTS.md

## 10fir fork notes
- Fork of Start9Labs/vaultwarden-startos with the Configure SSO (OIDC) action added. Rebase onto `upstream/master` to update; SSO i18n ids start at 101.
- Upstream Vaultwarden version: dockerTag in `startos/manifest/index.ts` (`vaultwarden/server:<version>-alpine`).
- Build: the Mac Docker context (media001) cannot pack s9pks (#2853); use `DOCKER_CONTEXT=evo001 BUILDX_BUILDER=evo001 make x86`.
