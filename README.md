# My App — Expo SDK 56 Template

A **local-first blog/post management** app built with Expo SDK 56. Uses on-device SQLite (via Drizzle ORM) for persistent storage, TanStack Query for server-state management, and React Native Paper for UI.

## Tech Stack

| Category         | Technology                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Framework        | [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/) + React Native 0.85                                              |
| Language         | TypeScript 6 (strict mode)                                                                                              |
| Routing          | [expo-router](https://docs.expo.dev/router/introduction/) v56 (file-based, typed routes)                                |
| Database         | SQLite via [expo-sqlite](https://docs.expo.dev/versions/v56.0.0/sdk/sqlite/) + [Drizzle ORM](https://orm.drizzle.team/) |
| UI Library       | [React Native Paper](https://callstack.github.io/react-native-paper/) v5 (Material Design 3)                            |
| State (server)   | [TanStack Query](https://tanstack.com/query/latest) v5                                                                  |
| State (client)   | [Zustand](https://github.com/pmndrs/zustand) v5 (declared, ready for use)                                               |
| Forms            | [react-hook-form](https://react-hook-form.com/) v7 + [Zod](https://zod.dev/) v4                                         |
| Icons            | [lucide-react-native](https://lucide.dev/guide/packages/lucide-react-native)                                            |
| Animations       | [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) 4.3                                      |
| Virtualized List | [@legendapp/list](https://legendapp.com/open-source/list/) v3                                                           |
| Layout Helpers   | [@mainamiru/react-native-ui](https://www.npmjs.com/package/@mainamiru/react-native-ui)                                  |
| Compiler         | React Compiler (experimental, enabled)                                                                                  |

## Quick Start

```bash
# Install dependencies
bun install

# Start the development server
bun start

# Platform-specific
bun run ios
bun run android
bun run web

# Database migrations (after schema changes)
bun run db:generate
bun run db:migrate
```

## Project Structure

```
app/                              # Expo Router (file-based routing)
  _layout.tsx                     # Root layout — providers, DB migrations
  +not-found.tsx                  # 404 → redirects to /
  (tabs)/                         # Bottom tab navigator
    _layout.tsx                   # Tab bar config (Home, Posts, Profile)
    index.tsx                     # Home — dashboard with stats + recent posts
    posts.tsx                     # Posts — list with pull-to-refresh + FAB
    profile.tsx                   # Profile — user info + settings menu
  (protected)/                    # Auth-gated screens (stack)
    _layout.tsx                   # Protected stack layout
    posts/
      add.tsx                     # Add Post — form with validation

src/
  client/
    index.ts                      # TanStack Query client config
  components/
    index.ts                      # Barrel exports
    input-field.tsx               # Reusable form input (react-hook-form + Paper)
    post-card.tsx                 # Post display card (Paper Card)
  constants/
    theme.ts                      # Colors (light/dark), Fonts, Spacing tokens
  db/
    index.ts                      # Drizzle DB initialization
    schema/
      index.ts                    # Barrel exports
      posts.schema.ts             # Posts table schema
      users.schema.ts             # Users table schema
    types/
      index.ts                    # Barrel exports
      post.ts                     # PostModel, PostCreateModel
      user.ts                     # UserModel, UserCreateModel
  global.css                      # Web font CSS custom properties
  hooks/
    use-color-scheme.ts           # Native color scheme
    use-color-scheme.web.ts       # Web-safe color scheme (hydration-safe)
    use-theme.ts                  # Returns Colors[light|dark]
  local-storage/
    index.ts                      # SQLite-backed key-value storage hook
  services/
    index.ts                      # Barrel exports
    posts-service.ts              # Posts data access layer (getPosts, createPost)
    users-service.ts              # Users data access layer (getUsers, getUserById)
  zod/
    index.ts                      # Barrel exports
    post.schema.ts                # Post validation schemas (create/update)
    user.schema.ts                # User validation schema (create)

drizzle/                          # Auto-generated migration files
  0000_glamorous_jigsaw.sql       # Initial migration (posts + users tables)
  migrations.js                   # Migration registry
  meta/                           # Migration metadata

assets/
  images/                         # App icons, splash screen, logos
  expo.icon/                      # App store icon assets
```

## Architecture

### Navigation

expo-router file-based routing with two route groups:

- **`(tabs)`** — Main tab navigator with 3 tabs: Home (`/`), Posts (`/posts`), Profile (`/profile`). Tab icons use `lucide-react-native`.
- **`(protected)`** — Stack navigator for authenticated screens. Currently contains only the Add Post screen (`/posts/add`). Intended to be wrapped with an auth guard.

Routes are type-safe via `typedRoutes: true` in `app.json`.

### Database & Drizzle ORM

SQLite database (`myapp.db`) managed through Drizzle ORM with Expo SQLite driver.

**Two tables:**

| posts                                 | users                                 |
| ------------------------------------- | ------------------------------------- |
| `id` (integer, PK)                    | `id` (integer, PK)                    |
| `title` (text)                        | `name` (text)                         |
| `userId` → `user_id` (integer)        | `email` (text, unique)                |
| `content` (text)                      | `avatar` (text, nullable)             |
| `createdAt` / `updatedAt` (text, ISO) | `createdAt` / `updatedAt` (text, ISO) |

**Pattern:** Service functions return Drizzle query builders (not awaited) to allow chaining:

```ts
// Service returns query builder
export function getPosts() {
  return db.select().from(posts);
}

// Caller chains .orderBy(), .where(), etc.
const data = await getPosts().orderBy(desc(posts.createdAt));
```

**Migrations** run automatically on app startup via `useMigrations()` in the root layout. The root layout also seeds a default user (id: 1, John Doe) on first launch.

**expo-sqlite config:** Full-text search enabled (except Android), SQLCipher encryption enabled (except Android), iOS custom SQLite compile flags.

### State Management

**Server state** — TanStack Query with a 5-minute stale time, manual refetch. All data fetching uses `useQuery` with descriptive query keys:

- `["posts"]` — All posts
- `["users"]` — All users
- `["user", id]` — Single user
- `["posts", "user", id]` — Posts by user

Mutations invalidate related queries on success.

**Client state** — Zustand v5 is available as a dependency. No stores are defined yet — ready for auth state, UI preferences, etc.

### UI Components & Theme

**Primary UI:** React Native Paper v5 (Material Design 3). Components used: `Text`, `Card`, `TextInput`, `Button`, `FAB`, `Avatar`, `List`, `Divider`, `HelperText`, `PaperProvider`.

**Theme system** — Custom `Colors` object with light/dark palettes:
| Token | Light | Dark |
|---|---|---|
| `text` | #000000 | #FFFFFF |
| `background` | #FFFFFF | #000000 |
| `backgroundElement` | #F0F0F3 | #212225 |
| `backgroundSelected` | #E0E1E6 | #2E3135 |
| `textSecondary` | #60646C | #B0B4BA |

Use the `useTheme()` hook to access the current color palette.

**Spacing scale:** `half` (2), `one` (4), `two` (8), `three` (16), `four` (24), `five` (32), `six` (64).

**Icons:** All icons use `lucide-react-native`.

### Forms & Validation

Forms use `react-hook-form` with Zod validation via `@hookform/resolvers`. A reusable `InputField` component wraps `Controller` from react-hook-form with React Native Paper's `TextInput`.

**Validation schemas:**

- `postCreateSchema` — `title` (required), `content` (required), `userId` (positive integer)
- `postUpdateSchema` — Partial version of create schema
- `userCreateSchema` — `name` (required), `email` (valid email), `password` (min 6 chars)

### Data Access Layer

Services in `src/services/` act as the data access layer:

| Service            | Functions                                                             |
| ------------------ | --------------------------------------------------------------------- |
| `posts-service.ts` | `getPosts()` — all posts, `createPost(post)` — insert with validation |
| `users-service.ts` | `getUsers()` — all users, `getUserById(id)` — single user             |

Services use Drizzle ORM for all database operations. Query results are managed by TanStack Query.

### Local Storage

A custom `useLocalStorage<T>(key, initialValue?)` hook provides SQLite-backed key-value storage (via `expo-sqlite/kv-store`). Returns `{ isLoading, error, value, getItemAsync, setItemAsync, deleteItemAsync }`. Values are JSON-serialized.

## Screens

### Home (`/`)

Dashboard with welcome header, stat cards (post count, user count), and the 3 most recent posts with a "See all" link to the Posts tab.

### Posts (`/posts`)

Scrollable list of all posts with pull-to-refresh and a floating action button to add new posts. Uses `LegendList` with view recycling.

### Profile (`/profile`)

Displays the default user (id: 1) with avatar initials, name, email, post count, member-since date, and a settings menu (Appearance, About, Clear Data).

### Add Post (`/posts/add`)

Form with title and content fields, validated with Zod. On successful submission, invalidates the posts query and navigates back.

## Scripts

| Command               | Description                                      |
| --------------------- | ------------------------------------------------ |
| `bun start`           | Start Expo development server                    |
| `bun run ios`         | Start on iOS simulator                           |
| `bun run android`     | Start on Android emulator                        |
| `bun run web`         | Start on web browser                             |
| `bun run lint`        | Run ESLint                                       |
| `bun run db:generate` | Generate Drizzle migrations after schema changes |
| `bun run db:migrate`  | Apply Drizzle migrations                         |

## Configuration Files

| File                | Purpose                                                                           |
| ------------------- | --------------------------------------------------------------------------------- |
| `app.json`          | Expo config: name, icons, splash screen, plugins, experiments                     |
| `metro.config.js`   | Metro bundler config (adds `.sql` extension support)                              |
| `babel.config.js`   | Babel config: `babel-preset-expo`, `inline-import` for `.sql`, Paper optimization |
| `drizzle.config.ts` | Drizzle Kit config: Expo driver, SQLite dialect, schema path                      |
| `tsconfig.json`     | TypeScript strict mode, path aliases (`@/` → `src/`, `@app/` → `app/`)            |

## Using This Template

This project is designed as a **starting template** for building Expo-based apps. Use it to jump-start development with a pre-configured stack.

### How to use

**1. Fork or clone the repository**

```bash
git clone https://github.com/mainamiru/expo-template.git my-app
cd my-app
bun install
```

**2. Customize app metadata**

Edit `app.json` to set your app's identity:

- `expo.name` — Display name
- `expo.slug` — URL slug
- `expo.scheme` — Deep link scheme
- `expo.version` — App version
- Icons and splash screen images in `assets/`

**3. (Optional) Reset the database**

- Delete `myapp.db` from device storage to start fresh
- Modify or remove the default user seed in `app/_layout.tsx`
- Edit Drizzle schemas in `src/db/schema/` and run `bun run db:generate`

**4. Build your features**

| Pattern             | Location          | What to do                                                  |
| ------------------- | ----------------- | ----------------------------------------------------------- |
| Add a table         | `src/db/schema/`  | Create a new schema file, update `index.ts`, run migrations |
| Add a service       | `src/services/`   | Create a data access layer for the new table                |
| Add a screen        | `app/`            | Create a file matching the route (e.g. `app/settings.tsx`)  |
| Add a component     | `src/components/` | Create the component, export from `index.ts`                |
| Add a Zod schema    | `src/zod/`        | Create a validation schema, export from `index.ts`          |
| Add a Zustand store | `src/stores/`     | Create a store (directory ready for use)                    |

**5. Add authentication**

The `(protected)` route group is already set up for auth-gated screens. Wire your auth solution (e.g. Clerk, Supabase, or custom) and add a layout guard in `app/(protected)/_layout.tsx`.

**6. Build and deploy**

```bash
bun run ios       # iOS build
bun run android   # Android build
bun run web       # Web (static output)
```

### Config files to review before publishing

| File                     | What to customize                               |
| ------------------------ | ----------------------------------------------- |
| `app.json`               | App name, slug, scheme, version, icons          |
| `assets/images/`         | Replace all icon and splash screen images       |
| `src/constants/theme.ts` | Adjust colors, spacing, fonts                   |
| `src/client/index.ts`    | Tune TanStack Query defaults (stale time, etc.) |

## Conventions

- **Services** return Drizzle query builders (not awaited) for callers to chain filters
- **Components** use inline styles with theme tokens from `useTheme()` and `Spacing`
- **Queries** use descriptive array keys for cache management
- **Validation** schemas live in `src/zod/` and are used by both services and forms
- **Types** are inferred from Drizzle schema using `InferSelectModel` / `InferInsertModel`
- **Route groups** — `(tabs)` for main navigation, `(protected)` for auth-gated screens
