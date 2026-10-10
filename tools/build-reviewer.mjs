import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(path.join(root,p),'utf8');
const fixture=JSON.parse(read('evidence/fixtures/synthetic-case-b.json'));
const code=read('reviewer/verifier.mjs').replace(/export\s+(const|function)/g,'$1');
const app=read('reviewer/app.js');
const html=read('reviewer/template.html')
 .replace('/*__INLINE_CSS__*/',()=>read('reviewer/style.css'))
 .replace('/*__VERIFIER__*/',()=>code+'\nwindow.CB_SYNTHETIC_FIXTURE='+JSON.stringify(fixture).replace(/</g,'\\u003c')+';')
 .replace('/*__APP__*/',()=>app);
writeFileSync(path.join(root,'reviewer/index.html'),html);
console.log('Generated standalone reviewer/index.html:',Buffer.byteLength(html),'bytes');
