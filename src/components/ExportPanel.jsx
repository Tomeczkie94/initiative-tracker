import { useRef } from 'react';
import { useApp } from '../context.jsx';

export default function ExportPanel() {
  const { state, toggleExport, importState, showToast } = useApp();
  const taRef = useRef(null);
  const json = JSON.stringify({round: state.round, turnIndex: state.turnIndex, combatants: state.combatants}, null, 2);

  function copyExport() {
    if (taRef.current) {
      taRef.current.select();
      document.execCommand('copy');
      showToast('Copied to clipboard.');
    }
  }

  function dlExport() {
    const blob = new Blob([json], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `walka-wedrowcy-runda${state.round}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    if (taRef.current) importState(taRef.current.value);
  }

  return (
    <div className="panel-block">
      <div className="panel-title"><i className="ti ti-database-export"></i>Export / Import Combat State</div>
      <textarea className="export-ta" ref={taRef} defaultValue={json} />
      <div className="ex-btns">
        <button className="btn btn-sm btn-gold" onClick={copyExport}>
          <i className="ti ti-copy"></i>&nbsp;Copy JSON
        </button>
        <button className="btn btn-sm" onClick={dlExport}>
          <i className="ti ti-download"></i>&nbsp;Download .json
        </button>
        <button className="btn btn-sm btn-blue" onClick={handleImport}>
          <i className="ti ti-database-import"></i>&nbsp;Import
        </button>
        <button className="btn btn-sm" onClick={toggleExport}>
          <i className="ti ti-x"></i>&nbsp;Close
        </button>
      </div>
    </div>
  );
}
