// CLAIMBREAK STAGE 4.2 — Cross-Examination: commit a forecast, spend quantum shots, and face the result.
// Hardening pass: honest provenance, decision outcome events, analytical reliability audit, export and recovery.
// Intended for Qollab's JS/Qiskit project shape. Keep starter index.html (#container).
// The Qollab runtime injects `backend`. Never hardcode a QPU or credentials.
// One experiment / one circuit / one backend.run per Qollab Run.
// Users MUST choose the case/protocol/shots BEFORE pressing "Collect quantum evidence".
// After a run, buttons analyze the acquired evidence ONLY; no second quantum job.
// Scientific confidence claims require trusted local measurements and independent samples.
import { QuantumCircuit } from 'qiskit';

const ALPHA = 0.01; // predeclared ONE selected one-sided test per execution
const VERSION = 'stage4.2';
const CASES = {
  A: {
    label: 'Source A', docket: 'FILE / 001', claim: 'The submitted source is entangled.',
    briefing: 'The supplier points to perfect Z-basis agreement. Decide which experiment could actually establish its claim.',
    truth: 'Entangled Bell state |Φ+⟩', explanation: 'Bell |Φ+⟩ has ZZ = +1 and XX = +1. A calibrated ZZ + XX witness can certify it.'
  },
  B: {
    label: 'Source B', docket: 'FILE / 002', claim: 'Fidelity with |Φ+⟩ is at least 0.90.',
    briefing: 'The supplier provides a strong quantitative fidelity promise. Challenge that number using justified bounds.',
    truth: 'Separable mixture ½|00⟩⟨00| + ½|11⟩⟨11|',
    explanation: 'An ignored GHZ ancilla makes the two-qubit reduced state classically correlated. ZZ = +1, XX = 0, and fidelity with |Φ+⟩ = 0.50.'
  },
  C: {
    label: 'Source C', docket: 'FILE / 003', claim: 'The submitted two-qubit state is separable.',
    briefing: 'An ordinary witness reportedly failed. Can a different prespecified witness disprove separability?',
    truth: 'Entangled Bell state |Φ−⟩', explanation: 'Bell |Φ−⟩ has ZZ = +1 and XX = −1. The ZZ − XX witness can establish entanglement.'
  }
};
const PROTOCOLS = {
  z: { label: 'Z only — insufficient baseline', summary: 'Measure ZZ only; no entanglement witness or fidelity bound.' },
  plus: { label: 'Two bases — witness ZZ + XX', summary: 'Collect independent ZZ and XX samples and test S = ZZ + XX.' },
  minus: { label: 'Two bases — witness ZZ − XX', summary: 'Collect independent ZZ and XX samples and test S = ZZ − XX.' }
};
const root = document.getElementById('container');
if (!root) throw new Error('ClaimBreak requires the Qollab starter index.html element #container.');

const state = {
  phase: 'setup', selection: { caseId:'A', protocol:'plus', shots:128 },
  execution:null, evidence:null, decision:null, decisionHistory:[], events:[], error:null, selectedHypothesis:null, auditChecks:null,
  challenge:{forecast:null, locked:false}
};
let startResolve = null;
const isoNow = () => new Date().toISOString();
const escapeHTML = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const fmt = n => Number.isFinite(n) ? n.toFixed(3) : '—';
const pct = n => Number.isFinite(n) ? (100*n).toFixed(2)+'%' : '—';
function record(type, detail) { state.events.push({ utc:isoNow(), type, detail }); }
function backendLabel() {
  try {
    const x = typeof backend.name === 'function' ? backend.name() : backend.name;
    if (typeof x === 'string' && x.trim()) return x.trim();
  } catch (_) { /* No backend classification guess */ }
  return 'Qollab-selected backend (device class unverified)';
}

// The classical mixture MUST be a mixed two-qubit state within EACH quantum job,
// not a single random |00> or |11> choice reused across all shots.
function buildCircuit(caseId, protocol) {
  const pairQubits = caseId === 'B' ? 3 : 2; // B uses a purification ancilla.
  const settings = protocol === 'z' ? ['Z'] : ['Z','X'];
  const nQubits = pairQubits * settings.length;
  const circuit = QuantumCircuit(nQubits, nQubits);
  const groups = [];
  for (let k = 0; k < settings.length; k++) {
    const offset = pairQubits * k;
    let qA, qB;
    if (caseId === 'B') {
      const env = offset;
      qA = offset + 1; qB = offset + 2;
      circuit.h(env); circuit.cx(env, qA); circuit.cx(env, qB);
    } else {
      qA = offset; qB = offset + 1;
      circuit.h(qA); circuit.cx(qA, qB);
      if (caseId === 'C') circuit.z(qA);
    }
    if (settings[k] === 'X') { circuit.h(qA); circuit.h(qB); }
    groups.push({ setting: settings[k], qA, qB });
  }
  // Measure every qubit for broad backend compatibility, including environment ancillas.
  // Crucial: never CONDITION the AB analysis on any ancilla outcome.
  for (let q=0; q<nQubits; q++) circuit.measure(q,q);
  return { circuit, nQubits, groups };
}
function normalizeCounts(raw, nBits) {
  const entries = raw instanceof Map ? [...raw.entries()] : Object.entries(raw);
  const cleaned = [];
  for (const [key, frequency] of entries) {
    const trimmed = String(key).replace(/\s/g,'');
    const count = Number(frequency);
    if (!/^[01]+$/.test(trimmed) || trimmed.length > nBits ||
        !Number.isInteger(count) || count < 0) throw new Error(`Invalid count: ${key} => ${frequency}`);
    cleaned.push([trimmed.padStart(nBits,'0'), count]);
  }
  if (!cleaned.length || cleaned.reduce((a,x)=>a+x[1],0) < 1) throw new Error('Backend returned no observations.');
  return cleaned;
}
function parityCorrelation(entries, nBits, qA, qB) {
  let total = 0, signed = 0;
  for (const [bits,n] of entries) {
    signed += (bits[nBits-1-qA] === bits[nBits-1-qB] ? 1 : -1)*n;
    total += n;
  }
  return { expectation:signed/total, samples:total };
}
function evaluateEvidence(entries, bundle, protocol) {
  const correlations = {};
  for (const g of bundle.groups) correlations[g.setting] = parityCorrelation(entries, bundle.nQubits, g.qA, g.qB);
  const zz = correlations.Z.expectation;
  const xx = correlations.X?.expectation ?? null;
  const n = correlations.Z.samples;
  if (xx !== null && correlations.X.samples !== n) throw new Error('Unequal sample counts between bases.');
  const sign = protocol === 'minus' ? -1 : 1;
  const S = xx === null ? null : zz + sign*xx;
  // One-sided Hoeffding bound for S from two independent sets of ±1 samples.
  // Predeclare protocol before measurement. No repeated-testing guarantees claimed.
  const margin = S === null ? null : 2*Math.sqrt(Math.log(1/ALPHA)/n);
  const lower = S === null ? null : S-margin;
  const certified = lower !== null && lower > 1;
  // For all two-qubit states: F_(Phi+) <= (2 + <ZZ> + <XX>)/4.
  // This upper bound has coverage >=99% only for a predeclared PLUS protocol.
  const fidelityUpper = protocol === 'plus' ? Math.min(1,(2+S+margin)/4) : null;
  return { zz, xx, S, margin, lower, fidelityUpper, certified, shotsReturned:n, protocol };
}
// These checks verify internal receipt consistency. They are not physical-device calibration.
function auditRecord(entries, bundle, selection, evidence) {
  const tests = [];
  const test = (name, pass) => tests.push({name, pass:Boolean(pass)});
  const n = entries.reduce((total,x)=>total+x[1],0);
  test('Measured shots equal predeclared shots', n===selection.shots);
  test('Bitstrings have expected width',entries.every(([b])=>b.length===bundle.nQubits));
  test('One circuit requested',bundle.groups.length===(selection.protocol==='z'?1:2));
  test('All measured correlations are within [-1,+1]',
    Math.abs(evidence.zz)<=1+1e-12 && (evidence.xx===null || Math.abs(evidence.xx)<=1+1e-12));
  test('Z-only does not certify',selection.protocol!=='z' ||
    (!evidence.certified && evidence.S===null && evidence.margin===null));
  test('Witness and threshold agree',evidence.lower===null ? !evidence.certified:
    evidence.certified===(evidence.lower>1));
  return {status:tests.every(t=>t.pass)?'PASS':'FAIL',checks:tests};
}

// An exact mathematical reference for a *separable* source with ZZ=+1 and
// XX built from N independent, equiprobable +/- outcomes.
// This is a theoretical probability, NEVER additional backend executions.
function theoreticalFalseCertificationRate(shots,threshold) {
  let probability=0;
  let lnFactorial=0;
  const logFact=[0];
  for(let k=1;k<=shots;k++){lnFactorial+=Math.log(k);logFact.push(lnFactorial);}
  for(let k=0;k<=shots;k++){
    const xx=(2*k-shots)/shots;
    if(xx>threshold){
      const logP=logFact[shots]-logFact[k]-logFact[shots-k]-shots*Math.log(2);
      probability+=Math.exp(logP);
    }
  }
  return Math.min(1,Math.max(0,probability));
}

// PURE CHALLENGE RULES — independently unit tested offline.
function supportsVerdict(verdict,e,caseId,auditPassed) {
  if(!auditPassed || !e) return false;
  if (verdict === 'CERTIFIED_ENTANGLEMENT') return e.certified === true;
  if (verdict === 'REFUTE_SPECIFIC_CLAIM') {
    if (caseId === 'B') return e.fidelityUpper !== null && e.fidelityUpper < 0.90;
    if (caseId === 'C') return e.certified === true;
    return false;
  }
  if (verdict === 'NOT_ESTABLISHED') {
    const refutable = caseId === 'B' ? e.fidelityUpper !== null && e.fidelityUpper < 0.90
      : caseId === 'C' ? e.certified === true : false;
    return !e.certified && !refutable;
  }
  return false;
}
function challengeAssessment(forecast,e,caseId,auditPassed,history,shots,protocol) {
  const valid=['CERTIFIED_ENTANGLEMENT','REFUTE_SPECIFIC_CLAIM','NOT_ESTABLISHED'].includes(forecast);
  const precommitSupported=valid && supportsVerdict(forecast,e,caseId,auditPassed);
  const accepted=history.find(d=>d.supported) || null;
  return {
    forecast, forecastSupported:precommitSupported, attemptCount:history.length,
    acceptedVerdict:accepted?.verdict ?? null,
    caseResolved:Boolean(accepted && accepted.verdict!=='NOT_ESTABLISHED'),
    status: !accepted ? 'AWAITING_ADMISSIBLE_VERDICT' :
      precommitSupported ? 'FORECAST_UPHELD' : 'FORECAST_OVERTURNED',
    resourceUse:{quantumJobs:1,shotsPerSetting:shots,measuredSettings:protocol==='z'?1:2},
    scoringBasis:'Forecast locked before measurement. Outcome depends on measured evidence. No extra quantum calls.'
  };
}
function allowedDecision(verdict) {
  return supportsVerdict(verdict,state.evidence,state.selection.caseId,state.auditChecks?.status==='PASS');
}
// END PURE CHALLENGE RULES

const css = `
#cb3{--bg:#f2efe8;--panel:#fffdf9;--ink:#212d28;--muted:#5d6c64;--line:#ccd1c7;--accent:#a63f2c;--forest:#22382e;--safe:#255944; color:var(--ink);background:var(--bg);font:15px/1.55 system-ui,-apple-system,Segoe UI,sans-serif;min-height:540px}
#cb3 *{box-sizing:border-box}#cb3 .header{background:var(--forest);color:#f6f2e9;border-bottom:4px solid var(--accent);padding:24px clamp(18px,4vw,36px)}
#cb3 .eyebrow{font:700 11px/1.5 ui-monospace,Consolas,monospace;letter-spacing:.13em;text-transform:uppercase}#cb3 h1,#cb3 h2{font-family:Georgia,serif;line-height:1.18;margin:.25em 0 .55em}#cb3 h1{font-size:clamp(25px,3vw,38px)}#cb3 h2{font-size:clamp(20px,2vw,26px)}
#cb3 p{margin:.3em 0 .9em}#cb3 .muted{color:var(--muted)}#cb3 .header .muted{color:#e5e6d9}#cb3 .page{padding:22px clamp(16px,4vw,34px);max-width:1100px;margin:auto}
#cb3 .grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(250px,.75fr);gap:18px}#cb3 .card{background:var(--panel);border:1px solid var(--line);border-radius:5px;padding:22px;margin:0 0 17px}#cb3 .callout{padding:12px 15px;border-left:3px solid var(--accent);background:#f6f0e7;margin:14px 0}
#cb3 button,#cb3 select{font:inherit}#cb3 button{cursor:pointer;padding:11px 15px;border-radius:3px;border:1px solid var(--forest);background:var(--forest);color:#fffdf9;font-weight:650}#cb3 button:hover{filter:brightness(1.12)}#cb3 button:focus-visible,#cb3 select:focus-visible,#cb3 textarea:focus-visible{outline:3px solid #c05d3e;outline-offset:3px}
#cb3 button.outline{background:transparent;color:var(--forest)}#cb3 button:disabled{opacity:.47;cursor:not-allowed}#cb3 label{display:block;font-weight:600;margin:12px 0 5px}#cb3 select{display:block;padding:12px 10px;border:1px solid #89998e;border-radius:3px;width:100%;max-width:100%;background:#fff;color:#202d26}
#cb3 .tag{display:inline-flex;align-items:center;gap:5px;border-radius:3px;border:1px solid #728579;padding:4px 8px;font:600 11px/1.3 ui-monospace,monospace;letter-spacing:.05em}
#cb3 .metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}#cb3 .metric{background:#f0f2eb;padding:12px;border:1px solid var(--line)}#cb3 .metric strong{display:block;font:700 25px/1.35 Georgia,serif}#cb3 .metric small{display:block;color:var(--muted);font-size:12px}
#cb3 .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}#cb3 .success{border-left-color:#236347;background:#e9f1e9}#cb3 .error{border-left-color:#af3b2b;background:#f9e6df}#cb3 .stack{display:grid;gap:8px}
#cb3 .fine{font-size:12px;color:var(--muted)}#cb3 .ledger{font-size:12px;word-wrap:break-word}#cb3 textarea{font:12px/1.4 ui-monospace,Consolas,monospace;background:white;color:#1f2b25;width:100%;min-height:230px;padding:12px;border:1px solid #8c978c;resize:vertical}
#cb3 .decision{border-top:1px solid var(--line);padding-top:12px;margin-top:14px}#cb3 .status{font-weight:650}#cb3 summary{cursor:pointer;font-weight:600}
#cb3 .good{color:#235a43}#cb3 .bad{color:#ad3b2b}#cb3 .hint{font-size:12px;padding:10px 12px;background:#f1efe9;border:1px solid var(--line)}
#cb3 .mission{background:#1f382f;color:#f9f3e5;border:1px solid #4c6456;padding:20px;position:relative;overflow:hidden}
#cb3 .mission:before{content:'01 / CROSS-EXAMINATION';position:absolute;right:-8px;top:-8px;font:700 12px ui-monospace,monospace;letter-spacing:.1em;color:#77978a;opacity:.32;transform:rotate(9deg)}
#cb3 .mission h2{color:#fff4df}#cb3 .mission p{color:#dbe8df}#cb3 .mission label{color:#fff4df}
#cb3 .mission .fine{color:#c6d4c9}#cb3 .mission select{background:#fffaf1}
#cb3 .signal-rail{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0}
#cb3 .signal-cell{border:1px solid #cad2c8;background:#f5f5ef;padding:12px}
#cb3 .signal-track{height:9px;background:#e2e4db;position:relative;margin:9px 0}
#cb3 .signal-track>i{display:block;background:var(--accent);height:100%}
#cb3 .challenge-outcome{border:2px solid var(--forest);padding:16px;margin:16px 0;background:#f2f5ec}
#cb3 .challenge-outcome.lost{border-color:var(--accent);background:#fcf0e9}
#cb3 .challenge-outcome .eyebrow{color:var(--accent)}
#cb3 .scoreline{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
#cb3 .scoreline span{font:600 11px ui-monospace,monospace;letter-spacing:.03em;border:1px solid #aab8aa;padding:6px 8px}
#cb3 .mission-foot{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
@media(max-width:420px){#cb3 .signal-rail{grid-template-columns:1fr}}
@media(max-width:760px){#cb3 .grid{grid-template-columns:1fr}#cb3 .page{padding:14px}#cb3 .card{padding:16px}#cb3 .metrics{grid-template-columns:1fr 1fr}}
@media(prefers-reduced-motion:reduce){#cb3 *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
`;
root.innerHTML = `<style>${css}</style><main id="cb3"><header class="header"><div class="eyebrow">CLAIMBREAK / QUANTUM EVIDENCE COURT / STAGE 4</div><h1>Don't trust the claim.<br>Design the test.</h1><p class="muted">A live Qiskit experiment. One circuit per Qollab Run. Decisions must not exceed the evidence.</p><span class="tag" id="cb3-tag">AWAITING EXPERIMENT</span></header><div class="page" id="cb3-content" aria-live="polite"></div></main>`;
const content = root.querySelector('#cb3-content');
const tag = root.querySelector('#cb3-tag');
function layout(left, right='') { content.innerHTML = `<div class="grid"><section>${left}</section><aside>${right}</aside></div>`; }
function setupView() {
  const c = CASES[state.selection.caseId];
  const protocol = PROTOCOLS[state.selection.protocol];
  const testIsTwo = state.selection.protocol !== 'z';
  layout(`<div class="card"><div class="eyebrow">Stage 01 / experiment design</div><h2>Your protocol is the strategy</h2><p class="muted">Your choices determine the quantum circuit BEFORE it is sent to the selected backend. No other case is measured in this run.</p>
    <label for="cb3-case">Evidence case</label><select id="cb3-case" data-field="caseId">${Object.entries(CASES).map(([id,x])=>`<option value="${id}" ${id===state.selection.caseId?'selected':''}>${x.docket} — ${x.label}</option>`).join('')}</select>
    <label for="cb3-protocol">Predeclared measurement protocol</label><select id="cb3-protocol" data-field="protocol">${Object.entries(PROTOCOLS).map(([id,x])=>`<option value="${id}" ${id===state.selection.protocol?'selected':''}>${escapeHTML(x.label)}</option>`).join('')}</select>
    <label for="cb3-shots">Shots per setting</label><select id="cb3-shots" data-field="shots">${[64,128,256,512].map(n=>`<option value="${n}" ${n===state.selection.shots?'selected':''}>${n} ${n===128?'— recommended':''}</option>`).join('')}</select>
    <div class="callout"><strong>One actual quantum job.</strong> ${escapeHTML(protocol.summary)} ${testIsTwo?'The circuit contains two independent source preparations, one per basis.':'Only one preparation is executed.'} This is a real shot budget, not an inspection credit. With two settings you collect ${state.selection.shots} samples PER setting in one quantum job.</div>
    <div class="mission"><div class="eyebrow">Quantum cross-examination · your stake</div><h2>Commit your prediction before the quantum job</h2>
      <p>What will this protocol actually justify? You cannot edit this forecast after measurement. If the evidence contradicts you, the court will show it.</p>
      <label for="cb3-forecast">Your pre-run forecast</label>
      <select id="cb3-forecast" data-field="forecast"><option value="">Choose the decision you expect the evidence to support</option>
      ${[['CERTIFIED_ENTANGLEMENT','Certify entanglement'],['REFUTE_SPECIFIC_CLAIM','Refute the submitted claim'],['NOT_ESTABLISHED','Admit evidence is insufficient']]
        .map(([v,l])=>`<option value="${v}" ${v===state.challenge.forecast?'selected':''}>${l}</option>`).join('')}</select>
      <div class="mission-foot"><span class="tag">1 QUANTUM JOB</span><span class="tag">${state.selection.shots} SHOTS / BASIS</span>
      <span class="tag">${testIsTwo?2:1} MEASUREMENT ${testIsTwo?'BASES':'BASIS'}</span></div>
      <p class="fine">Shots are real backend resources, not game currency. An accurate forecast must survive actual bitstring counts and the calibrated bound.</p>
    </div>
    <div class="actions"><button type="button" data-action="start" ${!state.challenge.forecast?'disabled':''}>Lock forecast &amp; collect real quantum evidence →</button></div>
    <p class="fine">The Qollab console may say “Running...” while waiting for this click. Select Qiskit Built-in Simulator (24q) in Qollab first. Do not use paid IonQ hardware for this test.</p></div>`,
    `<div class="card"><div class="eyebrow">${escapeHTML(c.docket)} / sealed source</div><h2>${escapeHTML(c.label)}</h2><p><strong>Submitted claim:</strong> ${escapeHTML(c.claim)}</p><p>${escapeHTML(c.briefing)}</p><div class="callout"><strong>Unknown until decision.</strong> The underlying preparation is concealed before the experiment.</div></div><div class="card"><div class="eyebrow">Protocol integrity</div><p>99% one-sided confidence bound for ONE predeclared witness or fidelity test. Repeated searching across new runs is not covered by this error guarantee.</p><p class="fine">Trusted measurement assumptions apply. No claim of device-independent verification or proven vendor fraud.</p></div>`);
}
function runningView() {
  const c=CASES[state.selection.caseId];
  layout(`<div class="card"><div class="eyebrow">Running live / backend chosen by Qollab</div><h2>Collecting ${escapeHTML(c.label)} evidence…</h2><p role="status" class="status">Submitting one circuit with ${state.selection.shots} shots. Waiting for Qiskit results.</p><p class="fine">Please do not press Run again or leave this page until Qollab finishes. The quantum job is counted exactly once.</p></div>`);
}
function evidenceView() {
  const c=CASES[state.selection.caseId]; const e=state.evidence;
  const claimRefuted = state.selection.caseId==='B' && e.fidelityUpper!==null && e.fidelityUpper<0.90;
  const theory = state.decision && state.selection.caseId==='B' && state.selection.protocol==='plus'
    ? {naive:theoreticalFalseCertificationRate(e.shotsReturned,0),
       calibrated:theoreticalFalseCertificationRate(e.shotsReturned,e.margin)} : null;
  const scienceLine = state.selection.protocol==='z'
    ? 'Only ZZ was measured. No entanglement certification, nor a quantitative fidelity refutation, is possible from this evidence alone.'
    : `Predeclared statistic ${state.selection.protocol==='minus'?'ZZ − XX':'ZZ + XX'}; lower confidence bound ${fmt(e.lower)}. ${e.certified?'This bound exceeds the separable-state limit 1.':'It does not exceed the separable-state limit 1.'}`;
  const buttons = [
    ['CERTIFIED_ENTANGLEMENT','Certify entanglement'],
    ['REFUTE_SPECIFIC_CLAIM','Refute submitted claim'],
    ['NOT_ESTABLISHED','Evidence insufficient']
  ];
  layout(`<div class="card"><div class="eyebrow">${escapeHTML(c.docket)} / evidence acquired</div><h2>${escapeHTML(c.label)}</h2><p><strong>Submitted claim:</strong> ${escapeHTML(c.claim)}</p><p class="fine">Actual measurements from this execution only. No other source has been measured in this Run.</p><div class="metrics"><div class="metric"><small>ZZ observed</small><strong>${fmt(e.zz)}</strong></div><div class="metric"><small>XX observed</small><strong>${e.xx===null?'NOT MEASURED':fmt(e.xx)}</strong></div><div class="metric"><small>Selected witness S</small><strong>${fmt(e.S)}</strong></div><div class="metric"><small>One-sided margin (α = 0.01)</small><strong>${fmt(e.margin)}</strong></div></div><div class="callout">${scienceLine}</div>
  ${state.selection.caseId==='B' && e.fidelityUpper!==null?`<div class="callout"><strong>Claim-specific test:</strong> conservative 99% upper bound for fidelity F(Φ+) is <b>${fmt(e.fidelityUpper)}</b>. ${claimRefuted?'This is below the vendor threshold 0.90.':'This does not yet refute the vendor threshold 0.90.'}</div>`:''}
  ${theory ? `<details class="card"><summary>Post-verdict reliability lens — mathematical reference (not a new quantum run)</summary><p class="fine">For the ideal separable-mixture model at the witness boundary, an uncalibrated rule S &gt; 1 miscertifies with probability ${pct(theory.naive)}. The fixed, predeclared ${fmt(100*(1-ALPHA))}% one-sided calibrated rule has exact false-certification probability ${pct(theory.calibrated)} at the same sample size. These are exact binomial reference calculations for this ideal model, not measured device error rates, and they do not establish performance under correlated noise.</p></details>` : ''}
  <div class="hint" role="status"><strong>Receipt checks:</strong> ${state.auditChecks.status === 'PASS' ? 'All internal checks passed' : 'Internal inconsistency detected — do not certify'} (${state.auditChecks.checks.filter(x=>x.pass).length}/${state.auditChecks.checks.length}). These checks do not validate QPU calibration.</div>
  <div class="decision"><div class="eyebrow">Decision / commit</div><h2>File your evidence-based verdict</h2><p class="fine">CERTIFIED requires a witness lower bound above 1. REFUTE must contradict the exact submitted claim. An absent violation does not demonstrate separability.</p><div class="actions">${buttons.map(([v,l])=>`<button type="button" class="${v==='NOT_ESTABLISHED'?'outline':''}" data-action="decision" data-value="${v}" ${state.decision?.supported?'disabled':''}>${l}</button>`).join('')}</div>
  ${state.decision?`<div class="callout ${state.decision.supported?'success':'error'}" role="status"><strong>${state.decision.supported?'DECISION ACCEPTED':'DECISION REJECTED — claim not justified'}</strong><p>${escapeHTML(state.decision.explanation)}</p>${state.decision.supported?`<p><strong>Source revealed:</strong> ${escapeHTML(c.truth)}. ${escapeHTML(c.explanation)}</p><p class="fine">Accepted verdict locked. Evidence and all attempts remain available in the JSON.</p>`:`<p><strong>Review allowed:</strong> choose another verdict using the SAME acquired evidence. No additional quantum job is sent. All attempts are retained in the decision history. Source identity remains sealed until an accepted verdict.</p>`}</div>`:''}</div></div>
  <div class="card"><div class="actions"><button type="button" data-action="export" class="outline">Display evidence JSON</button></div><p class="fine">Manual-copy export works within sandboxed Qollab. After this run, use Qollab's Run Project to choose a different case/protocol; no further quantum job is dispatched from this page.</p></div>`,
  `<div class="card"><div class="eyebrow">Live provenance</div><h2>Execution receipt</h2><p class="ledger"><strong>Backend:</strong> ${escapeHTML(state.execution.backendName)}<br><strong>Device class:</strong> Not independently verified in this UI<br><strong>Time (UTC):</strong> ${escapeHTML(state.execution.acquiredAtUtc)}<br><strong>Job ID:</strong> ${escapeHTML(state.execution.jobId??'not exposed')}<br><strong>Shots:</strong> ${e.shotsReturned} per setting<br><strong>Qubits:</strong> ${state.execution.qubits}<br><strong>Jobs:</strong> 1<br><strong>Qubit measurement:</strong> terminal only<br><strong>Protocol:</strong> ${escapeHTML(PROTOCOLS[state.selection.protocol].label)}</p><details><summary>What is and isn't live?</summary><p class="fine">This evidence came from a real Qiskit backend.run on the selected backend. A simulator execution is not a physical QPU observation. Verdict buttons and JSON export make no extra quantum calls. The QPU type must be checked in Qollab's QPU selector and job console.</p></details></div><div class="card"><div class="eyebrow">Scientific guardrails</div><p class="fine">The one-sided Hoeffding guarantee assumes independent measurements across the two prepared registers, trusted measurement axes and prespecified analysis. The 1% bound is per execution and does not account for hunting across repeated runs. Readout/crosstalk and device noise can invalidate stronger physical conclusions.</p><p class="fine">This effort is supported by Qollab & IonQ.</p></div>`);
  if (document.getElementById('cb3-json-panel')) displayExistingJSON();
}
function errorView() { layout(`<div class="card"><h2>Experiment could not finish</h2><div class="callout error" role="alert">${escapeHTML(state.error)}</div><p>No successful quantum observation was recorded. Reopen the Qollab editor, verify the backend and press Run Project again; use the free BasicSimulator.</p></div>`); }
function render() {
  tag.textContent = state.phase==='setup'?'PRE-RUN / SELECT PROTOCOL':state.phase==='running'?'LIVE JOB IN PROGRESS':state.phase==='evidence'?'EVIDENCE RECEIVED':'EXPERIMENT FAILED';
  if (state.phase==='setup') setupView();
  else if (state.phase==='running') runningView();
  else if (state.phase==='evidence') evidenceView();
  else errorView();
}
function decisionExplanation(v,ok) {
  if (v==='CERTIFIED_ENTANGLEMENT') return ok
    ? 'The prespecified witness lower bound exceeds the separable-state limit under the stated assumptions.'
    : 'The selected observations do not establish entanglement with the prescribed error bound.';
  if (v==='REFUTE_SPECIFIC_CLAIM') return ok
    ? (state.selection.caseId==='B'?'The upper confidence bound contradicts the claimed Φ+ fidelity ≥ 0.90.':'A valid witness establishes entanglement, contradicting the source’s separability claim.')
    : 'The acquired observations do not refute the specific submitted claim. Missing proof is not proof of fraud, separability, or falsity.';
  return ok?'This experimental record is insufficient to establish certification or refute the specific claim.':'A stronger conclusion is supported by the collected evidence; inspect the displayed bound.';
}
function exportRecord() {
  if (!state.execution || !state.evidence) return;
  record('EVIDENCE_RECORD_DISPLAYED',{delivery:'manual_copy',newQuantumJob:false});
  const out={
    product:'ClaimBreak Quantum Evidence Court',version:VERSION,
    configuration:{...state.selection,predeclaredBeforeQuantumRun:true,protocolLabel:PROTOCOLS[state.selection.protocol].label},
    execution:{...state.execution,mode:'LIVE_QISKIT_BACKEND_RESULT',deviceClass:'UNVERIFIED_IN_APP',quantumJobs:1},
    protocol:{alphaPerRun:ALPHA,margin:'2*sqrt(ln(1/alpha)/N) for two independent ±1 setting averages',
      scope:'single predeclared test in this run; no familywise claim across repeated runs',
      assumptions:'trusted bases, independent representative measurements, no arbitrary postselection'},
    evidence:state.evidence,auditChecks:state.auditChecks,
    theoreticalReference:state.selection.caseId==='B' && state.selection.protocol==='plus' ? {
      kind:'ANALYTICAL_IDEAL_SEPARABLE_MODEL_NOT_NEW_QUANTUM_EVIDENCE',
      naiveFalseCertificationProbability:theoreticalFalseCertificationRate(state.evidence.shotsReturned,0),
      calibratedFalseCertificationProbability:theoreticalFalseCertificationRate(state.evidence.shotsReturned,state.evidence.margin)
    } : null,
    rawCounts:state.execution.rawCounts,decision:state.decision,decisionHistory:state.decisionHistory,events:state.events
  };
  let panel=root.querySelector('#cb3-json-panel');
  if(!panel){ panel=document.createElement('section'); panel.id='cb3-json-panel';panel.className='card';content.prepend(panel); }
  panel.innerHTML=`<div class="eyebrow">Evidence / manual export</div><h2>Copy the exact JSON</h2><p class="fine">This browser may block Blob downloads. Select all JSON, press Ctrl+C, paste into Windows Notepad, then Save as <strong>claimbreak-stage4-1-evidence.json</strong> (All files / UTF-8).</p><div class="actions"><button type="button" data-action="select-json">Select all JSON</button><button type="button" class="outline" data-action="close-json">Close</button></div><textarea id="cb3-json-text" aria-label="Exported evidence JSON" readonly spellcheck="false"></textarea><p class="fine" id="cb3-copy-status">No further quantum job is needed.</p>`;
  panel.querySelector('textarea').value=JSON.stringify(out,null,2);
  panel.scrollIntoView({block:'start',behavior:'auto'});
}
function displayExistingJSON() { /* Export panel gets reconstructed only on explicit click. */ }
root.addEventListener('change',ev=>{
  if(state.phase!=='setup')return;
  const field=ev.target?.dataset?.field;
  if(field==='caseId'&&CASES[ev.target.value])state.selection.caseId=ev.target.value;
  if(field==='protocol'&&PROTOCOLS[ev.target.value])state.selection.protocol=ev.target.value;
  if(field==='shots'&&[64,128,256,512].includes(Number(ev.target.value)))state.selection.shots=Number(ev.target.value);
  if(field)render();
});
root.addEventListener('click',ev=>{
  const b=ev.target.closest?.('button[data-action]'); if(!b)return;
  const act=b.dataset.action;
  if(act==='start'&&state.phase==='setup'&&startResolve){record('EXPERIMENT_PREDECLARED',{...state.selection});const go=startResolve;startResolve=null;go();}
  if(act==='decision'&&state.phase==='evidence'&&!state.decision?.supported){
    const verdict=b.dataset.value;
    if(!['CERTIFIED_ENTANGLEMENT','REFUTE_SPECIFIC_CLAIM','NOT_ESTABLISHED'].includes(verdict))return;
    const supported=allowedDecision(verdict);
    const attempt={attempt:state.decisionHistory.length+1,verdict,supported,
      explanation:decisionExplanation(verdict,supported),atUtc:isoNow()};
    state.decision=attempt;
    state.decisionHistory.push({...attempt});
    record(supported?'DECISION_ACCEPTED':'DECISION_REJECTED',{attempt:attempt.attempt,verdict,supported,noAdditionalQuantumJob:true});render();
  }
  if(act==='export'&&state.phase==='evidence')exportRecord();
  if(act==='select-json'){const ta=root.querySelector('#cb3-json-text');if(ta){ta.focus();ta.select();root.querySelector('#cb3-copy-status').textContent='Selected. Press Ctrl+C to copy into Notepad.';}}
  if(act==='close-json'){root.querySelector('#cb3-json-panel')?.remove();}
});

async function runOneSelectedExperiment() {
  state.phase='setup'; render();
  // Keeping main.js alive until this user click permits IonQ's Qollab request proxy.
  await new Promise(resolve=>{startResolve=resolve;});
  state.phase='running';render();
  try{
    const selection={...state.selection}; // immutable after the protocol is locked
    const bundle=buildCircuit(selection.caseId,selection.protocol);
    const bName=backendLabel();
    const job=await backend.run(bundle.circuit,{shots:selection.shots}); // ONE quantum job
    let jobId=null;
    try{const x=typeof job.job_id==='function'?job.job_id():null;jobId=typeof x==='string'?x:null;}catch(_){/* optional */}
    const result=await job.result(); // fetch once; respects IonQ result-fetch rate limit
    const raw=result.get_counts().toJs();
    const entries=normalizeCounts(raw,bundle.nQubits);
    const evidence=evaluateEvidence(entries,bundle,selection.protocol);
    if(evidence.shotsReturned !== selection.shots) throw new Error(`Received ${evidence.shotsReturned} shots but requested ${selection.shots}`);
    state.evidence=evidence;
    state.auditChecks=auditRecord(entries,bundle,selection,evidence);
    if(state.auditChecks.status!=='PASS') throw new Error('Receipt integrity checks failed; decision blocked.');
    state.execution={backendName:bName,acquiredAtUtc:isoNow(),jobId,shots:selection.shots,qubits:bundle.nQubits,
      settings:bundle.groups.map(g=>g.setting),rawCounts:Object.fromEntries(entries)};
    record('LIVE_QUANTUM_RUN_COMPLETED',{backend:bName,shots:evidence.shotsReturned,qubits:bundle.nQubits,quantumJobs:1});
    state.phase='evidence';render();
  }catch(err){state.error=String(err?.message??err);record('QUANTUM_RUN_FAILED',{message:state.error});state.phase='error';render();console.error(err);}
}
await runOneSelectedExperiment();