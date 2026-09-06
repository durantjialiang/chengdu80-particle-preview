// Optional standalone browser regression. This is NOT part of npm test.
// The 2026-09-06 acceptance was run through Codex's native browser controls;
// see docs/persistent-backdrop-review.md. Run this separately with Playwright installed.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const {chromium}=await import(process.env.PARTICLE80_PLAYWRIGHT ?? 'playwright');
const output=resolve(process.env.PARTICLE80_OUTPUT ?? 'qa/artifacts/persistent-backdrop');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.PARTICLE80_BROWSER});
const url=process.env.PARTICLE80_URL ?? 'http://127.0.0.1:4174/qa/particle80.html?visit=first&fieldDebug=telemetry';
const checks=[],errors=[];
try {
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(url);
 const field=page.locator('[data-visibility-scope="page"]');
 await page.waitForSelector('[data-state="animated"][data-phase="living"]');
 const engine=await field.getAttribute('data-engine-id');
 assert.equal(await field.getAttribute('data-particles'),'9600');
 assert.equal(await field.getAttribute('data-view-scale'),'1.72');
 const snapshot=()=>field.evaluate(e=>({...e.dataset}));
 const alive=async()=>{
   const before=await snapshot();await page.waitForTimeout(250);const after=await snapshot();
   assert.ok(Number(after.simulationTime)>Number(before.simulationTime));
   assert.equal(after.engineId,engine);
   assert.equal(await page.locator('[data-visibility-scope="page"] canvas').count(),1);
   if(after.liveEngines)assert.equal(after.liveEngines,'1');
   if(after.pendingRafs)assert.ok(Number(after.pendingRafs)<=1);
   return after;
 };
 // Real elapsed hold, in addition to the 60/120-second pure timeline tests.
 await page.waitForTimeout(60000);
 assert.equal(await page.locator('[data-particle-story]').getAttribute('data-intro-state'),'HOLDING_80');
 checks.push({hold:await alive()});
 await page.getByRole('link',{name:'Explore Chengdu 80',exact:true}).click();
 await page.waitForFunction(()=>scrollY>500);
 assert.equal(await field.count(),1);
 // Natural wheel input, not an old "terminal handoff removes the renderer" assertion.
 for(let i=0;i<10;i++){
   await page.mouse.move(20,500);await page.mouse.wheel(0,12000);
   await page.waitForFunction(()=>document.querySelector('[data-particle-story]').getBoundingClientRect().bottom<0);
   const bottom=await alive();assert.equal(bottom.spread,'1.0000');
   for(const x of [35,1390]){
     await page.mouse.move(x,450,{steps:12});
     await page.waitForFunction(()=>Number(document.querySelector('[data-pointer-strength]').dataset.pointerStrength)>.9);
   }
   await page.mouse.wheel(0,-12000);await page.waitForFunction(()=>scrollY===0);
   await alive();
 }
 checks.push({roundTrips:10,engine});
 await page.getByRole('button',{name:'View details for Tsinghua University',exact:true}).click();
 await page.getByRole('dialog',{name:'Tsinghua University',exact:true}).waitFor();
 await page.mouse.move(35,450);await page.waitForTimeout(500);
 assert.ok(Number((await snapshot()).pointerStrength)<.01);
 await page.getByRole('button',{name:'Close university details',exact:true}).click();
 await alive();
 await page.getByRole('contentinfo').getByRole('button',{name:'中文',exact:true}).click();
 await alive();
 await context.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const phone=await mobile.newPage();await phone.goto(url);
 await phone.waitForSelector('[data-state="animated"]');
 const p=phone.locator('[data-visibility-scope="page"]');
 assert.equal(await p.getAttribute('data-particles'),'900');
 const mobileEngine=await p.getAttribute('data-engine-id');
 await phone.setViewportSize({width:390,height:760});
 assert.equal(await p.getAttribute('data-engine-id'),mobileEngine);
 assert.ok(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await phone.emulateMedia({reducedMotion:'reduce'});
 await phone.waitForSelector('[data-state="static"]');
 const time=await p.getAttribute('data-simulation-time');await phone.waitForTimeout(500);
 assert.equal(await p.getAttribute('data-simulation-time'),time);
 checks.push({mobile:true,reduced:true});await mobile.close();
 assert.deepEqual(errors,[]);
 await writeFile(output+'/browser-results.json',JSON.stringify({checks,errors},null,2));
 console.log(JSON.stringify({output,checks,errors},null,2));
} finally {await browser.close();}
