import React from 'react';
import { X, Sparkles, BookOpen, Shield, Sword, FlaskConical, Gem } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const SkillsModal = ({ isOpen, onClose, setCustomAction }: any) => {
  const { 
    dndClass, level, skills, setSkills, availableSkills, setAvailableSkills, 
    setCurrentSpellSlots, maxSpellSlots, skillPoints, setSkillPoints 
  } = useGameStore();

  if (!isOpen) return null;

  return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl bg-[#2b4c5e] rounded-lg border-4 border-[#90a4ae] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#e3dcc8] p-4 flex justify-between items-center border-b-4 border-[#90a4ae]">
              <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest">
                <Sparkles size={28} /> Dovednosti
              </div>
              <button onClick={() => onClose()} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6 bg-[#1e3746] flex flex-col gap-6 overflow-y-auto">
              <div className="flex justify-between items-center bg-[#1b262c] border-2 border-[#455a64] p-4 rounded text-[#90a4ae]">
                <div>
                  <h3 className="font-bold text-lg text-[#f4f1e1]">Tvé schopnosti</h3>
                  <p className="text-sm">Zde najdeš odemčené bojové dovednosti.</p>
                </div>
                <div className="text-right">
                  <div className="text-sm">Nevyužité body dovedností</div>
                  <div className="text-2xl font-bold text-[#d4af37]">{skillPoints}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {id: "silny_uder", name: "Silný úder", desc: "Základní útok nablízko se zvýšeným poškozením (Aktivní)"},
                  {id: "ohniva_koule", name: "Ohnivá koule", desc: "Sešle zničující ohnivou kouli na cíl (Aktivní - Magie)"},
                  {id: "plizeni", name: "Stínový krok", desc: "Postava se přesune do stínů a získá výhodu na další útok (Aktivní)"},
                  {id: "lecive_slovo", name: "Léčivé slovo", desc: "Magicky obnoví trochu zdraví (Aktivní)"},
                  {id: "odolnost", name: "Železná kůže", desc: "V boji tě je těžší zranit. (Pasivní)"},
                  {id: "sermir", name: "Mistr meče", desc: "Vyšší šance na kritický zásah. (Pasivní)"}
                ].map(skill => {
                  const isUnlocked = skills.find(s => s.id === skill.id);
                  return (
                    <div key={skill.id} className={`p-4 border-2 rounded ${isUnlocked ? 'bg-[#2b4c5e] border-[#90a4ae]' : 'bg-[#1b262c] border-[#455a64] opacity-80'}`}>
                      <h4 className={`font-bold ${isUnlocked ? 'text-[#f4f1e1]' : 'text-[#78909c]'}`}>{skill.name}</h4>
                      <p className="text-sm text-[#90a4ae] mt-1 mb-3">{skill.desc}</p>
                      
                      {isUnlocked ? (
                        skill.desc.includes("Aktivní") ? (
                          <button 
                            onClick={() => {
                                setCustomAction(`Používám dovednost: ${skill.name}`);
                                onClose();
                            }}
                            className="bg-[#b74b4b] text-[#f4f1e1] px-3 py-1 rounded text-sm hover:bg-[#8a3333] transition w-full font-bold"
                          >
                            Připravit do akce
                          </button>
                        ) : (
                          <div className="text-[#d4af37] text-sm font-bold text-center italic">Aktivní stále</div>
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
                          className="bg-[#1e3746] text-[#90a4ae] border border-[#455a64] px-3 py-1 rounded text-sm hover:bg-[#2b4c5e] transition w-full disabled:opacity-50"
                        >
                          Odemknout (1 bod)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      

  );
};
