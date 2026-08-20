/* Korean-first landing structure matching the supplied VibeGuys UI direction. */
(()=>{
  const app=document.querySelector('#app');
  const thumb=(name,index)=>`<article class="product-card" data-a="detail" data-id="${index===0?'orbital':index===1?'pagefold':index===2?'little-wins':'bugle'}"><div class="product-shot shot-${index}"><span>WEB</span></div><h3>${name}</h3><p>${['AI가 방해 요소를 차단하고 집중 시간을 분석해주는 도구','긴 영상을 요약하고 핵심만 빠르게 정리합니다','작은 습관을 만들고 지속할 수 있게 도와줘요','AI 프롬프트를 저장하고 공유하며 팀과 함께 관리해요'][index]}</p><footer><small>♡ ${[24,18,31,22][index]}</small><small>◌ ${[6,3,7,4][index]}</small><small>${[2,3,4,5][index]}시간 전</small></footer></article>`;
  const render=()=>{
    document.body.dataset.activeView='home';
    document.querySelectorAll('body>header nav [data-view]').forEach(button=>button.classList.remove('active'));
    app.innerHTML=`<main class="reference-home">
      <section class="reference-hero"><h1>NO HYPE.<br>JUST GOOD PRODUCTS.</h1><p>바이브코딩으로 탄생한 수많은 서비스들.<br>VibeGuys는 써보고, 안전하고, 유용한 것만 모아 소개합니다.</p><div class="mode-grid"><button class="mode active" data-view="explore"><b>⌘ &nbsp; EXPLORE <i>NEW</i></b><span>검토 완료된<br>새로운 서비스</span></button><button class="mode" data-view="trending"><b>♨ &nbsp; POPULAR</b><span>실제 반응이<br>좋은 서비스</span></button></div></section>
      <section class="checked"><header><h2>NEW &amp; CHECKED</h2><button data-view="explore">더 보기　›</button></header><p class="section-note">자동 보안 검사와 기본 검토를 거친 새로운 서비스입니다.</p><div class="product-grid">${thumb('FocusFlow',0)}${thumb('ClipMind',1)}${thumb('Habit Tracker',2)}${thumb('PromptLab',3)}</div></section>
      <section class="reference-bottom"><div class="popular-list"><header><h2>POPULAR THIS WEEK</h2><button data-view="trending">더 보기　›</button></header>${[['StudyMate','AI가 논문을 읽고 핵심을 정리해주는 연구 도구','12.4k','1.2k'],['VoiceDiary','말로 쓰면 AI가 요약해줍니다','9.8k','982'],['Sheet2Doc','스프레드시트를 문서로 변환하고 공유하세요','8.1k','843'],['TimeBlock','시간 관리 & 플래너','7.2k','711'],['Brainy','AI 기반 학습 도우미','6.3k','621']].map((item,index)=>`<article><b>${index+1}</b><span class="mini-icon">◉</span><div><strong>${item[0]}</strong><p>${item[1]}</p></div><small>◉ ${item[2]}　♡ ${item[3]}</small></article>`).join('')}</div></section>
    </main>`;
  };
  render();
  document.addEventListener('click',event=>{if(event.target.closest('[data-view="home"]'))setTimeout(render,0)});
})();
