import assert from 'node:assert/strict'
import { createDraftUrl, handleMcpRequest, MODERN_PROTOCOL_VERSION, TOOL_NAME } from './mcp-core.ts'

const validDraft = {
  name: '바이브 가이즈',
  tagline: 'Good vibes, real products.',
  description: '바이브 코딩 프로젝트를 발견하는 디렉토리',
  website_url: 'https://vibeguys.example/',
  creator_name: 'VibeGuys Team',
  category: 'Developer Tools',
  tags: ['MCP', 'vibe coding'],
}

const url = new URL(createDraftUrl(validDraft, 'https://vibeguys.example/'))
assert.equal(url.origin, 'https://vibeguys.example')
assert.match(url.hash, /^#submit=/)

const initialize = handleMcpRequest({
  jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25' },
}, {}, 'https://vibeguys.example/')
assert.equal(initialize.status, 200)
assert.equal((initialize.body?.result as Record<string, unknown>).protocolVersion, '2025-11-25')

const modernMeta = {
  'io.modelcontextprotocol/protocolVersion': MODERN_PROTOCOL_VERSION,
  'io.modelcontextprotocol/clientInfo': { name: 'test', version: '1' },
  'io.modelcontextprotocol/clientCapabilities': {},
}
const list = handleMcpRequest({
  jsonrpc: '2.0', id: 2, method: 'tools/list', params: { _meta: modernMeta },
}, { protocolVersion: MODERN_PROTOCOL_VERSION, method: 'tools/list' }, 'https://vibeguys.example/')
assert.equal(list.status, 200)
assert.equal((((list.body?.result as Record<string, unknown>).tools as Array<Record<string, unknown>>)[0]).name, TOOL_NAME)

const call = handleMcpRequest({
  jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: TOOL_NAME, arguments: validDraft, _meta: modernMeta },
}, { protocolVersion: MODERN_PROTOCOL_VERSION, method: 'tools/call', name: TOOL_NAME }, 'https://vibeguys.example/')
assert.equal(call.status, 200)
assert.equal((call.body?.result as Record<string, unknown>).isError, false)

const badOriginUrl = handleMcpRequest({
  jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: TOOL_NAME, arguments: { ...validDraft, website_url: 'http://localhost:3000' } },
}, {}, 'https://vibeguys.example/')
assert.equal((badOriginUrl.body?.result as Record<string, unknown>).isError, true)

const headerMismatch = handleMcpRequest({
  jsonrpc: '2.0', id: 5, method: 'tools/list', params: { _meta: modernMeta },
}, { protocolVersion: MODERN_PROTOCOL_VERSION, method: 'tools/call' }, 'https://vibeguys.example/')
assert.equal(headerMismatch.status, 400)

const unsupported = handleMcpRequest({
  jsonrpc: '2.0', id: 6, method: 'tools/list', params: { _meta: { ...modernMeta, 'io.modelcontextprotocol/protocolVersion': '2099-01-01' } },
}, { protocolVersion: '2099-01-01', method: 'tools/list' }, 'https://vibeguys.example/')
assert.equal(unsupported.status, 400)
assert.equal((unsupported.body?.error as Record<string, unknown>).code, -32022)

console.log('vibeguys-mcp core tests passed')
