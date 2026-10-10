/**
 * ClaimBreak independent receipt verifier (offline, no Qiskit, no external requests).
 * Checks internal numerical consistency of provided data. It CANNOT authenticate
 * the backend identity, that a job actually ran, or unchanged origin of JSON.
 */
export const REVIEWER_VERSION = '1.0.0';
const EPS = 1e-9;
const PAIRS = {
  A: { z:[0,1], x:[2,3], single:2, dual:4 },
  B: { z:[1,2], x:[4,5], single:3, dual:6 },
  C: { z:[0,1], x:[2,3], single:2, dual:4 }
};
const roundMatch = (a,b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a-b) <= EPS;

export function verifyReceipt(input) {
  const checks = [];
  const add = (label, pass, severity='error') => checks.push({ label, pass:!!pass, severity });
  const fail = text => add(text, false);
  const warn = text => add(text, false, 'warning');
  let record;
  try { record = typeof input === 'string' ? JSON.parse(input) : input; }
  catch(e){ return {status:'FAIL', checks:[{label:'Valid JSON document',pass:false,severity:'error'}],computed:null,record:null}; }
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return {status:'FAIL', checks:[{label:'JSON object expected',pass:false,severity:'error'}],computed:null,record:null};
  }
  const cfg=record.configuration??{};
  const exe=record.execution??{};
  const protocol=record.protocol??{};
  const id=cfg.caseId;
  const kind=cfg.protocol;
  const pair=PAIRS[id];
  const dual=kind==='plus'||kind==='minus';
  add('Known case and predeclared protocol', !!pair && (dual||kind==='z'));
  if (!pair || !(dual||kind==='z')) return {status:'FAIL',checks,computed:null,record};
  const nQubits=dual?pair.dual:pair.single;
  add('Circuit register width matches case and protocol', exe.qubits===nQubits);
  const countInput=exe.rawCounts ?? record.rawCounts;
  if (!countInput || typeof countInput!=='object' || Array.isArray(countInput)) {
    fail('Measured raw bitstring counts are present');
    return {status:'FAIL',checks,computed:null,record};
  }
  const entries=Object.entries(countInput);
  add('Raw counts nonempty',entries.length>0);
  add('Valid bitstrings and nonnegative integer frequencies',entries.length>0 && entries.every(([bits,n]) => new RegExp(`^[01]{${nQubits}}$`).test(bits) && Number.isInteger(n) && n>=0));
  if (checks.some(c=>!c.pass && c.severity==='error')) return {status:'FAIL',checks,computed:null,record};
  const n=entries.reduce((s,[,count])=>s+count,0);
  add('Shot totals match the predeclared count',Number.isInteger(cfg.shots) && cfg.shots>0 && n===cfg.shots && n===exe.shots);
  add('Record reports one quantum job',exe.quantumJobs===1);
  add('Record flags pre-run protocol declaration',cfg.predeclaredBeforeQuantumRun===true);
  if (exe.settings) add('Declared measurement settings agree with protocol',JSON.stringify(exe.settings) === JSON.stringify(dual?['Z','X']:['Z']));
  if (record.rawCounts) add('Duplicated counts fields are identical',JSON.stringify(Object.entries(record.rawCounts).sort())===JSON.stringify(entries.slice().sort()));
  if(n<=0){fail('Nonzero total shots'); return {status:'FAIL',checks,computed:null,record};}
  const corr=([qa,qb])=> entries.reduce((acc,[bits,count])=>acc+(bits[nQubits-1-qa]===bits[nQubits-1-qb]?count:-count),0)/n;
  const zz=corr(pair.z);
  const xx=dual?corr(pair.x):null;
  const alpha=Number(protocol.alphaPerRun);
  add('Valid declared per-run statistical error alpha',Number.isFinite(alpha)&&alpha>0&&alpha<1);
  if (!(alpha>0 && alpha<1)) return {status:'FAIL',checks,computed:null,record};
  const S=dual?zz+(kind==='minus'?-xx:xx):null;
  const margin=dual?2*Math.sqrt(Math.log(1/alpha)/n):null;
  const lower=dual?S-margin:null;
  const fidelityUpper=kind==='plus'?Math.min(1,(2+S+margin)/4):null;
  const certified=lower!==null && lower>1;
  const computed={zz,xx,S,margin,lower,fidelityUpper,certified,shotsReturned:n};
  for (const [key,value] of Object.entries(computed)) {
    if(!record.evidence || !(key in record.evidence)) { fail(`Reported evidence includes ${key}`);continue; }
    const reported=record.evidence[key];
    const pass=value===null?reported===null:typeof value==='boolean'?reported===value:roundMatch(value,reported);
    add(`Recomputed ${key} matches exported value`,pass);
  }
  const eventTypes=Array.isArray(record.events)?record.events.map(x=>x.type):[];
  add('Predeclared and completed-run audit events present',eventTypes.includes('EXPERIMENT_PREDECLARED')&&eventTypes.includes('LIVE_QUANTUM_RUN_COMPLETED'));
  add('No extra completed quantum job recorded',eventTypes.filter(x=>x==='LIVE_QUANTUM_RUN_COMPLETED').length===1);
  const pre=record.events?.find(x=>x.type==='EXPERIMENT_PREDECLARED')?.utc;
  const complete=record.events?.find(x=>x.type==='LIVE_QUANTUM_RUN_COMPLETED')?.utc;
  if(pre&&complete) add('Protocol declared before returned results',!Number.isNaN(Date.parse(pre))&&!Number.isNaN(Date.parse(complete))&&Date.parse(pre)<=Date.parse(complete));
  if(record.decision){
    const verdict=record.decision.verdict;
    const refutable=id==='B'?(fidelityUpper!==null&&fidelityUpper<0.9):id==='C'?certified:false;
    const expected=verdict==='CERTIFIED_ENTANGLEMENT'?certified:verdict==='REFUTE_SPECIFIC_CLAIM'?refutable:verdict==='NOT_ESTABLISHED'?!certified&&!refutable:null;
    add('Verdict is a defined ClaimBreak decision',expected!==null);
    add('Decision support agrees with independently recalculated evidence',expected===record.decision.supported);
    if(Array.isArray(record.decisionHistory)) {
      const h=record.decisionHistory;
      add('Decision history is sequential and last attempt matches recorded decision',h.length>0&&h.every((x,i)=>x.attempt===i+1)&&h[h.length-1].verdict===verdict&&h[h.length-1].supported===record.decision.supported);
      add('Decision-event count matches history',eventTypes.filter(x=>x==='DECISION_REJECTED'||x==='DECISION_ACCEPTED').length===h.length);
      add('Accepted verdict is final in history',!h.some((x,i)=>x.supported&&i<h.length-1));
    }
    const requiredEvent=record.decision.supported?'DECISION_ACCEPTED':'DECISION_REJECTED';
    if(String(record.version||'').startsWith('stage4')) add('Final decision event matches support status',eventTypes.includes(requiredEvent));
  } else warn('No committed or rejected decision in this receipt');
  // Stage 4.2: re-evaluate the player's precommitted strategy from raw counts,
  // rather than trusting the copied on-screen challenge assessment.
  if(record.version==='stage4.2'){
    const ch=record.challenge??{};
    const lockEvents=(record.events??[]).filter(x=>x.type==='CHALLENGE_FORECAST_LOCKED');
    const lock=lockEvents[0];
    const options=['CERTIFIED_ENTANGLEMENT','REFUTE_SPECIFIC_CLAIM','NOT_ESTABLISHED'];
    add('One legal pre-measurement player forecast was recorded',
      lockEvents.length===1 && options.includes(ch.forecast) && ch.forecast===lock?.detail?.forecast);
    const lockTime=Date.parse(lock?.utc??'');
    const acquiredTime=Date.parse(complete??'');
    add('Player forecast precedes the quantum backend result',
      Number.isFinite(lockTime)&&Number.isFinite(acquiredTime)&&lockTime<=acquiredTime&&
      eventTypes.indexOf('CHALLENGE_FORECAST_LOCKED')<eventTypes.indexOf('LIVE_QUANTUM_RUN_COMPLETED'));
    add('Precommit matches actual shot/basis configuration',
      lock?.detail?.shots===cfg.shots && lock?.detail?.protocol===cfg.protocol);
    const challengeRefutable=id==='B'?(fidelityUpper!==null&&fidelityUpper<.90):id==='C'?certified:false;
    const supported=ch.forecast==='CERTIFIED_ENTANGLEMENT'?certified:
      ch.forecast==='REFUTE_SPECIFIC_CLAIM'?challengeRefutable:
      ch.forecast==='NOT_ESTABLISHED'?!certified&&!challengeRefutable:false;
    add('Challenge forecast independently graded against quantum counts',ch.forecastSupported===supported);
    const attempts=Array.isArray(record.decisionHistory)?record.decisionHistory:[];
    const accepted=attempts.find(x=>x.supported)??null;
    const expectedStatus=!accepted?'AWAITING_ADMISSIBLE_VERDICT':
      supported?'FORECAST_UPHELD':'FORECAST_OVERTURNED';
    add('Challenge outcome matches accepted verdict and recovery history',
      ch.status===expectedStatus && ch.attemptCount===attempts.length &&
      ch.acceptedVerdict===(accepted?.verdict??null) &&
      ch.caseResolved===Boolean(accepted&&accepted.verdict!=='NOT_ESTABLISHED'));
    add('Game-resource statement is tied to the same actual quantum job',
      ch.resourceUse?.quantumJobs===1&&
      ch.resourceUse?.shotsPerSetting===cfg.shots&&
      ch.resourceUse?.measuredSettings===(dual?2:1));
  }
  // A receipt with internally valid calculations is still NOT a device attestation.
  warn('External backend authenticity cannot be established from user-supplied JSON');
  const status=checks.some(c=>!c.pass&&c.severity==='error')?'FAIL':'PASS';
  return {status,checks,computed,record};
}


/**
 * Four independent quantum-learning missions spanning separate receipts.
 * This is a SESSION-ONLY learning record, NOT an authenticated leaderboard,
 * an aggregate confidence statement, or a claim of backend provenance.
 */
export function campaignProgress(reviews) {
  const safe=Array.isArray(reviews)?reviews:[];
  const missions=[
    {id:'THE_BELL_WITNESS',title:'The Bell Witness',description:'Certify an entangled Φ+ source with the correct two-basis witness',
      match:r=>r.configuration?.caseId==='A'&&r.configuration?.protocol==='plus'&&r.decision?.verdict==='CERTIFIED_ENTANGLEMENT'},
    {id:'THE_CORRELATION_TRAP',title:'The Correlation Trap',description:'Refute the ≥90% fidelity bluff using ZZ and XX evidence',
      match:r=>r.configuration?.caseId==='B'&&r.configuration?.protocol==='plus'&&r.decision?.verdict==='REFUTE_SPECIFIC_CLAIM'},
    {id:'THE_HIDDEN_PHASE',title:'The Hidden Phase',description:'Reveal Φ− entanglement with the minus witness',
      match:r=>r.configuration?.caseId==='C'&&r.configuration?.protocol==='minus'&&r.decision?.verdict==='REFUTE_SPECIFIC_CLAIM'},
    {id:'THE_RIGHT_TO_ABSTAIN',title:'The Right to Abstain',description:'Know that Z-only evidence cannot establish entanglement',
      match:r=>r.configuration?.protocol==='z'&&r.decision?.verdict==='NOT_ESTABLISHED'}
  ];
  const claimedJobs=new Set();
  const eligible=[];
  safe.forEach((item,index)=>{
    const record=item?.record;
    if(item?.status!=='PASS'||record?.version!=='stage4.2'||!record.challenge||
       record.decision?.supported!==true) return;
    const jobId=record.execution?.jobId;
    if(jobId&&claimedJobs.has(jobId))return;
    if(jobId)claimedJobs.add(jobId);
    eligible.push({record,index});
  });
  const result=missions.map(m=>{
    const hit=eligible.find(({record})=>m.match(record));
    return {id:m.id,title:m.title,description:m.description,
      complete:Boolean(hit),receiptIndex:hit?.index??null};
  });
  return {status:'SESSION_RECEIPT_CONSISTENCY_ONLY__BACKEND_AUTHENTICITY_UNVERIFIED',
    complete:result.filter(x=>x.complete).length,total:result.length,missions:result,
    quantumRunsNotPooled:true,source:'INDEPENDENTLY_RECALCULATED_STAGE4_2_RECEIPTS'};
}
