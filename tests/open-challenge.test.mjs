import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyReceipt} from '../reviewer/verifier.mjs';

const source=readFileSync(new URL('../qollab/main.js',import.meta.url),'utf8');
const openStart=source.indexOf('// OPEN CHALLENGE SOURCE');
const openEnd=source.indexOf('// END OPEN CHALLENGE SOURCE');
const circuitStart=source.indexOf('function buildCircuit(');
const circuitEnd=source.indexOf('function normalizeCounts(',circuitStart);
const verdictStart=source.indexOf('// PURE CHALLENGE RULES');
const verdictEnd=source.indexOf('// END PURE CHALLENGE RULES');
assert.ok(openStart>=0&&openEnd>openStart&&circuitStart>=0&&circuitEnd>circuitStart);
const customSource=source.slice(openStart,openEnd);
const pureVerdicts=source.slice(verdictStart,verdictEnd);
const Default={gates:'H0 CX01',claimType:'SEPARABLE',threshold:0.90};

class FakeCircuit{
  constructor(n,bits){this.n=n;this.bits=bits;this.ops=[];}
  h(q){this.ops.push(['h',q]);}
  z(q){this.ops.push(['z',q]);}
  cx(a,b){this.ops.push(['cx',a,b]);}
  measure(a,b){this.ops.push(['measure',a,b]);}
}
function quantumCircuitFactory(qubits,bits){return new FakeCircuit(qubits,bits);}
const engine=new Function('QuantumCircuit','state',
  customSource+'\n'+source.slice(circuitStart,circuitEnd)+'\n'+pureVerdicts+
  '\nreturn {validateCustomBlueprint,applyCustomGates,buildCircuit,supportsVerdict,challengeAssessment};'
)(quantumCircuitFactory,{custom:Default});

function stage43Synthetic(){
  const n=128, alpha=.01, margin=2*Math.sqrt(Math.log(1/alpha)/n), now='2026-10-10T17:55:04Z';
  const blueprint={...Default};
  const immutableLock={...blueprint}; // A later edit must not mutate pre-run history by reference.
  const accepted={attempt:1,verdict:'REFUTE_SPECIFIC_CLAIM',supported:true,explanation:'SYNTHETIC TEST ONLY',atUtc:'2026-10-10T17:55:05Z'};
  return {
    product:'ClaimBreak Quantum Evidence Court',version:'stage4.3',
    configuration:{caseId:'D',protocol:'plus',shots:n,predeclaredBeforeQuantumRun:true},
    customBlueprint:blueprint,
    execution:{backendName:'SYNTHETIC_UNIT_TEST_NO_BACKEND',acquiredAtUtc:now,jobId:null,
      shots:n,qubits:4,settings:['Z','X'],quantumJobs:1,rawCounts:{'0000':64,'1111':64}},
    protocol:{alphaPerRun:alpha},
    evidence:{zz:1,xx:1,S:2,margin,lower:2-margin,
      fidelityUpper:1,certified:true,shotsReturned:n,protocol:'plus'},
    rawCounts:{'0000':64,'1111':64},
    decision:accepted,decisionHistory:[accepted],
    events:[
      {utc:'2026-10-10T17:55:00Z',type:'CUSTOM_CHALLENGE_BLUEPRINT_LOCKED',detail:immutableLock},
      {utc:'2026-10-10T17:55:01Z',type:'CHALLENGE_FORECAST_LOCKED',
        detail:{forecast:'REFUTE_SPECIFIC_CLAIM',shots:n,protocol:'plus'}},
      {utc:'2026-10-10T17:55:02Z',type:'EXPERIMENT_PREDECLARED',detail:{caseId:'D',protocol:'plus',shots:n}},
      {utc:now,type:'LIVE_QUANTUM_RUN_COMPLETED',detail:{quantumJobs:1}},
      {utc:'2026-10-10T17:55:05Z',type:'DECISION_ACCEPTED',detail:{verdict:'REFUTE_SPECIFIC_CLAIM'}}
    ],
    challenge:{forecast:'REFUTE_SPECIFIC_CLAIM',forecastSupported:true,attemptCount:1,
      acceptedVerdict:'REFUTE_SPECIFIC_CLAIM',caseResolved:true,status:'FORECAST_UPHELD',
      resourceUse:{quantumJobs:1,shotsPerSetting:n,measuredSettings:2}}
  };
}

test('gate grammar accepts new authored circuits and rejects arbitrary JS/QASM',()=>{
  assert.deepEqual(engine.validateCustomBlueprint(Default),Default);
  for(const gates of ['','H0 INVALID','H0;process.exit()','CX00',
    'H0 '.repeat(13).trim()]){
    assert.throws(()=>engine.validateCustomBlueprint({...Default,gates}));
  }
  assert.throws(()=>engine.validateCustomBlueprint({...Default,threshold:1.10}));
  assert.throws(()=>engine.validateCustomBlueprint({...Default,claimType:'OTHER'}));
});
test('new 2-qubit source is compiled into each basis of one live circuit',()=>{
  const c=engine.buildCircuit('D','plus',Default);
  assert.equal(c.nQubits,4);
  assert.deepEqual(c.groups.map(x=>x.setting),['Z','X']);
  assert.deepEqual(c.circuit.ops.slice(0,4),
    [['h',0],['cx',0,1],['h',2],['cx',2,3]]);
  assert.equal(c.circuit.ops.filter(x=>x[0]==='measure').length,4);
});
test('different author gates materially change the compiled backend circuit',()=>{
  const one=engine.buildCircuit('D','plus',Default).circuit.ops;
  const two=engine.buildCircuit('D','plus',{...Default,gates:'H0 CX01 Z0'}).circuit.ops;
  assert.notDeepEqual(one,two);
  assert.ok(two.some(x=>x[0]==='z'));
});
test('author-created precision claims affect admissible verdicts',()=>{
  const evidence={certified:false,fidelityUpper:.82};
  const b={gates:'H0 CX01',claimType:'FIDELITY_MIN',threshold:.90};
  assert.equal(engine.supportsVerdict('REFUTE_SPECIFIC_CLAIM',evidence,'D',true,b),true);
  assert.equal(engine.supportsVerdict('REFUTE_SPECIFIC_CLAIM',evidence,'D',true,
    {...b,threshold:.80}),false);
  assert.equal(engine.supportsVerdict('NOT_ESTABLISHED',evidence,'D',true,
    {...b,threshold:.80}),true);
  assert.equal(engine.supportsVerdict('REFUTE_SPECIFIC_CLAIM',evidence,'D',false,b),false);
});
test('synthetic Stage 4.3 receipt numerically consistent (NOT real backend evidence)',()=>{
  const r=stage43Synthetic();
  const result=verifyReceipt(r);
  assert.equal(result.status,'PASS',result.checks.filter(x=>!x.pass&&x.severity==='error').map(x=>x.label).join(';'));
  assert.equal(result.computed.zz,1);
  assert.equal(result.computed.xx,1);
});
test('tampered or late custom source cannot pass independent reviewer',()=>{
  for(const mutation of [
    r=>{r.customBlueprint.gates='H0 CX01 Z0';},
    r=>{r.events[0].utc='2026-10-10T18:55:00Z';},
    r=>{r.events[0].detail.claimType='ENTANGLED';},
    r=>{r.customBlueprint.gates='eval(alert(1))';},
    r=>{r.decision.supported=false;},
    r=>{r.challenge.forecastSupported=false;}
  ]){
    const r=stage43Synthetic();mutation(r);
    assert.equal(verifyReceipt(r).status,'FAIL');
  }
});
test('real-source gate compiler still dispatches exactly one backend.run',()=>{
  assert.equal((source.match(/await backend\.run\(/g)||[]).length,1);
});


test('minimum fidelity may remain UNKNOWN even when entanglement is certified',()=>{
  const high={gates:'H0 CX01',claimType:'FIDELITY_MIN',threshold:.95};
  const e={certified:true,fidelityUpper:1};
  assert.equal(engine.supportsVerdict('CERTIFIED_ENTANGLEMENT',e,'D',true,high),true);
  assert.equal(engine.supportsVerdict('REFUTE_SPECIFIC_CLAIM',e,'D',true,high),false);
  assert.equal(engine.supportsVerdict('NOT_ESTABLISHED',e,'D',true,high),true);
  const result=engine.challengeAssessment('NOT_ESTABLISHED',e,'D',true,
    [{verdict:'NOT_ESTABLISHED',supported:true}],128,'plus',high);
  assert.equal(result.forecastSupported,true);
  assert.equal(result.caseResolved,false);
  assert.equal(engine.supportsVerdict('NOT_ESTABLISHED',e,'D',true,
    {...high,claimType:'SEPARABLE'}),false);
});

test('independent reviewer accepts claim-specific abstention on high Bell fidelity',()=>{
  const receipt=stage43Synthetic();
  receipt.customBlueprint={gates:'H0 CX01',claimType:'FIDELITY_MIN',threshold:.95};
  receipt.events.find(x=>x.type==='CUSTOM_CHALLENGE_BLUEPRINT_LOCKED').detail={...receipt.customBlueprint};
  const expected='NOT_ESTABLISHED';
  receipt.decision={...receipt.decision,verdict:expected,supported:true};
  receipt.decisionHistory=[{...receipt.decision}];
  receipt.events.find(x=>x.type==='DECISION_ACCEPTED').detail.verdict=expected;
  receipt.events.find(x=>x.type==='CHALLENGE_FORECAST_LOCKED').detail.forecast=expected;
  receipt.challenge={...receipt.challenge,forecast:expected,forecastSupported:true,
    acceptedVerdict:expected,caseResolved:false,status:'FORECAST_UPHELD'};
  const reviewed=verifyReceipt(receipt);
  assert.equal(reviewed.status,'PASS',
    reviewed.checks.filter(x=>!x.pass&&x.severity==='error').map(x=>x.label).join('; '));
});


test('user-exported Stage 4.3 BasicSimulator custom challenge passes independent receipt audit',()=>{
  // User-supplied Qollab export: internally verifiable, NOT cryptographically backend-attested.
  const path=new URL('../evidence/observed/qollab-basic-simulator-custom-case-d-2026-10-11.json',import.meta.url);
  const receipt=JSON.parse(readFileSync(path,'utf8'));
  const review=verifyReceipt(receipt);
  assert.equal(review.status,'PASS',
    review.checks.filter(x=>!x.pass&&x.severity==='error').map(x=>x.label).join('; '));
  assert.equal(review.computed.zz,1);
  assert.equal(review.computed.xx,-1);
  assert.equal(review.computed.certified,true);
  assert.equal(receipt.challenge.status,'FORECAST_OVERTURNED');
  assert.equal(receipt.customBlueprint.gates,'H1 CX10 Z1');
});
