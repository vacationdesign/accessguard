# Tools — a11yscope

## Enabled Capabilities

### File System
- Read, write, and edit files within `/home/user/accessguard`
- Create new files and directories as needed

### Shell Commands
- `npm run dev` — Start development server (port 3000)
- `npm run build` — Build for production
- `npm run lint` — Run ESLint checks
- `npx tsc --noEmit` — Type-check without emitting

### Git
- Commit with descriptive messages
- Create and switch branches
- Push to remote (non-force only)

### Web Access
- Fetch documentation and API references
- Search for solutions and best practices

## Blocked Capabilities

- No access to external databases or production Supabase
- No Stripe API calls in production mode
- No deployment triggers (Vercel deploys via git push)
- No modification of system files outside the project
