/* Browser integration. Only a Supabase publishable key is used here. */
(async () => {
  const config = window.VIBEGUYS_CONFIG || {};
  const authRedirectUrl = config.authRedirectUrl || 'https://vibeguys-gilt.vercel.app/';
  const labels = { en:['Explore','Popular','Staff Picks','Web','App','Sign in','Submit your product'], ko:['탐색','인기','스태프 픽','웹','앱','로그인','제품 등록'] };
  const koreanCopy={
    'Freshly tested tools, served daily':'오늘 갓 튀긴 바이브','Built fast. Chosen carefully.':'빨리 만들고, 맛있게 고릅니다.',
    'The good stuff from the vibe-coded internet':'쏟아지는 바이브 속, 오늘의 제대로 된 한 입','Too many vibes.':'신상은 넘치고.','We pick':'맛있는 것만 남깁니다','the good ones.':'다시 찾게 될 것만.',
    'Discover useful things people built with AI. Try them, rate them, and back the ones worth keeping around.':'하루에도 수많은 서비스가 쏟아집니다. VibeGuys는 한 입 써보고, 다시 찾게 될 만한 것만 메뉴에 올립니다.',
    'Explore vibes →':'오늘의 메뉴 보기 →','Submit your vibe':'내 메뉴 올리기','2,400+ curious people':'2,400명 이상의 얼리 유저','finding their next useful thing':'다음으로 꽂힐 메뉴를 찾는 중',
    "TODAY'S SPECIAL":'오늘의 스페셜','Browse the counter':'오늘의 카운터','What are you in the mood for?':'오늘은 어떤 메뉴가 당기나요?','See all vibes':'메뉴판 전체 보기',
    'Make stuff':'무언가 만들기','Design, writing & creative tools':'디자인, 글쓰기, 창작 도구','Get it done':'일 해치우기','Productivity without the guilt':'부담 없이 쓰는 생산성 도구',
    'Build better':'더 잘 만들기','Developer tools & tiny miracles':'개발 도구와 작은 기적','Just for fun':'그냥 재미로','The weird corner of the menu':'메뉴의 가장 독특한 구석',
    'Staff tasted, staff approved':'주방 테스트 완료','Worth a second look.':'다시 주문할 맛.','No paid placement. Just tools':'협찬 메뉴는 올리지 않습니다. 우리가 진짜로','we think earn their tab.':'다시 찾을 것만 올립니다.',
    'Fresh off the grill':'방금 튀겨 나온 신상','New on the menu.':'새 메뉴 나왔습니다.','Browse all 20 →':'신상 메뉴 전부 보기 →','Back a build':'맛있는 빌드를 밀어주자','Found a vibe':'계속 만들 가치 있는','with staying power?':'메뉴를 찾았나요?',
    'Good small products deserve a shot. Help their makers keep building — with a clearly stated 10% platform commission.':'좋은 작은 제품은 기회가 필요합니다. 명확히 고지된 10% 플랫폼 수수료와 함께 제작자를 후원하세요.',
    'See funding projects →':'후원 프로젝트 보기 →','Looking at the menu':'메뉴 살펴보기','Explore the menu':'메뉴 탐색','Search a name, maker, tag, or the thing you wish existed.':'이름, 제작자, 태그 또는 찾고 싶은 기능을 검색하세요.',
    'Try ‘invoice’, ‘focus’, or ‘weird’':'‘invoice’, ‘focus’, ‘weird’를 검색해 보세요','VIBES ON THE MENU':'개의 바이브가 메뉴에 있어요','Nothing here yet.':'아직 등록된 것이 없어요.','Maybe you should build it.':'원하시는 것을 직접 만들어 보세요.',
    'Put it on the menu →':'메뉴에 등록하기 →','Back to the menu':'메뉴로 돌아가기','Live':'운영 중','Try it ↗':'사용해 보기 ↗','Save it':'저장하기','Saved ✓':'저장됨 ✓','Review it':'후기 남기기',
    'VibeGuys rating':'VibeGuys 평점','Taste tests':'사용 후기','Backed so far':'현재 후원액','What it does':'어떤 서비스인가요?','What people said':'사용자 후기','Write a taste test →':'후기 작성 →',
    'Quiet vibe.':'아직 조용한 바이브예요.','Maybe it is underrated. Be the first to taste test it.':'아직 알려지지 않았을지도 몰라요. 첫 후기를 남겨 보세요.',
    'Open for support':'후원 진행 중','Keep':'계속 만들어 갈 수 있도록','cooking.':'후원해 주세요.','Back the build in a transparent demo checkout. Platform commission is always 10%.':'투명한 데모 결제로 프로젝트를 후원하세요. 플랫폼 수수료는 항상 10%입니다.',
    'Raised':'모인 금액','Goal':'목표 금액','Supporters':'후원자','Days left':'남은 기간','Support it →':'후원하기 →','Trust check':'신뢰 확인',
    'Support a build':'프로젝트 후원','Give the good ones a longer runway.':'좋은 제품이 더 오래 날 수 있게 도와주세요.','Demo contributions show the 10% platform commission before you continue. No real money moves in this MVP.':'데모 후원은 계속하기 전에 10% 플랫폼 수수료를 보여줍니다. 이 MVP에서는 실제 결제가 이뤄지지 않습니다.',
    'Back this build →':'이 프로젝트 후원 →','Where the money goes':'후원금은 어디로 가나요?','Put it on the menu':'메뉴에 등록하기','Built something?':'무언가 만드셨나요?',
    'Tell us what it does. New vibes go to the tasting counter for a moderation check before appearing publicly.':'어떤 서비스인지 알려주세요. 신규 등록은 공개 전에 검토 과정을 거칩니다.','Demo submission only':'데모 등록 전용','Submit a Vibe':'바이브 등록',
    'Product name':'서비스 이름','One-line description':'한 줄 설명','Website URL':'웹사이트 URL','Category':'카테고리','What problem does it solve?':'어떤 문제를 해결하나요?','Creator name':'제작자 이름','Send to the tasting counter →':'검토 대기열로 보내기 →',
    'Admin demo':'관리자 데모','The tasting counter.':'검토 대기열','A local-only moderation view. No actions persist outside this browser session.':'로컬 데모 검토 화면입니다. 이 화면의 작업은 브라우저 밖에 저장되지 않습니다.',
    'Vibe queue':'등록 대기열','Review moderation':'후기 검토','Reports':'신고','Needs a human look':'사람의 검토가 필요해요','Approve':'승인','Resolve':'처리','Review':'검토',
    'Placement rules':'노출 원칙','Fast-made, thoughtfully picked.':'빠르게 만들고, 신중하게 골랐습니다.','Saved':'저장됨','Save':'저장','Sign in':'로그인','Account':'계정',
    'Support':'후원','Explore':'탐색','Trending':'인기','Staff Picks':'스태프 픽','Free':'무료','Freemium':'프리미엄 체험','Paid':'유료','All':'전체','All platforms':'전체 플랫폼',
    'AI that helps':'AI가 돕습니다','Tools worth using':'쓸 만한 도구','Built by people with ideas':'아이디어 있는 사람들이 만든 것','Fresh from the internet':'인터넷에서 갓 온 것',
    'Browse all 20':'전체 20개 보기','Try':'사용해 보기','Productivity':'생산성','Design':'디자인','Developer Tools':'개발 도구','Lifestyle':'라이프스타일','Utilities':'유틸리티','Weird & Fun':'독특하고 재미있는 것',
    'Your calm command center for the projects that actually matter.':'정말 중요한 프로젝트를 위한 차분한 통합 공간입니다.','A calm command center for the projects that actually matter.':'중요한 프로젝트를 위한 차분한 통합 공간입니다.',
    'Turn scattered research into a story your team can use.':'흩어진 리서치를 팀이 활용할 수 있는 이야기로 바꿉니다.','Ship ideas before your coffee gets cold.':'커피가 식기 전에 아이디어를 출시하세요.',
    'A season-by-season memory for people who grow things.':'무언가를 기르는 사람을 위한 계절별 기록입니다.','Explain the tangled thing without opening a giant diagram tool.':'거대한 다이어그램 도구 없이도 복잡한 일을 설명합니다.',
    'Build a tiny picnic scene with strangers, one pixel at a time.':'낯선 사람들과 픽셀 하나씩 작은 피크닉 장면을 만듭니다.'
  };
  const koreanPlaceholders={'Try invoice, focus, or weird':'예: invoice, focus, weird','e.g. Invoice Snack':'예: Invoice Snack','What useful thing does it do?':'어떤 유용한 기능을 제공하나요?','https://':'https://'};
  const originalText=new WeakMap(),originalAttributes=new WeakMap(); let localizationQueued=false;
  function translateText(source){
    const trimmed=source.trim(); if(koreanCopy[trimmed])return source.replace(trimmed,koreanCopy[trimmed]);
    return source.replace(/(\d[\d,]*) reviews\b/g,'$1개 리뷰').replace(/(\d[\d,]*) taste tests\b/g,'$1개 사용 후기').replace(/\/mo\b/g,'/월').replace(/\bProductivity\b/g,'생산성').replace(/\bDeveloper Tools\b/g,'개발 도구').replace(/\bLifestyle\b/g,'라이프스타일').replace(/\bUtilities\b/g,'유틸리티').replace(/\bWeird & Fun\b/g,'독특하고 재미있는 것').replace(/\bDesign\b/g,'디자인').replace(/\bFree\b/g,'무료').replace(/\bTry\b/g,'사용해 보기');
  }
  function localizeDocument(){
    const korean=document.documentElement.lang==='ko'; const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); const nodes=[]; while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){const parent=node.parentElement;if(!parent||['SCRIPT','STYLE'].includes(parent.tagName))continue;if(!originalText.has(node))originalText.set(node,node.nodeValue);const source=originalText.get(node);const next=korean?translateText(source):source;if(node.nodeValue!==next)node.nodeValue=next;}
    for(const element of document.querySelectorAll('[placeholder],[title],[aria-label]')){let original=originalAttributes.get(element);if(!original){original={placeholder:element.getAttribute('placeholder'),title:element.getAttribute('title'),'aria-label':element.getAttribute('aria-label')};originalAttributes.set(element,original)}for(const attribute of Object.keys(original)){if(original[attribute]===null)continue;const translated=koreanCopy[original[attribute]]||koreanPlaceholders[original[attribute]];const next=korean&&translated?translated:original[attribute];if(element.getAttribute(attribute)!==next)element.setAttribute(attribute,next);}}
    document.title=korean?'VibeGuys — 바이브 코딩 인터넷의 좋은 것들':'VibeGuys — the good stuff from the vibe-coded internet';
  }
  function scheduleLocalization(){if(localizationQueued)return;localizationQueued=true;queueMicrotask(()=>{localizationQueued=false;localizeDocument();})}
  new MutationObserver(scheduleLocalization).observe(document.body,{childList:true,subtree:true,characterData:true});
  const ko = () => document.documentElement.lang === 'ko';
  function setLanguage(next) {
    localStorage.setItem('vibeguys-language', next); document.documentElement.lang=next;
    document.querySelector('#language-toggle').textContent=next==='ko'?'EN':'KO';
    document.querySelectorAll('header nav button').forEach((el,i)=>el.textContent=labels[next][i]);
    const actions=document.querySelectorAll('.actions > button'); if(actions[1])actions[1].textContent=labels[next][5]; if(actions[3])actions[3].textContent=labels[next][6]; localizeDocument();
  }
  setLanguage(localStorage.getItem('vibeguys-language') || ((navigator.language||'').toLowerCase().startsWith('ko')?'ko':'en'));
  document.addEventListener('click',event=>{if(event.target.closest('[data-action="language"]'))setLanguage(ko()?'en':'ko')});
  const enabled = config.supabaseUrl && config.supabasePublishableKey && window.supabase;
  if(!enabled) return;
  const db=window.supabase.createClient(config.supabaseUrl,config.supabasePublishableKey); window.vibeSupabase=db;
  let products=[]; let catalogueMode='explore';
  async function syncSession(){const {data:{session}}=await db.auth.getSession();const button=document.querySelector('[data-action="sign"]');if(button)button.textContent=session?(session.user.user_metadata.full_name||'Account'):labels[document.documentElement.lang][5]}
  async function loadProducts(){
    const baseFields='id,slug,platform,category,pricing,name_en,name_ko,tagline_en,tagline_ko,description_en,description_ko,website_url,tags,staff_pick,featured,published_at,visit_count,review_count,profiles!products_owner_id_fkey(display_name)';
    const storefrontFields=',developer_name,header_image_url,screenshot_urls,release_stage,site_verified_at,site_verified_by';
    let response=await db.from('products').select(baseFields+storefrontFields).eq('status','published').order('published_at',{ascending:false});
    if(response.error?.code==='42703')response=await db.from('products').select(baseFields).eq('status','published').order('published_at',{ascending:false});
    if(response.error){console.error('VibeGuys product load failed',JSON.stringify(response.error));return}
    products=response.data||[];
  }
  const value=(p,key)=>ko()&&p[`${key}_ko`] ? p[`${key}_ko`] : p[`${key}_en`];
  const escapeHtml=value=>String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  function catalogue(mode='explore',fixedPlatform=''){
    catalogueMode=mode;
    const host=document.querySelector('#app'); const query=(document.querySelector('#supabase-search')?.value||'').toLowerCase(); const platform=fixedPlatform||document.querySelector('#platform-filter')?.value||'all'; const category=document.querySelector('#remote-category')?.value||'All';
    const ranked=mode==='trending'?products.filter(p=>(p.visit_count||0)>=30||(p.review_count||0)>=3).sort((a,b)=>((b.visit_count||0)+((b.review_count||0)*10))-((a.visit_count||0)+((a.review_count||0)*10))):mode==='staff'?products.filter(p=>p.staff_pick):products;
    const visible=ranked.filter(p=>(platform==='all'||p.platform===platform||p.platform==='both')&&(category==='All'||p.category===category)&&(!query||[value(p,'name'),value(p,'tagline'),p.category,(p.tags||[]).join(' ')].join(' ').toLowerCase().includes(query)));
    document.body.dataset.activeView=mode;document.querySelectorAll('body>header nav [data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===mode));
    if(mode==='explore'&&window.VibeGuysExplore){window.VibeGuysExplore.render(ranked,{source:'supabase',reset:true});return}
    if(mode==='trending'&&window.VibeGuysPopular){window.VibeGuysPopular.render(ranked,{source:'supabase'});return}
    const categories=['All',...new Set(products.map(p=>p.category))];
    const copy=mode==='trending'?{eyebrow:ko()?'검증된 반응':'Earned attention',title:ko()?'인기 있는 바이브':'Popular vibes',lead:ko()?'최근 7일 내 VibeGuys 방문 30회 또는 리뷰 3개 이상인 승인작만 보여드립니다.':'Only approved listings with 30 VibeGuys visits or 3 reviews appear here.'}:mode==='staff'?{eyebrow:ko()?'운영자 검토':'Editorial review',title:ko()?'스태프 픽':'Staff picks',lead:ko()?'운영자가 직접 검토해 고른 승인작입니다.':'Approved listings selected through editorial review.'}:{eyebrow:ko()?'새로 승인된 서비스':'Freshly approved',title:ko()?'새로운 바이브':'New vibes',lead:ko()?'검토와 보안 사전검사를 마친 최신 등록작입니다.':'The newest listings that passed pre-check and administrator review.'};
    host.innerHTML=`<section class="page"><div class="page-head"><p class="eyebrow">${copy.eyebrow}</p><h1>${copy.title}</h1><p class="lead">${copy.lead}</p></div><div class="filters"><input id="supabase-search" placeholder="${ko()?'예: invoice, focus, weird':'Try invoice, focus, or weird'}"><select id="platform-filter"><option value="all" ${platform==='all'?'selected':''}>${ko()?'전체 플랫폼':'All platforms'}</option><option value="web" ${platform==='web'?'selected':''}>Web</option><option value="app" ${platform==='app'?'selected':''}>App</option><option value="both" ${platform==='both'?'selected':''}>Web + App</option></select><select id="remote-category">${categories.map(x=>`<option>${x}</option>`).join('')}</select></div><p class="count">${visible.length} ${ko()?'개의 바이브':'VIBES ON THE MENU'}</p>${visible.length?`<div class="grid">${visible.map(p=>`<article class="card"><div class="card-top"><span class="icon" style="--color:#d94b42">${p.platform==='app'?'A':p.platform==='both'?'↔':'W'}</span><span class="tag">${p.platform==='both'?'WEB + APP':p.platform.toUpperCase()}</span></div><h3>${value(p,'name')}</h3><p class="summary">${value(p,'tagline')}</p><div class="card-foot"><small>${p.category} · ${p.pricing}<br>${ko()?'방문':'Visits'} ${p.visit_count||0} · ${ko()?'리뷰':'Reviews'} ${p.review_count||0}</small><span><button class="small" data-remote-review="${p.id}">${ko()?'리뷰':'Reviews'}</button>${p.website_url?`<a class="small primary" data-product-visit="${p.id}" href="${p.website_url}" target="_blank" rel="noreferrer">${ko()?'사용해 보기 ↗':'Try it ↗'}</a>`:''}</span></div></article>`).join('')}</div>`:`<div class="empty"><h2>${ko()?'아직 없어요.':'Nothing here yet.'}</h2><p>${mode==='trending'?(ko()?'기준을 충족한 인기 등록작이 아직 없습니다.':'No approved listing has met the popularity threshold yet.'):(ko()?'만들어 보시는 건 어때요?':'Maybe you should build it.')}</p></div>`}</section>`;
    host.querySelectorAll('.card').forEach((card,index)=>{card.dataset.storeProduct=visible[index]?.id||'';card.tabIndex=0});
  }
  function openStore(productId){const p=products.find(item=>item.id===productId);if(!p)return;const title=value(p,'name'),maker=p.developer_name||p.profiles?.display_name||'Independent maker',shots=(p.screenshot_urls||[]).filter(url=>url.startsWith('https://'));document.querySelector('#app').innerHTML=`<section class="store-page"><button class="back" data-view="explore">← ${ko()?'메뉴로':'Back to menu'}</button><div class="store-hero"><div><p class="eyebrow">${escapeHtml(p.category)} · ${escapeHtml(p.release_stage||'released')}</p><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(value(p,'tagline'))}</p><p class="maker">${p.site_verified_at?'✓ ':''}${ko()?'제작':'Created by'} ${escapeHtml(maker)}</p><div class="buttons">${p.website_url?`<a class="btn primary" data-product-visit="${p.id}" href="${escapeHtml(p.website_url)}" target="_blank" rel="noreferrer">${ko()?'사용해 보기 ↗':'Visit service ↗'}</a>`:''}<button class="btn" data-remote-review="${p.id}">${ko()?'리뷰':'Reviews'}</button></div></div></div><section class="store-body"><div><h2>${ko()?'어떤 서비스인가요?':'About this service'}</h2><p>${escapeHtml(value(p,'description')||value(p,'tagline'))}</p>${shots.length?`<div class="screenshots">${shots.map(url=>`<img src="${escapeHtml(url)}" alt="${escapeHtml(title)} screenshot" loading="lazy">`).join('')}</div>`:''}</div><aside class="store-side"><b>${p.platform==='both'?'WEB + APP':p.platform.toUpperCase()}</b><span>${escapeHtml(p.pricing)}</span><span>${ko()?'방문':'Visits'} ${p.visit_count||0}</span><span>${ko()?'리뷰':'Reviews'} ${p.review_count||0}</span><button class="text-btn" data-claim-product="${p.id}">${ko()?'이 웹사이트의 소유자인가요?':'Own this website?'}</button></aside></section></section>`;window.scrollTo(0,0)}
  document.addEventListener('input',event=>{if(event.target.id==='supabase-search')catalogue(catalogueMode)});
  document.addEventListener('change',event=>{if(['platform-filter','remote-category'].includes(event.target.id))catalogue(catalogueMode)});
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
    const storefront=document.createElement('div'); storefront.className='storefront-fields';
    storefront.innerHTML=`<p class="form-note">${ko()?'스토어 페이지를 더 정확하게 꾸며 주세요. 도메인 인증을 마친 제작자는 언제든 내용을 갱신할 수 있습니다.':'Add clear store-page information. Domain-verified owners can update it anytime.'}</p><label class="field"><span>${ko()?'출시 상태':'Release stage'}</span><select name="release_stage"><option value="released">${ko()?'정식 출시':'Released'}</option><option value="early_access">${ko()?'얼리 액세스':'Early access'}</option><option value="in_development">${ko()?'개발 중':'In development'}</option></select></label><label class="field"><span>${ko()?'헤더 이미지 URL (선택)':'Header image URL (optional)'}</span><input name="header_image_url" type="url" placeholder="https://"></label><label class="field"><span>${ko()?'스크린샷 URL (쉼표로 구분)':'Screenshot URLs (comma separated)'}</span><textarea name="screenshot_urls" placeholder="https://…"></textarea></label>`;
    platform.after(storefront);
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
    if(nav){event.preventDefault();event.stopImmediatePropagation();await loadProducts();catalogue(nav.dataset.view);window.scrollTo(0,0);return}
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
    let domain=null;try{domain=websiteUrl?new URL(websiteUrl).hostname.toLowerCase().replace(/^www\\./,''):null}catch{} if(domain){const {data:existing}=await db.from('products').select('id').eq('canonical_domain',domain).maybeSingle();if(existing){alert(ko()?'이미 등록된 웹사이트입니다. 도메인 소유권 인증 후 기존 등록을 관리할 수 있습니다.':'This website is already listed. Verify domain ownership to manage the existing listing.');return}}
    const screenshots=String(form.get('screenshot_urls')||'').split(',').map(url=>url.trim()).filter(url=>url.startsWith('https://'));
    const {data:product,error}=await db.from('products').insert({owner_id:user.id,slug:`${normalized}-${Date.now().toString(36)}`,platform:form.get('platform')||'web',listing_type:listingType,category:form.get('cat'),pricing:'free',name_en:name,tagline_en:form.get('tag'),description_en:form.get('problem'),website_url:websiteUrl,developer_name:form.get('maker'),header_image_url:String(form.get('header_image_url')||'').trim()||null,screenshot_urls:screenshots,release_stage:form.get('release_stage')||'released',tags:[],terms_version:'2026-08-17',terms_accepted_at:new Date().toISOString()}).select('id').single();
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
  const visitorKey=()=>{let key=localStorage.getItem('vibeguys-visitor-key');if(!key){key=crypto.randomUUID();localStorage.setItem('vibeguys-visitor-key',key)}return key};
  async function recordVisit(productId){await db.from('product_visits').insert({product_id:productId,visitor_key:visitorKey()})}
  async function openReviews(productId){
    const {data:product,error}=await db.from('products').select('id,name_en,name_ko,reviews(id,title,body,source_language,translated_title_ko,translated_body_ko,translated_title_en,translated_body_en,created_at,profiles!reviews_user_id_fkey(display_name))').eq('id',productId).single(); if(error){alert(error.message);return}
    const reviews=product.reviews||[]; const title=ko()&&(product.name_ko||product.name_en)||product.name_en; const renderReview=r=>{const target=ko()?'ko':'en';const translatedTitle=target==='ko'?r.translated_title_ko:r.translated_title_en;const translatedBody=target==='ko'?r.translated_body_ko:r.translated_body_en;return `<article class="review"><h3>${escapeHtml(translatedTitle||r.title)}</h3><p>${escapeHtml(translatedBody||r.body)}</p><small>${escapeHtml(r.profiles?.display_name||'Vibe person')} · ${r.source_language.toUpperCase()}</small><div class="buttons"><button class="small" data-original-review="${r.id}">${ko()?'원문 보기':'View original'}</button>${!translatedTitle?`<button class="small" data-translate-review="${r.id}" data-target-language="${target}">${ko()?'자동 번역':'Translate'}</button>`:''}</div><p id="original-${r.id}" hidden>${escapeHtml(r.title)}<br>${escapeHtml(r.body)}</p></article>`};
    const modal=document.querySelector('#modal');modal.innerHTML=`<div class="modal-box"><button class="close" data-a="close">×</button><h2>${escapeHtml(title)} ${ko()?'리뷰':'Reviews'}</h2>${reviews.length?reviews.map(renderReview).join(''):`<p>${ko()?'아직 리뷰가 없습니다.':'No reviews yet.'}</p>`}<form id="remote-review-form"><input type="hidden" name="product_id" value="${product.id}"><label class="field"><span>${ko()?'리뷰 제목':'Review title'}</span><input required name="title"></label><label class="field"><span>${ko()?'리뷰 내용':'Review'}</span><textarea required name="body"></textarea></label><label class="field"><span>${ko()?'별점':'Rating'}</span><select name="rating"><option value="5">5 ★</option><option value="4">4 ★</option><option value="3">3 ★</option><option value="2">2 ★</option><option value="1">1 ★</option></select></label><button class="btn primary">${ko()?'Google 계정으로 리뷰 등록':'Post review with Google account'}</button></form></div>`;modal.showModal();
  }
  document.addEventListener('click',async event=>{
    const storeCard=event.target.closest('[data-store-product]');if(storeCard&&!event.target.closest('a,button')){openStore(storeCard.dataset.storeProduct);return}
    const claim=event.target.closest('[data-claim-product]');if(claim){const {data:{user}}=await db.auth.getUser();if(!user){await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:authRedirectUrl}});return}const {data,error}=await db.functions.invoke('site-ownership',{body:{action:'start',productId:claim.dataset.claimProduct}});if(error){alert(error.message);return}const modal=document.querySelector('#modal');modal.innerHTML=`<div class="modal-box"><button class="close" data-a="close">×</button><h2>${ko()?'웹사이트 소유권 인증':'Verify website ownership'}</h2><p>${ko()?'사이트 홈의 &lt;head&gt;에 아래 메타태그를 넣고 인증을 눌러 주세요. 24시간 후 만료됩니다.':'Place this meta tag in your site homepage &lt;head&gt;, then verify. It expires in 24 hours.'}</p><pre class="verification-code">&lt;meta name="vibeguys-site-verification" content="${data.token}"&gt;</pre><button class="btn primary" data-verify-product="${claim.dataset.claimProduct}">${ko()?'인증 확인':'Check verification'}</button></div>`;modal.showModal();return}
    const verify=event.target.closest('[data-verify-product]');if(verify){const {data,error}=await db.functions.invoke('site-ownership',{body:{action:'verify',productId:verify.dataset.verifyProduct}});if(error){alert(error.message);return}document.querySelector('#modal').close();alert(ko()?'소유권이 인증되었습니다. 이 등록을 관리할 수 있습니다.':'Ownership verified. You can now manage this listing.');return}
    const visit=event.target.closest('[data-product-visit]');if(visit)recordVisit(visit.dataset.productVisit);
    const reviews=event.target.closest('[data-remote-review]');if(reviews){event.preventDefault();await openReviews(reviews.dataset.remoteReview);return}
    const original=event.target.closest('[data-original-review]');if(original){const box=document.querySelector(`#original-${original.dataset.originalReview}`);if(box)box.hidden=!box.hidden;return}
    const translate=event.target.closest('[data-translate-review]');if(translate){const {error}=await db.functions.invoke('translate-review',{body:{reviewId:translate.dataset.translateReview,targetLanguage:translate.dataset.targetLanguage}});if(error){alert(ko()?'번역 서비스를 아직 설정하지 못했습니다.':'Translation service is not configured yet.');return}await openReviews(document.querySelector('#remote-review-form [name="product_id"]').value);}
  },true);
  document.addEventListener('submit',async event=>{if(event.target.id!=='remote-review-form')return;event.preventDefault();event.stopImmediatePropagation();const {data:{user}}=await db.auth.getUser();if(!user){await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:authRedirectUrl}});return}const form=new FormData(event.target);const body=String(form.get('body'));const language=/[가-힣]/.test(`${form.get('title')} ${body}`)?'ko':'en';const {error}=await db.from('reviews').insert({product_id:form.get('product_id'),user_id:user.id,rating:Number(form.get('rating')),title:form.get('title'),body,source_language:language});if(error){alert(error.message);return}document.querySelector('#modal').close();alert(ko()?'리뷰가 등록되었습니다.':'Review posted.');},true);
  db.auth.onAuthStateChange(()=>syncSession()); await syncSession(); await loadProducts();
})();
