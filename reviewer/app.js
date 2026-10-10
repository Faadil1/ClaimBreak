// Runs without network, storage or an imported module. Bundled into index.html by tools/build-reviewer.mjs.
(() => {
  const $=id=>document.getElementById(id);
  const enc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const num=x=>Number.isFinite(x)?x.toFixed(3):'—';
  const receipts=[];
  let selected=-1;
  const setMessage=m=>{$('feedback').textContent=m;};
  function addRecord(source, json){
    if(receipts.length>=25){setMessage('Maximum 25 receipts per review session. Clear some records first.');return;}
    const check=verifyReceipt(json);
    if(!check.record){setMessage(`Could not parse ${source}. Provide a JSON object.`);return;}
    const id=check.record.execution?.jobId||null;
    if(id && receipts.some(x=>x.check.record?.execution?.jobId===id)) {setMessage(`Already imported job ${id}.`);return;}
    receipts.push({source,check}); selected=receipts.length-1;
    render();setMessage(`${source}: ${check.status} — ${check.checks.filter(x=>!x.pass && x.severity==='error').length} numerical/integrity error(s).`);
  }
  function render(){
    const have=receipts.length>0;
    $('empty').classList.toggle('hidden',have);$('docket').classList.toggle('hidden',!have);
    $('clear-all').disabled=!have;$('export-review').disabled=!have;
    $('count-summary').textContent=`${receipts.length} receipt${receipts.length===1?'':'s'} · ${receipts.filter(x=>x.check.status==='PASS').length} pass`;
    const body=$('receipt-rows');body.innerHTML='';
    receipts.forEach((item,i)=>{
      const {record:r,computed:e,status}=item.check;
      const c=r?.configuration??{};const ex=r?.execution??{};const d=r?.decision;
      const tr=document.createElement('tr');tr.dataset.receipt=String(i);tr.className=i===selected?'selected':'';tr.tabIndex=0;tr.setAttribute('role','button');tr.setAttribute('aria-label',`Review ${item.source}`);
      tr.innerHTML=`<td>${enc(item.source)}<br><code>${enc(c.caseId||'?')} · ${enc(c.protocol||'?')} · ${enc(c.shots??'')} per basis</code></td><td>${enc(ex.backendName||'UNDECLARED')}</td><td class="mono">${e?`S ${num(e.S)} / L ${num(e.lower)}`:'Not computable'}</td><td><span class="pill ${d?(d.supported?'PASS':'FAIL'):'WARN'}">${enc(d?.verdict||'NO DECISION')}</span></td><td><span class="pill ${status}">${status}</span></td>`;
      tr.addEventListener('click',()=>{selected=i;render();});tr.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();selected=i;render();}});
      body.append(tr);
    });
    renderDetail();
  }
  function renderDetail(){
    const target=$('detail');
    if(selected<0||!receipts[selected]){target.classList.add('hidden');return;}
    target.classList.remove('hidden');
    const {source,check:{record:r,computed:e,checks,status}}=receipts[selected];
    const conf=r.configuration||{};const exec=r.execution||{};const d=r.decision;
    const classify=String(exec.backendName||'').toLowerCase().includes('simulator')?'Simulator (declared)': 'Device class not independently verified';
    const checksHtml=checks.map(x=>`<li><span class="dot ${x.pass?'':x.severity==='warning'?'warn':'failed'}"></span><span>${enc(x.label)} ${x.pass?'':'— '+(x.severity==='warning'?'NOTICE':'FAIL')}</span></li>`).join('');
    const hist=Array.isArray(r.decisionHistory)?r.decisionHistory:(d?[d]:[]);
    const historyRows=hist.map((h,i)=>`<tr><td>${enc(h.attempt??i+1)}</td><td>${enc(h.verdict)}</td><td>${h.supported?'ACCEPTED':'REJECTED'}</td></tr>`).join('')||'<tr><td colspan="3">No decisions recorded</td></tr>';
    const eventHtml=Array.isArray(r.events)?r.events.map(x=>`<p><span class="mono">${enc(x.utc)}</span><br><strong>${enc(x.type)}</strong></p>`).join(''):'No event data';
    const ch=r.challenge;
    const crossExamination=ch?`<div class="panel"><div class="overline">04 / PLAYER STRATEGY / CROSS-EXAMINATION</div>
    <h2>The measurement can overrule the player</h2>
    <p><strong>Forecast locked before the quantum run:</strong> ${enc(ch.forecast)}</p>
    <p><span class="pill ${ch.forecastSupported?'PASS':'FAIL'}">${ch.forecastSupported?'SUPPORTED BY MEASUREMENT':'OVERTURNED BY MEASUREMENT'}</span>
       <span class="pill ${status}">AUDIT ${status}</span></p>
    <p class="muted">Session outcome: ${enc(ch.status)} · ${enc(ch.attemptCount)} verdict attempt(s).
    The verdict history cannot erase the original forecast.</p>
    <p class="mono">${enc(ch.resourceUse?.quantumJobs??'?')} quantum job · ${enc(ch.resourceUse?.shotsPerSetting??'?')} shots per setting · ${enc(ch.resourceUse?.measuredSettings??'?')} basis setting(s)</p>
    <p class="muted">The reviewer recomputes forecast support from raw bitstrings. No game points masquerade as a scientific confidence measure.</p></div>`:'';
    target.innerHTML=`<div class="section-heading"><div><span class="overline">03 / INDEPENDENT REASSESSMENT</span><h2 id="detail-title">${enc(source)}</h2></div><span class="pill ${status}">INTERNAL AUDIT / ${status}</span></div><div class="record-facts"><span>CASE ${enc(conf.caseId)}</span><span>${enc(conf.protocol)} witness</span><span>${enc(exec.backendName)}</span><span>${enc(exec.shots)} shots per setting</span><span>${enc(classify)}</span></div><div class="findings-grid">${crossExamination}<div class="panel"><div class="overline">RECOMPUTED / NOT COPIED</div><h2>Scientific finding</h2><div class="metrics"><div class="metric"><small>ZZ parity</small><b>${num(e?.zz)}</b></div><div class="metric"><small>XX parity</small><b>${num(e?.xx)}</b></div><div class="metric"><small>Witness S</small><b>${num(e?.S)}</b></div><div class="metric"><small>Lower bound</small><b>${num(e?.lower)}</b></div><div class="metric"><small>Fidelity upper</small><b>${num(e?.fidelityUpper)}</b></div><div class="metric"><small>Entanglement witness</small><b>${e?.certified?'YES':'NO'}</b></div></div><div class="redline"><strong>Interpretation:</strong> ${e?.certified?'Selected witness crosses the separable threshold under the declared assumptions.':'Selected evidence does not establish entanglement. This never proves separability.'} ${e?.fidelityUpper!==null&&e?.fidelityUpper<.90&&conf.caseId==='B'?'The computed fidelity upper bound refutes the case B ≥0.90 claim.':''}</div></div><div class="panel"><div class="overline">INTEGRITY / CROSS-CHECKS</div><h2>Audit trail</h2><ul class="checklist">${checksHtml}</ul></div><div class="panel"><div class="overline">DECISION / APPEAL</div><h2>Reasoned verdict</h2><p><span class="pill ${d?(d.supported?'PASS':'FAIL'):'WARN'}">${enc(d?.verdict||'NOT FILED')}</span></p><p class="muted">${enc(d?.explanation||'This receipt contains no user verdict.')}</p><table class="review-table"><thead><tr><th>Attempt</th><th>Verdict</th><th>Outcome</th></tr></thead><tbody>${historyRows}</tbody></table></div><div class="panel"><div class="overline">PROVENANCE / UNVERIFIED ORIGIN</div><h2>Execution trail</h2><p class="mono">JOB ${enc(exec.jobId||'NOT EXPOSED')}</p><div class="eventbox">${eventHtml}</div><p class="small-note">This is a user-controlled record. No cryptographic signing, provider attestation, or independent backend API verification is performed.</p></div></div>`;
  }
  $('file-input').addEventListener('change',async ev=>{for(const f of [...ev.target.files]){try{addRecord(f.name,await f.text());}catch(e){setMessage(`Cannot read ${f.name}: ${e.message}`);}}ev.target.value='';});
  const zone=$('drop-zone');
  zone.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();$('file-input').click();}});
  for(const event of ['dragenter','dragover'])zone.addEventListener(event,ev=>{ev.preventDefault();zone.classList.add('drag');});
  for(const event of ['dragleave','drop'])zone.addEventListener(event,ev=>{ev.preventDefault();zone.classList.remove('drag');});
  zone.addEventListener('drop',async ev=>{for(const f of [...ev.dataTransfer.files]){try{addRecord(f.name,await f.text());}catch(e){setMessage(`Cannot read ${f.name}: ${e.message}`);}}});
  $('show-paste').addEventListener('click',()=>{$('paste-panel').classList.toggle('hidden');$('json-paste').focus();});
  $('inspect-paste').addEventListener('click',()=>addRecord('Pasted record '+(receipts.length+1),$('json-paste').value));
  $('load-example').addEventListener('click',()=>{addRecord('SYNTHETIC_FIXTURE_NOT_LIVE',window.CB_SYNTHETIC_FIXTURE);});
  $('clear-all').addEventListener('click',()=>{receipts.length=0;selected=-1;render();setMessage('Session cleared. No data was persisted.');});
  $('export-review').addEventListener('click',()=>{
    const summary={product:'ClaimBreak Evidence Reviewer',reviewerVersion:REVIEWER_VERSION,kind:'LOCAL_INTEGRITY_REVIEW_NOT_BACKEND_ATTESTATION',generatedUtc:new Date().toISOString(),records:receipts.map(item=>({source:item.source,claimedJobId:item.check.record?.execution?.jobId??null,declaredBackend:item.check.record?.execution?.backendName??null,internalStatus:item.check.status,computed:item.check.computed,checks:item.check.checks,decision:item.check.record?.decision??null}))};
    $('review-export').classList.remove('hidden');$('review-json').value=JSON.stringify(summary,null,2);$('review-export').scrollIntoView({block:'start',behavior:'smooth'});
  });
  $('close-review').addEventListener('click',()=>{$('review-export').classList.add('hidden');});
  $('select-review').addEventListener('click',()=>{$('review-json').focus();$('review-json').select();setMessage('Report selected. Press Ctrl+C to copy.');});
  render();
})();
