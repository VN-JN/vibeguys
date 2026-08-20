import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders={'Access-Control-Allow-Origin':'https://vibeguys-gilt.vercel.app','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Content-Type':'application/json'}
const privateHost=(h:string)=>h==='localhost'||h.endsWith('.local')||h.endsWith('.internal')||/^(127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(h)
const tag=(html:string,token:string)=>{const escaped=token.replace(/[.*+?^$()|[\]\\]/g,'\\$&');return new RegExp('<meta[^>]+name=[\"\\\\']vibeguys-site-verification[\"\\\\'][^>]+content=[\"\\\\']'+escaped+'[\"\\\\']','i').test(html)||new RegExp('<meta[^>]+content=[\"\\\\']'+escaped+'[\"\\\\'][^>]+name=[\"\\\\']vibeguys-site-verification[\"\\\\']','i').test(html)}

Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders})
  if(req.method!=='POST')return new Response(JSON.stringify({error:'Method not allowed'}),{status:405,headers:corsHeaders})
  const authorization=req.headers.get('Authorization'),serviceKey=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}').default
  if(!authorization||!serviceKey)return new Response(JSON.stringify({error:'Authentication or service configuration required'}),{status:401,headers:corsHeaders})
  const session=createClient(Deno.env.get('SUPABASE_URL')!,serviceKey,{global:{headers:{Authorization:authorization}}})
  const {data:{user}}=await session.auth.getUser();if(!user)return new Response(JSON.stringify({error:'Invalid session'}),{status:401,headers:corsHeaders})
  const {action,productId}=await req.json().catch(()=>({}));if(!['start','verify'].includes(action)||typeof productId!=='string')return new Response(JSON.stringify({error:'Invalid request'}),{status:400,headers:corsHeaders})
  const admin=createClient(Deno.env.get('SUPABASE_URL')!,serviceKey)
  const {data:product}=await admin.from('products').select('id,website_url').eq('id',productId).single()
  if(!product?.website_url)return new Response(JSON.stringify({error:'No website to verify'}),{status:400,headers:corsHeaders})
  let url:URL;try{url=new URL(product.website_url)}catch{return new Response(JSON.stringify({error:'Invalid website URL'}),{status:400,headers:corsHeaders})}
  if(url.protocol!=='https:'||privateHost(url.hostname))return new Response(JSON.stringify({error:'Only public HTTPS websites may be verified'}),{status:400,headers:corsHeaders})
  if(action==='start'){const token=crypto.randomUUID(),expiresAt=new Date(Date.now()+86400000).toISOString();const {error}=await admin.from('product_domain_claims').upsert({product_id:productId,claimant_id:user.id,verification_token:token,status:'pending',expires_at:expiresAt,verified_at:null},{onConflict:'product_id'});if(error)return new Response(JSON.stringify({error:'Could not begin verification'}),{status:500,headers:corsHeaders});return new Response(JSON.stringify({token,expiresAt}),{headers:corsHeaders})}
  const {data:claim}=await admin.from('product_domain_claims').select('*').eq('product_id',productId).eq('claimant_id',user.id).eq('status','pending').single()
  if(!claim||new Date(claim.expires_at)<new Date())return new Response(JSON.stringify({error:'Verification request expired'}),{status:400,headers:corsHeaders})
  let html='';try{const response=await fetch(url.origin,{redirect:'manual',signal:AbortSignal.timeout(5000)});html=await response.text()}catch{return new Response(JSON.stringify({error:'Could not read website'}),{status:400,headers:corsHeaders})}
  if(!tag(html,claim.verification_token))return new Response(JSON.stringify({error:'Verification meta tag was not found'}),{status:400,headers:corsHeaders})
  const now=new Date().toISOString();await admin.from('products').update({owner_id:user.id,site_verified_at:now,site_verified_by:user.id}).eq('id',productId);await admin.from('product_domain_claims').update({status:'verified',verified_at:now}).eq('product_id',productId)
  return new Response(JSON.stringify({verified:true}),{headers:corsHeaders})
})
