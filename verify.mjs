import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import zlib from 'node:zlib';
function readZipEntry(file,name){
 const b=fs.readFileSync(file);let end=-1;for(let i=b.length-22;i>=Math.max(0,b.length-65557);i--){if(b.readUInt32LE(i)===0x06054b50){end=i;break;}}if(end<0)throw Error('ZIP directory missing');let p=b.readUInt32LE(end+16);for(let n=0;n<b.readUInt16LE(end+10);n++){if(b.readUInt32LE(p)!==0x02014b50)throw Error('Bad ZIP directory');const size=b.readUInt32LE(p+20),method=b.readUInt16LE(p+10),nl=b.readUInt16LE(p+28),el=b.readUInt16LE(p+30),cl=b.readUInt16LE(p+32),offset=b.readUInt32LE(p+42);const fn=b.subarray(p+46,p+46+nl).toString('utf8');if(fn===name){const begin=offset+30+b.readUInt16LE(offset+26)+b.readUInt16LE(offset+28);const data=b.subarray(begin,begin+size);if(method===0)return data.toString('utf8');if(method===8)return zlib.inflateRawSync(data).toString('utf8');throw Error('Unsupported ZIP compression');}p+=46+nl+el+cl;}throw Error('ZIP entry missing: '+name);
}
const html=readZipEntry(new URL('./task-board.zip',import.meta.url),'task-board.html');
assert.match(html,/Task Board 1\.2\.1/);assert.doesNotMatch(html,/statWeek|statStreak|function weekCount|function streak|S\.log\.push/);assert.match(html,/SortableJS/);assert.match(html,/Permission is hereby granted/);assert.doesNotMatch(html,/firebase|gstatic\.com/i);assert.match(html,/class="catalogue-brand"/);
const notice=html.slice(html.indexOf('<!--')+4,html.indexOf('-->'));assert.equal(notice.includes('--'),false);

const logic=html.slice(html.indexOf('function orderedColumns('),html.indexOf('function bindSortable('));
const ctx=vm.createContext({S:null,Date,STRIP_W:46,getComputedStyle:()=>({paddingLeft:'16',paddingRight:'16',columnGap:'14'})});vm.runInContext(logic,ctx);
const ids=a=>Array.from(a,x=>x.id),board={clientWidth:1100};
const make=()=>({maxFull:3,columns:['a','b','c','d','e'].map((id,i)=>({id,collapsed:i>2,used:i*100,tasks:[{id:'t'+id,text:'Keep '+id}]}))});
ctx.S=make();const tasks=JSON.stringify(ctx.S.columns.map(c=>c.tasks));
assert.deepEqual(ids(ctx.orderedColumns(ctx.S.columns)),['a','b','c','d','e']);
ctx.openColumnFirst('e',board);let plan=ctx.layoutPlan(board);
assert.deepEqual(ids(plan.columns),['e','a','b','c','d']);assert.deepEqual(Array.from(plan.full),['e','a','b']);assert.equal(ctx.S.columns[2].collapsed,true);
assert.deepEqual(ids(ctx.S.columns),['a','b','c','d','e']);assert.equal(JSON.stringify(ctx.S.columns.map(c=>c.tasks)),tasks);
ctx.openColumnFirst('d',board);assert.deepEqual(ids(ctx.layoutPlan(board).columns),['d','e','a','b','c']);assert.equal(ctx.S.columns[1].collapsed,true);
// Editing/using another section must not change the opening order.
ctx.S.columns[0].used=Number.MAX_SAFE_INTEGER;assert.deepEqual(ids(ctx.layoutPlan(board).columns),['d','e','a','b','c']);
// A free slot does not close another section.
ctx.S=make();ctx.S.columns[2].collapsed=true;ctx.openColumnFirst('e',board);assert.equal(ctx.S.columns[0].collapsed,false);assert.equal(ctx.S.columns[1].collapsed,false);
// Actual available width, rather than the configured maximum, controls desktop capacity.
ctx.S=make();ctx.openColumnFirst('e',{clientWidth:900});plan=ctx.layoutPlan({clientWidth:900});assert.deepEqual(Array.from(plan.full),['e','a']);assert.equal(ctx.S.columns[1].collapsed,true);
// Narrow grid uses the same open-first order and configured maximum.
ctx.S=make();ctx.openColumnFirst('e',{clientWidth:390});assert.equal(ctx.layoutPlan({clientWidth:390}),null);assert.deepEqual(ids(ctx.orderedColumns(ctx.S.columns)),['e','a','b','c','d']);assert.equal(ctx.S.columns[2].collapsed,true);
// All collapsed / one available column / absent id / persistence.
ctx.S=make();ctx.S.columns.forEach(c=>c.collapsed=true);ctx.openColumnFirst('d',board);assert.deepEqual(Array.from(ctx.layoutPlan(board).full),['d']);
ctx.S=make();ctx.S.maxFull=1;ctx.openColumnFirst('e',board);assert.deepEqual(Array.from(ctx.layoutPlan(board).full),['e']);
let before=JSON.stringify(ctx.S);ctx.openColumnFirst('missing',board);assert.equal(JSON.stringify(ctx.S),before);ctx.S=JSON.parse(before);assert.deepEqual(Array.from(ctx.layoutPlan(board).full),['e']);
assert.match(html,/newCols\.forEach\(c=>\{c.openRank=0;\}\)/);assert.match(html,/c\.openRank = Math\.max\(0,num\(c\.openRank\)\)/);
for(const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){let code=script[2];if(script[1].includes('module'))code=code.replace(/^import .*;$/gm,'');new vm.Script(code);}
console.log('PASS: real source logic; front opening, rightmost eviction, stable remaining and strip order, free slots, width limits, narrow grid, old backups, persistence, task preservation, drag-order reset and script syntax');
