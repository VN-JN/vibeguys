# VibeGuys MCP submission flow

The VibeGuys MCP server lets an AI editor inspect a local project and create a reviewable submission draft. It never publishes directly and does not receive a Supabase access token.

## User flow

1. Add the Streamable HTTP MCP server to Codex, Claude, or Cursor.
2. Ask: `Inspect this repository and prepare it for VibeGuys submission.`
3. The agent calls `prepare_project_submission` with details grounded in the repository.
4. Open the returned URL. The VibeGuys form is prefilled locally from the URL fragment.
5. Verify every field, add screenshots, sign in, accept the listing policy, and submit for moderation.

The fragment payload is not sent in the HTTP request or written to the database until the user submits the normal web form.

## Codex configuration

```toml
[mcp_servers.vibeguys]
url = "https://YOUR_PROJECT_REF.supabase.co/functions/v1/vibeguys-mcp"
```

In the ChatGPT desktop app or Codex IDE extension, choose **MCP servers > Add server > Streamable HTTP** and paste the same URL.

## Deploy

The function is configured as public in `supabase/config.toml` because it only validates metadata and returns a local review link. It performs no database or Storage operations.

```sh
supabase functions deploy vibeguys-mcp
supabase secrets set VIBEGUYS_APP_URL=https://YOUR_DEPLOYMENT.example/
```

Optionally set `VIBEGUYS_MCP_ALLOWED_ORIGINS` to a comma-separated list. Requests without an `Origin` header are accepted for native MCP clients; unrecognized browser origins receive HTTP 403.

## Protocol support

- MCP `2026-07-28` stateless Streamable HTTP, including `server/discover` and mirrored-header validation.
- Legacy initialization for `2025-11-25`, `2025-06-18`, and `2025-03-26` clients.
- Human review remains mandatory before any database write.
