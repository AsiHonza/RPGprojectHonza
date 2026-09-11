import worldMapData from '../data/generated/world_map.json';
import questsData from '../data/generated/quests.json';

export type QuestBadgeType = 'turn_in' | 'available' | 'objective' | 'cleared' | 'none';

export interface LocationQuestInfo {
  id: string;
  title: string;
  type: 'turn_in' | 'available' | 'objective' | 'completed';
  giver?: string;
  objective?: string;
}

export interface NodeQuestStatus {
  primaryBadge: QuestBadgeType;
  badges: QuestBadgeType[];
  turnInCount: number;
  availableCount: number;
  objectiveCount: number;
  completedCount: number;
  questList: LocationQuestInfo[];
}

// Canonical hex coordinate mapping for the 6 primary nodes
export const CANONICAL_HEX_MAP: Record<string, { q: number; r: number }> = {
  oakhaven: { q: 0, r: 0 },
  crossroads: { q: 2, r: -1 },
  old_mine: { q: -2, r: -2 },
  dark_forest: { q: 3, r: -2 },
  monastery_ruins: { q: 3, r: 1 },
  elf_camp: { q: 5, r: -3 }
};

export const HEX_TO_NODE_MAP: Record<string, string> = {
  '0_0': 'oakhaven',
  '2_-1': 'crossroads',
  '-2_-2': 'old_mine',
  '3_-2': 'dark_forest',
  '3_1': 'monastery_ruins',
  '5_-3': 'elf_camp'
};

/**
 * Calculates quest status badges and quest list for a given node or hex coordinate
 */
export function getLocationQuestStatus(
  nodeIdOrKey: string | { q: number; r: number },
  playerQuests: any[] = []
): NodeQuestStatus {
  let nodeId: string | null = null;

  if (typeof nodeIdOrKey === 'string') {
    nodeId = nodeIdOrKey;
  } else if (nodeIdOrKey && typeof nodeIdOrKey === 'object') {
    const key = `${nodeIdOrKey.q}_${nodeIdOrKey.r}`;
    nodeId = HEX_TO_NODE_MAP[key] || null;
  }

  const result: NodeQuestStatus = {
    primaryBadge: 'none',
    badges: [],
    turnInCount: 0,
    availableCount: 0,
    objectiveCount: 0,
    completedCount: 0,
    questList: []
  };

  if (!nodeId) return result;

  const node = (worldMapData as Record<string, any>)[nodeId];
  const nodeQuestIds: string[] = node?.quests || [];
  const allQuests = questsData as Record<string, any>;

  // Build sets of active and completed quest IDs from player's state
  const activeQuestsMap = new Map<string, any>();
  const completedQuestIds = new Set<string>();

  playerQuests.forEach(q => {
    const qId = q.id || q.quest_id;
    const isCompleted = q.stav === 'splneno' || q.stav === 'splněno' || q.status === 'completed';
    const isFailed = q.stav === 'selhani' || q.stav === 'selhání' || q.status === 'failed';

    if (isCompleted) {
      if (qId) completedQuestIds.add(qId);
    } else if (!isFailed) {
      if (qId) activeQuestsMap.set(qId, q);
    }
  });

  // 1. Check active quests in player's journal that target this location
  activeQuestsMap.forEach((playerQ, qId) => {
    const canonicalQ = allQuests[qId];
    const steps = canonicalQ?.steps || [];
    const currentStepIndex = playerQ.current_step || playerQ.krok || 1;
    const currentStep = steps.find((s: any) => s.id === currentStepIndex) || steps[0];

    const isLastStep = steps.length > 0 && currentStepIndex >= steps.length;
    const isReadyForTurnIn = playerQ.ready_for_turn_in || playerQ.stav === 'k_odevzdani' || (isLastStep && playerQ.objective_completed);

    // Target location for this step or turn-in
    const stepLocation = currentStep?.location_id || canonicalQ?.target_location_ids?.[0];
    const turnInLocation = canonicalQ?.start_location_id || 'oakhaven';

    if (isReadyForTurnIn && turnInLocation === nodeId) {
      result.turnInCount++;
      result.questList.push({
        id: qId,
        title: playerQ.nazev || playerQ.title || canonicalQ?.title || qId,
        type: 'turn_in',
        giver: canonicalQ?.giver_id,
        objective: 'Připraveno k odevzdání a převzetí odměny'
      });
    } else if (stepLocation === nodeId) {
      result.objectiveCount++;
      result.questList.push({
        id: qId,
        title: playerQ.nazev || playerQ.title || canonicalQ?.title || qId,
        type: 'objective',
        giver: canonicalQ?.giver_id,
        objective: currentStep?.objective || playerQ.cil || playerQ.objective || 'Aktivní cíl úkolu'
      });
    }
  });

  // 2. Check available quests at this node (not yet active or completed)
  nodeQuestIds.forEach(qId => {
    if (completedQuestIds.has(qId)) {
      result.completedCount++;
      return;
    }
    if (activeQuestsMap.has(qId)) {
      // Already processed above
      return;
    }

    const qData = allQuests[qId];
    if (!qData) return;

    // Check if quest starts at this node
    if (qData.start_location_id === nodeId) {
      result.availableCount++;
      result.questList.push({
        id: qId,
        title: qData.title || qId,
        type: 'available',
        giver: qData.giver_id,
        objective: qData.steps?.[0]?.objective || 'Nový úkol k dispozici'
      });
    }
  });

  // Determine badges list and primary badge
  const badges: QuestBadgeType[] = [];
  if (result.turnInCount > 0) badges.push('turn_in');
  if (result.availableCount > 0) badges.push('available');
  if (result.objectiveCount > 0) badges.push('objective');

  if (badges.length === 0 && result.completedCount > 0 && result.completedCount === nodeQuestIds.length) {
    badges.push('cleared');
  }

  result.badges = badges;

  // Primary badge priority: Turn In > Available > Objective > Cleared > None
  if (result.turnInCount > 0) {
    result.primaryBadge = 'turn_in';
  } else if (result.availableCount > 0) {
    result.primaryBadge = 'available';
  } else if (result.objectiveCount > 0) {
    result.primaryBadge = 'objective';
  } else if (badges.includes('cleared')) {
    result.primaryBadge = 'cleared';
  } else {
    result.primaryBadge = 'none';
  }

  return result;
}
