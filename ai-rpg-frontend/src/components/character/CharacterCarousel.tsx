import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, Sparkles, Sword } from 'lucide-react';
import { SeamlessVideo } from '../ui/SeamlessVideo';

interface Character {
  name: string;
  race: string;
  dnd_class: string;
  [key: string]: any;
}

interface CharacterCarouselProps {
  characters: Character[];
  onSelectCharacter: (name: string) => void;
  onDeleteCharacter: (e: React.MouseEvent, name: string) => void;
  onCreateNew: () => void;
  getAvatarVideo: (race?: string) => string | null;
}

export const CharacterCarousel: React.FC<CharacterCarouselProps> = ({
  characters,
  onSelectCharacter,
  onDeleteCharacter,
  onCreateNew,
  getAvatarVideo,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Keep index within bounds if characters array shrinks
  useEffect(() => {
    if (currentIndex >= characters.length && characters.length > 0) {
      setCurrentIndex(characters.length - 1);
    }
  }, [characters.length, currentIndex]);

  const handlePrev = () => {
    if (characters.length <= 1) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : characters.length - 1));
  };

  const handleNext = () => {
    if (characters.length <= 1) return;
    setCurrentIndex((prev) => (prev < characters.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, characters.length]);

  if (!characters || characters.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 p-8 text-center bg-[#f9f6e6]/60 backdrop-blur-md rounded-2xl border border-amber-900/10 shadow-xl max-w-md w-full">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shadow-inner">
          <Sparkles size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-cinzel font-bold text-slate-800">Žádné legendy</h3>
          <p className="text-slate-600 font-lora text-sm mt-1">Dosud jsi nevytvořil žádného hrdinu pro tento svět.</p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-8 py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-cinzel font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <Sparkles size={18} /> Vytvořit První Legendu
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full flex flex-col items-center select-none overflow-hidden shrink-0">
      {/* Title */}
      <div className="text-center mb-2 sm:mb-3">
        <h3 className="text-slate-800 font-cinzel font-bold text-lg sm:text-xl tracking-wider">Tvé Legendy</h3>
        <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-0.5" />
      </div>

      {/* Stage Container */}
      <div className="relative w-full max-w-4xl h-[370px] sm:h-[410px] flex items-center justify-center overflow-hidden">
        
        {/* Left Arrow Button */}
        {characters.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Předchozí postava"
            className="absolute left-2 sm:left-4 md:left-8 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#fcfaf2]/90 hover:bg-amber-100 border-2 border-amber-900/30 hover:border-amber-700 shadow-xl flex items-center justify-center text-amber-950 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft size={28} className="stroke-[2.5]" />
          </button>
        )}

        {/* Right Arrow Button */}
        {characters.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Další postava"
            className="absolute right-2 sm:right-4 md:right-8 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#fcfaf2]/90 hover:bg-amber-100 border-2 border-amber-900/30 hover:border-amber-700 shadow-xl flex items-center justify-center text-amber-950 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <ChevronRight size={28} className="stroke-[2.5]" />
          </button>
        )}

        {/* Carousel Cards Layer with Touch Drag */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const swipeThreshold = 40;
            if (info.offset.x < -swipeThreshold) {
              handleNext();
            } else if (info.offset.x > swipeThreshold) {
              handlePrev();
            }
          }}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {characters.map((char, idx) => {
            let diff = idx - currentIndex;
            if (characters.length > 2) {
              if (diff < -Math.floor(characters.length / 2)) diff += characters.length;
              if (diff > Math.floor(characters.length / 2)) diff -= characters.length;
            }

            const isFocused = diff === 0;
            const isLeft = diff === -1;
            const isRight = diff === 1;
            const isVisible = isFocused || isLeft || isRight;

            // Compute positions
            let xOffset = 0;
            let scale = 1;
            let opacity = 0;
            let zIndex = 10;
            let rotateY = 0;

            if (isFocused) {
              xOffset = 0;
              scale = 1.08;
              opacity = 1;
              zIndex = 30;
              rotateY = 0;
            } else if (isLeft) {
              xOffset = -220;
              scale = 0.86;
              opacity = 0.55;
              zIndex = 20;
              rotateY = 12;
            } else if (isRight) {
              xOffset = 220;
              scale = 0.86;
              opacity = 0.55;
              zIndex = 20;
              rotateY = -12;
            }

            if (!isVisible) {
              return null;
            }

            return (
              <motion.div
                key={char.name}
                animate={{
                  x: xOffset,
                  scale,
                  opacity,
                  rotateY,
                  zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={() => {
                  if (isFocused) {
                    onSelectCharacter(char.name);
                  } else {
                    setCurrentIndex(idx);
                  }
                }}
                className={`absolute w-56 sm:w-64 h-[320px] sm:h-[350px] rounded-2xl overflow-hidden cursor-pointer transition-shadow select-none ${
                  isFocused
                    ? 'border-2 border-amber-600 shadow-[0_12px_35px_rgba(180,83,9,0.35)] ring-4 ring-amber-400/30'
                    : 'border border-amber-900/20 shadow-md hover:opacity-80'
                } bg-[#f9f6e6]`}
              >
                {/* Clean Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f9f6e6] via-[#f9f6e6]/80 to-transparent z-10 pointer-events-none" />

                {/* Portrait Content */}
                {getAvatarVideo(char.race) ? (
                  <SeamlessVideo
                    src={getAvatarVideo(char.race)!}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      isFocused ? 'opacity-95' : 'opacity-70'
                    }`}
                  />
                ) : (
                  <img
                    src={`https://image.pollinations.ai/prompt/vibrant%20fable%20style%20magical%20fantasy%20portrait%20of%20a%20${encodeURIComponent(
                      char.race
                    )}%20${encodeURIComponent(char.dnd_class)}%20RPG%20character?width=512&height=768&nologo=true&seed=${
                      char.name.length * 42
                    }`}
                    alt={char.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      isFocused ? 'opacity-90' : 'opacity-65'
                    }`}
                  />
                )}

                {/* Card Foreground Elements */}
                <div className="absolute inset-0 z-20 flex flex-col p-4 sm:p-5 justify-between pointer-events-none">
                  {/* Top Bar: Delete Button */}
                  <div className="flex justify-end pointer-events-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCharacter(e, char.name);
                      }}
                      className="p-1.5 text-slate-700/60 hover:text-red-700 hover:bg-red-100/70 rounded-full transition-all shadow-sm"
                      title="Smazat postavu"
                    >
                      <Flame size={18} />
                    </button>
                  </div>

                  {/* Bottom Info & Play Prompt */}
                  <div className="pointer-events-auto flex flex-col gap-1.5">
                    <div>
                      <h4 className="text-xl sm:text-2xl font-cinzel font-bold text-slate-900 leading-tight drop-shadow-sm">
                        {char.name}
                      </h4>
                      <div className="text-amber-800 font-lora italic text-xs sm:text-sm font-semibold">
                        {char.race} {char.dnd_class}
                      </div>
                    </div>

                    {isFocused && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCharacter(char.name);
                        }}
                        className="w-full mt-1 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-cinzel font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Sword size={14} /> Vstoupit do hry
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      {characters.length > 1 && (
        <div className="flex items-center gap-2 mt-1 mb-2 shrink-0">
          {characters.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`transition-all rounded-full ${
                i === currentIndex ? 'w-5 h-1.5 bg-amber-700 shadow-sm' : 'w-1.5 h-1.5 bg-amber-900/30 hover:bg-amber-900/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Create New Legend Button */}
      <button
        onClick={onCreateNew}
        className="mt-1 px-6 py-2.5 bg-[#fcfaf2] border-2 border-amber-900/30 hover:border-amber-700 shadow-md hover:shadow-[0_4px_16px_rgba(180,83,9,0.25)] text-slate-800 hover:text-amber-950 font-cinzel font-bold rounded-xl transition-all uppercase tracking-widest text-xs flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
      >
        <Sparkles size={16} className="text-amber-700" />
        Vytvořit Novou Legendu
      </button>
    </div>
  );
};
