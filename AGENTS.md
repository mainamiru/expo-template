# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Project Reset Instructions

When using this repo as a **template for a new project**, the AI must reset all template-specific content:

## 1. App Identity
- `package.json` — change `name`, `version` back to `1.0.0`
- `app.json` — update `expo.name`, `expo.slug`, `expo.scheme`
- `src/constants/theme.ts` — adjust colors, fonts, spacing for the new brand

## 2. Database
- Delete all `.sql` migration files in `drizzle/`
- Delete `drizzle/migrations.js` and `drizzle/meta/`
- Remove or modify the default user seed in `app/_layout.tsx`
- Run `bun run db:generate` to create fresh migrations
- Run `bun run db:migrate` to apply them

## 3. Documentation
- `README.md` — rewrite for the new project. Remove template-specific content (example screens, seed data references)
- `AGENTS.md` — keep project reset instructions, remove template-specific agent notes
- `LICENSE` — update if needed

## 4. Assets
- Replace all images in `assets/images/` (icons, splash, favicon)
- Replace `assets/expo.icon/` assets

## 5. Git
- Delete `.git/` and run `git init` to start fresh history
- Or use `git checkout --orphan` for a clean branch

## 6. Cleanup
- Remove unused screens, components, services, and schemas that don't apply to the new project
- Remove placeholder/example data and comments
