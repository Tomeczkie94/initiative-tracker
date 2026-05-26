import { useApp } from '../context.jsx';
import { CONDITIONS, COND_CSS } from '../constants.js';
import { arcanalothHTML, flameSkullHTML } from '../statblocks.js';

// ---- HP Tab ----
export function HpTab({ c }) {
  const { editHp, editMaxHp, editTempHp, editAc, setCover } = useApp();
  return (
    <>
      <div className="frow">
        <label>Current HP</label>
        <input className="finp" type="number" value={c.hp}
          onChange={e => editHp(c.id, e.target.value)} />
      </div>
      <div className="frow">
        <label>Max HP</label>
        <input className="finp" type="number" min="1" value={c.maxHp}
          onChange={e => editMaxHp(c.id, e.target.value)} />
      </div>
      <div className="frow">
        <label>Temp HP</label>
        <input className="finp" type="number" min="0" value={c.tempHp}
          onChange={e => editTempHp(c.id, e.target.value)} />
      </div>
      <div className="frow">
        <label>Armor Class</label>
        <input className="finp" type="number" min="0" value={c.ac}
          onChange={e => editAc(c.id, e.target.value)} />
      </div>
      <div className="frow">
        <label>Cover</label>
        <select className="fsel" value={c.cover} onChange={e => setCover(c.id, e.target.value)}>
          <option value="none">No Cover</option>
          <option value="half">Half Cover (+2 AC &amp; DEX)</option>
          <option value="three">¾ Cover (+5 AC &amp; DEX)</option>
          <option value="total">Full Cover (cannot be targeted)</option>
        </select>
      </div>
    </>
  );
}

// ---- Conditions Tab ----
export function CondTab({ c }) {
  const { toggleCond, toggleConc } = useApp();
  const active = new Set(c.conditions);
  return (
    <>
      <div className="cond-grid">
        {CONDITIONS.map(cd => (
          <button
            key={cd}
            className={`cond-btn ${active.has(cd) ? 'on' : ''}`}
            onClick={() => toggleCond(c.id, cd)}
          >
            {cd}
          </button>
        ))}
      </div>
      <div className="conc-row">
        <button className={`btn btn-sm ${c.conc ? 'btn-blue' : ''}`} onClick={() => toggleConc(c.id)}>
          <i className={`ti ti-eye${c.conc ? '' : '-off'}`}></i>&nbsp;Concentration
        </button>
        <span className={`conc-ind ${c.conc ? 'on' : ''}`}>
          {c.conc ? 'Active — DC = max(10, ½ damage) on each hit' : 'Inactive'}
        </span>
      </div>
    </>
  );
}

// ---- Spell Slots Tab ----
export function SpellTab({ c }) {
  const { toggleSlot, longRest, burnAll } = useApp();
  if (!c.spellSlots) return <p style={{color:'var(--text-md)'}}>No spell slots.</p>;
  const {max, used} = c.spellSlots;

  return (
    <>
      {Object.keys(max).sort((a,b)=>+a-+b).map(k => {
        const m = max[k], u = used[k] || 0, av = m - u;
        return (
          <div key={k} className="sp-row">
            <span className="sp-lbl">Level {k}</span>
            <span className="sp-pips">
              {Array.from({length: m}, (_, i) => (
                <span
                  key={i}
                  className={`sp-pip ${i < av ? 'avail' : 'used'}`}
                  onClick={() => toggleSlot(c.id, k, i)}
                  title={`Level ${k}, slot ${i+1}`}
                />
              ))}
            </span>
            <span className="sp-cnt">{av}/{m}</span>
          </div>
        );
      })}
      <div className="sp-btns">
        <button className="btn btn-sm btn-green" onClick={() => longRest(c.id)}>
          <i className="ti ti-moon"></i>&nbsp;Long Rest
        </button>
        <button className="btn btn-sm btn-red" onClick={() => burnAll(c.id)}>
          <i className="ti ti-flame"></i>&nbsp;Expend All
        </button>
      </div>
    </>
  );
}

// ---- Statblock Tab ----
export function StatblockTab({ c }) {
  let html = '';
  if (c.monster === 'arcanaloth') html = arcanalothHTML();
  else if (c.monster === 'flameskull') html = flameSkullHTML();
  else return <p style={{color:'var(--text-md)'}}>No statblock available.</p>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

// ---- Legendary Tab ----
export function LegendaryTab({ c }) {
  const { toggleLeg, resetLeg, editLegMax } = useApp();
  const m = c.legendaryMax, u = c.legendaryUsed;

  return (
    <>
      <div className="frow">
        <label>Max Legendary Actions</label>
        <input className="finp" type="number" min="0" max="6" value={m}
          onChange={e => editLegMax(c.id, e.target.value)} />
      </div>
      {m > 0 ? (
        <>
          <div style={{fontSize:'11px',color:'var(--text-md)',marginBottom:'4px'}}>Available: {m-u} / {m}</div>
          <div className="leg-pips">
            {Array.from({length: m}, (_, i) => (
              <span
                key={i}
                className={`leg-pip ${i < (m - u) ? 'avail' : 'used'}`}
                onClick={() => toggleLeg(c.id, i)}
                title={`Legendary Action ${i+1}`}
              />
            ))}
          </div>
          <div style={{marginTop:'8px'}}>
            <button className="btn btn-sm" onClick={() => resetLeg(c.id)}>
              <i className="ti ti-refresh"></i>&nbsp;Reset
            </button>
          </div>
        </>
      ) : (
        <div style={{color:'var(--text-md)',fontSize:'11px',marginTop:'4px'}}>
          Set Max &gt; 0 to enable legendary actions (homebrew option).
        </div>
      )}
    </>
  );
}

// ---- Death Saves Tab ----
export function DeathTab({ c }) {
  const { deathTog, deathReset } = useApp();
  return (
    <div style={{marginBottom:'10px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
        <span style={{fontSize:'11px',color:'#4aca4a',width:'70px'}}>Success</span>
        <div style={{display:'flex',gap:'5px'}}>
          {[0,1,2].map(i => (
            <span
              key={i}
              className={`dc-circle suc ${i < c.deathS ? 'on' : ''}`}
              onClick={() => deathTog(c.id, 's', i)}
              title={`Success ${i+1}`}
            />
          ))}
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
        <span style={{fontSize:'11px',color:'#ca4040',width:'70px'}}>Failure</span>
        <div style={{display:'flex',gap:'5px'}}>
          {[0,1,2].map(i => (
            <span
              key={i}
              className={`dc-circle fail ${i < c.deathF ? 'on' : ''}`}
              onClick={() => deathTog(c.id, 'f', i)}
              title={`Failure ${i+1}`}
            />
          ))}
        </div>
      </div>
      <div style={{marginTop:'12px'}}>
        <button className="btn btn-sm" onClick={() => deathReset(c.id)}>
          <i className="ti ti-refresh"></i>&nbsp;Reset Saves
        </button>
      </div>
    </div>
  );
}

// ---- Notes Tab ----
export function NotesTab({ c }) {
  const { setNotes } = useApp();
  return (
    <textarea
      className="notes-ta"
      value={c.notes}
      onChange={e => setNotes(c.id, e.target.value)}
      placeholder="DM notes: spell durations, targets, tactics..."
    />
  );
}
