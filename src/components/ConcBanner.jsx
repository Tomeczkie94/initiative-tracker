import { useApp } from '../context.jsx';

export default function ConcBanner() {
  const { state, closeConc } = useApp();

  return (
    <div id="conc-banner">
      <div className="conc-title">⚠&nbsp;&nbsp;CONCENTRATION SAVE REQUIRED</div>
      {state.concSaves.map(s => (
        <div key={s.key} className="conc-item">
          <span className="conc-who">{s.name}</span>
          <span className="conc-info">took {s.damage} damage</span>
          <span className="conc-dc">DC {s.dc}</span>
          <span className="conc-info">Constitution save — Concentration</span>
          <button className="btn btn-sm" onClick={() => closeConc(s.key)}>
            <i className="ti ti-x"></i>
          </button>
        </div>
      ))}
    </div>
  );
}
