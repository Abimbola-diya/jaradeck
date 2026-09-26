// Client workspace helper for local database persistence (Dexie / localStorage fallback)

export async function getProjectBlocks(projectId = 'profile_portfolio_default') {
  try {
    const key = `jaradeck_blocks_${projectId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Failed to get project blocks:', err);
  }
  return [];
}

export async function saveProjectBlock(projectId = 'profile_portfolio_default', block) {
  try {
    const key = `jaradeck_blocks_${projectId}`;
    const existing = await getProjectBlocks(projectId);
    const updated = [block, ...existing.filter(b => b.id !== block.id)];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save project block:', err);
    return [];
  }
}

export async function stageLocalBlock(block) {
  return saveProjectBlock(block.projectId || 'profile_portfolio_default', block);
}

export default {
  getProjectBlocks,
  saveProjectBlock,
  stageLocalBlock,
};
