# Branch Performance Dashboard

A Next.js dashboard for viewing branch performance metrics across business locations. The app includes Supabase authentication, a protected dashboard, summary cards, and a branches table.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Supabase
- Tailwind CSS
- shadcn/ui-style components

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser. The home page redirects to `/dashboard`; unauthenticated users are redirected to `/login`.

## Supabase Setup

The app expects Supabase Auth to be enabled and a `branches` table with these fields:

| Column | Type | Description |
| --- | --- | --- |
| `id` | `uuid` or `text` | Branch identifier |
| `name` | `text` | Branch name |
| `monthly_revenue` | `numeric` | Monthly revenue value |
| `open_inquiries` | `integer` | Number of open inquiries |
| `staff_count` | `integer` | Number of staff members |
| `performance_score` | `numeric` | Branch performance score |
| `created_at` | `timestamp` | Creation timestamp |
| `updated_at` | `timestamp` | Last update timestamp |

Users sign in with Supabase Auth credentials through `/login`.

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Project Structure

```text
app/
  api/
    auth/
    branches/
  dashboard/
  login/
components/
  dashboard/
  ui/
lib/
  supabase.ts
```

## Main Routes

- `/login` - sign in page
- `/dashboard` - protected branch performance dashboard
- `/api/auth/login` - creates an auth cookie after Supabase sign-in
- `/api/auth/logout` - clears the auth cookie
- `/api/branches` - returns branch records for authenticated users
