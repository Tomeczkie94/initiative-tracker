import { useState, useRef, useEffect, useCallback } from 'react';
import { AppContext } from './context.jsx';
import {
  initialState, applyDamage, applyHeal, isDowned,
  defaultTab, uid, mkSlots
} from './gameLogic.js';
import { COVER_NEXT } from './constants.js';
import Header from './components/Header.jsx';
import Toolbar from './components/Toolbar.jsx';
import ConcBanner from './components/ConcBanner.jsx';
import MultiBar from './components/MultiBar.jsx';
import EnvForm from './components/EnvForm.jsx';
import AddForm from './components/AddForm.jsx';
import ExportPanel from './components/ExportPanel.jsx';
import EditForm from './components/EditForm.jsx';
import Sidebar from './components/Sidebar.jsx';
import CombatantCard from './components/CombatantCard.jsx';
import Toast from './components/Toast.jsx';

function App() {
  const [state, setState] = useState(initialState);
  const toastTimerRef = useRef(null);

  const update = useCallback((fn) => {
    setState(prev => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  }, []);

  const showToast = useCallback((msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setState(prev => ({ ...prev, toast: msg }));
    toastTimerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, toast: null }));
    }, 2500);
  }, []);

  const scrollToActive = useCallback(() => {
    setTimeout(() => {
      const el = document.querySelector('.cbt.is-active');
      const list = document.getElementById('list');
      if (el && list) {
        const t = el.offsetTop, h = el.offsetHeight, lh = list.clientHeight;
        list.scrollTop = t - (lh / 2) + (h / 2);
      }
    }, 60);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.target.matches('input,textarea,select')) return;
      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        nextTurn();
        scrollToActive();
      }
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevTurn();
        scrollToActive();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Navigation ----
  function nextTurn() {
    update(s => {
      if (!s.combatants.length) return;
      s.turnIndex = (s.turnIndex + 1) % s.combatants.length;
      if (s.turnIndex === 0) s.round++;
      const c = s.combatants[s.turnIndex];
      c.actions = {a: false, b: false, r: false, m: false};
      c.legendaryUsed = 0;
    });
  }

  function prevTurn() {
    update(s => {
      if (!s.combatants.length) return;
      if (s.turnIndex === 0) {
        if (s.round > 1) s.round--;
        s.turnIndex = s.combatants.length - 1;
      } else {
        s.turnIndex--;
      }
    });
  }

  function sortByInit() {
    update(s => {
      s.combatants.sort((a, b) => b.init - a.init);
      s.turnIndex = 0;
    });
  }

  function resetCombat() {
    if (!confirm('Reset combat?\n\nInitiative, conditions, actions and spell slots will be cleared.\nHP and AC are preserved.')) return;
    update(s => {
      s.round = 1; s.turnIndex = 0; s.concSaves = [];
      s.combatants = s.combatants.filter(c => c.type === 'pc' || c.type === 'enemy');
      s.combatants.forEach(c => {
        c.init = 0; c.conditions = []; c.conc = false; c.cover = 'none';
        c.actions = {a: false, b: false, r: false, m: false};
        if (c.spellSlots) Object.keys(c.spellSlots.used).forEach(k => c.spellSlots.used[k] = 0);
        c.legendaryUsed = 0; c.deathS = 0; c.deathF = 0;
      });
    });
  }

  // ---- Expand / Tabs ----
  function toggleExpand(id) {
    update(s => {
      s.expanded[id] = !s.expanded[id];
      if (s.expanded[id] && !s.activeTab[id]) {
        const c = s.combatants.find(c => c.id === id);
        if (c) s.activeTab[id] = defaultTab(c);
      }
    });
  }

  function goTab(id, tab) {
    update(s => {
      s.expanded[id] = true;
      s.activeTab[id] = tab;
    });
    setTimeout(() => {
      const el = document.querySelector(`.cbt[data-id="${id}"]`);
      const list = document.getElementById('list');
      if (el && list) {
        const top = el.offsetTop, h = el.offsetHeight, lh = list.clientHeight;
        list.scrollTop = top - (lh / 2) + (h / 2);
      }
    }, 60);
  }

  // ---- Damage / Heal ----
  function damage(id, amt) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) applyDamage(s, c, amt);
    });
  }

  function heal(id, amt) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) applyHeal(c, amt);
    });
  }

  // ---- HP / AC / Cover ----
  function editHp(id, val) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) c.hp = Math.min(Math.max(parseInt(val) || 0, 0), c.maxHp);
    });
  }

  function editMaxHp(id, val) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) { c.maxHp = Math.max(1, parseInt(val) || 1); c.hp = Math.min(c.hp, c.maxHp); }
    });
  }

  function editTempHp(id, val) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) c.tempHp = Math.max(0, parseInt(val) || 0);
    });
  }

  function editAc(id, val) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) c.ac = Math.max(0, parseInt(val) || 0);
    });
  }

  function setCover(id, val) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) c.cover = val;
    });
  }

  function cycleCover(id) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) c.cover = COVER_NEXT[c.cover];
    });
  }

  // ---- Actions ----
  function toggleAction(id, key) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) c.actions[key] = !c.actions[key];
    });
  }

  // ---- Conditions ----
  function toggleCond(id, cond) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (!c) return;
      const i = c.conditions.indexOf(cond);
      if (i >= 0) c.conditions.splice(i, 1);
      else c.conditions.push(cond);
    });
  }

  function removeCond(id, cond) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) c.conditions = c.conditions.filter(x => x !== cond);
    });
  }

  function toggleConc(id) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (!c) return;
      c.conc = !c.conc;
      if (!c.conc) s.concSaves = s.concSaves.filter(sv => !sv.key.startsWith(id));
    });
  }

  function closeConc(key) {
    update(s => { s.concSaves = s.concSaves.filter(sv => sv.key !== key); });
  }

  // ---- Initiative ----
  function setInit(id, val) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) c.init = parseInt(val) || 0;
    });
  }

  function rollInitiative() {
    update(s => {
      s.combatants.forEach(c => { if (c.init === 0) c.init = Math.ceil(Math.random() * 20); });
      s.combatants.sort((a, b) => b.init - a.init);
      s.turnIndex = 0;
    });
    showToast('Initiative rolled! Adjust values then hit Sort.');
  }

  // ---- Spell Slots ----
  function toggleSlot(id, level, pip) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (!c?.spellSlots) return;
      const k = String(level);
      const av = c.spellSlots.max[k] - (c.spellSlots.used[k] || 0);
      if (pip < av) c.spellSlots.used[k] = (c.spellSlots.used[k] || 0) + 1;
      else c.spellSlots.used[k] = Math.max(0, (c.spellSlots.used[k] || 0) - 1);
    });
  }

  function longRest(id) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c?.spellSlots) Object.keys(c.spellSlots.used).forEach(k => c.spellSlots.used[k] = 0);
    });
  }

  function burnAll(id) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c?.spellSlots) Object.keys(c.spellSlots.used).forEach(k => c.spellSlots.used[k] = c.spellSlots.max[k]);
    });
  }

  // ---- Legendary ----
  function toggleLeg(id, pip) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (!c) return;
      const av = c.legendaryMax - c.legendaryUsed;
      if (pip < av) c.legendaryUsed = Math.min(c.legendaryMax, c.legendaryUsed + 1);
      else c.legendaryUsed = Math.max(0, c.legendaryUsed - 1);
    });
  }

  function resetLeg(id) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) c.legendaryUsed = 0;
    });
  }

  function editLegMax(id, val) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) { c.legendaryMax = Math.max(0, parseInt(val) || 0); c.legendaryUsed = Math.min(c.legendaryUsed, c.legendaryMax); }
    });
  }

  // ---- Death Saves ----
  function deathTog(id, type, idx) {
    const cur = state.combatants.find(c => c.id === id);
    if (!cur) return;
    const newS = type === 's' ? (idx < cur.deathS ? idx : idx + 1) : cur.deathS;
    const newF = type === 'f' ? (idx < cur.deathF ? idx : idx + 1) : cur.deathF;
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (!c) return;
      if (type === 's') c.deathS = newS;
      else c.deathF = newF;
      if (newS >= 3) { c.deathS = 0; c.deathF = 0; c.hp = 1; }
      else if (newF >= 3) { c.deathS = 0; c.deathF = 0; }
    });
    if (newS >= 3) showToast(`${cur.name} — stabilized!`);
    else if (newF >= 3) showToast(`${cur.name} — died!`);
  }

  function deathReset(id) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) { c.deathS = 0; c.deathF = 0; }
    });
  }

  // ---- Notes ----
  function setNotes(id, val) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (c) c.notes = val;
    });
  }

  // ---- Remove ----
  function removeCombatant(id) {
    update(s => {
      const idx = s.combatants.findIndex(c => c.id === id);
      if (idx < 0) return;
      s.combatants.splice(idx, 1);
      if (s.combatants.length === 0) { s.turnIndex = 0; }
      else if (idx < s.turnIndex) s.turnIndex--;
      else if (s.turnIndex >= s.combatants.length) s.turnIndex = s.combatants.length - 1;
      delete s.expanded[id]; delete s.activeTab[id];
    });
  }

  // ---- Forms ----
  function toggleAddForm() {
    update(s => { s.showAddForm = !s.showAddForm; if (s.showAddForm) { s.formErrors = {}; s.editId = null; } });
  }

  function setAddFormType(t) {
    update(s => { s.addFormType = t; });
  }

  function addLair() {
    update(s => {
      if (s.combatants.some(c => c.type === 'lair')) {
        alert('A Lair Action already exists. Only one allowed per RAW 2014.');
        return;
      }
      s.combatants.push({
        id: 'lair_' + Date.now(), name: 'Lair Action',
        subname: 'Initiative 20 (RAW 2014)', type: 'lair',
        init: 20, ac: 0, hp: 0, maxHp: 0, tempHp: 0, cover: 'none',
        conditions: [], conc: false, actions: {a:false,b:false,r:false,m:false},
        spellSlots: null, legendaryMax: 0, legendaryUsed: 0,
        monster: null, deathS: 0, deathF: 0, notes: ''
      });
    });
  }

  function confirmEnv(name, init) {
    update(s => {
      s.combatants.push({
        id: uid(), name: name || 'Environment Effect',
        subname: 'Environment Effect', type: 'env',
        init: parseInt(init) || 0, ac: 0, hp: 0, maxHp: 0, tempHp: 0, cover: 'none',
        conditions: [], conc: false, actions: {a:false,b:false,r:false,m:false},
        spellSlots: null, legendaryMax: 0, legendaryUsed: 0,
        monster: null, deathS: 0, deathF: 0, notes: ''
      });
      s.showEnvForm = false;
    });
    showToast(`Added: ${name || 'Environment Effect'}`);
  }

  function confirmAdd(data) {
    const errs = {};
    if (!data.name) errs.name = 'Name is required.';
    if (isNaN(data.ac) || data.ac < 0) errs.ac = 'AC must be ≥ 0.';
    if (isNaN(data.maxHp) || data.maxHp < 1) errs.mhp = 'Max HP must be ≥ 1.';

    // Check duplicate name (warn only)
    let namew = null;
    if (data.name && state.combatants.some(c => c.name === data.name)) {
      namew = `A combatant named "${data.name}" already exists.`;
    }

    if (errs.name || errs.ac || errs.mhp) {
      update(s => { s.formErrors = {...errs, namew}; });
      return false;
    }

    const hp = isNaN(data.hp) ? data.maxHp : Math.min(data.hp, data.maxHp);
    const slots = data.slotsSpec && Object.keys(data.slotsSpec).length > 0 ? mkSlots(data.slotsSpec) : null;

    update(s => {
      s.formErrors = namew ? {namew} : {};
      s.combatants.push({
        id: uid(), name: data.name, subname: data.subname || '', type: data.type,
        init: data.init || 0, ac: data.ac, hp, maxHp: data.maxHp,
        tempHp: Math.max(0, data.tempHp || 0), cover: 'none',
        conditions: [], conc: false, actions: {a:false,b:false,r:false,m:false},
        spellSlots: slots, legendaryMax: data.legMax || 0, legendaryUsed: 0,
        monster: null, deathS: 0, deathF: 0, notes: data.notes || ''
      });
    });
    showToast(`Added: ${data.name}`);
    return true;
  }

  // ---- Edit ----
  function startEdit(id) {
    update(s => { s.editId = id; s.showAddForm = false; s.showEnvForm = false; });
  }

  function cancelEdit() {
    update(s => { s.editId = null; });
  }

  function confirmEdit(id, data) {
    update(s => {
      const c = s.combatants.find(c => c.id === id);
      if (!c) return;
      c.name = data.name;
      c.subname = data.subname;
      c.init = data.init;
      c.ac = data.ac;
      c.maxHp = data.maxHp;
      c.hp = Math.min(c.hp, data.maxHp);
      c.tempHp = data.tempHp;
      c.notes = data.notes;
      if (data.slotsSpec !== null) {
        if (Object.keys(data.slotsSpec).length > 0) {
          const newSlots = mkSlots(data.slotsSpec);
          if (c.spellSlots) {
            Object.keys(newSlots.used).forEach(k => {
              newSlots.used[k] = Math.min(c.spellSlots.used[k] || 0, newSlots.max[k]);
            });
          }
          c.spellSlots = newSlots;
        } else {
          c.spellSlots = null;
        }
      }
      if (typeof data.legMax === 'number') {
        c.legendaryMax = data.legMax;
        c.legendaryUsed = Math.min(c.legendaryUsed, data.legMax);
      }
      s.editId = null;
    });
    showToast(`Updated: ${data.name}`);
  }

  // ---- Quick Cond ----
  function toggleQuickCond(id) {
    update(s => { s.quickCondId = s.quickCondId === id ? null : id; });
  }

  // ---- Export / Import ----
  function toggleExport() {
    update(s => { s.showExport = !s.showExport; });
  }

  function toggleEnvForm() {
    update(s => { s.showEnvForm = !s.showEnvForm; });
  }

  function importState(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!Array.isArray(data.combatants)) throw new Error('Missing combatants array.');
      update(s => {
        s.round = data.round || 1; s.turnIndex = data.turnIndex || 0;
        s.combatants = data.combatants;
        s.expanded = {}; s.activeTab = {}; s.concSaves = []; s.showExport = false;
      });
      showToast('Combat state imported successfully.');
    } catch (err) {
      alert('Import error: ' + err.message);
    }
  }

  // ---- Multi-target ----
  function toggleMulti() {
    update(s => { s.multiMode = !s.multiMode; s.selected = {}; s.aoeAmt = 10; });
  }

  function toggleSelect(id) {
    update(s => { s.selected[id] = !s.selected[id]; });
  }

  function selectAllEnemies() {
    update(s => { s.combatants.forEach(c => { if (c.type === 'enemy') s.selected[c.id] = true; }); });
  }

  function clearSelection() {
    update(s => { s.selected = {}; });
  }

  function setAoeAmt(amt) {
    update(s => { s.aoeAmt = amt; });
  }

  function applyAoe() {
    const amt = state.aoeAmt;
    const hit = state.combatants.filter(c => state.selected[c.id]).length;
    update(s => {
      s.combatants.forEach(c => {
        if (s.selected[c.id]) applyDamage(s, c, amt);
      });
      s.selected = {};
    });
    if (hit) showToast(`${amt} damage applied to ${hit} combatant${hit > 1 ? 's' : ''}.`);
  }

  const ctx = {
    state,
    nextTurn, prevTurn, sortByInit, resetCombat,
    toggleExpand, goTab,
    damage, heal, editHp, editMaxHp, editTempHp, editAc, setCover, cycleCover,
    toggleAction,
    toggleCond, removeCond, toggleConc, closeConc,
    setInit, rollInitiative,
    toggleSlot, longRest, burnAll,
    toggleLeg, resetLeg, editLegMax,
    deathTog, deathReset,
    setNotes,
    removeCombatant,
    toggleAddForm, setAddFormType, addLair, confirmEnv, confirmAdd,
    startEdit, cancelEdit, confirmEdit,
    toggleQuickCond,
    toggleExport, toggleEnvForm, importState,
    toggleMulti, toggleSelect, selectAllEnemies, clearSelection, setAoeAmt, applyAoe,
    toggleSidebar: () => update(s => { s.sidebarOpen = !s.sidebarOpen; }),
    setView: (v) => update(s => { s.view = v; }),
    showToast,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div id="sidebar" className={state.sidebarOpen ? '' : 'collapsed'}>
        <Sidebar />
      </div>
      <div className="main-content">
        <Header />
        {state.view === 'combat' ? (
          <>
            {state.concSaves.length > 0 && <ConcBanner />}
            <Toolbar />
            {state.multiMode && <MultiBar />}
            {state.showEnvForm && <EnvForm />}
            {state.showAddForm && <AddForm />}
            {state.editId && <EditForm />}
            {state.showExport && <ExportPanel />}
            <div id="list">
              {state.combatants.length === 0 ? (
                <div className="empty-state">
                  <h3>No Combatants</h3>
                  <p>Click <em>Add Combatant</em> in the toolbar, or import a saved state via Export / Import.</p>
                </div>
              ) : (
                state.combatants.map((c, i) => (
                  <CombatantCard key={c.id} combatant={c} index={i} />
                ))
              )}
            </div>
          </>
        ) : (
          <div className="view-placeholder">
            <div className="view-placeholder-inner">
              <i className={`ti ${state.view === 'party' ? 'ti-users' : 'ti-skull'}`}></i>
              <h2>{state.view === 'party' ? 'Party' : 'Monsters'}</h2>
              <p>This screen is coming soon.</p>
            </div>
          </div>
        )}
      </div>
      {state.toast && <Toast message={state.toast} />}
    </AppContext.Provider>
  );
}

export default App;
