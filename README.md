# Living With Coyotes — Coyote Coexistence Council (CCC)

Landing page for the **Coyote Coexistence Council**. Built with Next.js (App
Router) + Tailwind, with email sign-ups stored in Supabase, deployed on Vercel.

> Slogan: **Shared streets, wild balance.**

---

## 1. Local setup

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase values
npm run dev                         # http://localhost:3000
```

## 2. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL → New query**, paste in [`supabase/schema.sql`](supabase/schema.sql), and run it.
   This creates the `signups` table and a Row-Level-Security policy that lets
   anonymous visitors **insert** a signup but not read the list.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Paste both into `.env.local`.

View who signed up in Supabase under **Table Editor → signups**.

## 3. Deploy to Vercel

1. Push this folder to a Git repo (GitHub/GitLab).
2. In Vercel, **Add New → Project**, import the repo.
3. Add the two env vars (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) under **Settings → Environment Variables**.
4. Deploy.

## 4. Connect livingwithcoyotes.org

In Vercel: **Project → Settings → Domains → Add** `livingwithcoyotes.org`.
Vercel will show the records to add at your registrar. Standard values:

| Type  | Name / Host | Value                  |
| ----- | ----------- | ---------------------- |
| A     | `@`         | `76.76.21.21`          |
| CNAME | `www`       | `cname.vercel-dns.com` |

> Vercel may give you slightly different values — always use the ones shown in
> your project's Domains tab. DNS can take anywhere from a few minutes to a few
> hours to propagate. Vercel issues the SSL certificate automatically.

If you registered the domain **inside Vercel**, the DNS is wired for you — just
add the domain to the project.

---

## Project structure

```
app/
  actions.ts        Server action: validates + inserts a signup
  page.tsx          Landing page (hero, mission, tiers, principles, signup)
  layout.tsx        Metadata + root layout
  globals.css       Tailwind + base styles
components/
  SignupForm.tsx    Client form with success / error states
lib/
  supabase.ts       Supabase client
supabase/
  schema.sql        Table + RLS policy
```

## Notes

- The signup form captures **email**, optional **city**, and a **tier**
  (resident / municipality / expert / other) — matching CCC's four-tier
  participant structure.
- Duplicate emails are handled gracefully (treated as already-signed-up).
- To collect more later (a real discussion forum), add Supabase Auth + tables;
  the stack already supports it.
