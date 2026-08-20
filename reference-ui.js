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
  let dragState=null;
  let suppressCardClick=false;
  const isKo=()=>document.documentElement.lang==='ko';
  const t=(ko,en)=>isKo()?ko:en;
  const platformLabel=value=>({web:'WEB',app:'APP',both:'WEB + APP'}[value]||'ALL');
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

  function rankRows(items,metric='rating'){
    return items.map((product,index)=>`<article class="home-rank-row" data-a="detail" data-id="${product.id}"><b>${index+1}</b><img src="${product.image}" alt=""><strong>${escape(product.name)}</strong><span>${metric==='views'?`◉ ${product.views}`:`◉ ${product.views}　★ ${product.rating}`}</span></article>`).join('');
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
    return {viewport,track,cards,step,max};
  }

  function syncSlider(animate=true){
    const {track,step,max}=sliderMetrics();
    if(!track)return;
    carouselOffset=Math.max(0,Math.min(carouselOffset,max));
    track.style.transition=animate?'transform .34s cubic-bezier(.22,.72,.24,1)':'none';
    track.style.transform=`translate3d(${-carouselOffset*step}px,0,0)`;
    const dots=app.querySelector('.home-dots');
    if(dots){
      const count=max+1;
      if(dots.children.length!==count)dots.innerHTML=Array.from({length:count},(_,index)=>`<button class="${index===carouselOffset?'active':''}" data-home-dot="${index}" aria-label="${t(`${index+1}번째 슬라이드`, `Slide ${index+1}`)}"></button>`).join('');
      [...dots.children].forEach((dot,index)=>{dot.classList.toggle('active',index===carouselOffset);dot.setAttribute('aria-current',index===carouselOffset?'true':'false')});
    }
    const next=app.querySelector('[data-home-next]');
    if(next)next.hidden=max===0;
  }

  function beginDrag(event){
    if(event.button!==0&&event.pointerType==='mouse')return;
    const metrics=sliderMetrics();
    if(!metrics.viewport||metrics.max===0)return;
    dragState={pointerId:event.pointerId,startX:event.clientX,lastX:event.clientX,baseX:-carouselOffset*metrics.step,moved:false,...metrics};
    metrics.viewport.setPointerCapture?.(event.pointerId);
    metrics.viewport.classList.add('dragging');
    metrics.track.style.transition='none';
  }

  function moveDrag(event){
    if(!dragState||dragState.pointerId!==event.pointerId)return;
    const delta=event.clientX-dragState.startX;
    dragState.lastX=event.clientX;
    if(Math.abs(delta)>5)dragState.moved=true;
    const minX=-dragState.max*dragState.step;
    const nextX=Math.max(minX,Math.min(0,dragState.baseX+delta));
    dragState.track.style.transform=`translate3d(${nextX}px,0,0)`;
    if(dragState.moved&&event.pointerType==='mouse')event.preventDefault();
  }

  function endDrag(event){
    if(!dragState||dragState.pointerId!==event.pointerId)return;
    const state=dragState;
    const delta=event.type==='pointercancel'?0:state.lastX-state.startX;
    const threshold=Math.min(64,state.step*.2);
    if(delta<=-threshold)carouselOffset=Math.min(state.max,carouselOffset+1);
    else if(delta>=threshold)carouselOffset=Math.max(0,carouselOffset-1);
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
            <article><i>◇</i><div><b>1,248+</b><span>${t('등록된 제품','listed products')}</span></div></article>
            <article><i>♙</i><div><b>328K+</b><span>${t('누적 사용자','total users')}</span></div></article>
            <article><i>◌</i><div><b>12.6K+</b><span>${t('리뷰 & 피드백','reviews & feedback')}</span></div></article>
            <article><i>⬡</i><div><b>100%</b><span>${t('보안 사전검사','security pre-check')}</span></div></article>
          </div>
        </div>
        <div class="home-showcase" aria-label="${t('추천 제품','Featured products')}">
          <div class="home-showcase-filters">${filters.map(([value,label])=>`<button class="${platform===value?'active':''}" data-home-platform="${value}">${label}</button>`).join('')}</div>
          <div class="home-featured-viewport" data-home-viewport><div class="home-featured-grid" data-home-track>${filtered.map(featureCard).join('')}</div></div>
          <button class="home-carousel-next" data-home-next aria-label="${t('다음 제품','Next products')}">›</button>
          <div class="home-dots"></div>
        </div>
      </section>
      <section class="home-directory">
        <div class="home-directory-column home-explore-preview"><header><div><h2>EXPLORE <i>NEW</i></h2><p>${t('새로 등록되고 검증된 서비스','Newly listed and checked products')}</p></div><button data-view="explore">${t('모두 보기','View all')} ›</button></header><div class="home-mini-grid">${products.slice(4,8).map(miniCard).join('')}</div></div>
        <div class="home-directory-column home-popular-preview"><header><div><h2><span>♨</span> POPULAR</h2><p>${t('실제 반응이 좋은 서비스','Products with real momentum')}</p></div><button data-view="trending">${t('모두 보기','View all')} ›</button></header><div class="home-rank-list">${rankRows([products[6],products[0],products[2],products[1],products[3]])}</div></div>
        <div class="home-directory-column"><header><div><h2><span>↗</span> TRENDING THIS WEEK</h2><p>${t('이번 주 가장 뜨거운 서비스','The hottest products this week')}</p></div><button data-view="trending">${t('모두 보기','View all')} ›</button></header><div class="home-rank-list trending">${rankRows([products[2],products[1],products[4],products[0],products[7]],'views')}</div></div>
      </section>
    </main>`;
    wireSlider();
  }

  document.addEventListener('click',event=>{
    if(suppressCardClick&&event.target.closest('.home-featured-viewport')){event.preventDefault();event.stopImmediatePropagation();suppressCardClick=false;return}
    const filter=event.target.closest('[data-home-platform]');
    if(filter){platform=filter.dataset.homePlatform;carouselOffset=0;render();return}
    const dot=event.target.closest('[data-home-dot]');
    if(dot){carouselOffset=Number(dot.dataset.homeDot)||0;syncSlider(true);return}
    if(event.target.closest('[data-home-next]')){const {max}=sliderMetrics();carouselOffset=max?carouselOffset>=max?0:carouselOffset+1:0;syncSlider(true);return}
    if(event.target.closest('[data-view="home"]'))setTimeout(render,0);
    if(event.target.closest('[data-action="language"]'))setTimeout(render,0);
  },true);
  let resizeTimer;
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(document.querySelector('.home-v3'))syncSlider(false)},100)});
  render();
})();
