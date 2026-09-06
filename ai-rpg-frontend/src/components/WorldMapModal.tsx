import React, { useState } from 'react';
import { Compass, Map as MapIcon, X } from 'lucide-react';
import { WorldMap } from './MapViewer';

interface WorldMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNodeId: string;
  onTravel: (nodeId: string) => void;
  isTraveling: boolean;
}

export function WorldMapModal({ isOpen, onClose, currentNodeId, onTravel, isTraveling }: WorldMapModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#121823] border-2 border-amber-900/50 rounded-2xl shadow-2xl shadow-black/80 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-900/30 bg-gradient-to-r from-[#121823] to-amber-950/20 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Compass className="text-amber-500 animate-pulse" size={24} />
            <h2 className="text-xl font-cinzel font-bold text-amber-100 uppercase tracking-widest drop-shadow-md">
              Mapa Aelthgardu
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Map Body */}
        <div className="p-4 flex-1 min-h-0 overflow-auto flex items-center justify-center">
            <WorldMap 
              currentNodeId={currentNodeId} 
              onTravel={(id) => {
                  onTravel(id);
                  onClose();
              }} 
              isTraveling={isTraveling} 
            />
        </div>
        
        <div className="p-4 text-center text-sm text-slate-400 font-lora border-t border-amber-900/20">
            Klikni na dostupný zlatý uzel pro rychlé cestování. Cestování stojí 1 dávku jídla.
        </div>
        
      </div>
    </div>
  );
}
