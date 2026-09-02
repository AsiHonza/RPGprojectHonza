import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const CharacterStatsPanel = () => {
  const { stats, hp, maxSpellSlots, currentSpellSlots } = useGameStore();

  return (
    <div className="flex flex-col gap-3">
      {[
        { key: 'str', label: 'Síla (STR)' },
        { key: 'dex', label: 'Obratnost (DEX)' },
        { key: 'con', label: 'Odolnost (CON)' },
        { key: 'intel', label: 'Inteligence (INT)' },
        { key: 'wis', label: 'Moudrost (WIS)' },
        { key: 'cha', label: 'Charisma (CHA)' },
      ].map((stat) => (
        <div key={stat.key} className="flex justify-between items-center bg-[#2b4c5e] p-3 rounded border border-[#455a64]">
          <span className="font-bold text-[#f4f1e1] uppercase w-1/2">{stat.label}</span>
          <span className="font-bold text-[#90a4ae] text-xl w-1/4 text-center">
             {(stats as any)[stat.key]}
          </span>
        </div>
      ))}
    </div>
  );
};
