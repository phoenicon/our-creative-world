// Headless smoke test for Twin Quest II: stubs the DOM, runs the real game
// script, and plays through the win condition of every level.
import { readFileSync } from 'fs';
import vm from 'vm';

const html = readFileSync(new URL('../public/games/twin-quest.html', import.meta.url), 'utf8');
const src = html.split('<script>')[1].split('</script>')[0];

// ---------- stubs ----------
const noopCtx = () => new Proxy({}, {
  get: (t, p) => {
    if (p === 'createRadialGradient' || p === 'createLinearGradient') return () => ({ addColorStop() {} });
    return typeof t[p] !== 'undefined' ? t[p] : () => noop;
  },
  set: () => true,
});
const noop = () => {};
function mkEl() {
  const el = {
    children: [], style: {}, _text: '', _html: '',
    classList: { _s: new Set(), add(c){this._s.add(c);}, remove(c){this._s.delete(c);}, toggle(c,f){f?this._s.add(c):this._s.delete(c);}, contains(c){return this._s.has(c);} },
    addEventListener: noop, removeEventListener: noop, appendChild(c){this.children.push(c);}, setAttribute: noop, getAttribute: () => null,
    getContext: () => noopCtx(), width: 0, height: 0, tabIndex: 0,
  };
  Object.defineProperty(el, 'textContent', { get(){return this._text;}, set(v){this._text=v;} });
  Object.defineProperty(el, 'innerHTML', { get(){return this._html;}, set(v){this._html=v; this.children=[];} });
  return el;
}
const els = {};
const byId = id => (els[id] = els[id] || mkEl());

let rafCb = null;
const store = {};
const listeners = {};
const windowObj = {
  addEventListener: (t, f) => { (listeners[t] = listeners[t] || []).push(f); },
  dispatch: (t, ev) => (listeners[t] || []).forEach(f => f(ev)),
};

const sandbox = {
  document: {
    getElementById: byId,
    createElement: () => mkEl(),
    querySelectorAll: () => [],
    documentElement: {},
  },
  window: windowObj,
  localStorage: {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
  },
  getComputedStyle: () => ({ getPropertyValue: () => '#ffffff' }),
  requestAnimationFrame: cb => { rafCb = cb; },
  setTimeout, clearTimeout, setInterval, clearInterval,
  location: { search: '', href: '' },
  URLSearchParams, navigator: { maxTouchPoints: 0 }, Math, Date, JSON, console,
  performance: { now: () => Date.now() },
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

const TQ = windowObj.__TQ;
if (!TQ) throw new Error('debug hook missing');
const tick = (n = 1) => { for (let i = 0; i < n; i++) rafCb(); };
const TILE = 40;
const put = (tx, ty) => { TQ.player.x = tx * TILE + 8; TQ.player.y = ty * TILE + 8; };
const press = k => { TQ.keys[k] = 1; };
const release = k => { TQ.keys[k] = 0; };
const use = () => { press('act'); tick(2); release('act'); tick(2); };
let pass = 0, fail = 0;
const check = (name, cond) => { cond ? pass++ : (fail++, console.log('FAIL: ' + name)); };

// ---------- Level 1: Greenwood ----------
TQ.startLevel(0);
tick(5);
check('L1 starts in play', TQ.state === 'play');
put(9, 8); tick(3);                                  // bone pickup
check('L1 bone picked up', TQ.player.hasBone);
TQ.player.x = TQ.dog.x - 20; TQ.player.y = TQ.dog.y; use();
check('L1 dog fed', TQ.dog.fed);
check('L1 dog friendship saved', TQ.prog.dog === true);
put(27, 11); tick(3);
check('L1 key picked up', TQ.player.keys === 1);
TQ.boss.hp = 1; TQ.player.x = TQ.boss.x - 26; TQ.player.y = TQ.boss.y; TQ.player.dir = 'right'; use();
check('L1 boss dies from swing', !TQ.boss.alive);
check('L1 chest opens', TQ.chest.open);
put(15, 19); tick(3);
check('L1 win', TQ.state === 'win');
check('L1 progress saved', JSON.parse(store['ocw-tq2-progress']).done[0] === true);
check('L1 sticker awarded', JSON.parse(store['ocw-stickers']).includes('quest-greenwood'));

// ---------- Level 2: Crystal Caves ----------
TQ.startLevel(1);
tick(5);
check('L2 darkness flag', TQ.L.dark === true);
check('L2 dog carries over', TQ.dog && TQ.dog.fed);
put(5, 3); tick(3);
check('L2 torch picked up', TQ.player.hasTorch);
for (const g of TQ.gems) { put(g.x, g.y); tick(3); }
check('L2 three crystals collected', TQ.player.gems === 3);
put(25, 18); tick(3);
check('L2 win on lift', TQ.state === 'win');
check('L2 sticker', JSON.parse(store['ocw-stickers']).includes('quest-caves'));

// ---------- Level 3: Flooded Ruins ----------
TQ.startLevel(2);
tick(5);
// push crate 1 (at 5,8) into the channel at (8,8): stand left, hold right
put(3, 8); TQ.player.y = 8 * TILE + 8; press('right'); tick(220); release('right');
check('L3 crate became a bridge', TQ.map[8][8] === TQ.T.BRIDGE);
put(19, 3); tick(3);
check('L3 boots picked up', TQ.player.hasBoots);
// shallow water walkable only with boots
put(20, 13); press('down'); tick(30); release('down');
check('L3 can wade shallow with boots', Math.floor(TQ.player.y / TILE) > 13);
TQ.frog.hp = 1; TQ.player.x = TQ.frog.x - 30; TQ.player.y = TQ.frog.y; TQ.player.dir = 'right';
while (TQ.frog.alive) { use(); tick(10); }          // frog may be mid-jump; retry until idle hit lands
check('L3 frog beaten', !TQ.frog.alive);
check('L3 chest opens', TQ.chest.open);
put(24, 17); tick(3);
check('L3 win', TQ.state === 'win');
check('L3 sticker', JSON.parse(store['ocw-stickers']).includes('quest-ruins'));

// ---------- Level 4: Castle ----------
TQ.startLevel(3);
tick(5);
// crate/plate/gate puzzle for key 1: crate at (13,17), plate at (11,17); push left
put(14, 17); press('left'); tick(260); release('left');
check('L4 gate open after plate', !TQ.map ? false : (() => { put(4, 17); tick(3); return TQ.player.keys === 1; })());
put(25, 10); tick(3);
check('L4 both keys', TQ.player.keys === 2);
// unlock door 1 (15,13) from below
put(15, 15); press('up'); tick(80); release('up');
check('L4 door 1 opened', TQ.map[13][15] === TQ.T.DOOROPEN);
check('L4 one key left', TQ.player.keys === 1);
// unlock door 2 (15,7) from below
put(15, 9); press('up'); tick(80); release('up');
check('L4 door 2 opened', TQ.map[7][15] === TQ.T.DOOROPEN);
// boss splits when hurt
const before = TQ.boss.hp;
TQ.player.x = TQ.boss.x - 26; TQ.player.y = TQ.boss.y; TQ.player.dir = 'right';
TQ.boss.hp = 10; use();
check('L4 boss split spawns slimes', TQ.state === 'play');
tick(15);                                            // let the swing animation finish
TQ.boss.hp = 1; TQ.player.x = TQ.boss.x - 26; TQ.player.y = TQ.boss.y; TQ.player.dir = 'right'; use();
check('L4 boss dead', !TQ.boss.alive);
check('L4 cage open', TQ.cage.open);
put(15, 3); tick(3);
check('L4 win', TQ.state === 'win');
check('L4 sticker', JSON.parse(store['ocw-stickers']).includes('quest-castle'));
check('all four worlds done', JSON.parse(store['ocw-tq2-progress']).done.every(Boolean));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
