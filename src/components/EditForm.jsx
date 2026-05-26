import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context.jsx';

const SLOT_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function EditForm() {
  const { state, confirmEdit, cancelEdit } = useApp();
  const c = state.combatants.find(c => c.id === state.editId);
  const nameRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');
  const [subname, setSubname] = useState('');
  const [init, setInit] = useState(0);
  const [ac, setAc] = useState(10);
  const [maxHp, setMaxHp] = useState(1);
  const [tempHp, setTempHp] = useState(0);
  const [notes, setNotes] = useState('');
  const [slots, setSlots] = useState({});
  const [legMax, setLegMax] = useState(0);

  // Populate form when combatant changes
  useEffect(() => {
    if (!c) return;
    setName(c.name);
    setSubname(c.subname);
    setInit(c.init);
    setAc(c.ac);
    setMaxHp(c.maxHp);
    setTempHp(c.tempHp);
    setNotes(c.notes);
    setLegMax(c.legendaryMax);
    if (c.spellSlots) {
      const s = {};
      Object.keys(c.spellSlots.max).forEach(k => s[k] = c.spellSlots.max[k]);
      setSlots(s);
    } else {
      setSlots({});
    }
    setErrors({});
    nameRef.current?.focus();
  }, [state.editId]); // re-initialize when target changes

  if (!c) return null;

  const isEnemy = c.type === 'enemy';
  const isPC = c.type === 'pc';
  const hasHP = isPC || isEnemy;
  const typeLabel = {pc: 'PC', enemy: 'Enemy / NPC', env: 'Environment Effect', lair: 'Lair Action'}[c.type] || c.type;

  function handleSave() {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required.';
    if (hasHP && (isNaN(parseInt(ac)) || parseInt(ac) < 0)) errs.ac = 'AC must be ≥ 0.';
    if (hasHP && (isNaN(parseInt(maxHp)) || parseInt(maxHp) < 1)) errs.mhp = 'Max HP must be ≥ 1.';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const slotsSpec = {};
    if (isEnemy) {
      SLOT_LEVELS.forEach(k => {
        const v = parseInt(slots[k]) || 0;
        if (v > 0) slotsSpec[k] = v;
      });
    }

    confirmEdit(c.id, {
      name: name.trim(),
      subname: subname.trim(),
      init: parseInt(init) || 0,
      ac: parseInt(ac) || 0,
      maxHp: parseInt(maxHp) || 1,
      tempHp: Math.max(0, parseInt(tempHp) || 0),
      notes,
      slotsSpec: isEnemy ? slotsSpec : null,
      legMax: isEnemy ? Math.max(0, parseInt(legMax) || 0) : null,
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.target.matches('textarea')) handleSave();
    if (e.key === 'Escape') cancelEdit();
  }

  function setSlot(k, val) {
    setSlots(prev => ({...prev, [k]: Math.max(0, parseInt(val) || 0)}));
  }

  return (
    <div className="panel-block" onKeyDown={handleKeyDown}>
      <div className="panel-title">
        <i className="ti ti-pencil"></i>
        Edit {typeLabel}: <span style={{color:'var(--text-md)',fontWeight:400,marginLeft:'4px'}}>{c.name}</span>
      </div>

      <div className="form-grid">
        <div className="fg span2">
          <div className="flbl">Name *</div>
          <input
            className={`finp2 ${errors.name ? 'err' : ''}`}
            ref={nameRef}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errors.name && <div className="ferr">{errors.name}</div>}
        </div>

        <div className="fg span2">
          <div className="flbl">Subtitle</div>
          <input
            className="finp2"
            value={subname}
            onChange={e => setSubname(e.target.value)}
            placeholder="Race · Class or CR · Type"
          />
        </div>

        <div className="fg">
          <div className="flbl">Initiative</div>
          <input className="finp2" type="number" value={init} onChange={e => setInit(e.target.value)} />
        </div>

        {hasHP && (
          <>
            <div className="fg">
              <div className="flbl">AC (Armor Class) *</div>
              <input
                className={`finp2 ${errors.ac ? 'err' : ''}`}
                type="number" min="0"
                value={ac}
                onChange={e => setAc(e.target.value)}
              />
              {errors.ac && <div className="ferr">{errors.ac}</div>}
            </div>

            <div className="fg">
              <div className="flbl">Max HP *</div>
              <input
                className={`finp2 ${errors.mhp ? 'err' : ''}`}
                type="number" min="1"
                value={maxHp}
                onChange={e => setMaxHp(e.target.value)}
              />
              {errors.mhp && <div className="ferr">{errors.mhp}</div>}
            </div>

            <div className="fg">
              <div className="flbl">Temp HP</div>
              <input className="finp2" type="number" min="0" value={tempHp} onChange={e => setTempHp(e.target.value)} />
            </div>
          </>
        )}

        {!hasHP && (
          <div className="fg">
            <div className="flbl">—</div>
          </div>
        )}

        <div className="fg span2">
          <div className="flbl">Notes</div>
          <textarea
            className="finp2 notes-ta"
            style={{height:'55px'}}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="DM notes..."
          />
        </div>

        {isEnemy && (
          <>
            <div className="fg span2">
              <div className="fsec"><i className="ti ti-wand"></i>&nbsp;Spell Slots (max per level)</div>
              <div className="slots-grid">
                {SLOT_LEVELS.map(k => (
                  <div key={k} className="fg">
                    <div className="flbl">Level {k}</div>
                    <input
                      className="finp2"
                      type="number" min="0" max="9"
                      value={slots[k] || 0}
                      onChange={e => setSlot(k, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="fg">
              <div className="fsec"><i className="ti ti-crown"></i>&nbsp;Legendary Actions (max)</div>
              <input
                className="finp2"
                type="number" min="0" max="6"
                value={legMax}
                onChange={e => setLegMax(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="form-actions">
        <button className="btn btn-gold" onClick={handleSave}>
          <i className="ti ti-check"></i>&nbsp;Save Changes
        </button>
        <button className="btn" onClick={cancelEdit}>
          <i className="ti ti-x"></i>&nbsp;Cancel
        </button>
      </div>
    </div>
  );
}
