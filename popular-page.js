/* Shared Popular catalogue, used by both the local fallback and Supabase data. */
(()=>{
  const fallbackShots=[
    'assets/focusflow-thumbnail.png',
    'assets/clipmind-thumbnail.png',
    'assets/habit-tracker-thumbnail.png',
    'assets/promptlab-thumbnail.png',
    'assets/product-dashboard-thumbnail-v1.png'
  ];
  const categoryOrder=['Developer Tools','Productivity','Design','Marketing','AI Tools','Business','Education','Entertainment','Finance','Health','Lifestyle','Utilities','Community','Weird & Fun'];
  const state={items:[],options:{},platform:'all',category:'all',stage:'all',price:'all',sort:'rank',layout:'grid',page:1,rankMap:new Map()};
  const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const locale=()=>document.documentElement.lang==='ko';
  const copy=()=>locale()?{
    title:'POPULAR',
    lead:'실제 사용자들의 반응으로 검증된 인기 서비스입니다.',
    sub:'웹과 앱을 한곳에서 비교하고, 지금 가장 주목받는 제품을 만나보세요.',
    all:'전체',web:'웹',app:'앱',both:'웹 + 앱',filter:'필터',reset:'초기화',category:'카테고리',platform:'서비스 유형',stage:'상태',price:'가격',sort:'정렬',
    rank:'인기순',newest:'최신 등록순',reviews:'리뷰순',released:'정식 출시',beta:'베타',building:'개발 중',free:'무료',freemium:'부분 유료',paid:'유료',
    empty:'아직 인기 기준을 충족한 제품이 없습니다.',views:'방문',reviewLabel:'리뷰',rankLabel:'인기 순위',security:'보안 검증 완료',securityCopy:'모든 서비스는 자동 보안 검사와 기본 검토를 거쳐 등록됩니다.',details:'자세히 보기 →'
  }:{
    title:'POPULAR',
    lead:'Products that earned real attention from real users.',
    sub:'Compare web and app products together and find what people are returning to.',
    all:'ALL',web:'WEB',app:'APP',both:'WEB + APP',filter:'FILTERS',reset:'RESET',category:'CATEGORY',platform:'SERVICE TYPE',stage:'STATUS',price:'PRICE',sort:'SORT',
    rank:'POPULAR',newest:'NEWEST',reviews:'MOST REVIEWED',released:'RELEASED',beta:'BETA',building:'IN DEVELOPMENT',free:'FREE',freemium:'FREEMIUM',paid:'PAID',
    empty:'No product has met the popularity threshold yet.',views:'VISITS',reviewLabel:'REVIEWS',rankLabel:'POPULARITY RANK',security:'SECURITY CHECKED',securityCopy:'Every product passes an automated security scan and a basic review before listing.',details:'LEARN MORE →'
  };
  const categoryLabel=value=>{
    if(!locale())return value;
    return ({'Developer Tools':'개발 도구','Productivity':'생산성','Design':'디자인','Marketing':'마케팅','AI Tools':'AI 도구','Business':'비즈니스','Education':'교육','Entertainment':'엔터테인먼트','Finance':'금융','Health':'건강','Lifestyle':'라이프스타일','Utilities':'유틸리티','Community':'커뮤니티','Weird & Fun':'재미'})[value]||value;
  };
  const nameOf=item=>locale()?(item.name_ko||item.name_en||item.name):(item.name_en||item.name_ko||item.name);
  const taglineOf=item=>locale()?(item.tagline_ko||item.tagline_en||item.tagline):(item.tagline_en||item.tagline_ko||item.tagline);
  const platformOf=item=>String(item.platform||'web').toLowerCase();
  const stageOf=item=>String(item.release_stage||'released').toLowerCase();
  const priceOf=item=>String(item.pricing||item.price||'free').toLowerCase().replace(/\s/g,'_');
  const reviewsOf=item=>Number(item.review_count??(Array.isArray(item.reviews)?item.reviews.length:item.reviews)??0);
  const visitsOf=item=>Number(item.visit_count??item.visits??item.trend??0);
  const rankOf=item=>visitsOf(item)+(reviewsOf(item)*10);
  const rankKey=item=>String(item.id||item.slug||nameOf(item)||'');
  const ratingOf=item=>{
    if(Number.isFinite(Number(item.rating))&&Number(item.rating)>0)return Number(item.rating).toFixed(1);
    const rows=Array.isArray(item.reviews)?item.reviews:[];
    const scores=rows.map(review=>Number(review.rating)).filter(score=>score>0);
    return scores.length?(scores.reduce((sum,score)=>sum+score,0)/scores.length).toFixed(1):'—';
  };
  const shotOf=(item,index)=>item.header_image_url||item.screenshot_urls?.[0]||item.image||fallbackShots[index%fallbackShots.length];
  const optionButton=(group,value,label)=>`<button data-popular-${group}="${escapeHtml(value)}" class="${state[group]===value?'active':''}">${label}</button>`;
  const filterGroup=(title,content)=>`<section class="explore-filter-group"><h3>${title}</h3><div>${content}</div></section>`;
  const card=(item,index)=>{
    const t=copy(),platform=platformOf(item),badge=platform==='both'?t.both:platform==='app'?t.app:t.web;
    const id=escapeHtml(item.id||item.slug||'');
    const rank=state.rankMap.get(rankKey(item))||index+1;
    const source=state.options.source==='supabase'?`data-store-product="${id}"`:`data-a="detail" data-id="${id}"`;
    return `<article class="popular-card" ${source} tabindex="0">
      <div class="popular-shot tone-${index%8}"><b class="popular-rank-badge" aria-label="${t.rankLabel} ${rank}">${String(rank).padStart(2,'0')}</b><img src="${escapeHtml(shotOf(item,index))}" alt="" loading="lazy"><span>${badge}</span></div>
      <div class="popular-card-copy">
        <h2>${escapeHtml(nameOf(item)||'Untitled')}</h2>
        <p>${escapeHtml(taglineOf(item)||'')}</p>
        <small>${escapeHtml(categoryLabel(item.category||'Product'))}</small>
      </div>
      <footer>
        <span aria-label="${t.views}">♡ ${visitsOf(item).toLocaleString()}</span>
        <span aria-label="${t.reviewLabel}">▢ ${reviewsOf(item).toLocaleString()}</span>
        <strong>★ ${ratingOf(item)}</strong>
      </footer>
    </article>`;
  };
  function reset(){state.platform='all';state.category='all';state.stage='all';state.price='all';state.sort='rank';state.layout='grid';state.page=1}
  function render(items=state.items,options={}){
    if(options.reset)reset();
    state.items=items||state.items||[];state.options={...state.options,...options};
    state.rankMap=new Map([...state.items].sort((a,b)=>rankOf(b)-rankOf(a)).map((item,index)=>[rankKey(item),index+1]));
    const t=copy();
    const foundCategories=[...new Set(state.items.map(item=>item.category).filter(Boolean))];
    const categories=[...new Set([...categoryOrder,...foundCategories])];
    let visible=state.items.filter(item=>{
      const platform=platformOf(item),stage=stageOf(item),price=priceOf(item);
      const priceMatches=state.price==='all'||price===state.price||(state.price==='freemium'&&price.includes('freemium'));
      const stageMatches=state.stage==='all'||stage===state.stage||(state.stage==='beta'&&stage==='early_access');
      return (state.category==='all'||item.category===state.category)&&(state.platform==='all'||platform===state.platform||platform==='both')&&stageMatches&&priceMatches;
    });
    visible.sort((a,b)=>state.sort==='newest'?new Date(b.published_at||0)-new Date(a.published_at||0):state.sort==='reviews'?reviewsOf(b)-reviewsOf(a):rankOf(b)-rankOf(a));
    const pageSize=16,totalPages=Math.max(1,Math.ceil(visible.length/pageSize));
    state.page=Math.min(Math.max(1,state.page),totalPages);
    const pageItems=visible.slice((state.page-1)*pageSize,state.page*pageSize);
    const pages=Array.from({length:totalPages},(_,i)=>i+1).filter(page=>page===1||page===totalPages||Math.abs(page-state.page)<=2);
    let previous=0;
    const pagination=pages.map(page=>{const gap=page-previous>1?'<span>…</span>':'';previous=page;return `${gap}<button data-popular-page="${page}" class="${page===state.page?'active':''}">${page}</button>`}).join('');
    const topCategories=categories.slice(0,9);
    const host=document.querySelector('#app');if(!host)return;
    document.body.dataset.activeView='popular';
    document.querySelectorAll('body>header nav [data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view==='trending'));
    host.innerHTML=`<main class="popular-page">
      <header class="popular-heading"><h1>${t.title}</h1><p>${t.lead}<br>${t.sub}</p></header>
      <nav class="explore-category-bar popular-category-bar" aria-label="${t.category}">${optionButton('category','all',t.all)}${topCategories.map(category=>optionButton('category',category,categoryLabel(category))).join('')}</nav>
      <div class="catalog-controls-row"><div class="explore-list-controls popular-list-controls"><span>${visible.length} PRODUCTS</span><label><span class="sr-only">${t.sort}</span><select data-popular-sort><option value="rank" ${state.sort==='rank'?'selected':''}>${t.rank}</option><option value="newest" ${state.sort==='newest'?'selected':''}>${t.newest}</option><option value="reviews" ${state.sort==='reviews'?'selected':''}>${t.reviews}</option></select></label><div class="explore-layout-toggle"><button data-popular-layout="grid" class="${state.layout==='grid'?'active':''}" aria-label="Grid view">▦</button><button data-popular-layout="list" class="${state.layout==='list'?'active':''}" aria-label="List view">☷</button></div></div><span aria-hidden="true"></span></div>
      <div class="popular-layout">
        <section class="popular-content">
          ${pageItems.length?`<section class="popular-grid ${state.layout==='list'?'is-list':''}">${pageItems.map(card).join('')}</section>`:`<section class="popular-empty"><p>${t.empty}</p></section>`}
          ${totalPages>1?`<nav class="popular-pagination" aria-label="Pagination"><button data-popular-page="${Math.max(1,state.page-1)}" aria-label="Previous">‹</button>${pagination}<button data-popular-page="${Math.min(totalPages,state.page+1)}" aria-label="Next">›</button></nav>`:''}
        </section>
        <aside class="explore-sidebar popular-sidebar">
          <section class="explore-filter-panel"><header><h2>${t.filter}</h2><button data-popular-reset>${t.reset} ↻</button></header>
            ${filterGroup(t.category,optionButton('category','all',t.all)+categories.map(category=>optionButton('category',category,categoryLabel(category))).join(''))}
            ${filterGroup(t.platform,optionButton('platform','all',t.all)+optionButton('platform','web',t.web)+optionButton('platform','app',t.app)+optionButton('platform','both',t.both))}
            ${filterGroup(t.stage,optionButton('stage','all',t.all)+optionButton('stage','released',t.released)+optionButton('stage','beta',t.beta)+optionButton('stage','in_development',t.building))}
            ${filterGroup(t.price,optionButton('price','all',t.all)+optionButton('price','free',t.free)+optionButton('price','freemium',t.freemium)+optionButton('price','paid',t.paid))}
            ${filterGroup(t.sort,`<label class="explore-filter-sort"><select data-popular-sort><option value="rank" ${state.sort==='rank'?'selected':''}>${t.rank}</option><option value="newest" ${state.sort==='newest'?'selected':''}>${t.newest}</option><option value="reviews" ${state.sort==='reviews'?'selected':''}>${t.reviews}</option></select></label>`)}
          </section>
          <section class="explore-aside-card security"><div><h2>${t.security}</h2><p>${t.securityCopy}</p><button type="button">${t.details}</button></div><span class="security-window" aria-hidden="true"><i>✓</i></span></section>
        </aside>
      </div>
    </main>`;
    host.focus({preventScroll:true});window.scrollTo(0,0);
  }
  document.addEventListener('click',event=>{
    const category=event.target.closest('[data-popular-category]'),platform=event.target.closest('[data-popular-platform]'),stage=event.target.closest('[data-popular-stage]'),price=event.target.closest('[data-popular-price]'),layout=event.target.closest('[data-popular-layout]'),page=event.target.closest('[data-popular-page]');
    if(category){state.category=category.dataset.popularCategory;state.page=1;render();return}
    if(platform){state.platform=platform.dataset.popularPlatform;state.page=1;render();return}
    if(stage){state.stage=stage.dataset.popularStage;state.page=1;render();return}
    if(price){state.price=price.dataset.popularPrice;state.page=1;render();return}
    if(layout){state.layout=layout.dataset.popularLayout;render();return}
    if(page){state.page=Number(page.dataset.popularPage)||1;render();return}
    if(event.target.closest('[data-popular-reset]')){reset();render();return}
  });
  document.addEventListener('change',event=>{if(event.target.matches('[data-popular-sort]')){state.sort=event.target.value;state.page=1;render()}});
  document.addEventListener('vibeguys:languagechange',()=>{if(document.querySelector('.popular-page'))render()});
  window.VibeGuysPopular={render};
})();
