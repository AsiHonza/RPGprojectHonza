import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Shield, Crosshair, Skull, Heart, Sword, FastForward, Sparkles, AlertTriangle, Loader2, Zap, Flame, Droplets, Wind, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSkillsForWeapon, WeaponSkill } from './weaponSkills';
import { executePlayerAttack, executeEnemyTurn, executePlayerClassSkill, tickPlayerStatuses, CombatEnemy, ActiveStatusEffect } from './combatEngine';
import { RACES } from '../../data/races';
import { CLASS_SKILL_TREES, ClassSkill } from '../../data/classSkillTrees';
import { getBuffDamageBonus } from '../../services/economy/buffEngine';

export const CombatArena = ({ onVictory }: { onVictory?: () => void }) => {
  const { 
    enemies, setEnemies, 
    combatLog, setCombatLog, 
    combatAp, setCombatAp, 
    combatRound, setCombatRound,
    hp, setHp, maxHp, stats,
    equipped, inventory, setInventory, setInCombat,
    race, dndClass, skills, preparedSkills,
    activeBuffs, tickCombatBuffs
  } = useGameStore();

  const maxAP = RACES[race]?.trait.id === 'human_versatility' ? 4 : 3;

  const [targetId, setTargetId] = useState<string | number | null>(null);
  const [creativeAction, setCreativeAction] = useState("");
  const [isEnemyTurn, setIsEnemyTurn] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [usedRelentless, setUsedRelentless] = useState(false);
  const [dragonCooldown, setDragonCooldown] = useState(0);
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({});
  const [playerShield, setPlayerShield] = useState(0);
  const [playerStatuses, setPlayerStatuses] = useState<ActiveStatusEffect[]>([]);
  const [isCombatFinished, setIsCombatFinished] = useState(false);
  const [isAoEActive, setIsAoEActive] = useState(false);
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

  // Získání připravených třídních kouzel (max 3)
  const classTree = CLASS_SKILL_TREES[dndClass];
  const activeClassSkills: Array<{ skill: ClassSkill; rank: number; rankData: any }> = (preparedSkills || [])
    .map(skillId => {
      const skill = classTree?.skills.find(s => s.id === skillId);
      if (!skill) return null;
      const learned = (skills || []).find((s: any) => s.id === skillId);
      const rank = learned ? (typeof learned.rank === 'number' ? learned.rank : 1) : 1;
      const rankData = skill.ranks[rank - 1] || skill.ranks[0];
      return { skill, rank, rankData };
    })
    .filter(Boolean) as any[];

  // Auto-target the first alive enemy if none selected
  useEffect(() => {
    if (!targetId || !enemies.find(e => e.id === targetId && e.hp > 0)) {
      const firstAlive = enemies.find(e => e.hp > 0);
      if (firstAlive) setTargetId(firstAlive.id);
    }
  }, [enemies, targetId]);

  // Check victory condition
  useEffect(() => {
    if (enemies.length > 0 && enemies.every(e => e.hp <= 0)) {
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
    setIsAoEActive(true);
    setTimeout(() => setIsAoEActive(false), 800);
    
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
    
    if (combatAp - 2 <= 0 && newEnemies.some(e => e.hp > 0)) {
      setTimeout(() => {
        endTurn();
      }, 1200);
    }
  };

  const handleUsePotion = (potion: any) => {
    if (isActionLocked || combatAp < 1) return;
    
    setCombatAp(prev => prev - 1);
    const healAmount = potion.healing_amount || 25;
    setHp(prev => Math.min(maxHp, prev + healAmount));
    
    // Remove from inventory
    setInventory(prev => prev.filter(i => i.id !== potion.id));
    addLog(`🧪 **TY**: Vypil jsi ${potion.name} a obnovil si ${healAmount} HP.`);
    
    if (combatAp - 1 <= 0) {
      setTimeout(() => {
        endTurn();
      }, 1000);
    }
  };

  // Útok zbraní
  const handlePlayerAction = (skill: WeaponSkill) => {
    if (isActionLocked || combatAp < skill.apCost) return;
    if (!targetId) {
      addLog("⚠️ Musíš vybrat cíl!");
      return;
    }

    setCombatAp(combatAp - skill.apCost);
    
    // Execute attack with weapon status affliction support
    const weaponAffliction = (mainHandWeapon as any)?.statusAffliction;
    let { updatedEnemies, logEntry, hit } = executePlayerAttack(skill, targetId, enemies, stats, race, weaponAffliction);
    
    // Apply active blacksmith/damage buffs
    const buffDmg = getBuffDamageBonus(activeBuffs);
    if (hit && buffDmg > 0) {
      updatedEnemies = updatedEnemies.map(e => {
        if (e.id === targetId) {
          const newHp = Math.max(0, e.hp - buffDmg);
          return { ...e, hp: newHp };
        }
        return e;
      });
      logEntry += ` ✨ [Broušená zbraň: +${buffDmg} dmg]`;
    }

    setEnemies(updatedEnemies);
    addLog(logEntry);

    if (combatAp - skill.apCost <= 0 && updatedEnemies.some(e => e.hp > 0)) {
      setTimeout(() => {
        endTurn();
      }, 1200);
    }
  };

  // Seslání připraveného třídního kouzla
  const handleCastClassSkill = (skill: ClassSkill, rankData: any) => {
    const cost = skill.apCost || 1;
    const cd = skillCooldowns[skill.id] || 0;
    if (isActionLocked || combatAp < cost || cd > 0) return;

    if (skill.targetType === "single" && !targetId) {
      addLog("⚠️ Pro toto kouzlo musíš vybrat cíl!");
      return;
    }

    setCombatAp(prev => prev - cost);
    if (skill.cooldown && skill.cooldown > 0) {
      setSkillCooldowns(prev => ({ ...prev, [skill.id]: skill.cooldown || 2 }));
    }

    if (skill.targetType === "aoe") {
      setIsAoEActive(true);
      setTimeout(() => setIsAoEActive(false), 900);
    }

    const res = executePlayerClassSkill(
      skill,
      rankData,
      targetId,
      enemies,
      stats,
      hp,
      maxHp,
      dndClass
    );

    setEnemies(res.updatedEnemies);
    setHp(res.updatedPlayerHp);
    if (res.addedShield > 0) {
      setPlayerShield(prev => prev + res.addedShield);
    }
    res.logEntries.forEach(l => addLog(l));

    if (combatAp - cost <= 0 && res.updatedEnemies.some(e => e.hp > 0)) {
      setTimeout(() => {
        endTurn();
      }, 1200);
    }
  };

  const endTurn = () => {
    if (isActionLocked) return;
    setIsEnemyTurn(true);
    addLog("⏳ Konec tvého tahu. Nepřátelé jednají...");

    setTimeout(() => {
      const aliveEnemies = enemies.filter(e => e.hp > 0);
      if (aliveEnemies.length > 0) {
        const { updatedPlayerHp, updatedShield, logEntries, updatedEnemies, usedRelentlessEndurance } = executeEnemyTurn(
          enemies, hp, race, usedRelentless, playerShield, 0
        );
        setHp(Math.max(updatedPlayerHp, 0));
        setPlayerShield(updatedShield);
        setEnemies(updatedEnemies);
        setUsedRelentless(usedRelentlessEndurance);
        logEntries.forEach(l => addLog(l));
      }
      
      // Start next round
      setCombatRound(combatRound + 1);
      setDragonCooldown(prev => Math.max(0, prev - 1));
      
      // Snížení cooldownů třídních kouzel o 1
      setSkillCooldowns(prev => {
        const next: Record<string, number> = {};
        for (const k in prev) {
          if (prev[k] > 1) next[k] = prev[k] - 1;
        }
        return next;
      });

      // Tick DoT na hráči
      if (playerStatuses.length > 0) {
        const dotRes = tickPlayerStatuses(hp, playerStatuses);
        setHp(Math.max(0, dotRes.updatedPlayerHp));
        setPlayerStatuses(dotRes.updatedStatuses);
        dotRes.logEntries.forEach(l => addLog(l));
      }

      setCombatAp(maxAP); // Reset AP
      setIsEnemyTurn(false);
      addLog(`⚔️ --- Kolo ${combatRound + 1} ---`);
    }, 1200);
  };

  const handleCreativeAction = () => {
    if (!creativeAction.trim()) return;
    if (combatAp < 1) return;
    
    setCombatAp(combatAp - 1);
    addLog(`📝 *Kreativní pokus:* ${creativeAction}`);
    addLog("🎲 *Vypravěč vyhodnocuje tvou akci...* (Bude napojeno na AI)");
    setCreativeAction("");
  };

  const handleVictory = () => {
    tickCombatBuffs();
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
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="font-cinzel font-bold text-red-50 text-lg flex items-center gap-2">
            <Sword className="animate-pulse" size={20} /> TAKTICKÝ BOJ
          </h2>
          {activeBuffs.map(b => (
            <span key={b.id} className="bg-amber-500/20 text-amber-200 border border-amber-500/40 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1" title={b.description}>
              <span>{b.icon}</span>
              <span>{b.name}</span>
            </span>
          ))}
        </div>
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
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: isTarget && !isDead ? 1.05 : 1,
                    x: isAoEActive && !isDead ? [0, -5, 5, -3, 3, 0] : 0
                  }}
                  transition={{ duration: 0.3 }}
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

                  <div className="font-cinzel font-bold text-sm text-slate-900 text-center mb-1 truncate">
                    {enemy.name}
                  </div>
                  
                  {/* Status Badges */}
                  {enemy.activeStatuses && enemy.activeStatuses.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2 justify-center">
                      {enemy.activeStatuses.map((st, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] px-1.5 py-0.2 rounded-md font-bold flex items-center gap-0.5 bg-amber-100/90 border border-amber-900/30 text-amber-950 shadow-2xs"
                          title={`${st.name}: ${st.damagePerRound ? `${st.damagePerRound} dmg/kolo` : 'Aktivní'} (zbývá ${st.duration} kol)`}
                        >
                          {st.icon} {st.duration}k
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* HP Bar */}
                  <div className="w-full bg-[#f4ecd8] h-2.5 rounded-full overflow-hidden border border-amber-900/40 relative mb-2 shadow-inner">
                    <motion.div 
                      className={`h-full ${isDead ? 'bg-slate-400' : 'bg-red-700'}`} 
                      animate={{ width: `${Math.max(0, (enemy.hp / enemy.max_hp) * 100)}%` }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-slate-900 leading-none drop-shadow-xs">
                      {Math.max(0, enemy.hp)} / {enemy.max_hp}
                    </span>
                  </div>

                  {/* Intent & AC */}
                  <div className="flex justify-between items-center text-xs font-cinzel">
                    <span className="text-slate-600 flex items-center gap-1 font-bold" title="Obrana (AC)">
                      <Shield size={12} className="text-amber-800" /> {enemy.ac}
                    </span>
                    
                    {!isDead && (
                      <span className={`font-bold px-1.5 py-0.5 rounded-md text-[10px] uppercase border ${
                        enemy.intent === 'attack' ? 'bg-red-100 text-red-900 border-red-300' :
                        enemy.intent === 'heavy_attack' ? 'bg-red-200 text-red-950 border-red-500 font-extrabold' :
                        enemy.intent === 'defend' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                        'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {enemy.intent === 'attack' && `Útok (${enemy.intentDamage || '2-7'})`}
                        {enemy.intent === 'heavy_attack' && `Drť (${enemy.intentDamage || '4-11'})`}
                        {enemy.intent === 'defend' && 'Obrana'}
                        {enemy.intent === 'idle' && 'Omráčen'}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Combat Log */}
        <div className="h-32 sm:h-36 bg-[#fdfbf2]/80 rounded-xl border border-amber-900/20 p-2 sm:p-3 overflow-y-auto font-lora text-xs flex flex-col gap-1 shadow-inner custom-scrollbar">
          {combatLog.map((log: string, idx: number) => (
            <div key={idx} className="text-slate-800 border-b border-amber-900/5 pb-0.5 last:border-0 leading-tight">
              {log}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Footer: Player Actions */}
      <div className="bg-[#f4ecd8] border-t-2 border-amber-900/20 p-3 sm:p-4 z-10 flex flex-col sm:flex-row gap-3">
        {/* Left: Player Profile & AP */}
        <div className="flex sm:flex-col justify-between sm:justify-center items-center sm:items-start min-w-[140px] pr-2 sm:border-r border-amber-900/20">
          <div>
            <div className="flex items-center gap-1.5 font-cinzel font-bold text-amber-950 text-sm">
              <Heart size={16} className="text-red-700 fill-red-700" />
              <span>{hp} / {maxHp}</span>
              {playerShield > 0 && (
                <span className="text-blue-700 text-xs font-bold" title="Štít">(+{playerShield} 🛡️)</span>
              )}
            </div>
            
            {/* Player Statuses */}
            {playerStatuses.length > 0 && (
              <div className="flex gap-1 mt-1">
                {playerStatuses.map((st, i) => (
                  <span key={i} className="text-[9px] px-1 bg-amber-100 border border-amber-800/30 rounded font-bold" title={st.name}>
                    {st.icon} {st.duration}k
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 mt-1 sm:mt-2">
            <span className="text-xs font-cinzel font-bold text-slate-700 mr-1">AP:</span>
            {Array(maxAP).fill(0).map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full border border-blue-900 transition-all ${i < combatAp ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-slate-300 opacity-50'}`} 
              />
            ))}
          </div>
        </div>

        {/* Middle: Skills & Spells */}
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          <div className="text-[10px] text-amber-900 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Bojové schopnosti</span>
            <span className="text-slate-500 font-normal">Připravená kouzla & Zbraň</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Dragon Breath (Racial) */}
            {RACES[race]?.trait.id === 'dragon_breath' && (
              <button
                disabled={isActionLocked || combatAp < 2 || dragonCooldown > 0}
                onClick={handleDragonBreath}
                className={`flex flex-col items-start p-2 rounded-lg border-2 transition-all min-w-[105px]
                  ${isActionLocked || combatAp < 2 || dragonCooldown > 0 ? 'bg-slate-200 border-slate-300 opacity-50 cursor-not-allowed' : 'bg-red-50 border-red-900/20 hover:border-red-600 shadow-xs'}`}
              >
                <div className="flex justify-between w-full items-center mb-1">
                  <span className="text-base">🔥</span>
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div className="text-xs font-bold text-red-900 font-cinzel leading-tight">Dračí Dech</div>
                <div className="text-[9px] text-red-700 leading-tight mt-0.5">[AoE] Oheň</div>
                {dragonCooldown > 0 && <div className="text-[9px] text-red-600 font-bold mt-0.5">⏳ CD: {dragonCooldown}</div>}
              </button>
            )}

            {/* Připravená třídní kouzla (Prepared Spells) */}
            {activeClassSkills.map(({ skill, rank, rankData }) => {
              const cd = skillCooldowns[skill.id] || 0;
              const cost = skill.apCost || 1;
              const isDisabled = isActionLocked || combatAp < cost || cd > 0;
              const isAoE = skill.targetType === "aoe";

              return (
                <button
                  key={skill.id}
                  disabled={isDisabled}
                  onClick={() => handleCastClassSkill(skill, rankData)}
                  className={`flex flex-col items-start p-2 rounded-lg border-2 transition-all min-w-[110px] relative
                    ${isDisabled ? 'bg-slate-200 border-slate-300 opacity-50 cursor-not-allowed' : 'bg-amber-50 border-amber-900/30 hover:border-amber-700 hover:bg-amber-100/80 shadow-xs'}`}
                >
                  <div className="flex justify-between w-full items-center mb-1">
                    <span className="text-base">✨</span>
                    <div className="flex gap-0.5">
                      {Array(cost).fill(0).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <span className="font-cinzel font-bold text-amber-950 text-xs text-left leading-tight truncate w-full">
                    {skill.name.split('(')[0]}
                  </span>
                  <span className="text-[9px] text-amber-800 mt-0.5 flex items-center gap-1 font-semibold">
                    {isAoE ? '[AoE Všichni]' : (rankData.healAmount ? `+ ${rankData.healAmount} HP` : (rankData.damageDice ? `${rankData.damageDice} dmg` : 'Podpora'))}
                  </span>
                  {cd > 0 && (
                    <div className="text-[9px] text-red-600 font-bold mt-0.5">⏳ CD: {cd}k</div>
                  )}
                </button>
              );
            })}

            {/* Zbraňové útoky */}
            {weaponSkills.map(skill => (
              <button
                key={skill.id}
                disabled={isActionLocked || combatAp < skill.apCost}
                onClick={() => handlePlayerAction(skill)}
                className={`flex flex-col items-start p-2 rounded-lg border-2 transition-all min-w-[105px]
                  ${isActionLocked || combatAp < skill.apCost ? 'bg-slate-200 border-slate-300 opacity-50 cursor-not-allowed' : 'bg-white border-amber-900/20 hover:border-amber-600 hover:bg-amber-50 shadow-xs'}`}
              >
                <div className="flex justify-between w-full items-center mb-1">
                  <span className="text-base">{skill.icon}</span>
                  <div className="flex gap-0.5">
                    {Array(skill.apCost).fill(0).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    ))}
                  </div>
                </div>
                <span className="font-cinzel font-bold text-slate-900 text-xs text-left leading-tight">{skill.name}</span>
                <span className="text-[9px] text-slate-500 mt-0.5">{skill.damageDice !== "0" ? `${skill.damageDice} dmg` : 'Podpora'}</span>
              </button>
            ))}

            {/* Lektvary z inventáře */}
            {inventory.filter(i => i && (i.type === 'lektvar' || (i.name && i.name.toLowerCase().includes('lektvar')))).map(potion => (
              <button
                key={potion.id}
                disabled={isActionLocked || combatAp < 1}
                onClick={() => handleUsePotion(potion)}
                className={`flex flex-col items-start p-2 rounded-lg border-2 transition-all min-w-[105px]
                  ${isActionLocked || combatAp < 1 ? 'bg-slate-200 border-slate-300 opacity-50 cursor-not-allowed' : 'bg-emerald-50 border-emerald-900/20 hover:border-emerald-600 hover:bg-emerald-100 shadow-xs'}`}
              >
                <div className="flex justify-between w-full items-center mb-1">
                  <span className="text-base">🧪</span>
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  </div>
                </div>
                <span className="font-cinzel font-bold text-emerald-900 text-xs text-left leading-tight truncate w-[85px]">{potion.name}</span>
                <span className="text-[9px] text-emerald-700 mt-0.5">+{potion.healing_amount || 25} HP</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: End Turn & Creative Action */}
        <div className="flex flex-row sm:flex-col gap-2 sm:min-w-[170px] justify-between">
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
              onChange={(e) => setCreativeAction(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreativeAction()}
              placeholder="Vlastní akce (1 AP)..."
              disabled={isActionLocked || combatAp < 1}
              className="w-full h-full bg-white/80 border border-amber-900/30 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-700 shadow-inner disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
