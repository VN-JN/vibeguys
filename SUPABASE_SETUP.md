# Supabase and Google sign-in setup

1. Create a Supabase project, then run `supabase/schema.sql` in the SQL Editor.
2. In **Project Settings → API Keys**, copy the project URL and a **publishable** key into a local `config.js`. Never use a secret or service-role key in this browser app.
3. In **Authentication → Providers**, enable Google and add the Google OAuth client ID and secret created in Google Cloud Console.
4. Add each local/production callback URL to **Authentication → URL Configuration → Redirect URLs**. Use `http://localhost:4173/` locally and `https://vibeguys-gilt.vercel.app/` for the current Vercel deployment.
5. In Google Cloud Console, add the Supabase callback URL shown in the Google provider panel to the OAuth client's authorized redirect URIs.
6. Set the application Site URL to the production app URL before launch.

The browser uses `signInWithOAuth({ provider: 'google' })`. It stores no Google client secret. Supabase Auth creates the session, and the database trigger adds a profile record.

## Safety and operations

- Every exposed table has Row Level Security enabled. Do not disable it to fix an error.
- The `published` product policy makes discovery public; authors can only modify their own pending submissions.
- Admin approval, live payment confirmation, refunds, and sponsored placement require server-side/Edge Function code using a secret key; they are intentionally not browser operations.
- Run the SQL in a disposable project first, then check the Database Linter/Advisors before production.
