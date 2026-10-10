import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyReceipt,campaignProgress} from '../reviewer/verifier.mjs';

// Extract the EXACT pure rules embedded in the single-file Qollab runtime.
// This tests shipped logic, not a duplicated approximation.
const source=readFileSync(new URL('../qollab/main.js',import.meta.url),'utf8');
const first=source.indexOf('// PURE CHALLENGE RULES');
const last=source.indexOf('// END PURE CHALLENGE RULES');
assert.ok(first>=0 && last>first);
const pure=source.slice(first,last);
const {supportsVerdict,challengeAssessment}=new Function(
  pure+'\nreturn {supportsVerdict,challengeAssessment};')();

const evidenceB={certified:false,fidelityUpper:.829214};
const evidenceA={certified:true,fidelityUpper:1};
const insufficient={certified:false,fidelityUpper:null};
const accepted=(verdict)=>[{attempt:1,verdict,supported:true}];
const observed=JSON.parse(readFileSync(new URL('../evidence/observed/ionq-simulator-case-b-2026-10-10.json',import.meta.url),'utf8'));
const clone=x=>structuredClone(x);
function makeStage42(){
  const r=clone(observed);
  r.version='stage4.2';
  r.events.unshift({utc:'2026-10-10T17:54:45.000Z',type:'CHALLENGE_FORECAST_LOCKED',
    detail:{forecast:'REFUTE_SPECIFIC_CLAIM',shots:128,protocol:'plus'}});
  r.challenge={
    forecast:'REFUTE_SPECIFIC_CLAIM',forecastSupported:true,attemptCount:1,
    acceptedVerdict:'REFUTE_SPECIFIC_CLAIM',caseResolved:true,status:'FORECAST_UPHELD',
    resourceUse:{quantumJobs:1,shotsPerSetting:128,measuredSettings:2},
    scoringBasis:'Forecast locked before measurement.'
  };
  return r;
}

test('quantum data must support a precommitted claim',()=>{
  assert.equal(supportsVerdict('REFUTE_SPECIFIC_CLAIM',evidenceB,'B',true),true);
  assert.equal(supportsVerdict('CERTIFIED_ENTANGLEMENT',evidenceB,'B',true),false);
  assert.equal(supportsVerdict('CERTIFIED_ENTANGLEMENT',evidenceA,'A',true),true);
  assert.equal(supportsVerdict('NOT_ESTABLISHED',insufficient,'B',true),true);
  assert.equal(supportsVerdict('REFUTE_SPECIFIC_CLAIM',evidenceB,'B',false),false);
  assert.equal(supportsVerdict('invented',evidenceA,'A',true),false);
});
test('player who correctly forecasts Case B wins only after accepted verdict',()=>{
  const r=challengeAssessment('REFUTE_SPECIFIC_CLAIM',evidenceB,'B',true,
    accepted('REFUTE_SPECIFIC_CLAIM'),128,'plus');
  assert.equal(r.status,'FORECAST_UPHELD');
  assert.equal(r.caseResolved,true);
  assert.equal(r.forecastSupported,true);
  assert.equal(r.resourceUse.quantumJobs,1);
  assert.equal(r.resourceUse.measuredSettings,2);
});
test('an incorrect initial forecast stays overturned even after recovery',()=>{
  const r=challengeAssessment('CERTIFIED_ENTANGLEMENT',evidenceB,'B',true,
    [{attempt:1,verdict:'CERTIFIED_ENTANGLEMENT',supported:false},
     {attempt:2,verdict:'REFUTE_SPECIFIC_CLAIM',supported:true}],128,'plus');
  assert.equal(r.status,'FORECAST_OVERTURNED');
  assert.equal(r.attemptCount,2);
  assert.equal(r.caseResolved,true);
  assert.equal(r.forecastSupported,false);
});
test('no accepted verdict never counts as resolved',()=>{
  const r=challengeAssessment('REFUTE_SPECIFIC_CLAIM',evidenceB,'B',true,
    [{attempt:1,verdict:'CERTIFIED_ENTANGLEMENT',supported:false}],64,'plus');
  assert.equal(r.status,'AWAITING_ADMISSIBLE_VERDICT');
  assert.equal(r.caseResolved,false);
  assert.equal(r.resourceUse.shotsPerSetting,64);
});
test('Z-only abstention is correct but is not claim resolution',()=>{
  const r=challengeAssessment('NOT_ESTABLISHED',insufficient,'A',true,
    accepted('NOT_ESTABLISHED'),64,'z');
  assert.equal(r.status,'FORECAST_UPHELD');
  assert.equal(r.caseResolved,false);
  assert.equal(r.resourceUse.measuredSettings,1);
});
test('Stage 4.2 challenge is independently verified from observed count fixture',()=>{
  const r=makeStage42();
  assert.equal(verifyReceipt(r).status,'PASS');
  assert.equal(verifyReceipt(observed).status,'PASS'); // historical Stage 4.1 is unaffected
});
test('forged precommit or missing precommit fails',()=>{
  for(const mutation of [
    r=>r.challenge.forecast='CERTIFIED_ENTANGLEMENT',
    r=>r.events.shift(),
    r=>r.events[0].utc='2026-10-10T18:54:45.000Z',
    r=>r.events[0].detail.shots=512
  ]){
    const r=makeStage42();mutation(r);
    assert.equal(verifyReceipt(r).status,'FAIL');
  }
});
test('forged challenge result or resource accounting fails',()=>{
  for(const mutation of [
    r=>r.challenge.forecastSupported=false,
    r=>r.challenge.status='FORECAST_OVERTURNED',
    r=>r.challenge.attemptCount=2,
    r=>r.challenge.caseResolved=false,
    r=>r.challenge.resourceUse.quantumJobs=2,
    r=>r.challenge.resourceUse.measuredSettings=1
  ]){
    const r=makeStage42();mutation(r);
    assert.equal(verifyReceipt(r).status,'FAIL');
  }
});
test('live source is still one quantum job, not a synthetic future run',()=>{
  assert.equal((source.match(/await backend\.run\(/g)||[]).length,1);
  assert.ok(source.includes('CHALLENGE_FORECAST_LOCKED'));
  assert.ok(source.includes('state.challenge.forecast'));
  assert.ok(source.includes("if(act==='start'&&state.phase==='setup'&&startResolve&&state.challenge.forecast)"));
});


const campaignMock=(caseId,protocol,verdict,jobId,status='PASS',version='stage4.2')=>({
  status,record:{version,configuration:{caseId,protocol},decision:{verdict,supported:true},
    challenge:{forecast:verdict},execution:{jobId}}
});
test('four-stage quantum campaign advances only from separate consistent Stage 4.2 receipts',()=>{
  const records=[
    campaignMock('A','plus','CERTIFIED_ENTANGLEMENT','synthetic-a'),
    campaignMock('B','plus','REFUTE_SPECIFIC_CLAIM','synthetic-b'),
    campaignMock('C','minus','REFUTE_SPECIFIC_CLAIM','synthetic-c'),
    campaignMock('B','z','NOT_ESTABLISHED','synthetic-z')
  ];
  const result=campaignProgress(records);
  assert.equal(result.complete,4);
  assert.equal(result.total,4);
  assert.ok(result.quantumRunsNotPooled);
  assert.equal(result.status,'SESSION_RECEIPT_CONSISTENCY_ONLY__BACKEND_AUTHENTICITY_UNVERIFIED');
  assert.ok(result.missions.every(x=>x.complete));
});
test('campaign cannot grant progress from failed audit, old version or reused job',()=>{
  const records=[
    campaignMock('A','plus','CERTIFIED_ENTANGLEMENT','duplicate'),
    campaignMock('B','plus','REFUTE_SPECIFIC_CLAIM','duplicate'),
    campaignMock('C','minus','REFUTE_SPECIFIC_CLAIM','unverified','FAIL'),
    campaignMock('B','z','NOT_ESTABLISHED','stage4.1','PASS','stage4.1')
  ];
  const result=campaignProgress(records);
  assert.equal(result.complete,1);
  assert.equal(result.missions[0].complete,true);
  assert.equal(result.missions[1].complete,false);
  assert.equal(result.missions[2].complete,false);
  assert.equal(result.missions[3].complete,false);
});
test('campaign never pools statistical evidence from separate quantum runs',()=>{
  const r=campaignProgress([]);
  assert.equal(r.complete,0);
  assert.ok(r.quantumRunsNotPooled);
});
