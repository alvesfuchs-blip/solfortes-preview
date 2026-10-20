'use strict';
const assert=require('node:assert/strict');
const {createSimulation,preview}=require('../lp/solar-residencial/core.js');
const good={name:'Pessoa fictícia',city:'Cidade fictícia',uf:'SP',reason:'installation',channel:'email',contact:'teste@example.invalid'};
(async()=>{
 let passed=0;
 for(const scenario of ['disabled','error','uncertain','success','live']){
  const adapter=createSimulation({scenario,delayMs:1});
  assert.equal(adapter.getState().state,'idle');
  const running=adapter.run(good);
  assert.equal(adapter.getState().state,'pending');
  assert.equal((await adapter.run(good)).state,'pending');
  const result=await running;
  assert.equal(result.state,['error','uncertain'].includes(scenario)?scenario:'disabled');
  assert.equal(result.captureEnabled,false);
  assert.equal(result.simulated,true);
  assert.match(result.message,/Nenhuma solicitação foi enviada/);
  assert.ok(!JSON.stringify(result).includes(good.contact));
  result.errors.injected=true;
  assert.equal(adapter.getState().errors.injected,undefined);
  passed++;
 }
 const adapter=createSimulation();
 assert.equal((await adapter.run({})).state,'invalid');passed++;
 assert.equal((await adapter.run(good)).state,'disabled');passed++;
 assert.equal(preview(good).state,'disabled');passed++;
 console.log(JSON.stringify({scope:'In-memory simulated states only; capture OFF',passed,failed:0}));
})().catch(error=>{console.error(error);process.exitCode=1;});
