import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://vibeguys-gilt.vercel.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

type Check = { name: string; passed: boolean; detail: string }

function inspectUrl(rawUrl: string | null, text: string): { checks: Check[]; status: 'passed' | 'flagged'; risk: 'low' | 'medium' | 'high'; summary: string } {
  const checks: Check[] = []
  let highRisk = false
  let mediumRisk = false

  if (!rawUrl) {
    checks.push({ name: 'https_url', passed: false, detail: 'No public HTTPS URL was provided.' })
    return { checks, status: 'flagged', risk: 'medium', summary: 'No URL to pre-check; administrator review is required.' }
  }

  try {
    const url = new URL(rawUrl)
    const safeProtocol = url.protocol === 'https:'
    checks.push({ name: 'https_url', passed: safeProtocol, detail: safeProtocol ? 'Uses HTTPS.' : 'Only HTTPS URLs are allowed.' })
    if (!safeProtocol) highRisk = true

    const host = url.hostname.toLowerCase()
    const privateHost = host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal') || /^(127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)
    checks.push({ name: 'public_host', passed: !privateHost, detail: privateHost ? 'Local or private-network host detected.' : 'Public hostname format.' })
    if (privateHost) highRisk = true

    const noCredentials = !url.username && !url.password
    checks.push({ name: 'url_credentials', passed: noCredentials, detail: noCredentials ? 'No URL-embedded credentials.' : 'URL-embedded credentials detected.' })
    if (!noCredentials) highRisk = true
  } catch {
    checks.push({ name: 'valid_url', passed: false, detail: 'The submitted URL is invalid.' })
    highRisk = true
  }

  const suspicious = /\b(password|passcode|seed phrase|wallet connect|verify account|bank login|gift card|crypto giveaway)\b/i.test(text)
  checks.push({ name: 'phishing_language', passed: !suspicious, detail: suspicious ? 'Credential or financial-solicitation language needs review.' : 'No common credential-harvesting phrase found.' })
  if (suspicious) mediumRisk = true

  if (highRisk) return { checks, status: 'flagged', risk: 'high', summary: 'High-risk URL signal found. This listing is blocked from publication pending review.' }
  if (mediumRisk) return { checks, status: 'flagged', risk: 'medium', summary: 'Potentially risky language found. Administrator review is required.' }
  return { checks, status: 'passed', risk: 'low', summary: 'Automated URL pre-check passed. Administrator approval is still required.' }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })

  const authorization = req.headers.get('Authorization')
  if (!authorization) return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: corsHeaders })

  const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
  const serviceKey = secretKeys.default
  if (!serviceKey) return new Response(JSON.stringify({ error: 'Scanner is not configured' }), { status: 500, headers: corsHeaders })
  const userClient = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey, {
    global: { headers: { Authorization: authorization } },
  })
  const { data: { user }, error: userError } = await userClient.auth.getUser()
  if (userError || !user) return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401, headers: corsHeaders })

  const { productId } = await req.json().catch(() => ({}))
  if (typeof productId !== 'string') return new Response(JSON.stringify({ error: 'productId is required' }), { status: 400, headers: corsHeaders })

  const adminClient = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey)

  const { data: product, error: productError } = await adminClient
    .from('products')
    .select('id,owner_id,website_url,name_en,tagline_en,description_en,status,moderation_status')
    .eq('id', productId)
    .single()
  if (productError || !product || product.owner_id !== user.id || product.status !== 'pending') {
    return new Response(JSON.stringify({ error: 'Submission not found' }), { status: 404, headers: corsHeaders })
  }

  const result = inspectUrl(product.website_url, [product.name_en, product.tagline_en, product.description_en].join(' '))
  const moderationStatus = result.status === 'passed' ? 'awaiting_admin' : 'needs_review'
  const { error: writeError } = await adminClient.from('security_scans').upsert({
    product_id: product.id,
    scanner_version: 'url-precheck-v1',
    status: result.status,
    risk_level: result.risk,
    checks: result.checks,
    summary: result.summary,
    scanned_at: new Date().toISOString(),
  }, { onConflict: 'product_id' })
  if (writeError) return new Response(JSON.stringify({ error: 'Could not store scan result' }), { status: 500, headers: corsHeaders })

  const { error: updateError } = await adminClient.from('products').update({
    security_scan_status: result.status,
    security_scan_summary: result.summary,
    moderation_status: moderationStatus,
  }).eq('id', product.id)
  if (updateError) return new Response(JSON.stringify({ error: 'Could not update submission' }), { status: 500, headers: corsHeaders })

  return new Response(JSON.stringify({ status: result.status, risk: result.risk, summary: result.summary }), { headers: corsHeaders })
})
