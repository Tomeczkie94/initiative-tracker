import { useApp } from '../context.jsx';
import { COVER_CLS, COVER_LABEL, COVER_BONUS, COND_CSS } from '../constants.js';
import { effAC, spellSum } from '../gameLogic.js';

const ACTIONS = [
  {k:'a', l:'Action', t:'Action'},
  {k:'b', l:'Bonus', t:'Bonus Action'},
  {k:'r', l:'Reaction', t:'Reaction'},
  {k:'m', l:'Move', t:'Movement'},
];

export default function StatusBar({ combatant: c }) {
  const { cycleCover, toggleAction, goTab, toggleConc, removeCond, toggleQuickCond } = useApp();
  const hasHP = c.type === 'pc' || c.type === 'enemy';
  const allDone = hasHP && c.actions.a && c.actions.b && c.actions.r && c.actions.m;

  const eff = effAC(c);
  const bon = COVER_BONUS[c.cover];
  const acTxt = c.cover === 'total' ? 'AC ∞ (Full)' : bon > 0 ? `AC ${eff} (${c.ac}+${bon})` : `AC ${eff}`;

  const ss = spellSum(c);
  const isDepl = ss && ss.startsWith('0/');

  return (
    <div className="status-bar">
      {hasHP && (
        <>
          <span
            className={`pill ${COVER_CLS[c.cover]}`}
            onClick={() => cycleCover(c.id)}
            title={COVER_LABEL[c.cover]}
          >
            {acTxt}
          </span>
          <span className="act-dots">
            {ACTIONS.map(a => (
              <span
                key={a.k}
                className={`act-dot ${c.actions[a.k] ? 'used' : ''}`}
                onClick={() => toggleAction(c.id, a.k)}
                title={a.t}
              >
                {a.l}
              </span>
            ))}
          </span>
        </>
      )}
      {ss !== null && (
        <span
          className={`pill pill-sp ${isDepl ? 'depleted' : ''}`}
          onClick={() => goTab(c.id, 'spells')}
          title={isDepl ? 'No spell slots remaining' : 'Spell Slots'}
        >
          <i className="ti ti-wand"></i>&nbsp;{ss}
        </span>
      )}
      {c.legendaryMax > 0 && (
        <span
          className="pill pill-leg"
          onClick={() => goTab(c.id, 'legendary')}
          title="Legendary Actions"
        >
          <i className="ti ti-crown"></i>&nbsp;{c.legendaryMax - c.legendaryUsed}/{c.legendaryMax}
        </span>
      )}
      {c.conc && (
        <span className="cb cb-conc" onClick={() => toggleConc(c.id)} title="Click to drop concentration">
          <i className="ti ti-eye"></i>&nbsp;Concentration
        </span>
      )}
      {c.conditions.map(cd => (
        <span
          key={cd}
          className={`cb ${COND_CSS[cd] || 'cb-def'}`}
          onClick={() => removeCond(c.id, cd)}
          title={`Click to remove: ${cd}`}
        >
          {cd}
        </span>
      ))}
      {allDone && <span className="done-badge">DONE</span>}
      {hasHP && (
        <span
          className="pill"
          style={{fontSize:'10px',padding:'1px 6px',fontFamily:'Lato,sans-serif'}}
          onClick={() => toggleQuickCond(c.id)}
          title="Quick-add condition without expanding"
        >
          +&nbsp;Cond
        </span>
      )}
    </div>
  );
}
