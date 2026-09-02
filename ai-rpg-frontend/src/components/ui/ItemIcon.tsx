import React from 'react';
import { Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, Heart, Gem as GemIcon, Package } from 'lucide-react';

const getStringHash = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return Math.abs(h);
};

export const ItemIcon = ({ iconName, itemId = "", className = "", size = 40 }: { iconName: string, itemId?: string, className?: string, size?: number }) => {
  const hash = getStringHash(itemId || iconName);
  let imgPath = "";

  switch (iconName) {
    case 'Sword':
      imgPath = `/items/FreeFantasyStockArtV3/sword_free${(hash % 5) + 1}.png`;
      break;
    case 'Shield':
      imgPath = `/items/FreeFantasyStockArtV3/shield_free${(hash % 5) + 1}.png`;
      break;
    case 'Potion':
      imgPath = `/items/FreeFantasyStockArtV3/potion_free${(hash % 5) + 1}.png`;
      break;
    case 'Ring':
      imgPath = `/items/FreeFantasyStockArtV3/ring_free${(hash % 5) + 1}.png`;
      break;
    case 'Shirt':
      imgPath = `/items/FreeFantasyStockArtV3/armor_free${(hash % 5) + 1}.png`;
      break;
    case 'ScrollText':
      imgPath = `/items/FreeFantasyStockArtV3/scroll_free${(hash % 5) + 1}.png`;
      break;
    default:
      imgPath = "";
  }

  if (imgPath) {
    return <img src={imgPath} alt={iconName} width={size} height={size} className={`object-contain ${className}`} />;
  }

  // Fallback to Lucide React icons
  switch (iconName) {
    case 'Sword': return <Sword size={size} className={className} />;
    case 'Shield': return <Shield size={size} className={className} />;
    case 'Potion': return <FlaskConical size={size} className={className} />;
    case 'Ring': return <Gem size={size} className={className} />;
    case 'Shirt': return <Shirt size={size} className={className} />;
    case 'ScrollText': return <ScrollText size={size} className={className} />;
    case 'Heart': return <Heart size={size} className={className} />;
    case 'Gem': return <GemIcon size={size} className={className} />;
    default: return <Package size={size} className={className} />;
  }
};
