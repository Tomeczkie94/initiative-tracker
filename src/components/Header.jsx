import { useApp } from '../context.jsx';

export default function Header() {
  const { state, nextTurn, prevTurn, sortByInit } = useApp();
  const act = state.combatants[state.turnIndex];
  const name = act ? act.name : '—';
  const tl = act ? ({pc:'· PC', enemy:'· Enemy', env:'· Effect', lair:'· Lair'}[act.type] || '') : '';
  const ni = state.combatants.length > 1 ? (state.turnIndex + 1) % state.combatants.length : -1;
  const nextName = ni >= 0 ? state.combatants[ni].name : '—';

  return (
    <div id="header">
      <div className="hdr-runda">ROUND&nbsp;<span>{state.round}</span></div>
      <div className="hdr-name" title={name}>
        {name} <span style={{fontSize:'10px',color:'var(--text-md)',fontWeight:400}}>{tl}</span>
      </div>
      {ni >= 0 && (
        <div className="next-lbl">Next&nbsp;<b>{nextName}</b></div>
      )}
      <div className="hdr-nav">
        <button className="btn btn-sm" onClick={prevTurn} title="Previous turn [←]">
          <i className="ti ti-chevron-left"></i>
        </button>
        <button className="btn btn-gold" onClick={nextTurn} title="Next Turn [Space / →]">
          <i className="ti ti-player-skip-forward"></i>&nbsp;Next Turn
        </button>
        <button className="btn btn-sm" onClick={sortByInit} title="Sort by initiative">
          <i className="ti ti-sort-descending-numbers"></i>&nbsp;Sort
        </button>
      </div>
      <div className="kbd-hint">
        <span className="kbd">Space</span>&nbsp;Next&nbsp;&nbsp;
        <span className="kbd">←→</span>&nbsp;Prev/Next
      </div>
    </div>
  );
}
