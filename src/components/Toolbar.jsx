import { useApp } from '../context.jsx';

export default function Toolbar() {
  const { state, rollInitiative, toggleMulti, toggleEnvForm, addLair, toggleAddForm, toggleExport, resetCombat } = useApp();

  return (
    <div id="toolbar">
      <button className="btn btn-sm btn-gold" onClick={rollInitiative} title="Roll d20 for all combatants with initiative = 0">
        <i className="ti ti-dice-d20"></i>&nbsp;Roll Initiative
      </button>
      <button className={`btn btn-sm ${state.multiMode ? 'btn-red' : ''}`} onClick={toggleMulti} title="Multi-target damage mode">
        <i className="ti ti-checkboxes"></i>&nbsp;{state.multiMode ? 'Cancel Multi' : 'Multi-target'}
      </button>
      <span style={{marginLeft:'4px',borderLeft:'1px solid var(--border)',height:'20px',display:'inline-block'}}></span>
      <button className="btn btn-sm" onClick={toggleEnvForm}>
        <i className="ti ti-cloud-storm"></i>&nbsp;Environment Effect
      </button>
      <button className="btn btn-sm" onClick={addLair}>
        <i className="ti ti-castle"></i>&nbsp;Lair Action
      </button>
      <button className="btn btn-sm btn-blue" onClick={toggleAddForm}>
        <i className="ti ti-user-plus"></i>&nbsp;Add Combatant
      </button>
      <button className="btn btn-sm" onClick={toggleExport}>
        <i className="ti ti-database-export"></i>&nbsp;Export / Import
      </button>
      <span style={{flex:1}}></span>
      <button className="btn btn-sm btn-red" onClick={resetCombat} title="Reset combat (danger)">
        <i className="ti ti-refresh"></i>&nbsp;Reset
      </button>
    </div>
  );
}
