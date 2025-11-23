export function createQuestSystem() {
    let activeQuests = [];
    let completedQuests = new Set();
    let questProgress = new Map(); // questId -> current progress

    function addQuest(quest) {
        if (activeQuests.length >= 5) return false; // Max 5 quests
        if (activeQuests.find(q => q.id === quest.id)) return false; // Already active
        if (completedQuests.has(quest.id)) return false; // Already completed

        activeQuests.push(quest);
        questProgress.set(quest.id, 0);
        return true;
    }

    function updateProgress(questId, amount = 1) {
        if (!questProgress.has(questId)) return;
        
        const current = questProgress.get(questId);
        const quest = activeQuests.find(q => q.id === questId);
        
        if (!quest) return;

        const newProgress = Math.min(current + amount, quest.targetCount);
        questProgress.set(questId, newProgress);

        // Check if completed
        if (newProgress >= quest.targetCount) {
            return completeQuest(questId);
        }

        return null;
    }

    function completeQuest(questId) {
        const questIndex = activeQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return null;

        const quest = activeQuests[questIndex];
        completedQuests.add(questId);
        activeQuests.splice(questIndex, 1);
        questProgress.delete(questId);

        return quest.rewards;
    }

    // Check progress for various actions
    function checkKill(enemyName) {
        const results = [];
        activeQuests.forEach(quest => {
            if (quest.type === "kill" && quest.target === enemyName) {
                const rewards = updateProgress(quest.id);
                if (rewards) results.push({ quest, rewards });
            }
        });
        return results;
    }

    function checkCollect(itemName, quantity = 1) {
        const results = [];
        activeQuests.forEach(quest => {
            if (quest.type === "collect" && quest.target === itemName) {
                const rewards = updateProgress(quest.id, quantity);
                if (rewards) results.push({ quest, rewards });
            }
        });
        return results;
    }

    function checkExplore() {
        const results = [];
        activeQuests.forEach(quest => {
            if (quest.type === "explore") {
                const rewards = updateProgress(quest.id);
                if (rewards) results.push({ quest, rewards });
            }
        });
        return results;
    }

    function checkSurvive(playerHp, maxHp, damageTaken) {
        const results = [];
        activeQuests.forEach(quest => {
            if (quest.type === "survive") {
                let shouldProgress = false;

                if (quest.id.includes("no_damage") && damageTaken === 0) {
                    shouldProgress = true;
                } else if (quest.id.includes("low_hp") && playerHp <= 10) {
                    shouldProgress = true;
                } else if (damageTaken === 0 || playerHp <= 10) {
                    shouldProgress = true;
                }

                if (shouldProgress) {
                    const rewards = updateProgress(quest.id);
                    if (rewards) results.push({ quest, rewards });
                }
            }
        });
        return results;
    }

    function checkBoss() {
        const results = [];
        activeQuests.forEach(quest => {
            if (quest.type === "boss") {
                const rewards = updateProgress(quest.id);
                if (rewards) results.push({ quest, rewards });
            }
        });
        return results;
    }

    function getActiveQuests() {
        return activeQuests.map(quest => ({
            ...quest,
            progress: questProgress.get(quest.id) || 0
        }));
    }

    function getAvailableQuests() {
        // Return empty array - quests are managed by region system now
        return [];
    }

    function getQuestProgress(questId) {
        return questProgress.get(questId) || 0;
    }
    
    // NEW: Clear all active quests (for region change)
    function clearActiveQuests() {
        activeQuests = [];
        questProgress.clear();
    }

    return {
        addQuest,
        checkKill,
        checkCollect,
        checkExplore,
        checkSurvive,
        checkBoss,
        getActiveQuests,
        getAvailableQuests,
        getQuestProgress,
        clearActiveQuests // NEW
    };
}