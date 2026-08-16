/* Browser integration. Only a Supabase publishable key is used here. */
(async () => {
  const config = window.VIBEGUYS_CONFIG || {};
  const authRedirectUrl = config.authRedirectUrl || 'https://vibeguys-gilt.vercel.app/';
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
  const escapeHtml=value=>String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  function catalogue(){
    const host=document.querySelector('#app'); const query=(document.querySelector('#supabase-search')?.value||'').toLowerCase(); const platform=document.querySelector('#platform-filter')?.value||'all'; const category=document.querySelector('#remote-category')?.value||'All';
    const visible=products.filter(p=>(platform==='all'||p.platform===platform||p.platform==='both')&&(category==='All'||p.category===category)&&(!query||[value(p,'name'),value(p,'tagline'),p.category,(p.tags||[]).join(' ')].join(' ').toLowerCase().includes(query)));
    const categories=['All',...new Set(products.map(p=>p.category))];
    host.innerHTML=`<section class="page"><div class="page-head"><p class="eyebrow">${ko()?'메뉴 둘러보기':'Looking at the menu'}</p><h1>${ko()?'웹과 앱에서 쓸모 있는 것들':'Useful things for web and app.'}</h1><p class="lead">${ko()?'기기 유형, 카테고리, 기능으로 탐색하세요.':'Filter by platform, category, or the problem you want solved.'}</p></div><div class="filters"><input id="supabase-search" placeholder="${ko()?'예: invoice, focus, weird':'Try invoice, focus, or weird'}"><select id="platform-filter"><option value="all">${ko()?'전체 플랫폼':'All platforms'}</option><option value="web">Web</option><option value="app">App</option><option value="both">Web + App</option></select><select id="remote-category">${categories.map(x=>`<option>${x}</option>`).join('')}</select></div><p class="count">${visible.length} ${ko()?'개의 바이브':'VIBES ON THE MENU'}</p>${visible.length?`<div class="grid">${visible.map(p=>`<article class="card"><div class="card-top"><span class="icon" style="--color:#d94b42">${p.platform==='app'?'A':p.platform==='both'?'↔':'W'}</span><span class="tag">${p.platform==='both'?'WEB + APP':p.platform.toUpperCase()}</span></div><h3>${value(p,'name')}</h3><p class="summary">${value(p,'tagline')}</p><div class="card-foot"><small>${p.category} · ${p.pricing}</small><a class="small primary" href="${p.website_url}" target="_blank" rel="noreferrer">${ko()?'사용해 보기 ↗':'Try it ↗'}</a></div></article>`).join('')}</div>`:`<div class="empty"><h2>${ko()?'아직 없어요.':'Nothing here yet.'}</h2><p>${ko()?'만들어 보시는 건 어때요?':'Maybe you should build it.'}</p></div>`}</section>`;
  }
  document.addEventListener('input',event=>{if(event.target.id==='supabase-search')catalogue()});
  document.addEventListener('change',event=>{if(['platform-filter','remote-category'].includes(event.target.id))catalogue()});
  function addSubmissionFields(){
    const form=document.querySelector('#submit-form'); if(!form||form.querySelector('[name="listing_type"]'))return;
    form.querySelector('.check')?.remove();
    const nameLabel=form.querySelector('[name="name"]')?.closest('.field');
    const kind=document.createElement('label'); kind.className='field';
    kind.innerHTML=`<span>${ko()?'등록 유형':'Submission type'}</span><select name="listing_type"><option value="live">${ko()?'완성된 서비스 등록':'Publish a finished service'}</option><option value="funding">${ko()?'제작 중 프로젝트 · 후원 모집':'Project in progress · funding'}</option></select>`;
    nameLabel?.before(kind);
    const platform=document.createElement('label'); platform.className='field';
    platform.innerHTML=`<span>${ko()?'서비스 유형':'Platform'}</span><select name="platform"><option value="web">Web</option><option value="app">App</option><option value="both">Web + App</option></select>`;
    form.querySelector('[name="cat"]').closest('.field').after(platform);
    const funding=document.createElement('div'); funding.id='funding-fields'; funding.hidden=true;
    funding.innerHTML=`<label class="field"><span>${ko()?'모금 목표 (USD)':'Funding goal (USD)'}</span><input name="funding_goal" type="number" min="1" step="1" placeholder="5000"></label><label class="field"><span>${ko()?'모금 마감일':'Funding deadline'}</span><input name="funding_deadline" type="date"></label><label class="field"><span>${ko()?'후원 리워드 이름':'Reward title'}</span><input name="reward_title" placeholder="${ko()?'예: 얼리 서포터':'e.g. Early supporter'}"></label><label class="field"><span>${ko()?'후원 리워드 상세':'Reward details'}</span><textarea name="reward_description" placeholder="${ko()?'무엇을, 언제 제공하는지 구체적으로 적어주세요.':'State exactly what supporters receive and when.'}"></textarea></label><label class="field"><span>${ko()?'최소 후원금 (USD)':'Minimum pledge (USD)'}</span><input name="reward_amount" type="number" min="1" step="1" placeholder="10"></label>`;
    form.querySelector('[name="maker"]').closest('.field').before(funding);
    const legal=document.createElement('label'); legal.className='check';
    legal.innerHTML=`<input required type="checkbox" name="terms_accepted"> <span>${ko()?'피싱·악성코드·인증정보 수집을 금지하며, 등록물로 인한 등록자 및 해당 범위의 운영자 법적 책임, 자동 보안 사전검사·관리자 검토 정책에 동의합니다.':'I prohibit phishing, malware, and credential harvesting, and accept the registrant’s and, where applicable, operator’s legal responsibility together with the automated pre-check and administrator review policy.'}</span>`;
    form.querySelector('button[type="submit"],button.btn')?.before(legal);
    const url=form.querySelector('[name="url"]'); const urlLabel=url?.closest('.field');
    const sync=()=>{const fundingMode=form.elements.listing_type.value==='funding'; funding.hidden=!fundingMode; url.required=!fundingMode; if(urlLabel?.querySelector('span'))urlLabel.querySelector('span').textContent=fundingMode?(ko()?'프로토타입/소개 URL (선택)':'Prototype or project URL (optional)'):(ko()?'서비스 URL (HTTPS 필수)':'Live service URL (HTTPS required)'); for(const field of funding.querySelectorAll('input,textarea'))field.required=fundingMode;};
    form.addEventListener('change',event=>{if(event.target.name==='listing_type')sync()}); sync();
  }
  document.addEventListener('click',async event=>{
    const nav=event.target.closest('[data-view="explore"],[data-view="trending"],[data-view="staff"]');
    if(nav){event.preventDefault();event.stopImmediatePropagation();await loadProducts();catalogue();window.scrollTo(0,0);return}
    if(event.target.closest('[data-view="submit"]'))setTimeout(addSubmissionFields,0);
    if(!event.target.closest('[data-action="sign"]'))return;
    event.preventDefault();event.stopImmediatePropagation();const {data:{session:userSession}}=await db.auth.getSession();
    if(userSession){await db.auth.signOut();await syncSession();return}
    const {error}=await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:authRedirectUrl}});if(error)alert(error.message);
  },true);
  document.addEventListener('submit',async event=>{
    if(event.target.id!=='submit-form')return;
    event.preventDefault();event.stopImmediatePropagation();
    const {data:{user}}=await db.auth.getUser();
    if(!user){await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:authRedirectUrl}});return}
    const form=new FormData(event.target); const name=String(form.get('name')||''); const normalized=name.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g)||'vibe';
    const listingType=String(form.get('listing_type')||'live'); const websiteUrl=String(form.get('url')||'').trim()||null;
    const {data:product,error}=await db.from('products').insert({owner_id:user.id,slug:`${normalized}-${Date.now().toString(36)}`,platform:form.get('platform')||'web',listing_type:listingType,category:form.get('cat'),pricing:'free',name_en:name,tagline_en:form.get('tag'),description_en:form.get('problem'),website_url:websiteUrl,tags:[],terms_version:'2026-08-17',terms_accepted_at:new Date().toISOString()}).select('id').single();
    if(error){alert(error.message);return}
    if(listingType==='funding'){
      const rewardAmount=Number(form.get('reward_amount')); const {error:projectError}=await db.from('projects').insert({product_id:product.id,funding_goal:Number(form.get('funding_goal')),deadline:new Date(String(form.get('funding_deadline'))).toISOString(),reward_summary:form.get('reward_description'),prototype_url:websiteUrl,reward_tiers:[{amount:rewardAmount,title:form.get('reward_title'),description:form.get('reward_description')}]});
      if(projectError){alert(projectError.message);return}
    }
    const {data:scan,error:scanError}=await db.functions.invoke('security-precheck',{body:{productId:product.id}});
    event.target.reset(); alert(scanError?(ko()?'등록은 접수됐지만 자동 검사가 지연되었습니다. 관리자 검토 대기열로 보냈습니다.':'Submission received. The automated check is delayed, so it was sent to the review queue.'):(scan?.summary|| (ko()?'자동 검사가 완료됐습니다. 관리자 승인 후 공개됩니다.':'Automated pre-check complete. It will publish only after administrator approval.')));
  },true);
  async function adminDashboard(){
    const {data:{user}}=await db.auth.getUser(); if(!user){alert(ko()?'관리자 대시보드는 로그인 후 사용할 수 있습니다.':'Sign in to access the administrator dashboard.');return}
    const {data:isAdmin,error:roleError}=await db.rpc('is_vibeguys_admin'); if(roleError||!isAdmin){alert(ko()?'이 계정에는 관리자 권한이 없습니다.':'This account is not an administrator.');return}
    const {data:queue,error}=await db.from('products').select('id,name_en,tagline_en,website_url,listing_type,moderation_status,security_scan_status,security_scan_summary,created_at,profiles!products_owner_id_fkey(display_name),security_scans(status,risk_level,summary)').neq('moderation_status','approved').order('created_at',{ascending:true});
    if(error){alert(error.message);return}
    const host=document.querySelector('#app'); const items=queue||[]; const awaiting=items.filter(item=>item.moderation_status==='awaiting_admin'); const flagged=items.filter(item=>item.moderation_status==='needs_review'||item.moderation_status==='scan_pending'); const hidden=items.filter(item=>item.moderation_status==='hidden'||item.moderation_status==='rejected');
    const render=(title,subtitle,list)=>`<section class="info"><div class="head"><div><p class="eyebrow">${subtitle}</p><h2>${title} <small>${list.length}</small></h2></div></div>${list.length?`<div class="admin-queue">${list.map(item=>`<article class="admin-review"><div><span class="pill ${item.security_scan_status==='flagged'?'risk':''}">${escapeHtml(item.security_scan_status)}</span><p class="meta">${escapeHtml(item.listing_type)} · ${escapeHtml(item.profiles?.display_name)} · ${new Date(item.created_at).toLocaleDateString()}</p><h3>${escapeHtml(item.name_en)}</h3><p>${escapeHtml(item.tagline_en)}</p><p class="scan-copy">${escapeHtml(item.security_scan_summary||'Security pre-check has not completed.')}</p>${item.website_url?`<a href="${escapeHtml(item.website_url)}" target="_blank" rel="noreferrer">${ko()?'등록 URL 열기 ↗':'Open submitted URL ↗'}</a>`:''}</div><div class="admin-actions">${item.moderation_status!=='hidden'&&item.moderation_status!=='rejected'?`<button class="btn primary" data-admin-action="approve" data-product-id="${item.id}">${ko()?'승인·공개':'Approve & publish'}</button><button class="btn" data-admin-action="hide" data-product-id="${item.id}">${ko()?'비공개':'Hide'}</button>`:`<span>${ko()?'비공개 처리됨':'Hidden'}</span>`}</div></article>`).join('')}</div>`:`<div class="empty"><p>${ko()?'처리할 항목이 없습니다.':'No submissions in this queue.'}</p></div>`}</section>`;
    host.innerHTML=`<section class="page"><div class="page-head"><p class="eyebrow">${ko()?'관리자':'Administrator'}</p><h1>${ko()?'검토 대시보드':'Moderation desk'}</h1><p class="lead">${ko()?'자동 검사는 공개를 보장하지 않습니다. 운영자가 최종 승인 또는 비공개를 결정합니다.':'An automated pre-check never publishes a listing. An administrator makes the final publish or hide decision.'}</p></div>${render(ko()?'자동 검사 통과 · 미검토':'Pre-check passed · awaiting review','Human review',awaiting)}${render(ko()?'위험 신호 또는 검사 대기':'Risk signal or scan pending','Priority review',flagged)}${render(ko()?'비공개·거절':'Hidden or rejected','History',hidden)}</section>`; host.focus({preventScroll:true}); window.scrollTo(0,0);
  }
  document.addEventListener('click',async event=>{
    if(event.target.closest('[data-view="admin"]')){event.preventDefault();event.stopImmediatePropagation();await adminDashboard();return}
    const control=event.target.closest('[data-admin-action]'); if(!control)return; event.preventDefault();event.stopImmediatePropagation();
    const {data:isAdmin}=await db.rpc('is_vibeguys_admin'); if(!isAdmin){alert(ko()?'관리자 권한이 필요합니다.':'Administrator access required.');return}
    const id=control.dataset.productId; const approve=control.dataset.adminAction==='approve';
    const update=approve?{status:'published',moderation_status:'approved',published_at:new Date().toISOString(),reviewed_by:(await db.auth.getUser()).data.user.id,reviewed_at:new Date().toISOString()}:{status:'archived',moderation_status:'hidden',reviewed_by:(await db.auth.getUser()).data.user.id,reviewed_at:new Date().toISOString()};
    const {error}=await db.from('products').update(update).eq('id',id); if(error){alert(error.message);return}
    if(approve)await db.from('projects').update({status:'active'}).eq('product_id',id); else await db.from('projects').update({status:'closed'}).eq('product_id',id);
    await adminDashboard();
  },true);
  db.auth.onAuthStateChange(()=>syncSession()); await syncSession(); await loadProducts();
})();
