import React, { useState } from 'react';
import { X, Sparkles, Zap, Shield, Swords, Flame, HeartHandshake, RotateCcw, Check, Plus, AlertCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { CLASS_SKILL_TREES, ClassSkill } from '../../data/classSkillTrees';

export const SkillsModal = ({ isOpen, onClose, setCustomAction }: any) => {
  const { 
    dndClass, skills, setSkills, skillPoints, setSkillPoints,
    preparedSkills, setPreparedSkills, gold, setGold 
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'passive'>('all');
  const [respecConfirmOpen, setRespecConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const classTree = CLASS_SKILL_TREES[dndClass] || CLASS_SKILL_TREES["Bojovník"];
  const allSkills = classTree.skills;

  // Filtrování
  const filteredSkills = allSkills.filter(s => {
    if (activeTab === 'active') return s.type === 'active';
    if (activeTab === 'passive') return s.type === 'passive';
    return true;
  });

  // Výpočet celkově investovaných bodů pro respec
  const calculateTotalInvestedPoints = () => {
    let total = 0;
    (skills || []).forEach((s: any) => {
      const r = s.rank || 1;
      if (r === 1) total += 1;
      else if (r === 2) total += 3; // 1 + 2
      else if (r >= 3) total += 6; // 1 + 2 + 3
    });
    return total;
  };

  // Respec akce
  const handleRespec = () => {
    if (gold < 50) return;
    const refundedPoints = calculateTotalInvestedPoints();
    setGold((prev: number) => Math.max(0, prev - 50));
    setSkillPoints((prev: number) => prev + refundedPoints);
    setSkills([]);
    setPreparedSkills([]);
    setRespecConfirmOpen(false);
  };

  // Vylepšení skillu
  const handleUpgradeSkill = (skill: ClassSkill) => {
    const existing = (skills || []).find((s: any) => s.id === skill.id);
    const currentRank = existing ? (typeof existing.rank === 'number' ? existing.rank : 1) : 0;
    const nextRank = currentRank + 1;
    const cost = nextRank; // Rank 1 = 1 pt, Rank 2 = 2 pts, Rank 3 = 3 pts

    if (skillPoints < cost || nextRank > 3) return;

    setSkillPoints((prev: number) => prev - cost);
    if (existing) {
      setSkills(skills.map((s: any) => s.id === skill.id ? { ...s, rank: nextRank } : s));
    } else {
      setSkills([...skills, { id: skill.id, name: skill.name, type: skill.type, rank: 1, desc: skill.ranks[0].desc }]);
      // Pokud je to první aktivní kouzlo a máme volný slot v přípravě, rovnou ho připravíme
      if (skill.type === 'active' && (!preparedSkills || preparedSkills.length < 3)) {
        setPreparedSkills([...(preparedSkills || []), skill.id]);
      }
    }
  };

  // Přepnutí přípravy kouzla do boje
  const togglePreparedSpell = (skillId: string) => {
    const list = preparedSkills || [];
    if (list.includes(skillId)) {
      setPreparedSkills(list.filter((id: string) => id !== skillId));
    } else {
      if (list.length >= 3) {
        alert("Můžeš mít připravena maximálně 3 kouzla do boje. Nejprve jedno odeber.");
        return;
      }
      setPreparedSkills([...list, skillId]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-[#f9f6e6]/95 backdrop-blur-xl rounded-2xl border border-amber-900/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 font-lora">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-amber-900/20 bg-gradient-to-r from-amber-900/10 via-transparent to-amber-900/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-xl border border-amber-900/20 text-amber-900 shadow-xs">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-amber-950 tracking-wide flex items-center gap-2">
                Kniha Schopností <span className="text-sm px-2.5 py-0.5 rounded-md bg-amber-900/10 text-amber-900 font-normal">{dndClass}</span>
              </h2>
              <p className="text-xs text-slate-600">
                Rozvíjej strom bojových umění a připrav si 3 kouzla do arény.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Respec Button */}
            <button
              onClick={() => setRespecConfirmOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-amber-100/60 text-slate-700 hover:text-amber-950 border border-amber-900/20 rounded-xl text-xs font-cinzel font-bold transition shadow-2xs"
              title="Resetovat všechny investované body schopností za 50 zlaťáků"
            >
              <RotateCcw size={14} className="text-amber-800" />
              <span>Reset (50 zl.)</span>
            </button>

            <button 
              onClick={() => onClose()} 
              className="text-amber-900/60 hover:text-amber-950 p-1.5 rounded-xl hover:bg-amber-900/10 transition"
              title="Zavřít"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Respec Confirmation Modal Dialog */}
        {respecConfirmOpen && (
          <div className="p-4 bg-amber-100/90 border-b border-amber-900/30 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-950">
              <AlertCircle size={18} className="text-amber-800 shrink-0" />
              <span>Opravdu chceš zapomenout všechny schopnosti za <strong>50 zlaťáků</strong>? Vrátí se ti <strong>{calculateTotalInvestedPoints()} bodů</strong>. (Máš {gold} zl.)</span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={gold < 50}
                onClick={handleRespec}
                className="px-3 py-1 bg-amber-800 hover:bg-amber-700 text-white rounded-lg font-cinzel font-bold disabled:opacity-40"
              >
                Potvrdit reset
              </button>
              <button
                onClick={() => setRespecConfirmOpen(false)}
                className="px-3 py-1 bg-white text-slate-700 rounded-lg font-cinzel font-bold border border-slate-300"
              >
                Zrušit
              </button>
            </div>
          </div>
        )}

        {/* Prepared Spells Bar (Horní lišta přípravy 3 kouzel do boje) */}
        <div className="px-5 py-3 bg-[#fdfbf2] border-b border-amber-900/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="text-[10px] uppercase font-cinzel font-bold tracking-wider text-amber-900 flex items-center gap-1.5">
              <span>⚔️ Připravená kouzla do boje</span>
              <span className="text-slate-500 font-normal">({(preparedSkills || []).length} / 3 sloty)</span>
            </div>
            <p className="text-[11px] text-slate-600">Vyber až 3 aktivní schopnosti, které budeš moci sesílat v aréně.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {[0, 1, 2].map((slotIdx) => {
              const skillId = (preparedSkills || [])[slotIdx];
              const skill = allSkills.find(s => s.id === skillId);
              const learned = (skills || []).find((s: any) => s.id === skillId);
              const rank = learned ? (typeof learned.rank === 'number' ? learned.rank : 1) : 1;

              return (
                <div 
                  key={slotIdx}
                  className="flex-1 sm:w-36 p-1.5 rounded-xl border border-amber-900/25 bg-white/90 shadow-2xs flex items-center justify-between gap-1.5"
                >
                  {skill ? (
                    <>
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="text-xs">✨</span>
                        <div className="overflow-hidden">
                          <div className="text-[11px] font-cinzel font-bold text-amber-950 truncate leading-tight">
                            {skill.name.split('(')[0]}
                          </div>
                          <div className="text-[9px] text-slate-500 font-bold">Úr. {rank} • {skill.apCost || 1} AP</div>
                        </div>
                      </div>
                      <button
                        onClick={() => togglePreparedSpell(skill.id)}
                        className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Odebrat z přípravy"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-center py-1 text-[11px] text-slate-400 italic font-cinzel">
                      Volný slot {slotIdx + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-4">
          
          {/* Skill points header & Tabs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/80 border border-amber-900/20 p-3.5 rounded-xl shadow-xs">
            {/* Tabs */}
            <div className="flex gap-1.5 bg-amber-900/5 p-1 rounded-xl border border-amber-900/10">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-cinzel font-bold transition ${activeTab === 'all' ? 'bg-amber-800 text-white shadow-2xs' : 'text-slate-700 hover:text-amber-950'}`}
              >
                Vše (10)
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1 rounded-lg text-xs font-cinzel font-bold transition ${activeTab === 'active' ? 'bg-amber-800 text-white shadow-2xs' : 'text-slate-700 hover:text-amber-950'}`}
              >
                Aktivní (5)
              </button>
              <button
                onClick={() => setActiveTab('passive')}
                className={`px-3 py-1 rounded-lg text-xs font-cinzel font-bold transition ${activeTab === 'passive' ? 'bg-amber-800 text-white shadow-2xs' : 'text-slate-700 hover:text-amber-950'}`}
              >
                Pasivní (5)
              </button>
            </div>

            {/* Points Tracker */}
            <div className="flex items-center gap-4 pl-2 sm:border-l border-amber-900/15">
              <div className="text-right">
                <div className="text-[10px] uppercase font-cinzel font-bold text-slate-500">Body k rozdělení</div>
                <div className="text-xl font-cinzel font-bold text-amber-900">{skillPoints}</div>
              </div>
            </div>
          </div>

          {/* Grid of Class Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map(skill => {
              const learned = (skills || []).find((s: any) => s.id === skill.id);
              const currentRank = learned ? (typeof learned.rank === 'number' ? learned.rank : 1) : 0;
              const isMaxRank = currentRank >= 3;
              const nextCost = currentRank + 1;
              const isPrepared = (preparedSkills || []).includes(skill.id);
              const rankData = currentRank > 0 ? skill.ranks[currentRank - 1] : skill.ranks[0];
              const nextRankData = currentRank < 3 ? skill.ranks[currentRank] : null;

              return (
                <div 
                  key={skill.id} 
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition shadow-xs ${
                    currentRank > 0 
                      ? 'bg-white/90 border-amber-900/30 shadow-sm' 
                      : 'bg-[#fdfbf2]/60 border-amber-900/15 opacity-80'
                  }`}
                >
                  <div>
                    {/* Top Row: Title, Type & Ranks */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-cinzel font-bold text-base text-amber-950 leading-tight">
                            {skill.name}
                          </h4>
                        </div>
                        
                        {/* Rank Stars */}
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <span className="font-cinzel font-bold text-amber-900 text-[11px] mr-1">
                            {currentRank === 0 ? "Nenaučeno" : `Úroveň ${currentRank}/3`}
                          </span>
                          {[1, 2, 3].map((star) => (
                            <span key={star} className={star <= currentRank ? "text-amber-700 font-bold" : "text-slate-300"}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-cinzel font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          skill.type === 'active' 
                            ? 'bg-amber-100 text-amber-900 border-amber-700/30' 
                            : 'bg-sky-100 text-sky-900 border-sky-700/30'
                        }`}>
                          {skill.type === 'active' ? 'Aktivní' : 'Pasivní'}
                        </span>

                        {skill.type === 'active' && (
                          <div className="text-[10px] font-cinzel text-slate-500 flex gap-1.5">
                            <span>{skill.apCost || 1} AP</span>
                            {skill.cooldown ? <span>• CD {skill.cooldown}k</span> : null}
                            {skill.targetType === 'aoe' && <span className="font-bold text-red-700">[AoE]</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Current Description */}
                    <div className="font-lora text-xs sm:text-sm text-slate-800 leading-relaxed bg-[#f9f6e6]/60 p-2.5 rounded-lg border border-amber-900/10 mb-2">
                      <span className="font-semibold text-amber-950">{currentRank > 0 ? "Aktivní efekt: " : "Základní efekt: "}</span>
                      {rankData.desc}
                    </div>

                    {/* Next Rank Preview */}
                    {nextRankData && currentRank > 0 && (
                      <div className="text-xs font-lora text-slate-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-900/10 mb-2">
                        <span className="font-semibold text-amber-900 not-italic">Další úroveň ({currentRank + 1}): </span>
                        {nextRankData.desc}
                      </div>
                    )}

                    {/* Milestone Perk Callout */}
                    <div className={`text-xs p-2 rounded-lg border flex items-start gap-1.5 ${
                      currentRank === 3 
                        ? 'bg-amber-100/80 border-amber-700/40 text-amber-950 font-medium shadow-2xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <Sparkles size={14} className="text-amber-800 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-cinzel font-bold text-[11px] text-amber-900">Milník (Úroveň 3): </span>
                        <span>{skill.ranks[2].milestonePerk || "Získává unikátní mechaniku a speciální bonus."}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2.5 border-t border-amber-900/15 flex flex-col sm:flex-row gap-2">
                    {/* Upgrade / Unlock Button */}
                    {!isMaxRank ? (
                      <button 
                        onClick={() => handleUpgradeSkill(skill)}
                        disabled={skillPoints < nextCost}
                        className="flex-1 py-2 px-3 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Plus size={14} />
                        <span>{currentRank === 0 ? `Odemknout (${nextCost} bod)` : `Vylepšit (${nextCost} body)`}</span>
                      </button>
                    ) : (
                      <div className="flex-1 text-center py-2 font-cinzel font-bold text-xs text-emerald-900 bg-emerald-100/70 rounded-xl border border-emerald-800/30">
                        ✓ Maximální úroveň (Rank III)
                      </div>
                    )}

                    {/* Prepared Spell Toggle for Active Skills */}
                    {skill.type === 'active' && currentRank > 0 && (
                      <button
                        onClick={() => togglePreparedSpell(skill.id)}
                        className={`py-2 px-3 rounded-xl font-cinzel font-bold text-xs tracking-wider transition border shadow-2xs flex items-center justify-center gap-1.5 ${
                          isPrepared 
                            ? 'bg-amber-200/90 text-amber-950 border-amber-600/50 hover:bg-amber-300/80' 
                            : 'bg-white hover:bg-amber-50 text-slate-700 border-amber-900/20'
                        }`}
                      >
                        {isPrepared ? (
                          <>
                            <Check size={14} className="text-amber-900" />
                            <span>V boji</span>
                          </>
                        ) : (
                          <span>Připravit do arény</span>
                        )}
                      </button>
                    )}

                    {/* Story Action Button */}
                    {skill.type === 'active' && currentRank > 0 && (
                      <button
                        onClick={() => {
                          setCustomAction(`Používám dovednost: ${skill.name}`);
                          onClose();
                        }}
                        className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-cinzel font-bold text-[11px] transition"
                        title="Využít tuto dovednost v textovém příběhu"
                      >
                        Příběh
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-amber-900/15 bg-amber-900/5 flex justify-between items-center">
          <div className="text-xs text-slate-600 font-cinzel">
            Aethelgard RPG • D&D Schopnosti & Příprava
          </div>
          <button
            onClick={() => onClose()}
            className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-sm"
          >
            Zavřít
          </button>
        </div>

      </div>
    </div>
  );
};
