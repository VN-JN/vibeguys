/* Four-step product submission workspace based on the supplied VibeGuys reference. */
(()=>{
  const copy={
    title:['제품 등록하기','Submit your product'],
    intro1:['당신이 만든 멋진 서비스를 VibeGuys에 소개하세요.','Introduce the product you built to VibeGuys.'],
    intro2:['정확한 정보는 더 좋은 발견과 연결을 만듭니다.','Accurate information leads to better discovery and connections.'],
    step1:['기본 정보','Basics'],step2:['상세 정보','Details'],step3:['스크린샷 & 링크','Screenshots & links'],step4:['검토 & 제출','Review & submit'],
    basics:['기본 정보','Basic information'],details:['상세 정보','Product details'],media:['스크린샷 & 링크','Screenshots & links'],review:['검토 & 제출','Review & submit'],
    productName:['제품 이름','Product name'],tagline:['한 줄 소개','One-line description'],category:['카테고리','Category'],platform:['제품 타입','Product type'],status:['상태','Status'],description:['설명','Description'],audience:['대상 사용자','Target audience'],problem:['해결하는 문제','Problem it solves'],tags:['태그 (최대 5개)','Tags (up to 5)'],
    namePlaceholder:['예) FocusFlow','e.g. FocusFlow'],tagPlaceholder:['예) AI가 방해 요소를 차단하고 몰입 시간을 분석해주는 집중 도구','e.g. An AI focus tool that blocks distractions and tracks deep work'],categoryPlaceholder:['카테고리를 선택하세요','Select a category'],descriptionPlaceholder:['당신의 서비스를 설명해주세요.','Describe your product.'],audiencePlaceholder:['이 서비스는 누구를 위한 건가요?','Who is this product for?'],problemPlaceholder:['어떤 문제를 해결하나요?','What problem does it solve?'],tagsPlaceholder:['태그를 입력하고 쉼표로 구분하세요.','Separate tags with commas.'],
    web:['웹','Web'],app:['앱','App'],both:['웹 + 앱','Web + App'],released:['출시됨','Released'],beta:['베타','Beta'],development:['개발 중','In development'],idea:['아이디어 단계','Idea stage'],
    creator:['제작자 이름','Creator name'],website:['웹사이트 URL','Website URL'],launchDate:['출시일','Launch date'],languages:['지원 언어','Supported languages'],contact:['연락 이메일','Contact email'],creatorPlaceholder:['예) Flow Studio','e.g. Flow Studio'],languagePlaceholder:['예) 한국어, English','e.g. Korean, English'],
    headerImage:['대표 이미지 URL','Header image URL'],screenshots:['스크린샷 URL','Screenshot URLs'],screenshotsHelp:['쉼표로 구분해 입력하세요. 가로형 이미지 3장 이상을 권장합니다.','Separate URLs with commas. Three or more landscape images are recommended.'],docs:['문서 링크','Documentation link'],demo:['데모 영상','Demo video'],github:['GitHub 링크','GitHub link'],
    agreement:['피싱·악성코드·인증정보 수집을 금지하며 등록물의 법적 책임, 자동 보안 사전검사와 관리자 검토 정책에 동의합니다.','I prohibit phishing, malware, and credential harvesting and accept legal responsibility, automated security checks, and administrator review.'],
    previous:['이전','Back'],next:['다음 단계','Next step'],submit:['검토 요청','Request review'],
    preview:['미리보기','Preview'],previewHelp:['입력한 정보로 미리보기를 확인하세요.','See how your listing looks as you type.'],visit:['웹사이트 방문','Visit website'],features:['주요 기능','Key features'],links:['링크','Links'],websiteLink:['웹사이트','Website'],docsLink:['문서','Docs'],demoLink:['데모 영상','Demo video'],githubLink:['GitHub','GitHub'],security:['등록 전 자동 보안 검사와 운영진 검토가 진행됩니다.','An automated security check and administrator review run before publishing.'],
    previewName:['FocusFlow','FocusFlow'],previewTagline:['AI가 방해 요소를 차단하고 몰입 시간을 분석해주는 집중 도구','An AI focus tool that blocks distractions and analyzes deep work.'],previewDescription:['FocusFlow는 당신의 집중 시간을 분석하고 방해 요소를 차단해 더 깊은 몰입을 도와주는 AI 기반 집중 도구입니다.','FocusFlow analyzes focus time and blocks distractions to help you work more deeply.'],previewMaker:['Flow Studio','Flow Studio'],previewLanguages:['한국어, English','Korean, English'],
    feature1:['실시간 방해 요소 차단 (앱, 알림)','Real-time distraction blocking'],feature2:['몰입 시간 측정 및 리포트 제공','Focus-time tracking and reports'],feature3:['집중 목표 설정 및 알림','Focus goals and reminders'],feature4:['다양한 차단 모드 (일반 / 엄격 / 사용자 정의)','Flexible blocking modes'],feature5:['데이터는 로컬에 안전하게 저장','Data stored safely on-device'],
    guide:['가이드','Guide'],guideAccuracy:['정확한 정보','Accurate information'],guideAccuracyBody:['정확할수록 사용자에게 더 잘 발견돼요.','Better information makes your product easier to discover.'],guideShots:['스크린샷','Screenshots'],guideShotsBody:['실제 화면은 최소 3장 이상 등록해주세요.','Add at least three real product screenshots.'],guideLinks:['링크 확인','Link verification'],guideLinksBody:['모든 링크는 제출 후 자동으로 확인됩니다.','Every submitted link is checked automatically.'],guideReview:['검토 과정','Review process'],guideReviewBody:['자동 보안 검사 후 운영진 검토가 진행됩니다.','Administrator review follows the automated security check.'],help:['도움이 필요하신가요?','Need help?'],helpBody:['등록 가이드를 확인하거나 문의하세요.','Read the submission guide or contact us.'],openGuide:['가이드 보기','View guide'],
    reviewIntro:['아래 내용을 확인한 뒤 검토를 요청하세요. 제출 후 자동 보안 검사와 운영진 검토가 시작됩니다.','Review the details below. Automated security and administrator review begin after submission.'],reviewProduct:['제품','Product'],reviewType:['유형','Type'],reviewUrl:['웹사이트','Website'],reviewMedia:['스크린샷','Screenshots'],required:['이 필드는 필수입니다.','This field is required.']
  };
  const categories=[['AI','AI 도구','AI Tools'],['Productivity','생산성','Productivity'],['Design','디자인','Design'],['Developer Tools','개발 도구','Developer Tools'],['Finance','금융','Finance'],['Marketing','마케팅','Marketing'],['Education','교육','Education'],['Lifestyle','라이프스타일','Lifestyle'],['Games','게임','Games'],['Utilities','유틸리티','Utilities']];
  const fallbackShots=['assets/focusflow-thumbnail.png','assets/product-dashboard-thumbnail-v1.png','assets/promptlab-thumbnail.png'];
  let currentHost=null;
  let currentStep=1;
  const isKo=()=>document.documentElement.lang==='ko';
  const t=key=>copy[key]?.[isKo()?0:1]||key;
  const esc=value=>String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const text=(tag,key,className='')=>`<${tag}${className?` class="${className}"`:''} data-submit-copy="${key}">${esc(t(key))}</${tag}>`;

  function choice(name,value,label,active=false,extra=''){
    return `<button type="button" class="submit-choice${active?' active':''}" data-submit-choice="${name}" data-value="${value}" ${extra}><span data-submit-copy="${label}">${esc(t(label))}</span></button>`;
  }

  function render(host){
    if(!host)return;
    currentHost=host;
    currentStep=1;
    document.body.dataset.activeView='submit';
    const categoryOptions=categories.map(([value,ko,en])=>`<option value="${value}">${esc(isKo()?ko:en)}</option>`).join('');
    host.innerHTML=`<section class="submit-page">
      <div class="submit-layout">
        <form class="submit-form-column" id="submit-form">
          <header class="submit-heading">${text('h1','title')}<p><span data-submit-copy="intro1">${esc(t('intro1'))}</span><br><span data-submit-copy="intro2">${esc(t('intro2'))}</span></p></header>
          <ol class="submit-steps" aria-label="${esc(t('title'))}">${[1,2,3,4].map(index=>`<li class="${index===1?'active':''}" data-submit-step-indicator="${index}"><b>${index}</b><span data-submit-copy="step${index}">${esc(t(`step${index}`))}</span></li>`).join('')}</ol>
          <input type="hidden" name="listing_type" value="live">
          <section class="submit-step-panel" data-submit-step="1">
            ${text('h2','basics')}
            <div class="submit-field-grid">
              <label class="submit-field"><span><span data-submit-copy="productName">${esc(t('productName'))}</span> <i>*</i></span><input required maxlength="60" name="name" data-submit-placeholder="namePlaceholder" placeholder="${esc(t('namePlaceholder'))}"><small><b data-submit-count="name">0</b> / 60</small></label>
              <label class="submit-field"><span><span data-submit-copy="tagline">${esc(t('tagline'))}</span> <i>*</i></span><input required maxlength="100" name="tag" data-submit-placeholder="tagPlaceholder" placeholder="${esc(t('tagPlaceholder'))}"><small><b data-submit-count="tag">0</b> / 100</small></label>
              <label class="submit-field"><span><span data-submit-copy="category">${esc(t('category'))}</span> <i>*</i></span><select required name="cat"><option value="" selected disabled data-submit-copy="categoryPlaceholder">${esc(t('categoryPlaceholder'))}</option>${categoryOptions}</select></label>
              <div class="submit-field"><span><span data-submit-copy="platform">${esc(t('platform'))}</span> <i>*</i></span><input type="hidden" name="platform" value="both"><div class="submit-segments">${choice('platform','web','web')}${choice('platform','app','app')}${choice('platform','both','both',true)}</div></div>
              <div class="submit-field submit-span-2"><span><span data-submit-copy="status">${esc(t('status'))}</span> <i>*</i></span><input type="hidden" name="release_stage" value="released"><div class="submit-segments submit-status-segments">${choice('release_stage','released','released',true,'data-status-dot="true"')}${choice('release_stage','early_access','beta')}${choice('release_stage','in_development','development')}${choice('release_stage','in_development','idea',false,'data-status-label="idea"')}</div></div>
              <label class="submit-field submit-span-2"><span><span data-submit-copy="description">${esc(t('description'))}</span> <i>*</i></span><div class="submit-editor"><div class="submit-editor-toolbar" aria-hidden="true"><b>B</b><i>I</i><u>U</u><span>≡</span><span>☷</span><span>↗</span></div><textarea required maxlength="2000" name="problem" data-submit-placeholder="descriptionPlaceholder" placeholder="${esc(t('descriptionPlaceholder'))}"></textarea><small><b data-submit-count="problem">0</b> / 2000</small></div></label>
              <label class="submit-field"><span data-submit-copy="audience">${esc(t('audience'))}</span><input maxlength="120" name="audience" data-submit-placeholder="audiencePlaceholder" placeholder="${esc(t('audiencePlaceholder'))}"><small><b data-submit-count="audience">0</b> / 120</small></label>
              <label class="submit-field"><span data-submit-copy="problem">${esc(t('problem'))}</span><input maxlength="120" name="solve" data-submit-placeholder="problemPlaceholder" placeholder="${esc(t('problemPlaceholder'))}"><small><b data-submit-count="solve">0</b> / 120</small></label>
              <label class="submit-field submit-span-2"><span data-submit-copy="tags">${esc(t('tags'))}</span><input name="tags" data-submit-placeholder="tagsPlaceholder" placeholder="${esc(t('tagsPlaceholder'))}"></label>
            </div>
          </section>
          <section class="submit-step-panel" data-submit-step="2" hidden>
            ${text('h2','details')}<div class="submit-field-grid">
              <label class="submit-field submit-span-2"><span><span data-submit-copy="website">${esc(t('website'))}</span> <i>*</i></span><input required type="url" name="url" placeholder="https://"></label>
              <label class="submit-field"><span><span data-submit-copy="creator">${esc(t('creator'))}</span> <i>*</i></span><input required name="maker" data-submit-placeholder="creatorPlaceholder" placeholder="${esc(t('creatorPlaceholder'))}"></label>
              <label class="submit-field"><span data-submit-copy="launchDate">${esc(t('launchDate'))}</span><input type="date" name="launch_date"></label>
              <label class="submit-field"><span data-submit-copy="languages">${esc(t('languages'))}</span><input name="languages" data-submit-placeholder="languagePlaceholder" placeholder="${esc(t('languagePlaceholder'))}"></label>
              <label class="submit-field"><span data-submit-copy="contact">${esc(t('contact'))}</span><input type="email" name="contact_email" placeholder="contact@example.com"></label>
            </div>
          </section>
          <section class="submit-step-panel" data-submit-step="3" hidden>
            ${text('h2','media')}<div class="submit-field-grid">
              <label class="submit-field submit-span-2"><span data-submit-copy="headerImage">${esc(t('headerImage'))}</span><input type="url" name="header_image_url" placeholder="https://"></label>
              <label class="submit-field submit-span-2"><span data-submit-copy="screenshots">${esc(t('screenshots'))}</span><textarea name="screenshot_urls" placeholder="https://…, https://…, https://…"></textarea><em data-submit-copy="screenshotsHelp">${esc(t('screenshotsHelp'))}</em></label>
              <label class="submit-field"><span data-submit-copy="docs">${esc(t('docs'))}</span><input type="url" name="docs_url" placeholder="https://"></label>
              <label class="submit-field"><span data-submit-copy="demo">${esc(t('demo'))}</span><input type="url" name="demo_url" placeholder="https://"></label>
              <label class="submit-field submit-span-2"><span data-submit-copy="github">${esc(t('github'))}</span><input type="url" name="github_url" placeholder="https://github.com/"></label>
            </div>
          </section>
          <section class="submit-step-panel" data-submit-step="4" hidden>
            ${text('h2','review')}<p class="submit-review-intro" data-submit-copy="reviewIntro">${esc(t('reviewIntro'))}</p>
            <dl class="submit-review-list"><div><dt data-submit-copy="reviewProduct">${esc(t('reviewProduct'))}</dt><dd data-submit-review="name">—</dd></div><div><dt data-submit-copy="reviewType">${esc(t('reviewType'))}</dt><dd data-submit-review="platform">—</dd></div><div><dt data-submit-copy="reviewUrl">${esc(t('reviewUrl'))}</dt><dd data-submit-review="url">—</dd></div><div><dt data-submit-copy="reviewMedia">${esc(t('reviewMedia'))}</dt><dd data-submit-review="screenshots">0</dd></div></dl>
            <label class="submit-legal"><input required type="checkbox" name="terms_accepted"><span data-submit-copy="agreement">${esc(t('agreement'))}</span></label>
          </section>
          <div class="submit-form-actions"><button type="button" class="submit-back" data-submit-prev hidden><span data-submit-copy="previous">${esc(t('previous'))}</span></button><button type="button" class="submit-next" data-submit-next><span data-submit-copy="next">${esc(t('next'))}</span><b aria-hidden="true">→</b></button><button type="submit" class="submit-next" data-submit-finish hidden><span data-submit-copy="submit">${esc(t('submit'))}</span><b aria-hidden="true">→</b></button></div>
        </form>
        <section class="submit-preview-column" aria-live="polite">
          <header><h2 data-submit-copy="preview">${esc(t('preview'))}</h2><p data-submit-copy="previewHelp">${esc(t('previewHelp'))}</p></header>
          <article class="submit-preview-card">
            <div class="submit-preview-product"><div class="submit-preview-logo" aria-hidden="true"><i></i><b></b></div><div><h3 data-preview-name>${esc(t('previewName'))}</h3><p data-preview-tagline>${esc(t('previewTagline'))}</p><div class="submit-preview-tags"><span data-preview-platform>WEB + APP</span><span data-preview-category>AI</span><span>AI</span><span data-preview-status>${esc(t('released'))}</span></div></div><a href="#" data-preview-visit><span data-submit-copy="visit">${esc(t('visit'))}</span> <b aria-hidden="true">↗</b></a></div>
            <p class="submit-preview-description" data-preview-description>${esc(t('previewDescription'))}</p>
            <div class="submit-preview-shots">${fallbackShots.map((src,index)=>`<img src="${src}" data-preview-shot="${index}" alt="Product screenshot preview">`).join('')}</div>
            <div class="submit-preview-meta"><span><i aria-hidden="true">♙</i><b data-preview-maker>${esc(t('previewMaker'))}</b></span><span><i aria-hidden="true">□</i><b data-preview-date>2026.05.10</b></span><span><i aria-hidden="true">◎</i><b data-preview-languages>${esc(t('previewLanguages'))}</b></span><span class="submit-preview-social" aria-hidden="true">♥　●</span></div>
            <div class="submit-preview-bottom"><section><h4 data-submit-copy="features">${esc(t('features'))}</h4><ul>${[1,2,3,4,5].map(index=>`<li><i>✓</i><span data-submit-copy="feature${index}">${esc(t(`feature${index}`))}</span></li>`).join('')}</ul></section><aside><h4 data-submit-copy="links">${esc(t('links'))}</h4>${[['websiteLink','website'],['docsLink','docs'],['demoLink','demo'],['githubLink','github']].map(([label,key])=>`<p><b data-submit-copy="${label}">${esc(t(label))}</b><span data-preview-link="${key}">—</span><i aria-hidden="true">↗</i></p>`).join('')}</aside></div>
          </article>
          <footer><span class="submit-security-icon" aria-hidden="true"></span><p data-submit-copy="security">${esc(t('security'))}</p></footer>
        </section>
        <aside class="submit-guide-column">
          <section class="submit-guide-card"><h2 data-submit-copy="guide">${esc(t('guide'))}</h2>${[['info','guideAccuracy','guideAccuracyBody'],['shot','guideShots','guideShotsBody'],['link','guideLinks','guideLinksBody'],['review','guideReview','guideReviewBody']].map(([icon,title,body])=>`<article><span class="submit-guide-icon ${icon}" aria-hidden="true"></span><div><h3 data-submit-copy="${title}">${esc(t(title))}</h3><p data-submit-copy="${body}">${esc(t(body))}</p></div></article>`).join('')}</section>
          <section class="submit-help-card"><h2 data-submit-copy="help">${esc(t('help'))}</h2><p data-submit-copy="helpBody">${esc(t('helpBody'))}</p><a href="LEGAL_NOTICE.md" target="_blank" rel="noreferrer"><span data-submit-copy="openGuide">${esc(t('openGuide'))}</span> <b>↗</b></a><small>contact@vibeguys.com</small></section>
        </aside>
      </div>
    </section>`;
    wire(host);
    syncPreview();
    setStep(1,false);
  }

  function setStep(next,scroll=true){
    currentStep=Math.max(1,Math.min(4,next));
    const page=currentHost?.querySelector('.submit-page');
    if(!page)return;
    page.querySelectorAll('[data-submit-step]').forEach(panel=>{
      const visible=Number(panel.dataset.submitStep)===currentStep;
      panel.hidden=!visible;
      panel.querySelectorAll('input,select,textarea').forEach(field=>{field.disabled=currentStep<4&&!visible});
    });
    page.querySelectorAll('[data-submit-step-indicator]').forEach(item=>{const index=Number(item.dataset.submitStepIndicator);item.classList.toggle('active',index===currentStep);item.classList.toggle('complete',index<currentStep)});
    page.querySelector('[data-submit-prev]').hidden=currentStep===1;
    page.querySelector('[data-submit-next]').hidden=currentStep===4;
    page.querySelector('[data-submit-finish]').hidden=currentStep!==4;
    if(currentStep===4)syncReview();
    if(scroll)page.querySelector('.submit-form-column')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function validateStep(){
    const panel=currentHost?.querySelector(`[data-submit-step="${currentStep}"]`);
    if(!panel)return true;
    for(const field of panel.querySelectorAll('input[required],select[required],textarea[required]')){
      if(!field.checkValidity()){field.reportValidity();return false}
    }
    return true;
  }

  function syncReview(){
    const form=currentHost?.querySelector('#submit-form');
    if(!form)return;
    const platform=form.elements.platform.value;
    const screenshots=String(form.elements.screenshot_urls?.value||'').split(',').filter(value=>value.trim()).length;
    const values={name:form.elements.name.value||'—',platform:platform==='both'?t('both'):t(platform),url:form.elements.url.value||'—',screenshots:String(screenshots)};
    Object.entries(values).forEach(([key,value])=>{const node=form.querySelector(`[data-submit-review="${key}"]`);if(node)node.textContent=value});
  }

  function syncPreview(){
    const page=currentHost?.querySelector('.submit-page');
    const form=page?.querySelector('#submit-form');
    if(!form)return;
    const value=name=>String(form.elements[name]?.value||'').trim();
    const set=(selector,next)=>{const node=page.querySelector(selector);if(node)node.textContent=next};
    set('[data-preview-name]',value('name')||t('previewName'));
    set('[data-preview-tagline]',value('tag')||t('previewTagline'));
    set('[data-preview-description]',value('problem')||t('previewDescription'));
    set('[data-preview-maker]',value('maker')||t('previewMaker'));
    set('[data-preview-languages]',value('languages')||t('previewLanguages'));
    set('[data-preview-date]',value('launch_date')?value('launch_date').replaceAll('-','.'):'2026.05.10');
    const platform=value('platform')||'both';
    set('[data-preview-platform]',platform==='both'?'WEB + APP':platform.toUpperCase());
    const category=categories.find(item=>item[0]===value('cat'));
    set('[data-preview-category]',category?(isKo()?category[1]:category[2]):'AI');
    const statusKey=form.dataset.releaseLabel||({released:'released',early_access:'beta',in_development:'development'}[value('release_stage')]||'released');
    set('[data-preview-status]',t(statusKey));
    const url=value('url');
    const visit=page.querySelector('[data-preview-visit]');
    if(visit){visit.href=url||'#';visit.dataset.enabled=url?'true':'false'}
    const shots=value('screenshot_urls').split(',').map(item=>item.trim()).filter(item=>/^https:\/\//i.test(item));
    page.querySelectorAll('[data-preview-shot]').forEach((image,index)=>{image.src=shots[index]||fallbackShots[index]});
    const linkValues={website:url||'https://focusflow.app',docs:value('docs_url')||'docs.focusflow.app',demo:value('demo_url')||'youtube.com/watch?v=focus',github:value('github_url')||'github.com/flowstudio/focusflow'};
    Object.entries(linkValues).forEach(([key,link])=>{const node=page.querySelector(`[data-preview-link="${key}"]`);if(node)node.textContent=link.replace(/^https?:\/\//,'')});
    page.querySelectorAll('[data-submit-count]').forEach(counter=>{counter.textContent=String(form.elements[counter.dataset.submitCount]?.value.length||0)});
    syncReview();
  }

  function localize(){
    const page=currentHost?.querySelector('.submit-page');
    if(!page)return;
    page.querySelectorAll('[data-submit-copy]').forEach(node=>{const key=node.dataset.submitCopy;if(copy[key])node.textContent=t(key)});
    page.querySelectorAll('[data-submit-placeholder]').forEach(node=>{node.placeholder=t(node.dataset.submitPlaceholder)});
    const categorySelect=page.querySelector('[name="cat"]');
    if(categorySelect){[...categorySelect.options].slice(1).forEach((option,index)=>{const category=categories[index];if(category)option.textContent=isKo()?category[1]:category[2]})}
    syncPreview();
  }

  function wire(host){
    const form=host.querySelector('#submit-form');
    form.addEventListener('input',syncPreview);
    form.addEventListener('change',syncPreview);
    host.querySelector('[data-preview-visit]')?.addEventListener('click',event=>{if(event.currentTarget.dataset.enabled!=='true')event.preventDefault()});
    host.querySelectorAll('[data-submit-choice]').forEach(button=>button.addEventListener('click',()=>{
      const name=button.dataset.submitChoice;
      form.elements[name].value=button.dataset.value;
      if(name==='release_stage')form.dataset.releaseLabel=button.dataset.statusLabel||({released:'released',early_access:'beta',in_development:'development'}[button.dataset.value]||'released');
      host.querySelectorAll(`[data-submit-choice="${name}"]`).forEach(item=>item.classList.toggle('active',item===button));
      syncPreview();
    }));
    host.querySelector('[data-submit-next]').addEventListener('click',()=>{if(validateStep())setStep(currentStep+1)});
    host.querySelector('[data-submit-prev]').addEventListener('click',()=>setStep(currentStep-1));
  }

  document.addEventListener('submit',event=>{
    if(event.target.id!=='submit-form'||!currentHost?.querySelector('.submit-page')||currentStep===4)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(validateStep())setStep(currentStep+1);
  },true);
  document.addEventListener('click',event=>{if(event.target.closest('[data-action="language"]'))setTimeout(localize,0)});
  window.VibeGuysSubmit={render};
})();
