# Supabase and Google sign-in setup

1. Create a Supabase project, then run `supabase/schema.sql` in the SQL Editor.
2. In **Project Settings → API Keys**, copy the project URL and a **publishable** key into a local `config.js`. Never use a secret or service-role key in this browser app.
3. In **Authentication → Providers**, enable Google and add the Google OAuth client ID and secret created in Google Cloud Console.
4. Add each local/production callback URL to **Authentication → URL Configuration → Redirect URLs**. Use `http://localhost:4173/` locally and `https://vibeguys-gilt.vercel.app/` for the current Vercel deployment.
5. In Google Cloud Console, add the Supabase callback URL shown in the Google provider panel to the OAuth client's authorized redirect URIs.
6. Set the application Site URL to the production app URL before launch.
7. Apply `supabase/20260817193000_submission_moderation.sql` after the base schema when setting up a fresh project. It adds the funding-project path, recorded policy acceptance, automated URL pre-check, and human moderation queue.
8. Apply `supabase/20260820110000_storefront_and_domain_claims.sql`, then deploy `supabase/site-ownership.ts` as the `site-ownership` Edge Function with JWT verification enabled. It prevents duplicate canonical domains and enables a maker to claim an existing listing by serving the generated `vibeguys-site-verification` meta tag on its HTTPS homepage.

## Moderation flow

Every submission starts private. Finished products and funding projects are both stored as pending submissions, then run through the `security-precheck` Edge Function. A pass means only that the basic URL/metadata pre-check found no configured risk signal; it is not a security guarantee. An administrator must explicitly publish or hide every submission in the Administrator dashboard. The first verified project owner is bootstrapped as an administrator; add later administrators directly to `public.admin_users` from the Supabase SQL Editor.

The user-facing policy text is in `LEGAL_NOTICE.md`. Have a qualified lawyer review it before public launch.

## Review translation

`supabase/translate-review.ts` stores a Korean or English translation beside the original review and always leaves the original available to readers. Before deploying it, add a Google Cloud Translation API key as the `GOOGLE_TRANSLATE_API_KEY` Edge Function secret and obtain explicit consent to send public review text to Google for translation. Do not put that key in `config.js`.

The browser uses `signInWithOAuth({ provider: 'google' })`. It stores no Google client secret. Supabase Auth creates the session, and the database trigger adds a profile record.

## Safety and operations

- Every exposed table has Row Level Security enabled. Do not disable it to fix an error.
- The `published` product policy makes discovery public; authors can only modify their own pending submissions.
- Admin approval, live payment confirmation, refunds, and sponsored placement require server-side/Edge Function code using a secret key; they are intentionally not browser operations.
- Domain verification fetches only the registered public HTTPS origin, rejects local/private hostnames, does not follow redirects, and waits five seconds at most. A successful token check transfers listing ownership; treat the Edge Function service key as a secret.
- Run the SQL in a disposable project first, then check the Database Linter/Advisors before production.
