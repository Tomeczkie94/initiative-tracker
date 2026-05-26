import { useApp } from '../context.jsx';

export default function MultiBar() {
  const { state, setAoeAmt, applyAoe, selectAllEnemies, clearSelection } = useApp();
  const sel = Object.values(state.selected).filter(Boolean).length;

  return (
    <div className="multi-bar">
      <span className="multi-lbl"><i className="ti ti-checkboxes"></i>&nbsp;MULTI-TARGET MODE</span>
      <span style={{fontSize:'11px',color:'var(--text-md)'}}>{sel} selected</span>
      <input
        className="hp-amt"
        style={{width:'60px'}}
        type="number"
        min="0"
        value={state.aoeAmt}
        onChange={e => setAoeAmt(parseInt(e.target.value) || 0)}
        title="Damage amount"
      />
      <button
        className="btn btn-sm btn-red"
        onClick={applyAoe}
        disabled={sel === 0}
        style={sel === 0 ? {opacity:.5} : undefined}
      >
        Apply Damage to Selected
      </button>
      <button className="btn btn-sm" onClick={selectAllEnemies} title="Select all enemies">All Enemies</button>
      <button className="btn btn-sm" onClick={clearSelection} title="Deselect all">Clear</button>
    </div>
  );
}
