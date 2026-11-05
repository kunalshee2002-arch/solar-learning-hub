# Solar Learning Hub

A responsive React + Vite learning website with Supabase authentication, database and file storage.

## 1. Configure locally
1. Install Node.js (LTS).
2. Copy `.env.example` to `.env`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your Supabase Project URL and **Publishable** key.
4. Run `npm install`, then `npm run dev`.

## 2. Configure Supabase
1. Open Supabase > SQL Editor.
2. Run all SQL in `supabase/setup.sql`.
3. In Authentication > Providers, keep Email enabled. Disable public sign-ups after creating the administrator account.
4. In Authentication > Users, create the administrator user using your own email and a strong password.
5. Copy that user's UUID, or run the commented SQL at the end of `setup.sql` after replacing the email, to add the account to `public.admin_users`.
6. Test the admin login at `/admin`.

## 3. Deploy
1. Push this project to your private GitHub repository.
2. Import the repository into Vercel.
3. Add environment variables in Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Every time you push a code change to the connected branch, Vercel rebuilds the site.

## Security notes
- The browser uses only the Supabase **Publishable** key. Never add a `sb_secret_...` or service-role key to frontend code or Vercel public environment variables.
- Database and Storage access are protected by Row Level Security policies in `supabase/setup.sql`.
- Only users explicitly inserted into `public.admin_users` can manage content.
- Use a unique strong admin password and enable MFA in Supabase Auth if available.
- Public sign-ups should be disabled after the admin account is created.
- Public learning documents are intentionally readable by visitors. Upload only materials you have permission to share.
- Keep a backup of your GitHub repository and important learning materials.
- This starter does not yet include student accounts, quiz management, or editable site branding. Those can be added in the next development phase.
