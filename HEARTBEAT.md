# Heartbeat — a11yscope Maintenance Tasks

## On Startup

- [ ] Verify `node_modules` exists; run `npm install` if missing
- [ ] Check that `npm run lint` passes
- [ ] Check that `npx tsc --noEmit` passes

## Daily (if enabled)

- [ ] Review open GitHub issues and summarize new ones
- [ ] Check for outdated dependencies with `npm outdated`

## Weekly (if enabled)

- [ ] Run full build (`npm run build`) and report any errors
- [ ] Check for security advisories with `npm audit`
