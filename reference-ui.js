/* Landing page matching the supplied VibeGuys directory composition. */
(()=>{
  const app=document.querySelector('#app');
  if(!app)return;

  const products=[
    {id:'little-wins',name:'Moodiary',platform:'app',image:'assets/clipmind-thumbnail.png',ko:'오늘의 감정을 기록하고 패턴을 발견하는 감정 일기',en:'A mood journal that reveals patterns in how you feel.',tags:['라이프스타일','생산성'],tagsEn:['Lifestyle','Productivity'],views:'982',likes:'76',rating:'4.7'},
    {id:'pagefold',name:'ShipFast',platform:'web',image:'assets/product-dashboard-thumbnail-v1.png',ko:'개발 팀을 위한 AI 기반 이슈 추적 및 프로젝트 관리 도구',en:'AI issue tracking and project management for product teams.',tags:['개발 도구','프로젝트 관리'],tagsEn:['Developer tools','Project management'],views:'1.2k',likes:'68',rating:'4.8'},
    {id:'orbital',name:'Finmate',platform:'both',image:'assets/habit-tracker-thumbnail.png',ko:'프리랜서를 위한 인보이스 발행과 수입 관리 플랫폼',en:'Invoicing and income tracking made for freelancers.',tags:['생산성','금융'],tagsEn:['Productivity','Finance'],views:'1.2k',likes:'134',rating:'4.6'},
    {id:'bugle',name:'Focus Music',platform:'app',image:'assets/focusflow-thumbnail.png',ko:'집중력을 높여주는 AI 맞춤형 배경 음악 앱',en:'AI-generated background music tuned for deep focus.',tags:['생산성','음악'],tagsEn:['Productivity','Music'],views:'1.5k',likes:'112',rating:'4.8'},
    {id:'side-quest',name:'Tripful',platform:'both',image:'assets/promptlab-thumbnail.png',ko:'AI 여행 플래너가 일정, 예산, 맛집까지 맞춤 추천',en:'An AI trip planner for routes, budgets, and local finds.',tags:['여행','라이프스타일'],tagsEn:['Travel','Lifestyle'],views:'1.1k',likes:'89',rating:'4.6'},
    {id:'pagefold',name:'LandingCraft',platform:'web',image:'assets/product-dashboard-thumbnail-v1.png',ko:'코딩 없이 멋진 랜딩페이지를 빠르게 만드는 도구',en:'Build polished landing pages quickly without code.',tags:['디자인','개발 도구'],tagsEn:['Design','Developer tools'],views:'843',likes:'51',rating:'4.5'},
    {id:'orbital',name:'FocusFlow',platform:'web',image:'assets/focusflow-thumbnail.png',ko:'AI가 업무 흐름을 정리해 주는 차분한 생산성 도구',en:'A calm AI workspace that keeps important work moving.',tags:['생산성','AI'],tagsEn:['Productivity','AI'],views:'2.1k',likes:'148',rating:'4.8'},
    {id:'bugle',name:'CodeSnap',platform:'web',image:'assets/promptlab-thumbnail.png',ko:'코드 스니펫을 아름답게 캡처하고 공유하는 도구',en:'Capture and share beautiful, readable code snippets.',tags:['개발 도구','유틸리티'],tagsEn:['Developer tools','Utilities'],views:'9.8k',likes:'211',rating:'4.7'}
  ];
  let platform='all';
  let carouselOffset=0;
  const CARDS_PER_SLIDE=4;
  let dragState=null;
  let suppressCardClick=false;
  let trendingOffset=0;
  let trendingTimer=null;
  const TRENDING_REFRESH_MS=9000;
  const isKo=()=>document.documentElement.lang==='ko';
  const t=(ko,en)=>isKo()?ko:en;
  const platformLabel=value=>({web:'WEB',app:'APP',both:'WEB + APP'}[value]||'ALL');
  const metricNumber=value=>{const text=String(value||'0').toLowerCase();return (parseFloat(text)||0)*(text.includes('k')?1000:1)};
  const popularItems=()=>[...products].sort((a,b)=>(metricNumber(b.views)+(Number(b.likes)||0)*10+Number(b.rating)*100)-(metricNumber(a.views)+(Number(a.likes)||0)*10+Number(a.rating)*100)).slice(0,4);
  const escape=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const visibleCards=()=>window.matchMedia('(max-width:480px)').matches?1:window.matchMedia('(max-width:720px)').matches?2:4;

  function featureCard(product){
    return `<article class="home-product-card" data-a="detail" data-id="${product.id}">
      <div class="home-product-shot"><img src="${product.image}" alt="${escape(product.name)} product preview"><span>${platformLabel(product.platform)}</span></div>
      <div class="home-product-copy"><h3>${escape(product.name)}</h3><p>${escape(isKo()?product.ko:product.en)}</p><div class="home-product-tags">${(isKo()?product.tags:product.tagsEn).map(tag=>`<span>${escape(tag)}</span>`).join('')}</div></div>
      <footer><span>◉ ${product.views}</span><span>♡ ${product.likes}</span><strong>★ ${product.rating}</strong></footer>
    </article>`;
  }

  function miniCard(product){
    return `<article class="home-mini-card" data-a="detail" data-id="${product.id}"><div class="home-mini-shot"><img src="${product.image}" alt=""><span>${platformLabel(product.platform)}</span></div><h3>${escape(product.name)}</h3><p>${escape(isKo()?product.ko:product.en)}</p><footer><span>◉ ${product.views}</span><strong>★ ${product.rating}</strong></footer></article>`;
  }

  function popularCard(product,index){
    return `<article class="home-mini-card home-popular-card" data-a="detail" data-id="${product.id}"><div class="home-mini-shot"><b class="home-card-rank" aria-label="${t('인기 순위','Popularity rank')} ${index+1}">${String(index+1).padStart(2,'0')}</b><img src="${product.image}" alt=""><span>${platformLabel(product.platform)}</span></div><h3>${escape(product.name)}</h3><p>${escape(isKo()?product.ko:product.en)}</p><footer><span>◉ ${product.views}</span><strong>★ ${product.rating}</strong></footer></article>`;
  }

  function rankRows(items,metric='rating'){
    return items.map((product,index)=>`<article class="home-rank-row" data-a="detail" data-id="${product.id}"><b>${index+1}</b><img src="${product.image}" alt=""><strong>${escape(product.name)}</strong><span>${metric==='views'?`◉ ${product.views}`:`◉ ${product.views}　★ ${product.rating}`}</span></article>`).join('');
  }

  function trendingItems(){
    const pool=[products[2],products[1],products[4],products[0],products[7],products[6],products[3],products[5]];
    return Array.from({length:5},(_,index)=>pool[(trendingOffset+index)%pool.length]);
  }

  function scheduleTrendingRefresh(){
    clearTimeout(trendingTimer);
    trendingTimer=setTimeout(()=>refreshTrending(),TRENDING_REFRESH_MS);
  }

  function refreshTrending(){
    const list=app.querySelector('[data-home-trending-list]');
    if(!list)return;
    trendingOffset=(trendingOffset+3)%products.length;
    list.classList.remove('is-refreshing');
    void list.offsetWidth;
    list.innerHTML=rankRows(trendingItems(),'views');
    list.classList.add('is-refreshing');
    const button=app.querySelector('[data-home-trending-refresh]');
    button?.classList.add('is-spinning');
    setTimeout(()=>{list.classList.remove('is-refreshing');button?.classList.remove('is-spinning')},520);
    scheduleTrendingRefresh();
  }

  function syncShell(){
    const copy={
      about:t('소개','About'),
      'about-copy':t('VibeGuys는 바이브코딩으로 만들어진 멋진 웹과 앱을 발견하고, 확인하고, 함께 나누는 플랫폼입니다.','VibeGuys discovers, checks, and shares useful web and app products built through vibe coding.'),
      terms:t('이용약관·등록 정책','Terms & listing policy'),
      privacy:t('개인정보처리방침','Privacy policy'),
      contact:t('문의하기','Contact'),
      admin:t('관리자 데모','Admin demo')
    };
    document.querySelectorAll('[data-shell]').forEach(node=>{if(copy[node.dataset.shell])node.textContent=copy[node.dataset.shell]});
  }

  function sliderMetrics(){
    const viewport=app.querySelector('[data-home-viewport]');
    const track=app.querySelector('[data-home-track]');
    const cards=track?[...track.children]:[];
    const gap=track?parseFloat(getComputedStyle(track).gap)||12:12;
    const step=cards[0]?cards[0].getBoundingClientRect().width+gap:0;
    const max=Math.max(0,cards.length-Math.min(visibleCards(),cards.length));
    const groups=Math.max(1,Math.ceil(cards.length/CARDS_PER_SLIDE));
    return {viewport,track,cards,step,max,groups};
  }

  function syncSlider(animate=true){
    const {track,step,max,groups}=sliderMetrics();
    if(!track)return;
    carouselOffset=Math.max(0,Math.min(carouselOffset,max));
    track.style.transition=animate?'transform .46s cubic-bezier(.22,1,.36,1)':'none';
    track.style.transform=`translate3d(${-carouselOffset*step}px,0,0)`;
    const dots=app.querySelector('.home-dots');
    if(dots){
      const activeGroup=Math.min(groups-1,Math.floor(carouselOffset/CARDS_PER_SLIDE));
      dots.hidden=groups<=1;
      if(dots.children.length!==groups)dots.innerHTML=Array.from({length:groups},(_,index)=>`<button data-home-dot="${index}" aria-label="${t(`${index+1}번째 제품 묶음`, `Product group ${index+1}`)}"></button>`).join('');
      [...dots.children].forEach((dot,index)=>{dot.classList.toggle('active',index===activeGroup);dot.setAttribute('aria-current',index===activeGroup?'true':'false')});
    }
    const next=app.querySelector('[data-home-next]');
    if(next)next.hidden=groups<=1;
  }

  function beginDrag(event){
    if(event.button!==0&&event.pointerType==='mouse')return;
    const metrics=sliderMetrics();
    if(!metrics.viewport||metrics.max===0)return;
    dragState={pointerId:event.pointerId,startX:event.clientX,lastX:event.clientX,lastTime:performance.now(),velocityX:0,baseX:-carouselOffset*metrics.step,moved:false,...metrics};
    metrics.viewport.setPointerCapture?.(event.pointerId);
    metrics.viewport.classList.add('dragging');
    metrics.track.style.transition='none';
  }

  function moveDrag(event){
    if(!dragState||dragState.pointerId!==event.pointerId)return;
    const delta=event.clientX-dragState.startX;
    const now=performance.now();
    const elapsed=Math.max(1,now-dragState.lastTime);
    const instantaneousVelocity=(event.clientX-dragState.lastX)/elapsed;
    dragState.velocityX=dragState.velocityX*.68+instantaneousVelocity*.32;
    dragState.lastX=event.clientX;
    dragState.lastTime=now;
    if(Math.abs(delta)>5)dragState.moved=true;
    const minX=-dragState.max*dragState.step;
    let nextX=dragState.baseX+delta;
    if(nextX>0)nextX*=.3;
    else if(nextX<minX)nextX=minX+(nextX-minX)*.3;
    dragState.track.style.transform=`translate3d(${nextX}px,0,0)`;
    if(dragState.moved)event.preventDefault();
  }

  function endDrag(event){
    if(!dragState||dragState.pointerId!==event.pointerId)return;
    const state=dragState;
    const delta=event.type==='pointercancel'?0:state.lastX-state.startX;
    let targetOffset=carouselOffset;
    if(event.type!=='pointercancel'&&state.moved){
      const projectedX=state.baseX+delta+state.velocityX*180;
      targetOffset=Math.round(-projectedX/state.step);
      const threshold=Math.min(52,state.step*.14);
      if(Math.abs(delta)>=threshold&&targetOffset===carouselOffset)targetOffset+=delta<0?1:-1;
    }
    carouselOffset=Math.max(0,Math.min(targetOffset,state.max));
    state.viewport.classList.remove('dragging');
    if(state.viewport.hasPointerCapture?.(event.pointerId))state.viewport.releasePointerCapture(event.pointerId);
    suppressCardClick=state.moved;
    dragState=null;
    syncSlider(true);
    if(suppressCardClick)setTimeout(()=>{suppressCardClick=false},0);
  }

  function wireSlider(){
    const viewport=app.querySelector('[data-home-viewport]');
    if(!viewport)return;
    viewport.addEventListener('pointerdown',beginDrag);
    viewport.addEventListener('pointermove',moveDrag);
    viewport.addEventListener('pointerup',endDrag);
    viewport.addEventListener('pointercancel',endDrag);
    requestAnimationFrame(()=>syncSlider(false));
  }

  function render(){
    clearTimeout(trendingTimer);
    document.body.dataset.activeView='home';
    document.querySelectorAll('body>header nav [data-view]').forEach(button=>button.classList.remove('active'));
    syncShell();
    const filtered=products.filter(product=>platform==='all'||product.platform===platform);
    const filters=[['all',t('전체','ALL')],['web','WEB'],['app','APP'],['both','WEB + APP']];
    app.innerHTML=`<main class="reference-home home-v3">
      <section class="home-hero">
        <div class="home-intro">
          <h1><em>GOOD VIBES.</em><br>REAL PRODUCTS.</h1>
          <p>${t('하루에도 수많은 바이브코딩 서비스가 쏟아집니다.<br>VibeGuys는 직접 써볼 만한 웹과 앱만 골라 소개합니다.','New vibe-coded services launch every day.<br>VibeGuys picks the web and app products actually worth trying.')}</p>
          <button class="home-submit" data-view="submit"><span>＋</span>${t('제품 등록','SUBMIT')}</button>
          <div class="home-stats">
            <article><i class="stat-icon stat-icon-package" aria-hidden="true"></i><div><b>1,248+</b><span>${t('등록된 제품','listed products')}</span></div></article>
            <article><i class="stat-icon stat-icon-users" aria-hidden="true"></i><div><b>328K+</b><span>${t('누적 사용자','total users')}</span></div></article>
            <article><i class="stat-icon stat-icon-feedback" aria-hidden="true"></i><div><b>12.6K+</b><span>${t('리뷰 & 피드백','reviews & feedback')}</span></div></article>
            <article><i class="stat-icon stat-icon-security" aria-hidden="true"></i><div><b>100%</b><span>${t('보안 사전검사','security pre-check')}</span></div></article>
          </div>
        </div>
        <div class="home-showcase" aria-label="${t('추천 제품','Featured products')}">
          <div class="home-showcase-filters">${filters.map(([value,label])=>`<button class="${platform===value?'active':''}" data-home-platform="${value}">${label}</button>`).join('')}</div>
          <div class="home-featured-viewport" data-home-viewport><div class="home-featured-grid" data-home-track>${filtered.map(featureCard).join('')}</div></div>
          <button class="home-carousel-next" data-home-next aria-label="${t('다음 제품 묶음','Next product group')}"><span aria-hidden="true"></span></button>
          <div class="home-dots"></div>
        </div>
      </section>
      <section class="home-directory">
        <div class="home-directory-column home-explore-preview"><header><div><h2>EXPLORE <i>NEW</i></h2><p>${t('새로 등록되고 검증된 서비스','Newly listed and checked products')}</p></div><button data-view="explore">${t('모두 보기','View all')} ›</button></header><div class="home-mini-grid">${products.slice(4,8).map(miniCard).join('')}</div></div>
        <div class="home-directory-column home-popular-preview"><header><div><h2><span class="section-icon section-icon-popular" aria-hidden="true"></span>POPULAR</h2><p>${t('실제 반응이 좋은 서비스','Products with real momentum')}</p></div><button data-view="trending">${t('모두 보기','View all')} ›</button></header><div class="home-mini-grid home-popular-grid">${popularItems().map(popularCard).join('')}</div></div>
        <div class="home-directory-column home-trending-preview"><header><div><h2><span class="section-icon section-icon-trending" aria-hidden="true"></span>TRENDING THIS WEEK</h2><p>${t('이번 주 가장 뜨거운 서비스','The hottest products this week')}</p></div><div class="home-section-actions"><button class="home-trending-refresh" data-home-trending-refresh aria-label="${t('트렌드 새로고침','Refresh trends')}"><span aria-hidden="true">↻</span></button><button data-view="trending">${t('모두 보기','View all')} ›</button></div></header><div class="home-rank-list trending" data-home-trending-list aria-live="polite">${rankRows(trendingItems(),'views')}</div></div>
      </section>
    </main>`;
    wireSlider();
    scheduleTrendingRefresh();
  }

  document.addEventListener('click',event=>{
    if(suppressCardClick&&event.target.closest('.home-featured-viewport')){event.preventDefault();event.stopImmediatePropagation();suppressCardClick=false;return}
    const filter=event.target.closest('[data-home-platform]');
    if(filter){platform=filter.dataset.homePlatform;carouselOffset=0;render();return}
    if(event.target.closest('[data-home-trending-refresh]')){refreshTrending();return}
    const dot=event.target.closest('[data-home-dot]');
    if(dot){const {max}=sliderMetrics();carouselOffset=Math.min((Number(dot.dataset.homeDot)||0)*CARDS_PER_SLIDE,max);syncSlider(true);return}
    if(event.target.closest('[data-home-next]')){const {max,groups}=sliderMetrics();const activeGroup=Math.min(groups-1,Math.floor(carouselOffset/CARDS_PER_SLIDE));const nextGroup=activeGroup>=groups-1?0:activeGroup+1;carouselOffset=Math.min(nextGroup*CARDS_PER_SLIDE,max);syncSlider(true);return}
    if(event.target.closest('[data-view="home"]'))setTimeout(render,0);
    if(event.target.closest('[data-action="language"]'))setTimeout(render,0);
  },true);
  let resizeTimer;
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(document.querySelector('.home-v3'))syncSlider(false)},100)});
  render();
})();
