import { useState } from 'react';
import { useApp } from '../context.jsx';
import { hpColor, hpPct, isDowned, defaultTab, getTabsFor } from '../gameLogic.js';
import StatusBar from './StatusBar.jsx';
import QuickCondPanel from './QuickCondPanel.jsx';
import { HpTab, CondTab, SpellTab, StatblockTab, LegendaryTab, DeathTab, NotesTab } from './tabs.jsx';

const TAB_COMPONENTS = {
  hp: HpTab,
  conditions: CondTab,
  spells: SpellTab,
  statblock: StatblockTab,
  legendary: LegendaryTab,
  death: DeathTab,
  notes: NotesTab,
};

export default function CombatantCard({ combatant: c, index }) {
  const { state, toggleExpand, goTab, damage, heal, setInit, removeCombatant, toggleSelect } = useApp();
  const [dmgAmt, setDmgAmt] = useState(1);

  const isAct = index === state.turnIndex;
  const isExp = !!state.expanded[c.id];
  const isDwn = isDowned(c);
  const hasHP = c.type === 'pc' || c.type === 'enemy';
  const allDone = hasHP && c.actions.a && c.actions.b && c.actions.r && c.actions.m;

  const cls = [
    'cbt',
    `t-${c.type}`,
    isAct ? 'is-active' : '',
    isDwn ? 'is-downed' : '',
    allDone && !isAct ? 'is-done' : '',
  ].filter(Boolean).join(' ');

  const activeTab = state.activeTab[c.id] || defaultTab(c);
  const tabs = getTabsFor(c);
  const hpC = hpColor(c);
  const pct = hpPct(c);

  function handleRemove(e) {
    e.stopPropagation();
    if (!confirm(`Remove ${c.name} from combat?\nThis cannot be undone.`)) return;
    removeCombatant(c.id);
  }

  function handleDamage(e) {
    e.stopPropagation();
    damage(c.id, dmgAmt);
  }

  function handleHeal(e) {
    e.stopPropagation();
    heal(c.id, dmgAmt);
  }

  const TabBody = TAB_COMPONENTS[activeTab];

  return (
    <div className={cls} data-id={c.id}>
      {state.multiMode && hasHP && (
        <input
          type="checkbox"
          className="cbt-checkbox"
          checked={!!state.selected[c.id]}
          onChange={() => toggleSelect(c.id)}
          onClick={e => e.stopPropagation()}
          title="Select for AoE damage"
        />
      )}

      {/* Card Head */}
      <div className="cbt-head" onClick={() => toggleExpand(c.id)}>
        <div className="init-wrap" onClick={e => e.stopPropagation()}>
          <input
            className="init-inp"
            type="number"
            value={c.init}
            onChange={e => setInit(c.id, e.target.value)}
            title="Initiative"
          />
        </div>
        <div className="nameblock">
          <div className="cbt-name">{c.name}</div>
          <div className="cbt-sub">{c.subname}</div>
        </div>

        {hasHP && (
          <div className="hp-block" onClick={e => e.stopPropagation()}>
            <div className="hp-row">
              <div className="hp-nums">
                <span className="hp-cur" style={{color: hpC}}>{c.hp}</span>
                <span className="hp-sep">&nbsp;/&nbsp;</span>
                <span className="hp-max">{c.maxHp}</span>
                {c.tempHp > 0 && <span className="hp-tmp">(+{c.tempHp})</span>}
              </div>
              <div className="hp-ctrl">
                <button className="btn btn-sm btn-red btn-icon" onClick={handleDamage} title="Deal damage">−</button>
                <input
                  className="hp-amt"
                  type="number"
                  min="0"
                  value={dmgAmt}
                  onChange={e => setDmgAmt(parseInt(e.target.value) || 0)}
                  onClick={e => e.stopPropagation()}
                  title="Amount"
                />
                <button className="btn btn-sm btn-green btn-icon" onClick={handleHeal} title="Heal">+</button>
              </div>
            </div>
            <div className="hp-bar-wrap">
              <div className="hp-bar" style={{width: `${pct}%`, background: hpC}} />
            </div>
          </div>
        )}

        <button
          className="btn btn-sm btn-icon"
          style={{opacity:.6}}
          onClick={handleRemove}
          title="Remove combatant"
        >
          <i className="ti ti-trash"></i>
        </button>
        <div className={`chevron ${isExp ? 'open' : ''}`}>
          <i className="ti ti-chevron-right"></i>
        </div>
      </div>

      <StatusBar combatant={c} />

      {state.quickCondId === c.id && <QuickCondPanel combatant={c} />}

      {isExp && (
        <div className="cbt-exp">
          <div className="tabs">
            {tabs.map(t => (
              <div
                key={t.id}
                className={`tab ${t.id === activeTab ? 'on' : ''}`}
                onClick={() => goTab(c.id, t.id)}
              >
                {t.label}
              </div>
            ))}
          </div>
          <div className="tab-body">
            {TabBody ? <TabBody c={c} /> : <span style={{color:'var(--text-md)'}}>—</span>}
          </div>
        </div>
      )}
    </div>
  );
}
