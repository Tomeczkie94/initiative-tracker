import { useApp } from '../context.jsx';
import { CONDITIONS } from '../constants.js';

export default function QuickCondPanel({ combatant }) {
  const { toggleCond, toggleQuickCond } = useApp();
  const active = new Set(combatant.conditions);

  return (
    <div className="quick-cond-panel">
      {CONDITIONS.map(cd => (
        <button
          key={cd}
          className={`qc-btn ${active.has(cd) ? 'on' : ''}`}
          onClick={() => toggleCond(combatant.id, cd)}
        >
          {cd}
        </button>
      ))}
      <button className="btn btn-sm" style={{marginLeft:'auto'}} onClick={() => toggleQuickCond(combatant.id)}>
        <i className="ti ti-x"></i>
      </button>
    </div>
  );
}
