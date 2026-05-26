import { useRef } from 'react';
import { useApp } from '../context.jsx';

export default function EnvForm() {
  const { confirmEnv, toggleEnvForm } = useApp();
  const nameRef = useRef(null);
  const initRef = useRef(null);

  function handleAdd() {
    confirmEnv(nameRef.current.value.trim(), initRef.current.value);
  }

  return (
    <div className="panel-block">
      <div className="panel-title"><i className="ti ti-cloud-storm"></i>New Environment Effect</div>
      <div className="env-row">
        <div className="fg">
          <div className="flbl">Name</div>
          <input
            className="finp2"
            style={{width:'180px'}}
            ref={nameRef}
            placeholder="e.g. Curse Fog, Silence Zone"
            autoFocus
          />
        </div>
        <div className="fg">
          <div className="flbl">Initiative</div>
          <input className="finp2" style={{width:'70px'}} type="number" ref={initRef} defaultValue="0" />
        </div>
        <div className="form-actions" style={{marginTop:0}}>
          <button className="btn btn-green btn-sm" onClick={handleAdd}>
            <i className="ti ti-plus"></i>&nbsp;Add
          </button>
          <button className="btn btn-sm" onClick={toggleEnvForm}>
            <i className="ti ti-x"></i>&nbsp;Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
