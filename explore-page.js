/* Explore catalogue inspired by the supplied directory layout. Keeps the existing VibeGuys wordmark. */
(()=>{
  const fallbackShots=[
    'assets/focusflow-thumbnail.png',
    'assets/clipmind-thumbnail.png',
    'assets/habit-tracker-thumbnail.png',
    'assets/promptlab-thumbnail.png',
    'assets/product-dashboard-thumbnail-v1.png'
  ];
  const categoryOrder=['Developer Tools','Productivity','Design','Marketing','AI Tools','Business','Education','Entertainment','Finance','Health','Lifestyle','Utilities','Community','Weird & Fun'];
  const state={items:[],options:{},category:'all',platform:'all',stage:'all',price:'all',sort:'newest',layout:'grid'};
  const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const ko=()=>document.documentElement.lang==='ko';
  const copy=()=>ko()?{
    title:'EXPLORE',lead:'새로 등록되고 검증된 서비스를 확인해보세요.',sub:'매일 업데이트되는 웹, 앱, AI 도구를 만나보세요.',
    all:'전체',web:'웹',app:'앱',both:'웹 + 앱',filter:'필터',reset:'초기화',category:'카테고리',platform:'서비스 유형',stage:'상태',price:'가격',sort:'정렬',
    newest:'최신 등록순',popular:'인기순',reviews:'리뷰순',released:'정식 출시',beta:'베타',building:'개발 중',free:'무료',freemium:'부분 유료',paid:'유료',
    empty:'아직 공개된 서비스가 없습니다.',emptySub:'승인된 서비스가 생기면 이곳에서 가장 먼저 소개합니다.',security:'보안 검증 완료',securityCopy:'모든 서비스는 자동 보안 검사와 기본 검토를 거쳐 등록됩니다.',details:'자세히 보기 →',hours:'시간 전'
  }:{
    title:'EXPLORE',lead:'Discover newly listed and verified products.',sub:'Fresh web, app, and AI tools are added every day.',
    all:'ALL',web:'WEB',app:'APP',both:'WEB + APP',filter:'FILTERS',reset:'RESET',category:'CATEGORY',platform:'SERVICE TYPE',stage:'STATUS',price:'PRICE',sort:'SORT',
    newest:'NEWEST',popular:'POPULAR',reviews:'MOST REVIEWED',released:'RELEASED',beta:'BETA',building:'IN DEVELOPMENT',free:'FREE',freemium:'FREEMIUM',paid:'PAID',
    empty:'No published products yet.',emptySub:'Approved products will appear here first.',security:'SECURITY CHECKED',securityCopy:'Every product passes an automated security scan and a basic review before listing.',details:'LEARN MORE →',hours:'H AGO'
  };
  const categoryLabel=value=>{
    if(!ko())return value;
    return ({'Developer Tools':'개발 도구','Productivity':'생산성','Design':'디자인','Marketing':'마케팅','AI Tools':'AI 도구','Business':'비즈니스','Education':'교육','Entertainment':'엔터테인먼트','Finance':'금융','Health':'건강','Lifestyle':'라이프스타일','Utilities':'유틸리티','Community':'커뮤니티','Weird & Fun':'재미'})[value]||value;
  };
  const nameOf=item=>ko()?(item.name_ko||item.name_en||item.name):(item.name_en||item.name_ko||item.name);
  const taglineOf=item=>ko()?(item.tagline_ko||item.tagline_en||item.tagline):(item.tagline_en||item.tagline_ko||item.tagline);
  const platformOf=item=>String(item.platform||'web').toLowerCase();
  const stageOf=item=>String(item.release_stage||'released').toLowerCase();
  const priceOf=item=>String(item.pricing||item.price||'free').toLowerCase().replace(/\s/g,'_');
  const visitsOf=item=>Number(item.visit_count??item.visits??item.trend??0);
  const reviewsOf=item=>Number(item.review_count??(Array.isArray(item.reviews)?item.reviews.length:item.reviews)??0);
  const likesOf=item=>Number(item.supporters??item.support??0);
  const scoreOf=item=>visitsOf(item)+(reviewsOf(item)*10)+(likesOf(item)*2);
  const shotOf=(item,index)=>item.header_image_url||item.screenshot_urls?.[0]||item.image||fallbackShots[index%fallbackShots.length];
  const ageOf=(item,index)=>{
    if(!item.published_at)return `${index+2}${ko()?'시간 전':'H AGO'}`;
    const hours=Math.max(1,Math.floor((Date.now()-new Date(item.published_at).getTime())/36e5));
    if(hours<24)return `${hours}${ko()?'시간 전':'H AGO'}`;
    const days=Math.floor(hours/24);return `${days}${ko()?'일 전':'D AGO'}`;
  };
  const badgeOf=item=>{const platform=platformOf(item);return platform==='both'?copy().both:platform==='app'?copy().app:copy().web};
  const itemTags=item=>[item.category,...(item.tags||[])].filter(Boolean).slice(0,3);
  const optionButton=(group,value,label)=>`<button data-explore-${group}="${escapeHtml(value)}" class="${state[group]===value?'active':''}">${label}</button>`;
  const card=(item,index)=>{
    const id=escapeHtml(item.id||item.slug||'');
    const source=state.options.source==='supabase'?`data-store-product="${id}"`:`data-a="detail" data-id="${id}"`;
    return `<article class="explore-card" ${source} tabindex="0">
      <div class="explore-shot"><img src="${escapeHtml(shotOf(item,index))}" alt="" loading="lazy"><span>${badgeOf(item)}</span></div>
      <div class="explore-card-copy"><h2>${escapeHtml(nameOf(item)||'Untitled')}</h2><p>${escapeHtml(taglineOf(item)||'')}</p><div class="explore-tags">${itemTags(item).map(tag=>`<span>${escapeHtml(categoryLabel(tag))}</span>`).join('')}</div></div>
      <footer><span title="Visits">◉ ${visitsOf(item).toLocaleString()}</span><span title="Likes">♡ ${likesOf(item).toLocaleString()}</span><span title="Reviews">◯ ${reviewsOf(item).toLocaleString()}</span><time>${ageOf(item,index)}</time></footer>
    </article>`;
  };
  const filterGroup=(title,content)=>`<section class="explore-filter-group"><h3>${title}</h3><div>${content}</div></section>`;
  function reset(){state.category='all';state.platform='all';state.stage='all';state.price='all';state.sort='newest';state.layout='grid'}
  function render(items=state.items,options={}){
    if(options.reset)reset();
    state.items=items||state.items||[];state.options={...state.options,...options};
    if(options.initialCategory&&options.initialCategory!=='All')state.category=options.initialCategory;
    const t=copy();
    const foundCategories=[...new Set(state.items.map(item=>item.category).filter(Boolean))];
    const categories=[...new Set([...categoryOrder,...foundCategories])];
    let visible=state.items.filter(item=>{
      const platform=platformOf(item),stage=stageOf(item),price=priceOf(item);
      const priceMatches=state.price==='all'||price===state.price||(state.price==='freemium'&&price.includes('freemium'));
      const stageMatches=state.stage==='all'||stage===state.stage||(state.stage==='beta'&&stage==='early_access');
      return (state.category==='all'||item.category===state.category)&&(state.platform==='all'||platform===state.platform||platform==='both')&&stageMatches&&priceMatches;
    });
    visible.sort((a,b)=>state.sort==='popular'?scoreOf(b)-scoreOf(a):state.sort==='reviews'?reviewsOf(b)-reviewsOf(a):new Date(b.published_at||0)-new Date(a.published_at||0));
    const topCategories=categories.slice(0,9);
    const host=document.querySelector('#app');if(!host)return;
    document.body.dataset.activeView='explore';
    document.querySelectorAll('body>header nav [data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view==='explore'));
    host.innerHTML=`<main class="explore-page">
      <header class="explore-heading"><h1>${t.title}</h1><p>${t.lead}<br>${t.sub}</p></header>
      <nav class="explore-category-bar" aria-label="${t.category}">${optionButton('category','all',t.all)}${topCategories.map(category=>optionButton('category',category,categoryLabel(category))).join('')}</nav>
      <div class="catalog-controls-row"><div class="explore-list-controls"><span>${visible.length} PRODUCTS</span><label><span class="sr-only">${t.sort}</span><select data-explore-sort><option value="newest" ${state.sort==='newest'?'selected':''}>${t.newest}</option><option value="popular" ${state.sort==='popular'?'selected':''}>${t.popular}</option><option value="reviews" ${state.sort==='reviews'?'selected':''}>${t.reviews}</option></select></label><div class="explore-layout-toggle"><button data-explore-layout="grid" class="${state.layout==='grid'?'active':''}" aria-label="Grid view">▦</button><button data-explore-layout="list" class="${state.layout==='list'?'active':''}" aria-label="List view">☷</button></div></div><span aria-hidden="true"></span></div>
      <div class="explore-layout">
        <section class="explore-content">
          ${visible.length?`<section class="explore-grid ${state.layout==='list'?'is-list':''}">${visible.map(card).join('')}</section>`:`<section class="explore-empty"><h2>${t.empty}</h2><p>${t.emptySub}</p><button data-view="submit">${ko()?'제품 등록하기 →':'SUBMIT A PRODUCT →'}</button></section>`}
        </section>
        <aside class="explore-sidebar">
          <section class="explore-filter-panel"><header><h2>${t.filter}</h2><button data-explore-reset>${t.reset} ↻</button></header>
            ${filterGroup(t.category,optionButton('category','all',t.all)+categories.map(category=>optionButton('category',category,categoryLabel(category))).join(''))}
            ${filterGroup(t.platform,optionButton('platform','all',t.all)+optionButton('platform','web',t.web)+optionButton('platform','app',t.app)+optionButton('platform','both',t.both))}
            ${filterGroup(t.stage,optionButton('stage','all',t.all)+optionButton('stage','released',t.released)+optionButton('stage','beta',t.beta)+optionButton('stage','in_development',t.building))}
            ${filterGroup(t.price,optionButton('price','all',t.all)+optionButton('price','free',t.free)+optionButton('price','freemium',t.freemium)+optionButton('price','paid',t.paid))}
          </section>
          <section class="explore-aside-card security"><div><h2>${t.security}</h2><p>${t.securityCopy}</p><button type="button">${t.details}</button></div><span class="security-window" aria-hidden="true"><i>✓</i></span></section>
        </aside>
      </div>
    </main>`;
    host.focus({preventScroll:true});window.scrollTo(0,0);
  }
  document.addEventListener('click',event=>{
    const category=event.target.closest('[data-explore-category]'),platform=event.target.closest('[data-explore-platform]'),stage=event.target.closest('[data-explore-stage]'),price=event.target.closest('[data-explore-price]'),layout=event.target.closest('[data-explore-layout]');
    if(category){state.category=category.dataset.exploreCategory;render();return}
    if(platform){state.platform=platform.dataset.explorePlatform;render();return}
    if(stage){state.stage=stage.dataset.exploreStage;render();return}
    if(price){state.price=price.dataset.explorePrice;render();return}
    if(layout){state.layout=layout.dataset.exploreLayout;render();return}
    if(event.target.closest('[data-explore-reset]')){reset();render();return}
  });
  document.addEventListener('change',event=>{if(event.target.matches('[data-explore-sort]')){state.sort=event.target.value;render()}});
  document.addEventListener('vibeguys:languagechange',()=>{if(document.querySelector('.explore-page'))render()});
  window.VibeGuysExplore={render};
})();
