import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const template=fs.readFileSync('catalog/index.template.html','utf8');
const pet=fs.readFileSync('catalog/pet-preserved.html','utf8');
if(!template.includes('{{PET}}'))throw new Error('Missing pet placeholder');
// Keep editable sources stable; publish content-addressed assets so phones and
// desktops never reuse the previous release's scripts or styles after a reload.
const assetDir='dist/assets';
fs.rmSync(assetDir,{recursive:true,force:true});
fs.mkdirSync(assetDir,{recursive:true});
const assets=new Map(),pending=new Set();
function fingerprint(name){
  if(assets.has(name))return assets.get(name);
  if(pending.has(name))throw new Error('Circular static dependency: '+name);
  if(path.basename(name)!==name)throw new Error('Unsupported asset path: '+name);
  pending.add(name);
  let content=fs.readFileSync('dist/'+name,'utf8');
  if(name.endsWith('.mjs'))content=content.replace(/(\b(?:from\s*|import\s*)['"])\.\/([^'"]+)(['"])/g,(_,prefix,dependency,suffix)=>prefix+'./'+fingerprint(dependency)+suffix);
  const ext=path.extname(name),hash=createHash('sha256').update(content).digest('hex').slice(0,12);
  const output=name.slice(0,-ext.length)+'.'+hash+ext;
  fs.writeFileSync(assetDir+'/'+output,content);
  pending.delete(name);assets.set(name,output);return output;
}
const html=template.replace('{{PET}}',pet).replace(/((?:src|href)=["'])\.\/([^"']+)(["'])/g,(_,prefix,name,suffix)=>prefix+'./assets/'+fingerprint(name)+suffix);
fs.writeFileSync('dist/index.html','\ufeff'+html);
console.log('Built Chinese UTF-8 entry and '+assets.size+' versioned assets');
