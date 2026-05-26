import { COVER_BONUS } from './constants.js';

export function mkSlots(spec) {
  const used = {};
  Object.keys(spec).forEach(k => used[k] = 0);
  return { max: {...spec}, used };
}

export function mkPC(id, name, sub, ac, maxHp, init = 0) {
  return {
    id, name, subname: sub, type: 'pc', init, ac,
    hp: maxHp, maxHp, tempHp: 0, cover: 'none',
    conditions: [], conc: false,
    actions: {a: false, b: false, r: false, m: false},
    spellSlots: null, legendaryMax: 0, legendaryUsed: 0,
    monster: null, deathS: 0, deathF: 0, notes: ''
  };
}

export function mkEnemy(id, name, sub, ac, maxHp, monster, slotsSpec, init = 0) {
  return {
    id, name, subname: sub, type: 'enemy', init, ac,
    hp: maxHp, maxHp, tempHp: 0, cover: 'none',
    conditions: [], conc: false,
    actions: {a: false, b: false, r: false, m: false},
    spellSlots: slotsSpec ? mkSlots(slotsSpec) : null,
    legendaryMax: 0, legendaryUsed: 0,
    monster, deathS: 0, deathF: 0, notes: ''
  };
}

export function initialCombatants() {
  return [
    mkPC('anr',    "An'r May",       'Drow · Sorcerer / Shadow Magic',           13, 44),
    mkPC('finnek', 'Finnek von Shrot','Gnome · Artificer / Arcane Artillerist',   16, 52),
    mkPC('guo',    'Guo',             'Human · Cleric / Peace Domain',            18, 60),
    mkPC('szept',  'Szeptomir',       'Half-Elf · Rogue / Arcane Trickster',      15, 52),
    mkPC('tygrum', 'Tygrum',          'Dwarf · Paladin / Oath of Vengeance',      19, 68),
    mkPC('eona',   'Eona',            'Halfling · Barbarian / Path of the Berserker', 14, 75),
    mkEnemy('neferon','Neferon',       'Arcanaloth · CR 12', 17,104,'arcanaloth',{1:4,2:3,3:3,4:3,5:2,6:1,7:1,8:1}),
    mkEnemy('flame1','Flameskull #1',  'Flameskull · CR 4',  13, 40,'flameskull', {1:3,2:2,3:1}),
    mkEnemy('flame2','Flameskull #2',  'Flameskull · CR 4',  13, 40,'flameskull', {1:3,2:2,3:1}),
    mkEnemy('flame3','Flameskull #3',  'Flameskull · CR 4',  13, 40,'flameskull', {1:3,2:2,3:1}),
  ];
}

export function initialState() {
  return {
    round: 1, turnIndex: 0,
    combatants: initialCombatants(),
    expanded: {}, activeTab: {},
    concSaves: [],
    showExport: false, showEnvForm: false, showAddForm: false,
    addFormType: 'pc',
    formErrors: {},
    toast: null,
    quickCondId: null,
    multiMode: false, selected: {}, aoeAmt: 10,
  };
}

export function uid() {
  return 'cx_' + Date.now() + '_' + (Math.random() * 1e4 | 0);
}

export function hpColor(c) {
  if (c.hp <= 0) return 'var(--hp-lo)';
  const p = c.hp / c.maxHp;
  if (p > 0.5) return 'var(--hp-hi)';
  if (p > 0.25) return 'var(--hp-md)';
  return 'var(--hp-lo)';
}

export function hpPct(c) {
  return c.maxHp > 0 ? Math.max(0, Math.min(100, c.hp / c.maxHp * 100)) : 0;
}

export function spellSum(c) {
  if (!c.spellSlots) return null;
  const {max, used} = c.spellSlots;
  const a = Object.keys(max).reduce((s, k) => s + max[k] - (used[k] || 0), 0);
  const t = Object.keys(max).reduce((s, k) => s + max[k], 0);
  return `${a}/${t}`;
}

export function isDowned(c) {
  return c.type === 'pc' && c.hp <= 0;
}

export function effAC(c) {
  return c.ac + (COVER_BONUS[c.cover] || 0);
}

// Mutates draft combatant + draft state (for concSaves)
export function applyDamage(draft, c, amt) {
  if (amt <= 0) return;
  let rem = amt;
  if (c.tempHp > 0) {
    const abs = Math.min(c.tempHp, rem);
    c.tempHp -= abs;
    rem -= abs;
  }
  c.hp = Math.max(0, c.hp - rem);
  if (c.conc && rem > 0) {
    const dc = Math.max(10, Math.floor(rem / 2));
    draft.concSaves.push({key: c.id + '_' + Date.now(), name: c.name, dc, damage: rem});
  }
  if (c.hp <= 0) c.conc = false;
}

export function applyHeal(c, amt) {
  if (amt <= 0) return;
  if (c.hp <= 0 && c.type === 'pc') { c.deathS = 0; c.deathF = 0; }
  c.hp = Math.min(c.maxHp, c.hp + amt);
}

export function defaultTab(c) {
  return (c.type === 'env' || c.type === 'lair') ? 'notes' : 'hp';
}

export function getTabsFor(c) {
  const t = [];
  if (c.type === 'pc' || c.type === 'enemy') {
    t.push({id: 'hp', label: 'HP / AC / Cover'});
    t.push({id: 'conditions', label: 'Conditions'});
  }
  if (c.spellSlots) t.push({id: 'spells', label: 'Spell Slots'});
  if (c.monster) t.push({id: 'statblock', label: 'Statblock'});
  if (c.type === 'enemy') t.push({id: 'legendary', label: 'Legendary'});
  if ((c.type === 'pc' || c.type === 'enemy') && isDowned(c)) t.push({id: 'death', label: 'Death Saves'});
  t.push({id: 'notes', label: 'Notes'});
  return t;
}
