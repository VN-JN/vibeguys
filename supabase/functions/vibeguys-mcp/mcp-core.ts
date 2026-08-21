export const MODERN_PROTOCOL_VERSION = '2026-07-28'
export const LEGACY_PROTOCOL_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26']
export const TOOL_NAME = 'prepare_project_submission'

type JsonRpcId = string | number | null
type JsonRpcRequest = {
  jsonrpc?: string
  id?: JsonRpcId
  method?: string
  params?: Record<string, unknown>
}

type McpHeaders = {
  protocolVersion?: string | null
  method?: string | null
  name?: string | null
}

type McpResponse = {
  status: number
  body?: Record<string, unknown>
}

const categories = ['AI', 'Productivity', 'Design', 'Developer Tools', 'Finance', 'Marketing', 'Education', 'Lifestyle', 'Games', 'Utilities']
const platforms = ['web', 'app', 'both']
const releaseStages = ['released', 'early_access', 'in_development']

const tool = {
  name: TOOL_NAME,
  title: 'Prepare a VibeGuys project submission',
  description: 'After inspecting the user\'s current project files, prepare a reviewable VibeGuys submission link. This does not publish or write to the database. The user opens the link, reviews the fields, adds screenshots, signs in, accepts the listing policy, and submits through the VibeGuys website.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 60, description: 'Product name.' },
      tagline: { type: 'string', minLength: 1, maxLength: 100, description: 'A clear one-line product description.' },
      description: { type: 'string', minLength: 1, maxLength: 2000, description: 'What the product does and who it is for.' },
      website_url: { type: 'string', format: 'uri', description: 'Public HTTPS product or deployment URL.' },
      creator_name: { type: 'string', minLength: 1, maxLength: 100, description: 'Creator, team, or studio name.' },
      category: { type: 'string', enum: categories },
      platform: { type: 'string', enum: platforms, default: 'web' },
      release_stage: { type: 'string', enum: releaseStages, default: 'released' },
      audience: { type: 'string', maxLength: 120, description: 'Primary target audience.' },
      problem_solved: { type: 'string', maxLength: 120, description: 'The main problem this product solves.' },
      tags: { type: 'array', maxItems: 5, items: { type: 'string', minLength: 1, maxLength: 30 } },
      github_url: { type: 'string', format: 'uri' },
      docs_url: { type: 'string', format: 'uri' },
      demo_url: { type: 'string', format: 'uri' },
      languages: { type: 'array', maxItems: 8, items: { type: 'string', minLength: 1, maxLength: 30 } },
    },
    required: ['name', 'tagline', 'description', 'website_url', 'creator_name', 'category'],
  },
  outputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      review_url: { type: 'string', format: 'uri' },
      next_step: { type: 'string' },
    },
    required: ['review_url', 'next_step'],
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
}

function rpcResult(id: JsonRpcId, result: Record<string, unknown>): Record<string, unknown> {
  return { jsonrpc: '2.0', id, result }
}

function rpcError(id: JsonRpcId, code: number, message: string, data?: Record<string, unknown>): Record<string, unknown> {
  return { jsonrpc: '2.0', id, error: { code, message, ...(data ? { data } : {}) } }
}

function toolError(message: string, modern: boolean): Record<string, unknown> {
  return {
    ...(modern ? { resultType: 'complete' } : {}),
    content: [{ type: 'text', text: message }],
    isError: true,
  }
}

function base64UrlEncode(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '')
}

function cleanText(value: unknown, field: string, max: number, required = false): string | undefined {
  if (value === undefined || value === null || value === '') {
    if (required) throw new Error(`${field} is required.`)
    return undefined
  }
  if (typeof value !== 'string') throw new Error(`${field} must be a string.`)
  const cleaned = value.trim()
  if (required && !cleaned) throw new Error(`${field} is required.`)
  if (cleaned.length > max) throw new Error(`${field} must be ${max} characters or fewer.`)
  return cleaned || undefined
}

function cleanHttpsUrl(value: unknown, field: string, required = false): string | undefined {
  const cleaned = cleanText(value, field, 2048, required)
  if (!cleaned) return undefined
  let url: URL
  try { url = new URL(cleaned) } catch { throw new Error(`${field} must be a valid URL.`) }
  if (url.protocol !== 'https:') throw new Error(`${field} must use HTTPS.`)
  return url.toString()
}

function cleanStringArray(value: unknown, field: string, limit: number): string[] | undefined {
  if (value === undefined) return undefined
  if (!Array.isArray(value)) throw new Error(`${field} must be an array.`)
  const result = [...new Set(value.map((item) => cleanText(item, field, 30, true)!))].slice(0, limit)
  return result.length ? result : undefined
}

export function normalizeDraft(argumentsValue: unknown): Record<string, unknown> {
  if (!argumentsValue || typeof argumentsValue !== 'object' || Array.isArray(argumentsValue)) throw new Error('Tool arguments must be an object.')
  const input = argumentsValue as Record<string, unknown>
  const category = cleanText(input.category, 'category', 40, true)!
  if (!categories.includes(category)) throw new Error(`category must be one of: ${categories.join(', ')}.`)
  const platform = cleanText(input.platform, 'platform', 12) || 'web'
  if (!platforms.includes(platform)) throw new Error(`platform must be one of: ${platforms.join(', ')}.`)
  const releaseStage = cleanText(input.release_stage, 'release_stage', 24) || 'released'
  if (!releaseStages.includes(releaseStage)) throw new Error(`release_stage must be one of: ${releaseStages.join(', ')}.`)

  return Object.fromEntries(Object.entries({
    version: 1,
    source: 'mcp',
    name: cleanText(input.name, 'name', 60, true),
    tagline: cleanText(input.tagline, 'tagline', 100, true),
    description: cleanText(input.description, 'description', 2000, true),
    website_url: cleanHttpsUrl(input.website_url, 'website_url', true),
    creator_name: cleanText(input.creator_name, 'creator_name', 100, true),
    category,
    platform,
    release_stage: releaseStage,
    audience: cleanText(input.audience, 'audience', 120),
    problem_solved: cleanText(input.problem_solved, 'problem_solved', 120),
    tags: cleanStringArray(input.tags, 'tags', 5),
    github_url: cleanHttpsUrl(input.github_url, 'github_url'),
    docs_url: cleanHttpsUrl(input.docs_url, 'docs_url'),
    demo_url: cleanHttpsUrl(input.demo_url, 'demo_url'),
    languages: cleanStringArray(input.languages, 'languages', 8),
  }).filter(([, value]) => value !== undefined))
}

export function createDraftUrl(argumentsValue: unknown, appUrl: string): string {
  const draft = normalizeDraft(argumentsValue)
  const base = new URL(appUrl)
  base.hash = `submit=${base64UrlEncode(JSON.stringify(draft))}`
  return base.toString()
}

function decodeHeaderValue(value: string | null | undefined): string | null {
  if (!value) return null
  const match = value.match(/^=\?base64\?([A-Za-z0-9+/=]+)\?=$/)
  if (!match) return value
  try {
    const binary = atob(match[1])
    return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))
  } catch { return null }
}

function modernValidation(request: JsonRpcRequest, headers: McpHeaders): string | null {
  const bodyVersion = (request.params?._meta as Record<string, unknown> | undefined)?.['io.modelcontextprotocol/protocolVersion']
  if (headers.protocolVersion !== MODERN_PROTOCOL_VERSION || bodyVersion !== MODERN_PROTOCOL_VERSION) return 'MCP-Protocol-Version header and request metadata must both be 2026-07-28.'
  if (headers.method !== request.method) return 'Mcp-Method header does not match the JSON-RPC method.'
  if (request.method === 'tools/call' && decodeHeaderValue(headers.name) !== request.params?.name) return 'Mcp-Name header does not match the requested tool.'
  return null
}

export function handleMcpRequest(request: JsonRpcRequest, headers: McpHeaders, appUrl: string): McpResponse {
  const id = request.id ?? null
  if (request.jsonrpc !== '2.0' || typeof request.method !== 'string') return { status: 400, body: rpcError(id, -32600, 'Invalid Request') }

  if (request.method === 'notifications/initialized' && request.id === undefined) return { status: 202 }

  if (request.method === 'initialize') {
    const requested = typeof request.params?.protocolVersion === 'string' ? request.params.protocolVersion : LEGACY_PROTOCOL_VERSIONS[0]
    const protocolVersion = LEGACY_PROTOCOL_VERSIONS.includes(requested) ? requested : LEGACY_PROTOCOL_VERSIONS[0]
    return { status: 200, body: rpcResult(id, {
      protocolVersion,
      capabilities: { tools: {} },
      serverInfo: { name: 'vibeguys-mcp', version: '1.0.0', description: 'Prepare reviewable VibeGuys project submissions.' },
      instructions: 'Inspect the current project before calling prepare_project_submission. The tool only creates a review link; tell the user to open it, verify every field, add screenshots, sign in, accept the policy, and submit on VibeGuys.',
    }) }
  }

  const bodyProtocolVersion = (request.params?._meta as Record<string, unknown> | undefined)?.['io.modelcontextprotocol/protocolVersion']
  const requestedModernVersion = typeof bodyProtocolVersion === 'string' ? bodyProtocolVersion : headers.protocolVersion
  if (requestedModernVersion && !LEGACY_PROTOCOL_VERSIONS.includes(requestedModernVersion) && requestedModernVersion !== MODERN_PROTOCOL_VERSION) {
    return { status: 400, body: rpcError(id, -32022, 'Unsupported protocol version', { supported: [MODERN_PROTOCOL_VERSION, ...LEGACY_PROTOCOL_VERSIONS], requested: requestedModernVersion }) }
  }
  const modern = requestedModernVersion === MODERN_PROTOCOL_VERSION
  if (modern) {
    const validationError = modernValidation(request, headers)
    if (validationError) return { status: 400, body: rpcError(id, -32020, `Header mismatch: ${validationError}`) }
  }

  if (request.method === 'server/discover') {
    return { status: 200, body: rpcResult(id, {
      resultType: 'complete',
      supportedVersions: [MODERN_PROTOCOL_VERSION, ...LEGACY_PROTOCOL_VERSIONS],
      capabilities: { tools: {} },
      _meta: { 'io.modelcontextprotocol/serverInfo': { name: 'vibeguys-mcp', version: '1.0.0' } },
      instructions: 'Inspect the current project first. Create a VibeGuys draft only when the required fields are grounded in repository files or confirmed by the user. The returned URL always requires human review before submission.',
      ttlMs: 3600000,
      cacheScope: 'public',
    }) }
  }

  if (request.method === 'ping') return { status: 200, body: rpcResult(id, {}) }

  if (request.method === 'tools/list') {
    return { status: 200, body: rpcResult(id, {
      ...(modern ? { resultType: 'complete', ttlMs: 3600000, cacheScope: 'public' } : {}),
      tools: [tool],
    }) }
  }

  if (request.method === 'tools/call') {
    if (request.params?.name !== TOOL_NAME) return { status: modern ? 404 : 200, body: rpcError(id, -32601, `Unknown tool: ${String(request.params?.name || '')}`) }
    try {
      const reviewUrl = createDraftUrl(request.params?.arguments, appUrl)
      const structuredContent = {
        review_url: reviewUrl,
        next_step: 'Open the review URL, verify the generated fields, add project screenshots, sign in, accept the listing policy, and submit for moderation.',
      }
      return { status: 200, body: rpcResult(id, {
        ...(modern ? { resultType: 'complete' } : {}),
        content: [{ type: 'text', text: `Your VibeGuys draft is ready. Open this link to review and finish the submission:\n${reviewUrl}\n\nNo project was published and no database write occurred.` }],
        structuredContent,
        isError: false,
      }) }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid submission data.'
      return { status: 200, body: rpcResult(id, toolError(message, modern)) }
    }
  }

  return { status: modern ? 404 : 200, body: rpcError(id, -32601, `Method not found: ${request.method}`) }
}
