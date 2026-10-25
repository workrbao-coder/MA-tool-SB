(() => {
  if(!document.documentElement.classList.contains('mobile-survey-prototype')) return;
  const appWindow = window;
  const doc = document;
  let visibilityTimer = null;
  let revealUntil = 0;
  function editingField(){
    const field = doc.activeElement;
    return field && field.matches('textarea, input[type="text"]') && field.closest('.prototype-scroll') ? field : null;
  }
  function scheduleInputVisibility(delay = 160){
    window.clearTimeout(visibilityTimer);
    visibilityTimer = window.setTimeout(keepInputVisible, delay);
  }
  function keepInputVisible(){
    const field = editingField();
    if(!field) return;
    const viewport = window.visualViewport;
    if(viewport && viewport.scale !== 1) return;
    const viewportTop = viewport ? viewport.offsetTop : 0;
    const viewportBottom = viewportTop + (viewport ? viewport.height : window.innerHeight);
    const top = viewportTop + 12;
    const bottom = viewportBottom - 12;
    if(bottom <= top) return;
    const rect = field.getBoundingClientRect();
    let delta = 0;
    // Let native focus scrolling finish, then correct only a clipped input.
    if(rect.top < top || rect.height > bottom - top){
      delta = rect.top - top;
    }else if(rect.bottom > bottom){
      delta = rect.bottom - bottom;
    }
    if(Math.abs(delta) > 1) window.scrollBy({top:delta, left:0, behavior:'instant'});
  }
  doc.addEventListener('focusin', ()=>{
    doc.documentElement.classList.toggle('mobile-editing', !!editingField());
    revealUntil = Date.now() + 1000;
    scheduleInputVisibility(350);
  });
  doc.addEventListener('focusout', ()=>{
    window.clearTimeout(visibilityTimer);
    window.requestAnimationFrame(()=>{
      doc.documentElement.classList.toggle('mobile-editing', !!editingField());
    });
  });
  function viewportResized(){
    revealUntil = Date.now() + 600;
    scheduleInputVisibility();
  }
  window.addEventListener('resize', viewportResized);
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize', viewportResized);
    window.visualViewport.addEventListener('scroll', ()=>{
      // Do not pull the user back after they deliberately scroll while typing.
      if(Date.now() < revealUntil) scheduleInputVisibility();
    });
  }

  doc.title = 'MA 手機快速評語';
  doc.documentElement.classList.add('mobile-survey-prototype');

  const style = doc.createElement('style');
  style.id = 'mobileSurveyPrototypeStyles';
  style.textContent = `
    :root{--prototype-ink:#17202d;--prototype-blue:#0b4aa2;--prototype-cyan:#087f8c;--prototype-coral:#c94f45;--prototype-line:#d9dee6;--prototype-bg:#eef1f4;}
    html,body{width:100%!important;max-width:100%!important;height:auto!important;overflow-x:clip!important;background:var(--prototype-bg)!important;}
    html{overflow-y:auto!important;scroll-behavior:auto!important;}
    body{min-height:100svh!important;box-sizing:border-box!important;overflow-y:visible!important;}
    body{display:block!important;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)!important;color:var(--prototype-ink)!important;}
    .prototype-scroll{min-height:0;overflow:visible;padding:10px 0 calc(var(--mobile-footer-height,128px) + 16px);}
    .mobile-editing .prototype-preview-card{visibility:hidden!important;pointer-events:none!important;}
    .header{width:min(100% - 24px,440px)!important;margin:0 auto 8px!important;padding:0!important;gap:8px!important;}
    .header .logo{width:30px!important;height:30px!important;border-radius:6px!important;}
    .header .title{font-size:17px!important;line-height:1.2!important;gap:5px!important;}
    .header .title a{font-size:13px!important;max-width:170px!important;}
    .header .version{font-size:10px!important;color:#697386!important;}
    .container{width:min(100% - 16px,448px)!important;margin:0 auto!important;padding:0!important;border-radius:8px!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;}
    .tabs,#editorTab,#needTab,#practiceTab,#helpTab{display:none!important;}
    #generatorTab,.grid{display:block!important;}
    #generatorTab .grid>.card:first-child{padding:12px!important;border-radius:8px!important;box-shadow:0 2px 12px rgba(27,39,51,.08)!important;background:#fff!important;}
    .prototype-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:2px 0 10px;margin-bottom:10px;border-bottom:1px solid var(--prototype-line);}
    .prototype-heading strong{font-size:16px;color:var(--prototype-ink);}
    .prototype-heading span{padding:3px 7px;border-radius:5px;background:#e9f2ff;color:var(--prototype-blue);font-size:11px;font-weight:700;}
    .top-fields,.degree-fields{display:none!important;}
    .prototype-basic{display:grid;gap:13px;}
    .prototype-choice-section{display:grid;gap:6px;min-width:0;}
    .prototype-choice-label{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:800;color:#4a5565;}
    .prototype-choice-label.required:after{content:'*';color:var(--prototype-coral);}
    .prototype-choice-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;}
    .prototype-choice-grid.level-grid{grid-template-columns:repeat(8,minmax(0,1fr));gap:3px;}
    .level-grid .prototype-choice{padding:7px 0;font-size:14px;white-space:nowrap;}
    .prototype-choice-section.prototype-collapsible{display:block;}
    .prototype-collapsible>summary{list-style:none;min-height:42px;cursor:pointer;}
    .prototype-collapsible>summary::-webkit-details-marker{display:none;}
    .prototype-collapsible>summary:after{content:'+';margin-left:auto;font-size:18px;}
    .prototype-collapsible[open]>summary:after{content:'−';}
    .prototype-choice-value{margin-left:8px;font-size:12px;font-weight:500;color:#087f8c;}
    .prototype-collapsible .prototype-choice-grid{margin-top:6px;}
    .prototype-choice-grid.compact-3{grid-template-columns:repeat(3,minmax(0,1fr));}
    .prototype-choice-grid.compact-5{grid-template-columns:repeat(5,minmax(0,1fr));}
    .prototype-choice-grid.rating-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
    .prototype-choice-grid.degree-grid{grid-template-columns:1fr;max-height:226px;overflow:auto;padding-right:2px;}
    .prototype-choice{min-height:42px;padding:7px 5px;border:1px solid var(--prototype-line);border-radius:7px;background:#fff;color:#263243;font-size:13px;font-weight:700;line-height:1.2;text-align:center;cursor:pointer;overflow-wrap:anywhere;}
    .prototype-choice.active{background:var(--prototype-blue);border-color:var(--prototype-blue);color:#fff;box-shadow:0 2px 7px rgba(11,74,162,.22);}
    .prototype-choice-grid.degree-grid .prototype-choice{text-align:left;padding:9px 10px;min-height:44px;}
    .prototype-choice-grid.degree-grid .prototype-choice.active{background:#e7f1ff;color:var(--prototype-blue);border-color:#79a9e5;box-shadow:none;}
    #prototypeReverse{display:none;}
    #reverseFootWrap{display:flex!important;margin:0!important;padding:9px 10px!important;min-height:44px;align-items:center;gap:8px;border:1px solid var(--prototype-line);border-radius:7px;background:#f8fafc;font-size:13px;font-weight:700;}
    #reverseFoot{width:20px!important;height:20px!important;margin:0!important;accent-color:var(--prototype-blue);}
    #reverseFootProgress{flex:1;width:auto!important;min-width:0!important;margin:0 0 0 4px!important;padding:8px!important;font-size:16px!important;border-radius:6px!important;background:#fff!important;}
    .prototype-accordion{margin-top:10px;border-top:1px solid var(--prototype-line);}
    .prototype-accordion>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;min-height:46px;padding:0 2px;font-size:14px;font-weight:800;color:var(--prototype-ink);cursor:pointer;}
    .prototype-accordion>summary::-webkit-details-marker{display:none;}
    .prototype-accordion>summary:after{content:'+';display:grid;place-items:center;width:24px;height:24px;border-radius:5px;background:#eef2f7;color:var(--prototype-blue);font-size:18px;line-height:1;}
    .prototype-accordion[open]>summary:after{content:'−';}
    .prototype-accordion-content{padding:0 0 10px;}
    .prototype-accordion .form-row{display:block!important;width:100%!important;margin:0!important;}
    .prototype-accordion .form-row>.label,.prototype-accordion .skills-row>div:first-child>#skillsLabel{display:none!important;}
    .prototype-accordion textarea{width:100%!important;min-height:72px!important;padding:10px!important;border-radius:7px!important;font-size:16px!important;line-height:1.45!important;box-sizing:border-box!important;}
    #needQuickToggle,#practiceQuickToggle{display:none!important;}
    #needQuickButtons,#practiceQuickButtons{display:block!important;width:100%!important;position:static!important;margin-bottom:8px!important;}
    #needQuickList,#practiceQuickList{display:flex!important;position:static!important;width:100%!important;max-width:none!important;min-width:0!important;max-height:150px!important;overflow:auto!important;padding:0 0 5px!important;border:0!important;box-shadow:none!important;background:transparent!important;gap:6px!important;flex-wrap:wrap!important;}
    #needQuickList button,#practiceQuickList button{width:auto!important;min-height:38px!important;margin:0!important;padding:7px 9px!important;border:1px solid #cfd8e4!important;border-radius:7px!important;background:#f7f9fc!important;color:#263243!important;font-size:12px!important;font-weight:700!important;line-height:1.2!important;white-space:normal!important;}
    .skills-row>div:last-child{width:100%!important;}
    #toggleRequiredAllBtn,#toggleLevel1MobileBtn,#restoreCoreDefaultsBtn{min-height:38px!important;padding:7px 10px!important;border-radius:7px!important;font-size:12px!important;}
    .remark-table,.remark-table tbody{display:block!important;width:100%!important;}
    .remark-table thead{display:none!important;}
    .remark-table tr{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:7px!important;width:100%!important;}
    .remark-table td{display:contents!important;}
    .remark-table td[style*="display: none"],.remark-cell label[style*="display: none"]{display:none!important;}
    .remark-cell label{display:grid!important;grid-template-rows:auto 34px!important;justify-items:center!important;align-items:center!important;gap:4px!important;min-width:0!important;margin:0!important;padding:7px 2px!important;border:1px solid var(--prototype-line)!important;border-radius:7px!important;background:#fafbfd!important;white-space:normal!important;text-align:center!important;}
    .remark-cell .remark-name{order:1!important;font-size:11px!important;line-height:1.15!important;white-space:normal!important;}
    .remark-cell .remark-symbol{order:2!important;margin:0!important;transform:scale(1.35);}
    #skillBlockCore.style-block{display:grid!important;grid-template-columns:1fr!important;gap:7px!important;padding:0!important;box-shadow:none!important;background:transparent!important;}
    #skillBlockCore .skill-col{display:grid!important;grid-template-columns:86px minmax(0,1fr)!important;align-items:center!important;width:100%!important;min-width:0!important;padding:7px!important;border:1px solid var(--prototype-line)!important;border-radius:7px!important;background:#fafbfd!important;box-sizing:border-box!important;}
    #skillBlockCore .skill-name{margin:0!important;font-size:12px!important;text-align:left!important;white-space:normal!important;}
    #skillBlockCore .skill-buttons{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important;}
    #skillBlockCore .skill-row{display:contents!important;}
    #skillBlockCore .skill-buttons button{width:100%!important;height:38px!important;line-height:38px!important;border-radius:6px!important;font-size:11px!important;}
    .optional-skills{display:flex!important;gap:6px!important;margin-top:8px!important;flex-wrap:wrap!important;}
    .optional-title{width:100%;font-size:12px!important;font-weight:800;color:#4a5565!important;}
    .optional-skill{min-height:38px;padding:5px 8px!important;border-radius:7px!important;font-size:12px!important;background:#f7f9fc!important;}
    .optional-skill input{width:18px!important;height:18px!important;accent-color:var(--prototype-blue);}
    .note-required{font-size:11px!important;margin-top:8px!important;color:#687386!important;}
    .prototype-preview-card{position:fixed!important;bottom:0!important;left:0!important;right:0!important;z-index:20!important;width:min(calc(100% - 16px),448px)!important;max-height:65dvh!important;overflow-y:auto!important;margin:0 auto!important;padding:0 0 calc(8px + env(safe-area-inset-bottom))!important;border:1px solid #ccd5e1!important;border-bottom:0!important;border-radius:8px 8px 0 0!important;background:#fff!important;box-shadow:0 -5px 20px rgba(27,39,51,.14)!important;}
    .prototype-preview-details>summary{list-style:none;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:8px;min-height:54px;padding:8px 10px;cursor:pointer;}
    .prototype-preview-details>summary::-webkit-details-marker{display:none;}
    .prototype-preview-title{font-size:12px;font-weight:900;color:var(--prototype-blue);white-space:nowrap;}
    .prototype-preview-snippet{font-size:12px;color:#4b5565;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .prototype-preview-chevron{font-size:16px;color:#657187;}
    .prototype-preview-details[open] .prototype-preview-chevron{transform:rotate(180deg);}
    .prototype-preview-body{padding:0 10px 4px;border-top:1px solid var(--prototype-line);}
    .prototype-preview-card .preview{min-height:40px!important;max-height:min(140px,20vh)!important;overflow:auto!important;margin-top:8px!important;padding:9px!important;border-radius:7px!important;font-size:13px!important;line-height:1.45!important;}
    .prototype-preview-card .preview-actions{display:grid!important;grid-template-columns:1fr 1fr 1fr!important;gap:6px!important;margin:0!important;padding:0 10px!important;}
    .prototype-preview-card .preview-actions>div{display:contents!important;}
    .prototype-preview-card .btn{width:100%!important;min-height:42px!important;padding:7px!important;border-radius:7px!important;font-size:12px!important;}
    .copy-check{display:none!important;}
    @media(max-width:360px){
      .prototype-choice-grid.compact-5{grid-template-columns:repeat(3,minmax(0,1fr));}
      #skillBlockCore .skill-col{grid-template-columns:72px minmax(0,1fr)!important;}
      #skillBlockCore .skill-buttons{gap:3px!important;}
    }
  `;
  doc.head.appendChild(style);

  const generator = doc.getElementById('generatorTab');
  const cards = generator ? generator.querySelectorAll('.grid>.card') : [];
  const formCard = cards[0];
  const previewCard = cards[1];
  if(!formCard || !previewCard) return;

  const heading = doc.createElement('div');
  heading.className = 'prototype-heading';
  heading.innerHTML = '<strong>手機快速評語</strong><span>操作範例</span>';
  formCard.prepend(heading);

  const basic = doc.createElement('section');
  basic.className = 'prototype-basic';
  heading.after(basic);

  const choiceConfigs = [
    {id:'level',label:'等級',required:true,grid:'level-grid'},
    {id:'rating',label:'評級',grid:'rating-grid'},
    {id:'levelState',label:'能力',required:true,grid:'compact-3',collapsible:true},
    {id:'degreeSelect',label:'程度',required:true,grid:'degree-grid'},
    {id:'character',label:'特質',grid:'compact-5',collapsible:true}
  ];
  const choiceSections = new Map();

  function selectValue(select, value){
    if(select.value === value) return;
    select.value = value;
    select.dispatchEvent(new appWindow.Event('input', {bubbles:true}));
    select.dispatchEvent(new appWindow.Event('change', {bubbles:true}));
    appWindow.setTimeout(refreshAll, 0);
  }

  function buildChoiceSection(config){
    const select = doc.getElementById(config.id);
    if(!select) return;
    let section = choiceSections.get(config.id);
    if(!section){
      section = doc.createElement(config.collapsible ? 'details' : 'section');
      section.className = `prototype-choice-section${config.collapsible ? ' prototype-collapsible' : ''}`;
      section.dataset.selectId = config.id;
      const label = doc.createElement(config.collapsible ? 'summary' : 'div');
      label.className = `prototype-choice-label${config.required && !config.collapsible ? ' required' : ''}`;
      label.textContent = config.label;
      if(config.collapsible){
        if(config.required){
          const required = doc.createElement('span');
          required.textContent = '*';
          required.style.color = 'var(--prototype-coral)';
          label.appendChild(required);
        }
        const value = doc.createElement('span');
        value.className = 'prototype-choice-value';
        label.appendChild(value);
      }
      const grid = doc.createElement('div');
      grid.className = `prototype-choice-grid ${config.grid || ''}`.trim();
      section.append(label, grid);
      basic.appendChild(section);
      choiceSections.set(config.id, section);
    }
    const grid = section.querySelector('.prototype-choice-grid');
    const currentValue = section.querySelector('.prototype-choice-value');
    if(currentValue) currentValue.textContent = select.value || '未選擇';
    const options = Array.from(select.options).filter(option=>option.value !== '');
    const signature = JSON.stringify(options.map(option=>[option.value, option.textContent]));
    // Preserve button nodes during selection so an in-flight tap keeps its target.
    if(grid.dataset.options !== signature){
      grid.dataset.options = signature;
      grid.replaceChildren(...options.map(option=>{
      const button = doc.createElement('button');
      button.type = 'button';
      button.className = `prototype-choice${select.value === option.value ? ' active' : ''}`;
      button.textContent = config.id === 'level' ? option.value : option.textContent.trim();
      if(config.id === 'level') button.setAttribute('aria-label', option.textContent.trim());
      button.dataset.value = option.value;
      button.setAttribute('aria-pressed', select.value === option.value ? 'true' : 'false');
      button.addEventListener('click', ()=>selectValue(select, option.value));
      return button;
      }));
    }
    for(const button of grid.children){
      const selected = select.value === button.dataset.value;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
  }

  choiceConfigs.forEach(buildChoiceSection);

  const reverse = doc.getElementById('reverseFootWrap');
  if(reverse){
    const reverseSection = doc.createElement('section');
    reverseSection.id = 'prototypeReverse';
    reverseSection.className = 'prototype-choice-section';
    const reverseLabel = doc.createElement('div');
    reverseLabel.className = 'prototype-choice-label';
    reverseLabel.textContent = '反腳';
    reverseSection.append(reverseLabel, reverse);
    basic.appendChild(reverseSection);
  }

  function wrapAccordion(row, title, open){
    if(!row) return null;
    const details = doc.createElement('details');
    details.className = 'prototype-accordion';
    details.open = !!open;
    const summary = doc.createElement('summary');
    summary.textContent = title;
    const content = doc.createElement('div');
    content.className = 'prototype-accordion-content';
    row.before(details);
    content.appendChild(row);
    details.append(summary, content);
    return details;
  }

  const rowFor = id=>{
    const el = doc.getElementById(id);
    return el ? el.closest('.form-row') : null;
  };
  const skillsDetails = wrapAccordion(doc.querySelector('.skills-row'), '技能評量', true);
  const notesDetails = wrapAccordion(rowFor('otherNotes'), '其他備註', true);
  const needDetails = wrapAccordion(rowFor('needImprove'), '需加強', false);
  const practiceDetails = wrapAccordion(rowFor('practice'), '建議練習', false);
  [skillsDetails, notesDetails, needDetails, practiceDetails].forEach(details=>{
    if(details) formCard.appendChild(details);
  });

  try{ if(typeof appWindow.renderNeedQuickButtons === 'function') appWindow.renderNeedQuickButtons(); }catch(e){}
  try{ if(typeof appWindow.renderPracticeQuickButtons === 'function') appWindow.renderPracticeQuickButtons(); }catch(e){}

  previewCard.classList.add('prototype-preview-card');
  const preview = doc.getElementById('preview');
  const previewActions = previewCard.querySelector('.preview-actions');
  const previewDetails = doc.createElement('details');
  previewDetails.className = 'prototype-preview-details';
  const previewSummary = doc.createElement('summary');
  const previewTitle = doc.createElement('span');
  previewTitle.className = 'prototype-preview-title';
  previewTitle.textContent = 'MA 預覽';
  const previewSnippet = doc.createElement('span');
  previewSnippet.className = 'prototype-preview-snippet';
  const previewChevron = doc.createElement('span');
  previewChevron.className = 'prototype-preview-chevron';
  previewChevron.textContent = '⌃';
  previewSummary.append(previewTitle, previewSnippet, previewChevron);
  const previewBody = doc.createElement('div');
  previewBody.className = 'prototype-preview-body';
  previewBody.append(preview);
  previewDetails.append(previewSummary, previewBody);
  previewCard.replaceChildren(previewDetails, previewActions);
  const scroller = doc.createElement('main');
  scroller.className = 'prototype-scroll';
  const header = doc.querySelector('.header');
  const container = doc.querySelector('.container');
  doc.body.prepend(scroller);
  scroller.append(header, container);
  doc.body.appendChild(previewCard);
  // Keep the footer's space even while hidden, so focus/blur cannot move buttons.
  function reserveFooterSpace(){
    doc.documentElement.style.setProperty('--mobile-footer-height', `${previewCard.getBoundingClientRect().height}px`);
  }
  if(window.ResizeObserver) new ResizeObserver(reserveFooterSpace).observe(previewCard);
  previewDetails.addEventListener('toggle', reserveFooterSpace);
  window.addEventListener('resize', reserveFooterSpace);
  reserveFooterSpace();

  const updatePreviewSnippet = ()=>{
    const text = (preview.textContent || '').trim();
    previewSnippet.textContent = text || '尚未產生評語';
  };
  updatePreviewSnippet();

  function syncVisibility(){
    const level = doc.getElementById('level').value;
    const visible = {
      rating: level !== '8',
      levelState: !['7','8'].includes(level),
      degreeSelect: !['7','8'].includes(level),
      character: true,
      level: true
    };
    choiceSections.forEach((section,id)=>{ section.style.display = visible[id] ? '' : 'none'; });
    if(skillsDetails){
      skillsDetails.hidden = !level;
      skillsDetails.querySelector('summary').textContent = ['7','8'].includes(level) ? '核心技能' : '必要技能';
      if(skillsDetails.dataset.level !== level){
        skillsDetails.open = !!level;
        skillsDetails.dataset.level = level;
      }
    }
    const reverseSection = doc.getElementById('prototypeReverse');
    if(reverseSection) reverseSection.style.display = ['4','5','6','7'].includes(level) ? '' : 'none';
  }

  function refreshAll(){
    choiceConfigs.forEach(buildChoiceSection);
    syncVisibility();
    try{ if(typeof appWindow.renderNeedQuickButtons === 'function') appWindow.renderNeedQuickButtons(); }catch(e){}
    try{ if(typeof appWindow.renderPracticeQuickButtons === 'function') appWindow.renderPracticeQuickButtons(); }catch(e){}
    updatePreviewSnippet();
  }

  doc.addEventListener('change', ()=>appWindow.setTimeout(refreshAll,0), true);
  doc.addEventListener('input', ()=>appWindow.setTimeout(updatePreviewSnippet,0), true);
  doc.addEventListener('rating-options-updated', ()=>appWindow.setTimeout(refreshAll,0));
  doc.addEventListener('click', event=>{
    if(event.target.closest('#toggleResetInputsBtn,#toggleResetRestoreBtn,#restoreCoreDefaultsBtn')){
      appWindow.setTimeout(refreshAll,0);
    }else{
      appWindow.setTimeout(updatePreviewSnippet,0);
    }
  }, true);
  refreshAll();
})();

