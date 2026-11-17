// Lightweight integration checks for merged files and verification policy.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p), 'utf8');
const source = read('data/verification.ts');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const moduleShim = {exports:{}};
new Function('module','exports',js)(moduleShim,moduleShim.exports);
const {isDemoCardValid, cartFingerprint, canCompleteDemoOrder} = moduleShim.exports;
assert.equal(isDemoCardValid('COUGAR-DEMO'),true);
for(const invalid of ['cougar-demo',' COUGAR-DEMO','COUGAR-DEMO ','INVALID']) assert.equal(isDemoCardValid(invalid),false);
const cart={1:2,2:1}; const key=cartFingerprint(cart);
assert.equal(canCompleteDemoOrder(null,cart,'COUGAR-DEMO',false),false);
assert.equal(canCompleteDemoOrder(key,cart,'COUGAR-DEMO',true),false);
assert.equal(canCompleteDemoOrder(key,cart,'COUGAR-DEMO',false),true);
assert.equal(canCompleteDemoOrder(key,{1:3,2:1},'COUGAR-DEMO',false),false);
assert.equal(canCompleteDemoOrder(key,cart,'INVALID',false),false);
assert.equal(canCompleteDemoOrder(cartFingerprint({}),{},'COUGAR-DEMO',false),false);
for(const file of ['App.tsx','components/DemoCardVerification.tsx','components/ProductPhoto.tsx','screens/CartScreen.tsx','screens/ConfirmationScreen.tsx']) {
 const result=ts.transpileModule(read(file),{compilerOptions:{jsx:ts.JsxEmit.React, module:ts.ModuleKind.CommonJS},reportDiagnostics:true});
 assert.equal((result.diagnostics||[]).length,0,`Transpile diagnostics in ${file}`);
}
for(const name of ['gatorade','powerade','electrolit','bodyarmor','propel']) assert.ok(fs.existsSync(path.join(root,'assets/products',name+'.png')));
assert.match(read('App.tsx'),/canCompleteDemoOrder\(verifiedCart, cart, nfcInput, verifying\)/);
assert.match(read('screens/ConfirmationScreen.tsx'),/3000 \+ Math.random\(\) \* 2000/);
console.log('Merged integration checks passed.');
