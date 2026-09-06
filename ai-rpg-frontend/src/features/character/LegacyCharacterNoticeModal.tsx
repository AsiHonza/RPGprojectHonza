import React, { useState } from 'react';
import { Sparkles, ShieldAlert, Check, X, Compass, Flame, ShoppingBag, Users } from 'lucide-react';
import { setLegacyAcknowledged } from '../../services/version/gameVersion';

interface LegacyCharacterNoticeModalProps {
  isOpen: boolean;
  characterName: string;
  onClose: () => void;
  onProceed: () => void;
  onCreateNew: () => void;
}

export const LegacyCharacterNoticeModal: React.FC<LegacyCharacterNoticeModalProps> = ({
  isOpen,
  characterName,
  onClose,
  onProceed,
  onCreateNew,
}) => {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  if (!isOpen) return null;

  const handleProceed = () => {
    if (dontAskAgain) {
      setLegacyAcknowledged(characterName, true);
    }
    onProceed();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-[#fdfbf7] dark:bg-[#121823] border-2 border-amber-600/70 dark:border-amber-500/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-5 sm:p-7 overflow-hidden flex flex-col gap-4 text-slate-800 dark:text-[#e2d9c8]">
        
        {/* Subtle Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-amber-900/15 dark:border-amber-500/20 pb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-800 dark:text-amber-300 shadow-inner shrink-0">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest font-cinzel font-bold text-amber-800 dark:text-amber-400">
                Aethelgard v2.1 • Velká obroda
              </div>
              <h3 className="text-lg sm:text-xl font-cinzel font-bold text-slate-900 dark:text-[#e2d9c8] leading-tight">
                Starší verze hrdiny
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-[#1c2637] rounded-full transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Text */}
        <div className="flex flex-col gap-3 text-xs sm:text-sm font-lora leading-relaxed text-slate-700 dark:text-slate-300 relative z-10">
          <p>
            Hrdina <span className="font-bold text-amber-950 dark:text-amber-300 font-cinzel text-sm sm:text-base">{characterName}</span> byl
            stvořen v dřívější epoše Aelthgardu. Svět od té doby prošel zásadním vývojem:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/80 dark:bg-[#141c28] border border-amber-900/10 dark:border-amber-500/20 text-xs">
              <Compass size={16} className="text-amber-700 dark:text-amber-400 shrink-0" />
              <span>Interaktivní hexová mapa království</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/80 dark:bg-[#141c28] border border-amber-900/10 dark:border-amber-500/20 text-xs">
              <ShoppingBag size={16} className="text-amber-700 dark:text-amber-400 shrink-0" />
              <span>Městská centra, kovář & oři</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/80 dark:bg-[#141c28] border border-amber-900/10 dark:border-amber-500/20 text-xs">
              <Users size={16} className="text-amber-700 dark:text-amber-400 shrink-0" />
              <span>Živé postavy s motivacemi & tajemstvími</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/80 dark:bg-[#141c28] border border-amber-900/10 dark:border-amber-500/20 text-xs">
              <Flame size={16} className="text-amber-700 dark:text-amber-400 shrink-0" />
              <span>Táboření a spotřeba zásob</span>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 italic bg-amber-100/40 dark:bg-[#192231] p-2.5 rounded-xl border-l-2 border-amber-600 dark:border-amber-500 text-xs">
            Můžeš s touto postavou pokračovat, avšak mapa světa a některé městské mechaniky nemusí v jejím původním světě fungovat zcela spolehlivě. Pro nejlepší herní zážitek doporučujeme stvořit novou legendu.
          </p>
        </div>

        {/* Checkbox Don't Ask Again */}
        <label className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-lora cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={dontAskAgain}
            onChange={(e) => setDontAskAgain(e.target.checked)}
            className="w-4 h-4 rounded border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-700 dark:accent-amber-500"
          />
          <span>Pro tuto postavu se již příště neptat</span>
        </label>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-amber-900/10 dark:border-amber-500/20">
          <button
            onClick={onCreateNew}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-500 dark:hover:to-amber-600 text-white rounded-xl font-cinzel font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles size={16} />
            Stvořit novou legendu
          </button>
          <button
            onClick={handleProceed}
            className="py-3 px-4 bg-[#f2ece1] dark:bg-[#1c2637] hover:bg-amber-100 dark:hover:bg-[#25334a] border border-amber-900/20 dark:border-amber-500/30 text-slate-800 dark:text-[#e2d9c8] hover:text-amber-950 dark:hover:text-amber-300 rounded-xl font-cinzel font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check size={15} />
            Vstoupit i tak
          </button>
        </div>

      </div>
    </div>
  );
};
