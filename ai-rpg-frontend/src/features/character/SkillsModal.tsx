import React from 'react';
import { X, Sparkles, Zap, Shield, Swords, Flame, HeartHandshake } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const SkillsModal = ({ isOpen, onClose, setCustomAction }: any) => {
  const { 
    dndClass, skills, setSkills, skillPoints, setSkillPoints 
  } = useGameStore();

  if (!isOpen) return null;

  const availableSkillsList = [
    { id: "silny_uder", name: "Silný úder", desc: "Základní útok nablízko se zvýšeným drtivým poškozením.", type: "Aktivní", icon: Swords },
    { id: "ohniva_koule", name: "Ohnivá koule", desc: "Sešle zničující ohnivou kouli na cíl a jeho bezprostřední okolí.", type: "Aktivní", icon: Flame },
    { id: "plizeni", name: "Stínový krok", desc: "Postava splyne se stíny a získá výhodu na další překvapivý útok.", type: "Aktivní", icon: Zap },
    { id: "lecive_slovo", name: "Léčivé slovo", desc: "Magicky obnoví zdraví a zacelí utržené rány v boji.", type: "Aktivní", icon: HeartHandshake },
    { id: "odolnost", name: "Železná kůže", desc: "Přirozená tělesná odolnost snižující utržené fyzické zranění.", type: "Pasivní", icon: Shield },
    { id: "sermir", name: "Mistr meče", desc: "Dlouhá léta výcviku zvyšují šanci na drtivý kritický zásah.", type: "Pasivní", icon: Swords },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="w-full max-w-3xl bg-[#f9f6e6]/95 backdrop-blur-xl rounded-2xl border border-amber-900/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-amber-900/15 bg-gradient-to-r from-amber-900/5 via-transparent to-amber-900/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl border border-amber-900/15 text-amber-900">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-amber-950 tracking-wide">
                Kniha Schopností
              </h2>
              <p className="text-xs font-lora text-slate-600">
                Bojová umění a kouzla ({dndClass})
              </p>
            </div>
          </div>

          <button 
            onClick={() => onClose()} 
            className="text-amber-900/60 hover:text-amber-950 p-1.5 rounded-xl hover:bg-amber-900/10 transition"
            title="Zavřít"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-4">
          
          {/* Skill points header */}
          <div className="flex justify-between items-center bg-white/80 border border-amber-900/15 p-4 rounded-xl shadow-sm">
            <div>
              <h3 className="font-cinzel font-bold text-base text-amber-950">Odemčené schopnosti</h3>
              <p className="text-xs font-lora text-slate-600">Investuj body a rozvíjej sílu svého hrdiny.</p>
            </div>
            <div className="text-right pl-3 border-l border-amber-900/10">
              <div className="text-[10px] uppercase font-cinzel font-bold text-slate-500">Volné body</div>
              <div className="text-2xl font-cinzel font-bold text-amber-900">{skillPoints}</div>
            </div>
          </div>

          {/* Grid of abilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {availableSkillsList.map(skill => {
              const isUnlocked = skills.some(s => s.id === skill.id);
              const SkillIcon = skill.icon;

              return (
                <div 
                  key={skill.id} 
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition shadow-xs ${
                    isUnlocked 
                      ? 'bg-white/80 border-amber-900/25 shadow-sm' 
                      : 'bg-white/50 border-amber-900/10 opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg border ${isUnlocked ? 'bg-amber-100 border-amber-700/30 text-amber-900' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                          <SkillIcon size={16} />
                        </div>
                        <h4 className="font-cinzel font-bold text-base text-amber-950">{skill.name}</h4>
                      </div>
                      <span className={`text-[10px] font-cinzel font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        skill.type === 'Aktivní' 
                          ? 'bg-amber-100 text-amber-900 border-amber-700/30' 
                          : 'bg-sky-100 text-sky-900 border-sky-700/30'
                      }`}>
                        {skill.type}
                      </span>
                    </div>

                    <p className="font-lora text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      {skill.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-900/10">
                    {isUnlocked ? (
                      skill.type === "Aktivní" ? (
                        <button 
                          onClick={() => {
                            setCustomAction(`Používám dovednost: ${skill.name}`);
                            onClose();
                          }}
                          className="w-full py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-sm"
                        >
                          Použít dovednost v příběhu
                        </button>
                      ) : (
                        <div className="text-center py-1.5 font-cinzel font-bold text-xs text-amber-900 bg-amber-100/60 rounded-lg border border-amber-900/15">
                          ✓ Trvale aktivní posílení
                        </div>
                      )
                    ) : (
                      <button 
                        onClick={() => {
                          if (skillPoints > 0) {
                            setSkillPoints((p: any) => p - 1);
                            setSkills([...skills, skill]);
                          }
                        }}
                        disabled={skillPoints <= 0}
                        className="w-full py-2 bg-white hover:bg-amber-50 text-slate-800 border border-amber-900/20 rounded-xl font-cinzel font-bold text-xs tracking-wider transition shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Odemknout (1 bod schopnosti)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-amber-900/10 bg-amber-900/5 flex justify-end">
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

