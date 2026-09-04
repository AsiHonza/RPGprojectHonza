import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Shield, Crosshair, Skull, Heart, Sword, FastForward, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSkillsForWeapon, WeaponSkill } from './weaponSkills';
import { executePlayerAttack, executeEnemyTurn, CombatEnemy } from './combatEngine';
import { RACES } from '../../data/races';

export const CombatArena = ({ onVictory }: { onVictory?: () => void }) => {
  const { 
    enemies, setEnemies, 
    combatLog, setCombatLog, 
    combatAp, setCombatAp, 
    combatRound, setCombatRound,
    hp, setHp, maxHp, stats,
    equipped, inventory, setInventory, setInCombat,
    race
  } = useGameStore();

  const maxAP = RACES[race]?.trait.id === 'human_versatility' ? 4 : 3;

  const [targetId, setTargetId] = useState<string | number | null>(null);
  const [creativeAction, setCreativeAction] = useState("");
  const [isEnemyTurn, setIsEnemyTurn] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [usedRelentless, setUsedRelentless] = useState(false);
  const [dragonCooldown, setDragonCooldown] = useState(0);
  const [isCombatFinished, setIsCombatFinished] = useState(false);
  const victoryHandledRef = useRef(false);

  const allEnemiesDead = enemies.length > 0 && enemies.every(e => e.hp <= 0);
  const playerDead = hp <= 0;
  const isActionLocked = isEnemyTurn || isCombatFinished || allEnemiesDead || playerDead;

  // Scroll log to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [combatLog]);

  // Determine current weapon and its skills
  const mainHandWeaponId = equipped["hlavní ruka"];
  const mainHandWeapon = inventory.find(i => i.id === mainHandWeaponId);
  const weaponSkills = getSkillsForWeapon(mainHandWeapon?.name || mainHandWeapon?.type);

  // Auto-target the first alive enemy if none selected
  useEffect(() => {
    if (!targetId || !enemies.find(e => e.id === targetId && e.hp > 0)) {
      const firstAlive = enemies.find(e => e.hp > 0);
      if (firstAlive) setTargetId(firstAlive.id);
    }
  }, [enemies, targetId]);

  // Handle victory
  useEffect(() => {
    const aliveEnemies = enemies.filter(e => e.hp > 0);
    if (aliveEnemies.length === 0 && enemies.length > 0) {
      if (!victoryHandledRef.current) {
        victoryHandledRef.current = true;
        setIsCombatFinished(true);
        setTimeout(() => {
          handleVictory();
        }, 1200);
      }
    }
  }, [enemies]);

  const addLog = (msg: string) => {
    setCombatLog(prev => [...prev, msg]);
  };

  const handleDragonBreath = () => {
    if (isActionLocked || combatAp < 2 || dragonCooldown > 0) return;
    setCombatAp(combatAp - 2);
    setDragonCooldown(3);
    
    let newEnemies = [...enemies];
    let logStr = "🔥 **Dračí dech!** Vydechl jsi vlnu plamenů na všechny nepřátele! ";
    
    newEnemies.forEach(e => {
      if (e.hp > 0) {
        const dmg = Math.floor(Math.random() * 6) + 1 + (stats.cha ? Math.floor((stats.cha - 10) / 2) : 0);
        e.hp -= Math.max(1, dmg);
        logStr += ` [${e.name}: ${dmg} dmg]`;
      }
    });
    
    setEnemies(newEnemies);
    addLog(logStr);
    
    setTimeout(() => {
      handleEnemyTurn(newEnemies);
    }, 1500);
  };

  
  const handleUsePotion = (potion: any) => {
    if (isActionLocked || combatAp < 1) return;
    
    setCombatAp(prev => prev - 1);
    const healAmount = potion.healing_amount || 25;
    setHp(prev => Math.min(maxHp, prev + healAmount));
    
    // Remove from inventory
    setInventory(prev => prev.filter(i => i.id !== potion.id));
    
    setCombatLog(prev => [...prev, `**TY**: Vypil jsi ${potion.name} a obnovil si ${healAmount} HP.`]);
    
    // Trigger enemy turn if AP is 0
    if (combatAp - 1 <= 0) {
      setTimeout(() => {
        setIsEnemyTurn(true);
        processEnemyTurn();
      }, 1000);
    }
  };

  const handlePlayerAction = (skill: WeaponSkill) => {
    if (isActionLocked || combatAp < skill.apCost) return;
    if (!targetId) {
      addLog("⚠️ Musíš vybrat cíl!");
      return;
    }

    setCombatAp(combatAp - skill.apCost);
    
    // Execute attack
    const { updatedEnemies, logEntry, hit } = executePlayerAttack(skill, targetId, enemies, stats, race);
    setEnemies(updatedEnemies);
    addLog(logEntry);
  };

  const endTurn = () => {
    if (isActionLocked) return;
    setIsEnemyTurn(true);
    addLog("⏳ Konec tvého tahu. Nepřátelé jednají...");

    setTimeout(() => {
      const aliveEnemies = enemies.filter(e => e.hp > 0);
      if (aliveEnemies.length > 0) {
        const { updatedPlayerHp, logEntries, updatedEnemies, usedRelentlessEndurance } = executeEnemyTurn(enemies, hp, race, usedRelentless);
        setHp(Math.max(updatedPlayerHp, 0));
        setEnemies(updatedEnemies);
        setUsedRelentless(usedRelentlessEndurance);
        logEntries.forEach(l => addLog(l));
      }
      
      // Start next round
      setCombatRound(combatRound + 1);
      setDragonCooldown(prev => Math.max(0, prev - 1));
      setCombatAp(maxAP); // Reset AP
      setIsEnemyTurn(false);
      addLog(`⚔️ --- Kolo ${combatRound + 1} ---`);
    }, 1200);
  };

  const handleCreativeAction = () => {
    if (!creativeAction.trim()) return;
    if (combatAp < 1) return;
    
    // In the future, this calls the LLM. For now, it's a placeholder local calculation or just sends action.
    setCombatAp(combatAp - 1);
    addLog(`📝 *Kreativní pokus:* ${creativeAction}`);
    addLog("🎲 *Vypravěč vyhodnocuje tvou akci...* (Bude napojeno na AI)");
    setCreativeAction("");
  };

  const handleVictory = () => {
    addLog("🏆 Všichni nepřátelé poraženi! Vyhrál jsi boj.");
    if (onVictory) {
      onVictory();
    } else {
      setTimeout(() => {
        setInCombat(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f6e6]/95 backdrop-blur-md rounded-2xl border-2 border-red-900/30 shadow-2xl overflow-hidden font-lora relative">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-[#f9f6e6]/90 to-[#e5dfc5]/95 pointer-events-none" />

      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/90 to-red-950/90 border-b border-red-900/50 p-3 z-10 flex justify-between items-center shadow-md">
        <h2 className="font-cinzel font-bold text-red-50 text-lg flex items-center gap-2">
          <Sword className="animate-pulse" size={20} /> TAKTICKÝ BOJ
        </h2>
        <div className="text-red-200/90 text-xs uppercase tracking-widest font-bold">Kolo {combatRound}</div>
      </div>

      {/* Arena: Enemies */}
      <div className="p-4 z-10 flex-1 flex flex-col justify-end">
        <div className="flex flex-wrap gap-4 justify-center items-end h-full mb-6">
          <AnimatePresence>
            {enemies.map((enemy: CombatEnemy) => {
              const isTarget = targetId === enemy.id;
              const isDead = enemy.hp <= 0;
              return (
                <motion.div 
                  key={enemy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, scale: isTarget && !isDead ? 1.05 : 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => !isDead && setTargetId(enemy.id)}
                  className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer w-40 sm:w-48 shadow-lg
                      ${isDead ? 'border-amber-900/20 bg-[#e5dfc5]/50 grayscale opacity-50' : 
                        isTarget ? 'border-red-600 bg-white/90 shadow-red-600/30 scale-105' : 'border-amber-900/30 bg-[#fdfbf2]/90 hover:border-red-700/50 hover:bg-white'
                      }`}
                >
                  {isTarget && !isDead && (
                    <div className="absolute -top-3 -right-3 text-red-500 animate-bounce">
                      <Crosshair size={24} />
                    </div>
                  )}

                  <div className="font-cinzel font-bold text-sm text-slate-900 text-center mb-2 truncate">
                    {enemy.name}
                  </div>
                  
                  {/* HP Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-slate-600 mb-1 font-bold">
                      <span>HP</span>
                      <span>{Math.max(0, enemy.hp)} / {enemy.max_hp}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 border border-slate-300 shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${enemy.hp < enemy.max_hp * 0.3 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.max(0, (enemy.hp / enemy.max_hp) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Intent / Status */}
                  {!isDead ? (
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded text-red-400 border border-red-900/30">
                        {enemy.intent === "attack" || enemy.intent === "heavy_attack" ? (
                          <><Sword size={12} /> {enemy.intentDamage} DMG</>
                        ) : enemy.intent === "defend" ? (
                          <><Shield size={12} /> OBRANA</>
                        ) : (
                          <span className="text-slate-500">ČEKÁ</span>
                        )}
                      </div>
                      {enemy.status && enemy.status !== "none" && (
                        <div className="text-amber-500 font-bold uppercase text-[10px]">
                          {enemy.status}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 text-xs font-bold uppercase flex justify-center items-center gap-1">
                      <Skull size={12} /> Mrtvý
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Combat Log */}
      <div className="h-32 sm:h-40 bg-black/60 border-t border-b border-red-900/30 overflow-y-auto p-3 z-10 text-xs sm:text-sm text-slate-300 font-lora leading-relaxed">
        {combatLog.map((log, i) => (
          <div key={i} className={`mb-1.5 ${log.includes('zasáhl tě') || log.includes('ztratil') ? 'text-red-400 font-semibold' : log.includes('Trefa') || log.includes('zasáhl') ? 'text-emerald-400' : 'text-slate-300'}`}>
            <span dangerouslySetInnerHTML={{__html: log.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')}} />
          </div>
        ))}
        {isEnemyTurn && (
          <div className="text-amber-500/70 italic animate-pulse">
            Nepřátelé provádí své akce...
          </div>
        )}
        <div ref={logEndRef} />
      </div>

      {/* Action Bar (Player UI) */}
      <div className="bg-[#f9f6e6] p-3 sm:p-4 z-10 flex flex-col sm:flex-row gap-4 border-t-4 border-red-900/40 relative">
        {/* Player Status */}
        <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2 sm:min-w-[120px]">
          <div>
            <div className="text-[10px] text-amber-900 font-bold uppercase tracking-wider mb-0.5">Tvoje zdraví</div>
            <div className="flex items-center gap-1 text-red-600 font-bold font-cinzel text-lg">
              <Heart size={16} className={hp < maxHp * 0.3 ? 'animate-bounce' : ''} />
              {hp} / {maxHp}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-amber-900 font-bold uppercase tracking-wider mb-0.5">Akce (AP)</div>
            <div className="flex gap-1">
              {Array.from({length: maxAP}, (_, i) => i + 1).map(i => (
                <div key={i} className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-blue-800 ${i <= combatAp ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-blue-900/20'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex-1">
          <div className="text-[10px] text-amber-900 font-bold uppercase tracking-wider mb-2">Tvé dovednosti ({mainHandWeapon?.name || "Beze zbraně"})</div>
          <div className="flex flex-wrap gap-2">
            {/* Dragon Breath */}
            {RACES[race]?.trait.id === 'dragon_breath' && (
              <button
                disabled={isActionLocked || combatAp < 2 || dragonCooldown > 0}
                onClick={handleDragonBreath}
                className={`flex flex-col items-start p-2 rounded-lg border-2 transition-all min-w-[110px]
                  ${isActionLocked || combatAp < 2 || dragonCooldown > 0 ? 'bg-slate-200 border-slate-300 opacity-50 cursor-not-allowed' : 'bg-red-50 border-red-900/20 hover:border-red-600 shadow-sm'}`}
              >
                <div className="flex justify-between w-full items-center mb-1">
                  <span className="text-base">🔥</span>
                  <div className="flex">
                    <div className={`w-2 h-2 rounded-full border border-blue-800 ${combatAp >= 1 ? 'bg-blue-500' : 'bg-blue-900/20'}`} />
                    <div className={`w-2 h-2 rounded-full border border-blue-800 ${combatAp >= 2 ? 'bg-blue-500' : 'bg-blue-900/20'}`} />
                  </div>
                </div>
                <div className="text-left w-full">
                  <div className="text-xs font-bold text-red-900 font-cinzel leading-tight">Dračí Dech</div>
                  <div className="text-[9px] text-red-700 leading-tight mt-0.5">AoE Oheň</div>
                </div>
                {dragonCooldown > 0 && <div className="text-[10px] text-red-600 font-bold mt-1">🔄 CD: {dragonCooldown}</div>}
              </button>
            )}
            {weaponSkills.map(skill => (
              <button
                key={skill.id}
                disabled={isActionLocked || combatAp < skill.apCost}
                onClick={() => handlePlayerAction(skill)}
                className={`flex flex-col items-start p-2 rounded-lg border-2 transition-all min-w-[110px]
                  ${isActionLocked || combatAp < skill.apCost ? 'bg-slate-200 border-slate-300 opacity-50 cursor-not-allowed' : 'bg-white border-amber-900/20 hover:border-amber-600 hover:bg-amber-50 shadow-sm'}`}
              >
                <div className="flex justify-between w-full items-center mb-1">
                  <span className="text-base">{skill.icon}</span>
                  <div className="flex gap-0.5">
                    {Array(skill.apCost).fill(0).map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />)}
                  </div>
                </div>
                <span className="font-cinzel font-bold text-slate-900 text-xs text-left leading-tight">{skill.name}</span>
                <span className="text-[9px] text-slate-500 mt-0.5">{skill.damageDice !== "0" ? `${skill.damageDice} dmg` : 'Podpora'}</span>
              </button>
            ))}
          
              {/* Potions */}
              {inventory.filter(i => i && (i.type === 'lektvar' || (i.name && i.name.toLowerCase().includes('lektvar')))).map(potion => (
                <button
                  key={potion.id}
                  disabled={isActionLocked || combatAp < 1}
                  onClick={() => handleUsePotion(potion)}
                  className={`flex flex-col items-start p-2 rounded-lg border-2 transition-all min-w-[110px]
                    ${isActionLocked || combatAp < 1 ? 'bg-slate-200 border-slate-300 opacity-50 cursor-not-allowed' : 'bg-emerald-50 border-emerald-900/20 hover:border-emerald-600 hover:bg-emerald-100 shadow-sm'}`}
                >
                  <div className="flex justify-between w-full items-center mb-1">
                    <span className="text-base">🧪</span>
                    <div className="flex gap-0.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                  </div>
                  <span className="font-cinzel font-bold text-emerald-900 text-xs text-left leading-tight truncate w-[85px]">{potion.name}</span>
                  <span className="text-[9px] text-emerald-700 mt-0.5">Léčení: {potion.healing_amount || 25} HP</span>
                </button>
              ))}
</div>
        </div>

        {/* End Turn & Creative Action */}
        <div className="flex flex-row sm:flex-col gap-2 sm:min-w-[180px] justify-between">
          <button 
            onClick={endTurn}
            disabled={isActionLocked}
            className={`flex-1 font-bold font-cinzel rounded-xl flex items-center justify-center gap-2 p-2 sm:py-3 transition-colors text-sm shadow-md ${allEnemiesDead ? 'bg-emerald-800 text-white cursor-not-allowed opacity-90' : 'bg-red-800 hover:bg-red-700 text-white disabled:opacity-50 disabled:bg-red-950/40 disabled:cursor-not-allowed'}`}
          >
            {allEnemiesDead ? (
              <>
                <Sparkles size={16} className="animate-spin" /> Vítězství! Vyhodnocuji...
              </>
            ) : isEnemyTurn ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Tah nepřátel...
              </>
            ) : (
              <>
                <FastForward size={16} /> Konec tahu
              </>
            )}
          </button>
          
          <div className="flex-1 relative group">
            <input 
              type="text"
              value={creativeAction}
              onChange={e => setCreativeAction(e.target.value)}
              placeholder="Napiš šílený nápad..."
              disabled={isActionLocked || combatAp < 1}
              onKeyDown={e => e.key === 'Enter' && handleCreativeAction()}
              className="w-full bg-white/80 border-2 border-amber-900/20 rounded-lg p-2 text-xs font-lora outline-none focus:border-amber-500 pr-8 disabled:opacity-50 h-full"
            />
            <button 
              onClick={handleCreativeAction}
              disabled={isActionLocked || combatAp < 1 || !creativeAction.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-500 disabled:opacity-30"
            >
              <Sparkles size={14} />
            </button>
            <div className="absolute bottom-full left-0 mb-1 w-48 bg-slate-900 text-amber-100 text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              Kreativní akce (1 AP): Využije prostředí nebo nestandardní taktiku. Vypravěč určí výsledek.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
