import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { SeamlessVideo } from './SeamlessVideo';

interface AmbientBackgroundProps {
  className?: string;
  lightSrc?: string;
  darkSrc?: string;
  overlayClassName?: string;
  glow?: boolean;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  className = "absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden",
  lightSrc = "/video/bg1.mp4",
  darkSrc = "/video/bg_dark.mp4",
  overlayClassName = "",
  glow = true,
}) => {
  const { theme } = useGameStore();

  const isDark =
    theme === 'dark' ||
    (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={className}>
      {/* Light Mode Video Layer */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
          isDark ? 'opacity-0' : 'opacity-60'
        }`}
      >
        <SeamlessVideo
          src={lightSrc}
          className="w-full h-full"
        />
      </div>

      {/* Dark Mode Video Layer (Minimalist Ambient Fantasy) */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
          isDark ? 'opacity-65' : 'opacity-0'
        }`}
      >
        <SeamlessVideo
          src={darkSrc}
          className="w-full h-full"
        />
      </div>

      {/* Ambient Gradient Overlays */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-[#e5dfc5]/20 via-[#f9f6e6]/50 to-transparent dark:from-[#0b0f16]/60 dark:via-[#0b0f16]/80 dark:to-[#0b0f16]/95 pointer-events-none transition-colors duration-1000 ${overlayClassName}`}
      />

      {/* Central Mystical Glow */}
      {glow && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rpg-magic/10 dark:bg-amber-500/5 blur-[120px] rounded-full pointer-events-none transition-colors duration-1000" />
      )}
    </div>
  );
};
