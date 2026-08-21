import { handleMcpRequest } from './mcp-core.ts'

const appUrl = Deno.env.get('VIBEGUYS_APP_URL') || 'https://vibeguys-gilt.vercel.app/'
const allowedOrigins = new Set(
  (Deno.env.get('VIBEGUYS_MCP_ALLOWED_ORIGINS') || 'https://vibeguys-gilt.vercel.app')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
)

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } })

  const origin = req.headers.get('Origin')
  if (origin && !allowedOrigins.has(origin)) {
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32000, message: 'Invalid Origin' } }), { status: 403, headers: jsonHeaders })
  }

  let body: any
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }), { status: 400, headers: jsonHeaders })
  }

  const result = handleMcpRequest(body, {
    protocolVersion: req.headers.get('MCP-Protocol-Version'),
    method: req.headers.get('Mcp-Method'),
    name: req.headers.get('Mcp-Name'),
  }, appUrl)

  if (!result.body) return new Response(null, { status: result.status })
  return new Response(JSON.stringify(result.body), { status: result.status, headers: jsonHeaders })
})
