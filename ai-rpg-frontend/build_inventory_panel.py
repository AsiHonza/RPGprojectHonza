import codecs

with codecs.open('inventory_extracted.tsx', 'r', 'utf-8') as f:
    jsx = f.read()

# We will wrap it in a component
start_idx = jsx.find('<div className="fixed inset-0')
end_idx = jsx.rfind('</div>') + 6
inner_jsx = jsx[start_idx:end_idx]

# Replace setInventoryOpen(false) with onClose()
inner_jsx = inner_jsx.replace('setInventoryOpen(false)', 'onClose()')

comp = f"""import React from 'react';
import {{ ItemIcon }} from '../../components/ui/ItemIcon';
import {{ X, Package }} from 'lucide-react';
import {{ useGameStore }} from '../../store/gameStore';

export const InventoryPanel = ({{ isOpen, onClose, selectedItem, setSelectedItem }}: any) => {{
  const {{ inventory, equipped, setEquipped, gold }} = useGameStore();

  if (!isOpen) return null;

  return (
{inner_jsx}
  );
}};
"""

with codecs.open('src/features/character/InventoryPanel.tsx', 'w', 'utf-8') as f:
    f.write(comp)
print("InventoryPanel.tsx created")
