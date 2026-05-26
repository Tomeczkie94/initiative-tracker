import { useRef, useEffect } from 'react';
import { useApp } from '../context.jsx';

const SLOT_LEVELS = [1,2,3,4,5,6,7,8];

export default function AddForm() {
  const { state, confirmAdd, toggleAddForm, setAddFormType } = useApp();
  const isPC = state.addFormType === 'pc';
  const e = state.formErrors;

  const nameRef = useRef(null);
  const subRef = useRef(null);
  const initRef = useRef(null);
  const acRef = useRef(null);
  const mhpRef = useRef(null);
  const hpRef = useRef(null);
  const thpRef = useRef(null);
  const notesRef = useRef(null);
  const slotRefs = useRef({});
  const legRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  function handleAdd() {
    const slotsSpec = {};
    if (!isPC) {
      SLOT_LEVELS.forEach(k => {
        const v = parseInt(slotRefs.current[k]?.value) || 0;
        if (v > 0) slotsSpec[k] = v;
      });
    }

    const result = confirmAdd({
      name: nameRef.current?.value.trim() || '',
      subname: subRef.current?.value.trim() || '',
      init: parseInt(initRef.current?.value) || 0,
      ac: parseInt(acRef.current?.value),
      maxHp: parseInt(mhpRef.current?.value),
      hp: parseInt(hpRef.current?.value),
      tempHp: parseInt(thpRef.current?.value) || 0,
      notes: notesRef.current?.value || '',
      type: isPC ? 'pc' : 'enemy',
      slotsSpec: isPC ? {} : slotsSpec,
      legMax: isPC ? 0 : (parseInt(legRef.current?.value) || 0),
    });

    if (result) {
      // reset form for next entry
      if (nameRef.current) nameRef.current.value = '';
      if (subRef.current) subRef.current.value = '';
      if (initRef.current) initRef.current.value = '0';
      if (acRef.current) acRef.current.value = '10';
      if (mhpRef.current) mhpRef.current.value = '1';
      if (hpRef.current) hpRef.current.value = '';
      if (thpRef.current) thpRef.current.value = '0';
      if (notesRef.current) notesRef.current.value = '';
      SLOT_LEVELS.forEach(k => { if (slotRefs.current[k]) slotRefs.current[k].value = '0'; });
      if (legRef.current) legRef.current.value = '0';
      nameRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.target.matches('textarea')) handleAdd();
  }

  return (
    <div className="panel-block" id="add-form-panel" onKeyDown={handleKeyDown}>
      <div className="panel-title"><i className="ti ti-user-plus"></i>Add Combatant</div>
      <div className="type-tgl">
        <button className={`type-btn ${isPC ? 's-pc' : ''}`} onClick={() => setAddFormType('pc')}>
          PC (Player Character)
        </button>
        <button className={`type-btn ${!isPC ? 's-en' : ''}`} onClick={() => setAddFormType('enemy')}>
          Enemy / NPC
        </button>
      </div>
      <div className="form-grid">
        <div className="fg span2">
          <div className="flbl">Name *</div>
          <input className={`finp2 ${e.name ? 'err' : ''}`} ref={nameRef}
            placeholder={isPC ? 'e.g. Kaelindra Moonwhisper' : 'e.g. Vampire #2, Wraith'} />
          {e.name && <div className="ferr">{e.name}</div>}
          {e.namew && <div className="fwarn">{e.namew}</div>}
        </div>
        <div className="fg span2">
          <div className="flbl">Subtitle</div>
          <input className="finp2" ref={subRef}
            placeholder={isPC ? 'Race · Class Level' : 'CR X · Type · Size'} />
        </div>
        <div className="fg">
          <div className="flbl">Initiative</div>
          <input className="finp2" type="number" ref={initRef} defaultValue="0" />
        </div>
        <div className="fg">
          <div className="flbl">AC (Armor Class) *</div>
          <input className={`finp2 ${e.ac ? 'err' : ''}`} type="number" min="0" ref={acRef} defaultValue="10" />
          {e.ac && <div className="ferr">{e.ac}</div>}
        </div>
        <div className="fg">
          <div className="flbl">Max HP *</div>
          <input className={`finp2 ${e.mhp ? 'err' : ''}`} type="number" min="1" ref={mhpRef} defaultValue="1" />
          {e.mhp && <div className="ferr">{e.mhp}</div>}
        </div>
        <div className="fg">
          <div className="flbl">Current HP</div>
          <input className="finp2" type="number" ref={hpRef} placeholder="= Max HP" />
        </div>
        <div className="fg">
          <div className="flbl">Temp HP</div>
          <input className="finp2" type="number" min="0" ref={thpRef} defaultValue="0" />
        </div>
        <div className="fg span2">
          <div className="flbl">Notes</div>
          <textarea className="finp2 notes-ta" style={{height:'55px'}} ref={notesRef}
            placeholder="Optional starting notes..." />
        </div>
        {!isPC && (
          <>
            <div className="fg span2">
              <div className="fsec"><i className="ti ti-wand"></i>&nbsp;Spell Slots (optional)</div>
              <div className="slots-grid">
                {SLOT_LEVELS.map(k => (
                  <div key={k} className="fg">
                    <div className="flbl">Level {k}</div>
                    <input className="finp2" type="number" min="0" max="9"
                      defaultValue="0"
                      ref={el => slotRefs.current[k] = el} />
                  </div>
                ))}
              </div>
            </div>
            <div className="fg">
              <div className="fsec"><i className="ti ti-crown"></i>&nbsp;Legendary Actions (max)</div>
              <input className="finp2" type="number" min="0" max="6" ref={legRef} defaultValue="0" />
            </div>
          </>
        )}
      </div>
      <div className="form-actions">
        <button className="btn btn-green" onClick={handleAdd}>
          <i className="ti ti-plus"></i>&nbsp;Add Combatant
        </button>
        <button className="btn" onClick={toggleAddForm}>
          <i className="ti ti-x"></i>&nbsp;Cancel
        </button>
      </div>
    </div>
  );
}
