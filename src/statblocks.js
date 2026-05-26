function sl(n, s) {
  const slug = s || n.toLowerCase().replace(/'/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  return `<a class="spell-link" href="https://dnd5e.wikidot.com/spell:${slug}" target="_blank">${n}</a>`;
}

export function arcanalothHTML() {
  return `<div class="sb">
<div class="sb-name">Neferon — Arcanaloth</div>
<div class="sb-meta">Medium fiend (yugoloth), neutral evil · MM 2014 p.313</div>
<hr class="sb-hr">
<div class="sb-row">
  <span><span class="sb-l">AC</span> 17 (natural armor)</span>
  <span><span class="sb-l">HP</span> 104 (16d8+32)</span>
  <span><span class="sb-l">Speed</span> 30 ft.</span>
</div>
<div class="sb-stats">
  <div><div class="sn">SIŁ</div><div class="sv">14</div><div class="sm">+2</div></div>
  <div><div class="sn">ZRE</div><div class="sv">14</div><div class="sm">+2</div></div>
  <div><div class="sn">BUD</div><div class="sv">14</div><div class="sm">+2</div></div>
  <div><div class="sn">INT</div><div class="sv">20</div><div class="sm">+5</div></div>
  <div><div class="sn">MĄD</div><div class="sv">16</div><div class="sm">+3</div></div>
  <div><div class="sn">CHA</div><div class="sv">17</div><div class="sm">+3</div></div>
</div>
<hr class="sb-hr">
<div class="sb-row"><span><span class="sb-l">Saving Throws</span> Int +9, Wis +7, Cha +7</span></div>
<div class="sb-row"><span><span class="sb-l">Resistances</span> fire, cold; nonmagical B/P/S</span></div>
<div class="sb-row"><span><span class="sb-l">Immunities</span> acid, poison; Poisoned condition</span></div>
<div class="sb-row"><span><span class="sb-l">Senses</span> truesight 120 ft., darkvision 60 ft.</span></div>
<div class="sb-row"><span><span class="sb-l">Languages</span> Abyssal, Common, Infernal, Yugoloth; telepathy 60 ft.</span></div>
<div class="sb-row"><span><span class="sb-l">CR</span> 12 (8,400 XP)</span></div>
<hr class="sb-hr">
<div class="sb-sec"><div class="sb-stitle">TRAITS</div>
<p><strong>Magic Resistance.</strong> Advantage on saving throws against spells and magical effects.</p>
<p><strong>Innate Spellcasting</strong> (CHA DC 15). At will: ${sl('Alter Self','alter-self')}, ${sl('Darkness')}, ${sl('Detect Magic','detect-magic')}, ${sl('Detect Thoughts','detect-thoughts')}, ${sl('Dispel Magic','dispel-magic')}, ${sl('Invisibility')}, ${sl('Magic Missile','magic-missile')}, ${sl('Suggestion')}. 3/day each: ${sl('Fear')}, ${sl('Fireball')}, ${sl('Ice Storm','ice-storm')}, ${sl('Identify')}.</p>
<p><strong>Spellcasting</strong> (Wizard 16, INT DC 17, +9 to hit). Spell levels 1–8.</p>
</div>
<div class="sb-sec"><div class="sb-stitle">SPELLS — selected</div>
<p>Cantripy: ${sl('Fire Bolt','fire-bolt')}, ${sl('Mage Hand','mage-hand')}, ${sl('Minor Illusion','minor-illusion')}, ${sl('Prestidigitation')}</p>
<p>K1: ${sl('Alarm')}, ${sl('Magic Missile','magic-missile')}, ${sl('Shield')}</p>
<p>K2: ${sl('Darkness')}, ${sl('Invisibility')}, ${sl('Suggestion')}</p>
<p>K3: ${sl('Bestow Curse','bestow-curse')}, ${sl('Counterspell')}, ${sl('Dispel Magic','dispel-magic')}, ${sl('Fireball')}, ${sl('Fly')}, ${sl('Gaseous Form','gaseous-form')}</p>
<p>K4: ${sl('Arcane Eye','arcane-eye')}, ${sl('Banishment')}, ${sl('Fire Shield','fire-shield')}, ${sl('Polymorph')}</p>
<p>K5: ${sl('Contact Other Plane','contact-other-plane')}, ${sl('Hold Monster','hold-monster')}, ${sl('Wall of Force','wall-of-force')}</p>
<p>K6: ${sl('Chain Lightning','chain-lightning')}, ${sl('Disintegrate')}, ${sl('True Seeing','true-seeing')}</p>
<p>K7: ${sl('Finger of Death','finger-of-death')}, ${sl('Teleport')}</p>
<p>K8: ${sl('Dominate Monster','dominate-monster')}, ${sl('Feeblemind')}</p>
</div>
<div class="sb-sec"><div class="sb-stitle">ACTIONS</div>
<p><strong>Multiattack.</strong> Two Claw attacks or one Spellcasting action.</p>
<p><strong>Claw.</strong> +7 to hit, reach 5 ft. Hit: 8 (2d6+2) slashing + 9 (2d8) acid.</p>
<p><strong>Teleport.</strong> Magically teleports up to 60 ft. to a visible unoccupied space.</p>
</div>
</div>`;
}

export function flameSkullHTML() {
  return `<div class="sb">
<div class="sb-name">Flameskull</div>
<div class="sb-meta">Small undead, neutral evil · MM 2014 p.134</div>
<hr class="sb-hr">
<div class="sb-row">
  <span><span class="sb-l">AC</span> 13</span>
  <span><span class="sb-l">HP</span> 40 (9d8)</span>
  <span><span class="sb-l">Speed</span> 0 ft., fly 40 ft. (hover)</span>
</div>
<div class="sb-stats">
  <div><div class="sn">SIŁ</div><div class="sv">1</div><div class="sm">−5</div></div>
  <div><div class="sn">ZRE</div><div class="sv">17</div><div class="sm">+3</div></div>
  <div><div class="sn">BUD</div><div class="sv">10</div><div class="sm">+0</div></div>
  <div><div class="sn">INT</div><div class="sv">16</div><div class="sm">+3</div></div>
  <div><div class="sn">MĄD</div><div class="sv">10</div><div class="sm">+0</div></div>
  <div><div class="sn">CHA</div><div class="sv">11</div><div class="sm">+0</div></div>
</div>
<hr class="sb-hr">
<div class="sb-row"><span><span class="sb-l">Resistances</span> fire; nonmagical B/P/S</span></div>
<div class="sb-row"><span><span class="sb-l">Immunities</span> cold, lightning, poison; many undead conditions</span></div>
<div class="sb-row"><span><span class="sb-l">Senses</span> darkvision 60 ft.</span></div>
<div class="sb-row"><span><span class="sb-l">CR</span> 4 (1,100 XP)</span></div>
<hr class="sb-hr">
<div class="sb-sec"><div class="sb-stitle">TRAITS</div>
<p><strong>Rejuvenation.</strong> If destroyed, rises again in 1 hour with 1 HP unless holy water or ${sl('Dispel Evil and Good','dispel-evil-and-good')} is used on its remains.</p>
<p><strong>Magic Resistance.</strong> Advantage on saving throws against spells and magical effects.</p>
<p><strong>Spellcasting</strong> (Wizard 5, INT DC 13, +5 to hit).</p>
</div>
<div class="sb-sec"><div class="sb-stitle">SPELLS</div>
<p>Level 1 (3 slots): ${sl('Magic Missile','magic-missile')}, ${sl('Shield')}</p>
<p>Level 2 (2 slots): ${sl('Blur')}, ${sl('Flaming Sphere','flaming-sphere')}</p>
<p>Level 3 (1 slot): ${sl('Fireball')}</p>
</div>
<div class="sb-sec"><div class="sb-stitle">ACTIONS</div>
<p><strong>Multiattack.</strong> Two Fire Ray attacks.</p>
<p><strong>Fire Ray.</strong> +5 to hit, range 30 ft. Hit: 10 (3d6) fire damage.</p>
</div>
</div>`;
}
