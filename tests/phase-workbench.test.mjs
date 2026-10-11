import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { verifyReceipt } from '../reviewer/verifier.mjs';

const src=readFileSync(new URL('../qollab/main.js',import.meta.url),'utf8');
const sourcePart=src.slice(src.indexOf('// OPEN CHALLENGE SOURCE'),src.indexOf('// END OPEN CHALLENGE SOURCE'));
const buildPart=src.slice(src.indexOf('function buildCircuit('),src.indexOf('function normalizeCounts('));
const evalPart=src.slice(src.indexOf('function parityCorrelation('),src.indexOf('// These checks verify internal'));
const visualPart=src.slice(src.indexOf('/* Visual composer:'),src.indexOf('const css = '+String.fromCharCode(96)));
class Circuit {
  constructor(n,b){this.n=n;this.b=b;this.ops=[];}
  h(q){this.ops.push(['h',q]);}
  z(q){this.ops.push(['z',q]);}
  s(q){this.ops.push(['s',q]);}
  t(q){this.ops.push(['t',q]);}
  sdg(q){this.ops.push(['sdg',q]);}
  cx(a,b){this.ops.push(['cx',a,b]);}
  measure(a,b){this.ops.push(['measure',a,b]);}
}
const blueprint={gates:'H0 CX01 S0',claimType:'SEPARABLE',threshold:.8};
const engine=new Function('QuantumCircuit','state','ALPHA',
 sourcePart+'\n'+buildPart+'\n'+evalPart+
 '\nreturn {validateCustomBlueprint,buildCircuit,evaluateEvidence};')
 ((n,b)=>new Circuit(n,b),{custom:blueprint},.01);
const view=new Function('SOURCE_GATES','escapeHTML','fmt',
 visualPart+'\nreturn {sourceWorkbench,sourceGateAt,witnessPlane};')
 (new Set(['H0','H1','Z0','Z1','S0','S1','T0','T1','CX01','CX10']),
 s=>String(s).replace(/</g,'&lt;').replace(/"/g,'&quot;'),
 n=>Number.isFinite(n)?n.toFixed(3):'—');
function fixture(){
 const margin=2*Math.sqrt(Math.log(100)/128);
 const base='2026-10-11T15:00:00.000Z';
 const decision={attempt:1,verdict:'REFUTE_SPECIFIC_CLAIM',supported:true,atUtc:'2026-10-11T15:00:05.000Z'};
 return {
  version:'stage4.4',configuration:{caseId:'D',protocol:'xyplus',shots:128,predeclaredBeforeQuantumRun:true},
  execution:{backendName:'SYNTHETIC_TEST_NOT_QOLLAB',shots:128,qubits:4,settings:['Z','XY'],quantumJobs:1,
    rawCounts:{'0000':64,'1111':64}},protocol:{alphaPerRun:.01},
  evidence:{zz:1,xx:null,xy:1,S:2,margin,lower:2-margin,certified:true,
    fidelityUpper:null,shotsReturned:128,protocol:'xyplus'},
  rawCounts:{'0000':64,'1111':64},customBlueprint:{...blueprint},
  decision,decisionHistory:[decision],
  events:[
   {utc:'2026-10-11T14:59:50.000Z',type:'CUSTOM_CHALLENGE_BLUEPRINT_LOCKED',detail:{...blueprint}},
   {utc:'2026-10-11T14:59:51.000Z',type:'CHALLENGE_FORECAST_LOCKED',detail:{forecast:'NOT_ESTABLISHED',shots:128,protocol:'xyplus'}},
   {utc:'2026-10-11T14:59:52.000Z',type:'EXPERIMENT_PREDECLARED',detail:{caseId:'D',protocol:'xyplus',shots:128}},
   {utc:base,type:'LIVE_QUANTUM_RUN_COMPLETED',detail:{quantumJobs:1}},
   {utc:decision.atUtc,type:'DECISION_ACCEPTED',detail:{verdict:decision.verdict}}
  ],
  challenge:{forecast:'NOT_ESTABLISHED',forecastSupported:false,attemptCount:1,
   acceptedVerdict:'REFUTE_SPECIFIC_CLAIM',caseResolved:true,status:'FORECAST_OVERTURNED',
   resourceUse:{quantumJobs:1,shotsPerSetting:128,measuredSettings:2}}
 };
}
test('phase-source compiler maps S/T gates to genuine circuit instructions',()=>{
 const b=engine.validateCustomBlueprint({...blueprint,gates:'H0 CX01 S0 T1'});
 assert.equal(b.gates,'H0 CX01 S0 T1');
 assert.throws(()=>engine.validateCustomBlueprint({...b,gates:'H0 eval()'}));
 const q=engine.buildCircuit('D','xyplus',b);
 assert.equal(q.nQubits,4);
 assert.deepEqual(q.groups.map(x=>x.setting),['Z','XY']);
 assert.ok(q.circuit.ops.some(o=>o[0]==='t'&&o[1]===1));
 assert.deepEqual(q.circuit.ops.filter(o=>o[0]==='sdg'),[['sdg',3]]);
});
test('the observed XY correlation is not misrepresented as XX',()=>{
 const q=engine.buildCircuit('D','xyplus',blueprint);
 const result=engine.evaluateEvidence([['0000',64],['1111',64]],q,'xyplus');
 assert.equal(result.xy,1);
 assert.equal(result.xx,null);
 assert.equal(result.S,2);
 assert.equal(result.certified,true);
 assert.equal(result.fidelityUpper,null);
});
test('visual composer changes the real gate grammar and plot is tied to measured evidence',()=>{
 const h=view.sourceWorkbench('H0 CX01 S0');
 assert.match(h,/data-action="gate-add"/);
 assert.match(h,/data-action="gate-undo"/);
 assert.equal(view.sourceGateAt('CX01',0),'●');
 assert.equal(view.sourceGateAt('CX01',1),'⊕');
 const plot=view.witnessPlane({zz:1,xx:null,xy:1,S:2,lower:1.62},'xyplus');
 assert.match(plot,/XY measured/);
 assert.match(plot,/WITNESS CERTIFIED/);
});
test('Stage 4.4 synthetic XY receipt passes independently, while altered fields fail',()=>{
 const r=fixture();
 const rv=verifyReceipt(r);
 assert.equal(rv.status,'PASS',rv.checks.filter(c=>c.severity==='error'&&!c.pass).map(c=>c.label).join(';'));
 assert.equal(rv.computed.xy,1);
 assert.equal(rv.computed.xx,null);
 const w=fixture();w.evidence.xy=.5;assert.equal(verifyReceipt(w).status,'FAIL');
 const x=fixture();x.execution.settings=['Z','X'];assert.equal(verifyReceipt(x).status,'FAIL');
 const y=fixture();y.customBlueprint.gates='H0 CX01 Z0';assert.equal(verifyReceipt(y).status,'FAIL');
});
test('exactly one backend.run call remains in Qollab runtime',()=>{
 assert.equal((src.match(/await backend\.run\(/g)||[]).length,1);
});

test('observed Qollab Stage 4.4 phase run is independently consistent, including rejected verdict',()=>{
 const path=new URL('../evidence/observed/qollab-basic-simulator-phase-xy-stage44-2026-10-11.json',import.meta.url);
 const receipt=JSON.parse(readFileSync(path,'utf8'));
 const review=verifyReceipt(receipt);
 assert.equal(review.status,'PASS',
   review.checks.filter(c=>c.severity==='error'&&!c.pass).map(c=>c.label).join('; '));
 assert.equal(review.computed.zz,1);
 assert.equal(review.computed.xy,1);
 assert.equal(review.computed.xx,null);
 assert.equal(review.computed.lower>1,true);
 assert.equal(receipt.challenge.status,'AWAITING_ADMISSIBLE_VERDICT');
 assert.equal(receipt.decision.supported,false);
 assert.equal(receipt.execution.backendName,'basic_simulator');
});
