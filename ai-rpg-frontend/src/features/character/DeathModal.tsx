import React, { useState } from 'react';
import { Skull, Loader2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const DeathModal = ({ onClose }: { onClose: () => void }) => {
  const { name, email, setGameState, hp, maxHp } = useGameStore();
  const [loading, setLoading] = useState(false);

  // If the player isn't actually dead, don't show the modal
  if (hp > 0) return null;

  const handleDeath = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/delete-character`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name })
      });
    } catch (e) {
      console.error("Failed to delete character", e);
    } finally {
      setLoading(false);
      localStorage.removeItem("aethelgard_active_char");
      setGameState("menu");
      onClose(); // In case we want to unmount it cleanly
    }
  };

  return (
    <div className="fixed inset-0 bg-red-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 font-lora">
      <div className="w-full max-w-md bg-[#1a0f0e] border border-red-900/50 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.2)] overflow-hidden flex flex-col items-center text-center p-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="w-20 h-20 rounded-full bg-red-950/80 border border-red-900/50 flex items-center justify-center text-red-600 mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)] animate-pulse">
          <Skull size={40} />
        </div>

        <h2 className="font-cinzel font-bold text-3xl sm:text-4xl text-red-500 mb-4 tracking-widest uppercase text-shadow">
          Zemřel jsi
        </h2>
        
        <p className="text-red-200/80 mb-8 leading-relaxed z-10">
          Tvoje cesta v drsném světě Aethelgardu zde končí. Legendy o tvých skutcích postupně vyblednou a tvá duše se připojí k padlým předkům. 
          <br /><br />
          Z tvé postavy <strong>{name}</strong> nezbude než prach a vzpomínka.
        </p>

        <button
          onClick={handleDeath}
          disabled={loading}
          className="w-full py-4 px-6 bg-red-900/40 border border-red-900 hover:bg-red-800 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all rounded-xl text-red-200 font-cinzel font-bold tracking-widest uppercase flex justify-center items-center gap-2 z-10"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Skull size={20} />}
          {loading ? "Odcházení..." : "Zpět do prázdnoty"}
        </button>
      </div>
    </div>
  );
};
