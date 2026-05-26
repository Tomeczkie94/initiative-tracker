import { useApp } from '../context.jsx';
import { hpColor, hpPct, isDowned } from '../gameLogic.js';
import { COND_CSS } from '../constants.js';

function SbEntry({ c, isActive, onClick }) {
  const { startEdit, removeCombatant } = useApp();
  const hpC = hpColor(c);
  const pct = hpPct(c);
  const downed = isDowned(c);

  function handleEdit(e) {
    e.stopPropagation();
    startEdit(c.id);
  }

  function handleRemove(e) {
    e.stopPropagation();
    if (!confirm(`Remove ${c.name} from combat?\nThis cannot be undone.`)) return;
    removeCombatant(c.id);
  }

  return (
    <div
      className={`sb-entry${isActive ? ' sb-active' : ''}${downed ? ' sb-downed' : ''}`}
      onClick={onClick}
    >
      <div className="sb-entry-row">
        <div className="sb-entry-name">{c.name}</div>
        <div className="sb-entry-actions">
          <button className="sb-action-btn" onClick={handleEdit} title="Edit combatant">
            <i className="ti ti-pencil"></i>
          </button>
          <button className="sb-action-btn sb-action-del" onClick={handleRemove} title="Remove combatant">
            <i className="ti ti-trash"></i>
          </button>
        </div>
      </div>
      <div className="sb-entry-hp">
        <span className="sb-entry-hp-nums" style={{color: hpC}}>
          {c.hp}<span style={{color:'var(--text-lo)'}}>/{c.maxHp}</span>
        </span>
        {c.tempHp > 0 && (
          <span style={{fontSize:'9px',color:'#60a8e0'}}>+{c.tempHp}</span>
        )}
      </div>
      <div className="sb-entry-bar">
        <div className="sb-entry-bar-fill" style={{width:`${pct}%`, background:hpC}} />
      </div>
      {c.conditions.length > 0 && (
        <div className="sb-entry-conds">
          {c.conditions.map(cd => (
            <span key={cd} className={`sb-cond-pill ${COND_CSS[cd] || 'cb-def'}`}>
              {cd.slice(0, 3)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SbSection({ title, view, combatants, activeId, onScrollTo }) {
  const { state, setView } = useApp();
  const isActive = state.view === view;
  return (
    <div className="sb-section">
      <button
        className={`sb-section-title sb-nav-btn${isActive ? ' sb-nav-active' : ''}`}
        onClick={() => setView(isActive ? 'combat' : view)}
        title={isActive ? 'Back to combat' : `Go to ${title} screen`}
      >
        {title}
      </button>
      <div className={`sb-section-content${isActive ? ' collapsed' : ''}`}>
        <div>
          {combatants.length === 0
            ? <div className="sb-empty">None</div>
            : combatants.map(c => (
                <SbEntry
                  key={c.id}
                  c={c}
                  isActive={c.id === activeId}
                  onClick={() => onScrollTo(c.id)}
                />
              ))
          }
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { state, toggleSidebar } = useApp();
  const isOpen = state.sidebarOpen;

  const pcs      = state.combatants.filter(c => c.type === 'pc');
  const monsters = state.combatants.filter(c => c.type === 'enemy');
  const activeId = state.combatants[state.turnIndex]?.id;

  function scrollToC(id) {
    const el = document.querySelector(`.cbt[data-id="${id}"]`);
    const list = document.getElementById('list');
    if (el && list) {
      const top = el.offsetTop, h = el.offsetHeight, lh = list.clientHeight;
      list.scrollTop = top - (lh / 2) + (h / 2);
    }
  }

  return (
    <>
      <div className="sb-header">
        <button
          className="sb-toggle-btn"
          onClick={toggleSidebar}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <i className={`ti ${isOpen ? 'ti-chevrons-left' : 'ti-chevrons-right'}`}></i>
        </button>
        {isOpen && <span className="sb-title">Overview</span>}
      </div>
      {isOpen && (
        <div className="sb-body">
          <SbSection title="Party"    view="party"    combatants={pcs}      activeId={activeId} onScrollTo={scrollToC} />
          <SbSection title="Monsters" view="monsters" combatants={monsters} activeId={activeId} onScrollTo={scrollToC} />
        </div>
      )}
    </>
  );
}
