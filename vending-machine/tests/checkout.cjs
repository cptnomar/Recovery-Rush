// Exercise App.tsx handlers directly, including bypassing disabled UI controls.
// Minimal React/Native stubs keep these transaction tests dependency-free.
/* global __dirname */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
let slots = [], cursor = 0, timers = new Map(), timerId = 0;
const react = {
  createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
  useState(initial) {
    const index = cursor++;
    if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
    return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
  },
  useRef(value) { const index = cursor++; return slots[index] ||= { current: value }; },
  useEffect() {},
  useCallback: callback => callback,
};
const native = new Proxy({
  StyleSheet: { create: value => value },
  useWindowDimensions: () => ({ width: 360, height: 780 }),
  Platform: { OS: 'android' }, Keyboard: { dismiss() {} },
  Animated: { Value: class {}, View: 'AnimatedView' },
}, { get: (target, key) => target[key] || key });
function load(file) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, {
    module, exports: module.exports,
    require: name => {
      if (name === 'react') return react;
      if (name === 'react-native') return native;
      if (name.endsWith('.png')) {
        const asset = path.resolve(path.dirname(file), name);
        assert.ok(fs.existsSync(asset), `Missing image: ${asset}`);
        assert.equal(fs.readFileSync(asset).subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
        return asset;
      }
      return load(path.resolve(path.dirname(file), name + '.ts'));
    },
    setTimeout: callback => { timers.set(++timerId, callback); return timerId; },
    clearTimeout: id => timers.delete(id),
  }, { filename: file });
  return module.exports;
}
const App = load(path.resolve(__dirname, '../App.tsx')).default;
let nodes;
function render() {
  cursor = 0; nodes = [];
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(visit);
    if (typeof node.type === 'function') return visit(node.type(node.props));
    nodes.push(node); visit(node.props?.children);
  }
  visit(App());
}
function find(label) {
  const node = nodes.find(node => node.props.accessibilityLabel === label);
  assert.ok(node, `Missing control: ${label}`);
  return node.props;
}
function press(label, bypass = false) {
  const control = find(label);
  if (!bypass) assert.ok(!control.disabled, `${label} is disabled`);
  control.onPress(); render();
}
function flush() { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); render(); }
function input(value) { find('Simulated NFC identifier').onChangeText(value); render(); }
function locked() { assert.equal(find('COMPLETE DEMO ORDER').disabled, true); }
function verify() { press('SIMULATE CARD TAP'); locked(); flush(); assert.equal(find('COMPLETE DEMO ORDER').disabled, false); }
render();
press('CHOOSE YOUR ENERGY');
for (const name of ['Gatorade', 'Powerade', 'Electrolit', 'BODYARMOR', 'Propel']) {
  find(`Add ${name} to cart`);
  const image = find(`${name} product photo`);
  assert.equal(path.basename(image.source), `${name.toLowerCase()}.png`);
  assert.equal(image.resizeMode, 'contain');
}
press('Add Gatorade to cart'); press('View cart'); locked();
assert.equal(path.basename(find('Gatorade product photo').source), 'gatorade.png');
press('COMPLETE DEMO ORDER', true); locked(); // App guard, independent of UI
for (const value of ['INVALID', 'cougar-demo', ' COUGAR-DEMO', 'COUGAR-DEMO ']) {
  input(value); press('VERIFY TEST INPUT'); flush(); locked();
}
input('COUGAR-DEMO'); press('VERIFY TEST INPUT'); locked(); flush();
assert.equal(find('COMPLETE DEMO ORDER').disabled, false);
input('INVALID'); locked(); // Editing a previously verified identifier invalidates it
verify(); press('Add one Gatorade'); locked(); // Quantity change invalidates it
press('SIMULATE CARD TAP'); press('Remove one Gatorade'); flush(); locked(); // Pending work is canceled
verify(); press('Recovery Rush home'); press('CHOOSE YOUR ENERGY');
press('Add Powerade to cart'); press('View cart'); locked(); // Product selection/new checkout
verify();
const complete = find('COMPLETE DEMO ORDER').onPress;
complete(); complete(); render(); // Rapid repeated completion cannot double-decrement stock
assert.equal(path.basename(find('Gatorade product photo').source), 'gatorade.png');
assert.equal(path.basename(find('Powerade product photo').source), 'powerade.png');
assert.ok(!nodes.some(n => n.props.accessibilityLabel === 'COMPLETE DEMO ORDER'));
press('BACK TO THE LINEUP');
const stockText = nodes.filter(n => n.type === 'Text').map(n => n.props.children.flat(Infinity).join(''));
assert.ok(stockText.includes('9 left'), 'Purchase should decrement brand stock once');
press('Add Propel to cart'); press('View cart'); locked();
press('Remove one Propel');
assert.ok(!nodes.some(n => n.props.accessibilityLabel === 'COMPLETE DEMO ORDER'), 'Empty cart cannot complete');
console.log('PASS: checkout guards, invalid/manual/tap input, loading, reset, cancellation, receipt, stock and empty cart');
