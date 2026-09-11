/**
 * Exploration & Anti-Abuse Engine for Aelthgard RPG
 * Manages area scouting, resource costs (rations), node exhaustion, and canonical loot discovery.
 */

import { NODE_EXPLORATION_MAP, ItemDef, NodeExplorationData } from '@/data/canonicalLoot';

export interface ExplorationResult {
  success: boolean;
  message: string;
  foundItem: ItemDef | null;
  goldEarned: number;
  xpEarned: number;
  rationsConsumed: number;
  dayAdvanced: number;
  ambushEncounter: boolean;
  ambushText?: string;
  updatedExploredNodes: Record<string, { searched: boolean; lootCollected: string[] }>;
}

export function canExploreNode(
  nodeId: string,
  exploredNodes: Record<string, { searched: boolean; lootCollected: string[] }>,
  rations: number
): { allowed: boolean; alreadyCleared: boolean; reason?: string } {
  const nodeState = exploredNodes[nodeId];
  if (nodeState && nodeState.searched) {
    return {
      allowed: false,
      alreadyCleared: true,
      reason: 'Tato oblast byla již důkladně prozkoumána a její hlavní tajemství byla odhalena.'
    };
  }

  if (rations <= 0) {
    return {
      allowed: false,
      alreadyCleared: false,
      reason: 'Nemáš žádné dávky jídla (rations)! Na důkladný půldenní průzkum divočiny ti chybí zásoby.'
    };
  }

  return { allowed: true, alreadyCleared: false };
}

export function performNodeExploration(
  nodeId: string,
  exploredNodes: Record<string, { searched: boolean; lootCollected: string[] }>,
  rations: number,
  playerWisdom: number = 10,
  hasPerkSixthSense: boolean = false,
  hasScoutPost: boolean = false
): ExplorationResult {
  const check = canExploreNode(nodeId, exploredNodes, rations);
  const nodeData: NodeExplorationData | undefined = NODE_EXPLORATION_MAP[nodeId];

  if (!nodeData) {
    return {
      success: false,
      message: 'Tato oblast nemá žádná zaznamenaná skrytá tajemství ani ložiska.',
      foundItem: null,
      goldEarned: 0,
      xpEarned: 0,
      rationsConsumed: 0,
      dayAdvanced: 0,
      ambushEncounter: false,
      updatedExploredNodes: exploredNodes
    };
  }

  if (!check.allowed) {
    return {
      success: false,
      message: check.reason || nodeData.clearedDescription,
      foundItem: null,
      goldEarned: 0,
      xpEarned: 0,
      rationsConsumed: 0,
      dayAdvanced: 0,
      ambushEncounter: false,
      updatedExploredNodes: exploredNodes
    };
  }

  // Calculate Roll: d20 + WIS mod (+3 if Sixth Sense perk is active, +2 if Scout Post)
  const wisMod = Math.floor((playerWisdom - 10) / 2);
  const rollBonus = wisMod + (hasPerkSixthSense ? 3 : 0) + (hasScoutPost ? 2 : 0);
  const rawRoll = Math.floor(Math.random() * 20) + 1;
  const totalRoll = rawRoll + rollBonus;

  const isAmbushed = !hasScoutPost && totalRoll < nodeData.encounterDc && nodeId !== 'oakhaven' && nodeId !== 'elf_camp';

  const updatedNodes = {
    ...exploredNodes,
    [nodeId]: {
      searched: true,
      lootCollected: [nodeData.guaranteedItem.id]
    }
  };

  let ambushNotice = '';
  if (isAmbushed) {
    ambushNotice = 'Během prohledávání terénu tě zaskočila hlídka z úkrytu! Bleskovým protiútokem se ti však podařilo situaci zvládnout a včas vyklouznout.';
  }

  const finalMsg = isAmbushed 
    ? `${ambushNotice}\n\n${nodeData.discoveryDescription}`
    : nodeData.discoveryDescription;

  return {
    success: true,
    message: finalMsg,
    foundItem: nodeData.guaranteedItem,
    goldEarned: nodeData.bonusGold,
    xpEarned: nodeData.bonusXp,
    rationsConsumed: 1,
    dayAdvanced: 0.5,
    ambushEncounter: isAmbushed,
    ambushText: ambushNotice || undefined,
    updatedExploredNodes: updatedNodes
  };
}
