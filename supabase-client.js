/* Browser integration. Only a Supabase publishable key is used here. */
(async () => {
  const config = window.VIBEGUYS_CONFIG || {};
  const labels = { en:['Explore','Trending','Staff Picks','Support','Sign in','Submit a vibe'], ko:['탐색','인기','스태프 픽','후원','로그인','바이브 등록'] };
  const ko = () => document.documentElement.lang === 'ko';
  function setLanguage(next) {
    localStorage.setItem('vibeguys-language', next); document.documentElement.lang=next;
    document.querySelector('#language-toggle').textContent=next==='ko'?'EN':'KO';
    document.querySelectorAll('header nav button').forEach((el,i)=>el.textContent=labels[next][i]);
    const actions=document.querySelectorAll('.actions > button'); if(actions[1])actions[1].textContent=labels[next][4]; if(actions[3])actions[3].textContent=`${labels[next][5]} ↗`;
  }
  setLanguage(localStorage.getItem('vibeguys-language') || ((navigator.language||'').toLowerCase().startsWith('ko')?'ko':'en'));
  document.addEventListener('click',event=>{if(event.target.closest('[data-action="language"]'))setLanguage(ko()?'en':'ko')});
  const enabled = config.supabaseUrl && config.supabasePublishableKey && window.supabase;
  if(!enabled) return;
  const db=window.supabase.createClient(config.supabaseUrl,config.supabasePublishableKey); window.vibeSupabase=db;
  let products=[];
  async function syncSession(){const {data:{session}}=await db.auth.getSession();const button=document.querySelector('[data-action="sign"]');if(button)button.textContent=session?(session.user.user_metadata.full_name||'Account'):labels[document.documentElement.lang][4]}
  async function loadProducts(){const {data,error}=await db.from('products').select('id,slug,platform,category,pricing,name_en,name_ko,tagline_en,tagline_ko,description_en,description_ko,website_url,tags,staff_pick,featured,published_at,profiles!products_owner_id_fkey(display_name)').eq('status','published').order('published_at',{ascending:false});if(error){console.error('VibeGuys product load failed',error);return}products=data||[]}
  const value=(p,key)=>ko()&&p[`${key}_ko`] ? p[`${key}_ko`] : p[`${key}_en`];
  function catalogue(){
    const host=document.querySelector('#app'); const query=(document.querySelector('#supabase-search')?.value||'').toLowerCase(); const platform=document.querySelector('#platform-filter')?.value||'all'; const category=document.querySelector('#remote-category')?.value||'All';
    const visible=products.filter(p=>(platform==='all'||p.platform===platform||p.platform==='both')&&(category==='All'||p.category===category)&&(!query||[value(p,'name'),value(p,'tagline'),p.category,(p.tags||[]).join(' ')].join(' ').toLowerCase().includes(query)));
    const categories=['All',...new Set(products.map(p=>p.category))];
    host.innerHTML=`<section class="page"><div class="page-head"><p class="eyebrow">${ko()?'메뉴 둘러보기':'Looking at the menu'}</p><h1>${ko()?'웹과 앱에서 쓸모 있는 것들':'Useful things for web and app.'}</h1><p class="lead">${ko()?'기기 유형, 카테고리, 기능으로 탐색하세요.':'Filter by platform, category, or the problem you want solved.'}</p></div><div class="filters"><input id="supabase-search" placeholder="${ko()?'예: invoice, focus, weird':'Try invoice, focus, or weird'}"><select id="platform-filter"><option value="all">${ko()?'전체 플랫폼':'All platforms'}</option><option value="web">Web</option><option value="app">App</option><option value="both">Web + App</option></select><select id="remote-category">${categories.map(x=>`<option>${x}</option>`).join('')}</select></div><p class="count">${visible.length} ${ko()?'개의 바이브':'VIBES ON THE MENU'}</p>${visible.length?`<div class="grid">${visible.map(p=>`<article class="card"><div class="card-top"><span class="icon" style="--color:#d94b42">${p.platform==='app'?'A':p.platform==='both'?'↔':'W'}</span><span class="tag">${p.platform==='both'?'WEB + APP':p.platform.toUpperCase()}</span></div><h3>${value(p,'name')}</h3><p class="summary">${value(p,'tagline')}</p><div class="card-foot"><small>${p.category} · ${p.pricing}</small><a class="small primary" href="${p.website_url}" target="_blank" rel="noreferrer">${ko()?'사용해 보기 ↗':'Try it ↗'}</a></div></article>`).join('')}</div>`:`<div class="empty"><h2>${ko()?'아직 없어요.':'Nothing here yet.'}</h2><p>${ko()?'만들어 보시는 건 어때요?':'Maybe you should build it.'}</p></div>`}</section>`;
  }
  document.addEventListener('input',event=>{if(event.target.id==='supabase-search')catalogue()});
  document.addEventListener('change',event=>{if(['platform-filter','remote-category'].includes(event.target.id))catalogue()});
  function addPlatformField(){
    const form=document.querySelector('#submit-form'); if(!form||form.querySelector('[name="platform"]'))return;
    const field=document.createElement('label'); field.className='field';
    field.innerHTML=`<span>${ko()?'서비스 유형':'Platform'}</span><select name="platform"><option value="web">Web</option><option value="app">App</option><option value="both">Web + App</option></select>`;
    form.querySelector('[name="cat"]').closest('.field').after(field);
  }
  document.addEventListener('click',async event=>{
    const nav=event.target.closest('[data-view="explore"],[data-view="trending"],[data-view="staff"]');
    if(nav){event.preventDefault();event.stopImmediatePropagation();await loadProducts();catalogue();window.scrollTo(0,0);return}
    if(event.target.closest('[data-view="submit"]'))setTimeout(addPlatformField,0);
    if(!event.target.closest('[data-action="sign"]'))return;
    event.preventDefault();event.stopImmediatePropagation();const {data:{session:userSession}}=await db.auth.getSession();
    if(userSession){await db.auth.signOut();await syncSession();return}
    const {error}=await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});if(error)alert(error.message);
  },true);
  document.addEventListener('submit',async event=>{
    if(event.target.id!=='submit-form')return;
    event.preventDefault();event.stopImmediatePropagation();
    const {data:{user}}=await db.auth.getUser();
    if(!user){await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});return}
    const form=new FormData(event.target); const slug=form.get('name').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    const {error}=await db.from('products').insert({owner_id:user.id,slug:`${slug}-${Date.now().toString(36)}`,platform:form.get('platform')||'web',category:form.get('cat'),pricing:'free',name_en:form.get('name'),tagline_en:form.get('tag'),description_en:form.get('problem'),website_url:form.get('url'),tags:[]});
    if(error){alert(error.message);return}
    event.target.reset(); alert(ko()?'등록이 접수되었습니다. 검토 후 공개됩니다.':'Your vibe is submitted for review.');
  },true);
  db.auth.onAuthStateChange(()=>syncSession()); await syncSession(); await loadProducts();
})();
