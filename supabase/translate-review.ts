import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async req => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  const authorization=req.headers.get('Authorization'); if(!authorization)return new Response('Authentication required',{status:401})
  const keys=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}'); const serviceKey=keys.default; const apiKey=Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
  if(!serviceKey||!apiKey)return new Response(JSON.stringify({error:'Translation provider is not configured'}),{status:503,headers:{'Content-Type':'application/json'}})
  const client=createClient(Deno.env.get('SUPABASE_URL')!,serviceKey,{global:{headers:{Authorization:authorization}}}); const {data:{user}}=await client.auth.getUser();if(!user)return new Response('Invalid session',{status:401})
  const {reviewId,targetLanguage}=await req.json(); if(!['ko','en'].includes(targetLanguage)||typeof reviewId!=='string')return new Response('Invalid request',{status:400})
  const {data:review,error}=await client.from('reviews').select('id,title,body,source_language').eq('id',reviewId).single();if(error)return new Response('Review not found',{status:404})
  if(review.source_language===targetLanguage)return new Response(JSON.stringify({translated:false}),{headers:{'Content-Type':'application/json'}})
  const response=await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q:[review.title,review.body],source:review.source_language,target:targetLanguage,format:'text'})});
  if(!response.ok)return new Response(JSON.stringify({error:'Translation request failed'}),{status:502,headers:{'Content-Type':'application/json'}})
  const translated=(await response.json()).data.translations; const fields=targetLanguage==='ko'?{translated_title_ko:translated[0].translatedText,translated_body_ko:translated[1].translatedText}:{translated_title_en:translated[0].translatedText,translated_body_en:translated[1].translatedText};
  await client.from('reviews').update(fields).eq('id',review.id); return new Response(JSON.stringify({translated:true}),{headers:{'Content-Type':'application/json'}})
})
