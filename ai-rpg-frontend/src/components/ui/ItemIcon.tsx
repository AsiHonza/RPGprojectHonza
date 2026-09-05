import React, { useState } from 'react';
import { 
  Sword, 
  Shield, 
  FlaskConical, 
  Gem, 
  Shirt, 
  ScrollText, 
  Heart, 
  Package, 
  Axe, 
  BookOpen, 
  Wand2, 
  Sparkles, 
  Crown,
  Flame
} from 'lucide-react';

const getStringHash = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return Math.abs(h);
};

export const ItemIcon = ({ 
  iconName, 
  itemId = "", 
  className = "", 
  size = 40 
}: { 
  iconName: string; 
  itemId?: string; 
  className?: string; 
  size?: number; 
}) => {
  const [hasError, setHasError] = useState(false);
  const hash = getStringHash(itemId || iconName);
  let imgPath = "";

  const norm = (iconName || '').toLowerCase();

  if (!hasError) {
    if (norm.includes('sword') || norm === 'meč' || norm === 'dlouhý meč') {
      imgPath = `/items/FreeFantasyStockArtV3/sword_free${(hash % 5) + 1}.png`;
    } else if (norm.includes('dagger') || norm === 'dýka') {
      imgPath = `/items/FreeFantasyStockArtV3/dagger_free${(hash % 6) + 1}.png`;
    } else if (norm.includes('bow') || norm === 'luk' || norm === 'kuše') {
      imgPath = `/items/FreeFantasyStockArtV3/bow_free${(hash % 2) + 1}.png`;
    } else if (norm.includes('axe') || norm === 'sekera') {
      imgPath = `/items/FreeFantasyStockArtV3/axe_free${(hash % 4) + 1}.png`;
    } else if (norm.includes('staff') || norm === 'hůl') {
      imgPath = `/items/FreeFantasyStockArtV3/staff_free${(hash % 3) + 1}.png`;
    } else if (norm.includes('spellbook') || norm === 'kniha') {
      imgPath = `/items/FreeFantasyStockArtV3/spellbook_free${(hash % 6) + 1}.png`;
    } else if (norm.includes('shield') || norm === 'štít') {
      imgPath = `/items/FreeFantasyStockArtV3/shield_free${(hash % 4) + 1}.png`;
    } else if (norm.includes('potion') || norm === 'lektvar') {
      imgPath = `/items/FreeFantasyStockArtV3/potion_free${(hash % 4) + 1}.png`;
    } else if (norm.includes('scroll') || norm === 'svitek') {
      imgPath = `/items/FreeFantasyStockArtV3/scroll_free${(hash % 5) + 1}.png`;
    }
  }

  if (imgPath && !hasError) {
    return (
      <img 
        src={imgPath} 
        alt={iconName} 
        width={size} 
        height={size} 
        className={`object-contain drop-shadow-sm transition-transform ${className}`} 
        onError={() => setHasError(true)}
      />
    );
  }

  // Fallback to stylized Lucide React icons
  if (norm.includes('sword') || norm === 'meč') return <Sword size={size} className={`text-amber-900 ${className}`} />;
  if (norm.includes('shield') || norm === 'štít') return <Shield size={size} className={`text-sky-800 ${className}`} />;
  if (norm.includes('potion') || norm === 'lektvar') return <FlaskConical size={size} className={`text-emerald-700 ${className}`} />;
  if (norm.includes('ring') || norm.includes('amulet') || norm.includes('gem') || norm.includes('šperk')) {
    return <Gem size={size} className={`text-amber-700 ${className}`} />;
  }
  if (norm.includes('shirt') || norm.includes('armor') || norm.includes('zbroj') || norm.includes('brnění') || norm.includes('roucho')) {
    return <Shirt size={size} className={`text-amber-900 ${className}`} />;
  }
  if (norm.includes('scroll') || norm.includes('svitek')) return <ScrollText size={size} className={`text-amber-800 ${className}`} />;
  if (norm.includes('axe') || norm.includes('sekera')) return <Axe size={size} className={`text-amber-900 ${className}`} />;
  if (norm.includes('staff') || norm.includes('wand') || norm.includes('hůl')) return <Wand2 size={size} className={`text-purple-700 ${className}`} />;
  if (norm.includes('book') || norm.includes('kniha')) return <BookOpen size={size} className={`text-amber-900 ${className}`} />;
  if (norm.includes('crown') || norm.includes('koruna')) return <Crown size={size} className={`text-yellow-600 ${className}`} />;
  if (norm.includes('heart') || norm.includes('zdraví')) return <Heart size={size} className={`text-red-600 ${className}`} />;
  if (norm.includes('fire') || norm.includes('plamen')) return <Flame size={size} className={`text-orange-600 ${className}`} />;

  return <Package size={size} className={`text-amber-900/70 ${className}`} />;
};
