/* Shared Popular catalogue, used by both the local fallback and Supabase data. */
(()=>{
  const fallbackShots=[
    'assets/focusflow-thumbnail.png',
    'assets/clipmind-thumbnail.png',
    'assets/habit-tracker-thumbnail.png',
    'assets/promptlab-thumbnail.png',
    'assets/product-dashboard-thumbnail-v1.png'
  ];
  const state={items:[],options:{},platform:'all',category:'all',sort:'rank',page:1};
  const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const locale=()=>document.documentElement.lang==='ko';
  const copy=()=>locale()?{
    title:'POPULAR',
    lead:'실제 사용자들의 반응으로 검증된 인기 서비스입니다.',
    sub:'웹과 앱을 한곳에서 비교하고, 지금 가장 주목받는 제품을 만나보세요.',
    all:'전체',web:'웹',app:'앱',category:'카테고리',sort:'정렬: 인기순',newest:'정렬: 최신순',reviews:'정렬: 리뷰순',
    empty:'아직 인기 기준을 충족한 제품이 없습니다.',views:'방문',reviewLabel:'리뷰'
  }:{
    title:'POPULAR',
    lead:'Products that earned real attention from real users.',
    sub:'Compare web and app products together and find what people are returning to.',
    all:'ALL',web:'WEB',app:'APP',category:'CATEGORY',sort:'SORT: POPULAR',newest:'SORT: NEWEST',reviews:'SORT: REVIEWS',
    empty:'No product has met the popularity threshold yet.',views:'VISITS',reviewLabel:'REVIEWS'
  };
  const nameOf=item=>locale()?(item.name_ko||item.name_en||item.name):(item.name_en||item.name_ko||item.name);
  const taglineOf=item=>locale()?(item.tagline_ko||item.tagline_en||item.tagline):(item.tagline_en||item.tagline_ko||item.tagline);
  const platformOf=item=>String(item.platform||'web').toLowerCase();
  const rankOf=item=>(Number(item.visit_count??item.visits??item.trend??0)+(Number(item.review_count??item.reviews??0)*10));
  const reviewsOf=item=>Number(item.review_count??(Array.isArray(item.reviews)?item.reviews.length:item.reviews)??0);
  const visitsOf=item=>Number(item.visit_count??item.visits??item.trend??0);
  const ratingOf=item=>{
    if(Number.isFinite(Number(item.rating))&&Number(item.rating)>0)return Number(item.rating).toFixed(1);
    const rows=Array.isArray(item.reviews)?item.reviews:[];
    const scores=rows.map(review=>Number(review.rating)).filter(score=>score>0);
    return scores.length?(scores.reduce((sum,score)=>sum+score,0)/scores.length).toFixed(1):'—';
  };
  const shotOf=(item,index)=>item.header_image_url||item.screenshot_urls?.[0]||item.image||fallbackShots[index%fallbackShots.length];
  const card=(item,index)=>{
    const platform=platformOf(item),badge=platform==='both'?'WEB + APP':platform.toUpperCase();
    const id=escapeHtml(item.id||item.slug||'');
    const source=state.options.source==='supabase'?`data-store-product="${id}"`:`data-a="detail" data-id="${id}"`;
    return `<article class="popular-card" ${source} tabindex="0">
      <div class="popular-shot tone-${index%8}"><img src="${escapeHtml(shotOf(item,index))}" alt="" loading="lazy"><span>${badge}</span></div>
      <div class="popular-card-copy">
        <h2>${escapeHtml(nameOf(item)||'Untitled')}</h2>
        <p>${escapeHtml(taglineOf(item)||'')}</p>
        <small>${escapeHtml(item.category||'Product')}</small>
      </div>
      <footer>
        <span aria-label="${copy().views}">♡ ${visitsOf(item).toLocaleString()}</span>
        <span aria-label="${copy().reviewLabel}">▢ ${reviewsOf(item).toLocaleString()}</span>
        <strong>★ ${ratingOf(item)}</strong>
      </footer>
    </article>`;
  };
  function render(items=state.items,options=state.options){
    state.items=items||[];state.options={...state.options,...options};
    const t=copy();
    const categories=[...new Set(state.items.map(item=>item.category).filter(Boolean))];
    let visible=state.items.filter(item=>{
      const platform=platformOf(item);
      return (state.platform==='all'||platform===state.platform||platform==='both')&&(state.category==='all'||item.category===state.category);
    });
    visible.sort((a,b)=>state.sort==='newest'?new Date(b.published_at||0)-new Date(a.published_at||0):state.sort==='reviews'?reviewsOf(b)-reviewsOf(a):rankOf(b)-rankOf(a));
    const pageSize=16,totalPages=Math.max(1,Math.ceil(visible.length/pageSize));
    state.page=Math.min(state.page,totalPages);
    const pageItems=visible.slice((state.page-1)*pageSize,state.page*pageSize);
    const pages=Array.from({length:totalPages},(_,i)=>i+1).filter(page=>page===1||page===totalPages||Math.abs(page-state.page)<=2);
    let previous=0;
    const pagination=pages.map(page=>{const gap=page-previous>1?'<span>…</span>':'';previous=page;return `${gap}<button data-popular-page="${page}" class="${page===state.page?'active':''}">${page}</button>`}).join('');
    const host=document.querySelector('#app');if(!host)return;
    document.body.dataset.activeView='popular';
    document.querySelectorAll('body>header nav [data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view==='trending'));
    host.innerHTML=`<main class="popular-page">
      <header class="popular-heading"><h1>${t.title}</h1><p>${t.lead}<br>${t.sub}</p></header>
      <section class="popular-toolbar" aria-label="Popular filters">
        <div class="popular-segments">
          <button data-popular-platform="all" class="${state.platform==='all'?'active':''}">${t.all}</button>
          <button data-popular-platform="web" class="${state.platform==='web'?'active':''}">${t.web}</button>
          <button data-popular-platform="app" class="${state.platform==='app'?'active':''}">${t.app}</button>
        </div>
        <label><span class="sr-only">${t.category}</span><select data-popular-category><option value="all">${t.category}</option>${categories.map(category=>`<option value="${escapeHtml(category)}" ${state.category===category?'selected':''}>${escapeHtml(category)}</option>`).join('')}</select></label>
        <label class="popular-sort"><span class="sr-only">Sort</span><select data-popular-sort><option value="rank" ${state.sort==='rank'?'selected':''}>${t.sort}</option><option value="newest" ${state.sort==='newest'?'selected':''}>${t.newest}</option><option value="reviews" ${state.sort==='reviews'?'selected':''}>${t.reviews}</option></select></label>
      </section>
      ${pageItems.length?`<section class="popular-grid">${pageItems.map(card).join('')}</section>`:`<section class="popular-empty"><p>${t.empty}</p></section>`}
      ${totalPages>1?`<nav class="popular-pagination" aria-label="Pagination"><button data-popular-page="${Math.max(1,state.page-1)}" aria-label="Previous">‹</button>${pagination}<button data-popular-page="${Math.min(totalPages,state.page+1)}" aria-label="Next">›</button></nav>`:''}
    </main>`;
    host.focus({preventScroll:true});window.scrollTo(0,0);
  }
  document.addEventListener('click',event=>{
    const platform=event.target.closest('[data-popular-platform]');
    const page=event.target.closest('[data-popular-page]');
    if(platform){state.platform=platform.dataset.popularPlatform;state.page=1;render();return}
    if(page){state.page=Number(page.dataset.popularPage)||1;render();return}
    if(event.target.closest('[data-action="language"]')&&document.querySelector('.popular-page'))setTimeout(()=>render(),0);
  });
  document.addEventListener('change',event=>{
    if(event.target.matches('[data-popular-category]')){state.category=event.target.value;state.page=1;render()}
    if(event.target.matches('[data-popular-sort]')){state.sort=event.target.value;state.page=1;render()}
  });
  window.VibeGuysPopular={render};
})();
