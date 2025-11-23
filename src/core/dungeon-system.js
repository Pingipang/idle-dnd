import { getDungeonsForRegion, getDungeonById } from "./dungeon-list.js";

export function createDungeonSystem() {
    let currentDungeonId = null;
    
    // Dungeon completion tracking: { dungeonId: { completed: bool, enemiesKilled: X } }
    let dungeonProgress = {};
    
    // Initialize progress for all dungeons
    function initializeDungeons() {
        const allRegions = ['corporate', 'startup', 'gaming', 'social', 'retail', 'techsupport', 'crypto', 'ceotower'];
        allRegions.forEach(regionId => {
            const dungeons = getDungeonsForRegion(regionId);
            dungeons.forEach(dungeon => {
                if (!dungeonProgress[dungeon.id]) {
                    dungeonProgress[dungeon.id] = {
                        completed: false,
                        enemiesKilled: 0,
                        attempts: 0
                    };
                }
            });
        });
    }
    
    initializeDungeons();
    
    // Get current dungeon data
    function getCurrentDungeon() {
        if (!currentDungeonId) return null;
        return getDungeonById(currentDungeonId);
    }
    
    // Enter a dungeon
    function enterDungeon(dungeonId) {
        const dungeon = getDungeonById(dungeonId);
        if (!dungeon) return { success: false, reason: "Dungeon not found" };
        
        currentDungeonId = dungeonId;
        dungeonProgress[dungeonId].attempts++;
        
        return { success: true, dungeon };
    }
    
    // Exit dungeon (return to region view)
    function exitDungeon() {
        currentDungeonId = null;
    }
    
    // Track enemy kill in current dungeon
    function addEnemyKill() {
        if (!currentDungeonId) return;
        dungeonProgress[currentDungeonId].enemiesKilled++;
    }
    
    // Complete dungeon (boss defeated or player died)
    function completeDungeon(success) {
        if (!currentDungeonId) return;
        
        if (success) {
            dungeonProgress[currentDungeonId].completed = true;
        }
        
        const dungeonId = currentDungeonId;
        currentDungeonId = null;
        
        return dungeonId;
    }
    
    // Get dungeon progress
    function getDungeonProgress(dungeonId) {
        return dungeonProgress[dungeonId] || { completed: false, enemiesKilled: 0, attempts: 0 };
    }
    
    // Get current dungeon progress
    function getCurrentProgress() {
        if (!currentDungeonId) return null;
        
        const dungeon = getCurrentDungeon();
        const progress = dungeonProgress[currentDungeonId];
        
        return {
            enemiesKilled: progress.enemiesKilled,
            enemiesRequired: dungeon.enemyCount,
            completed: progress.completed,
            completion: Math.min((progress.enemiesKilled / dungeon.enemyCount) * 100, 100)
        };
    }
    
    // Get all dungeons for a region with their status
    function getDungeonsStatus(regionId) {
        const dungeons = getDungeonsForRegion(regionId);
        
        return dungeons.map(dungeon => {
            const progress = getDungeonProgress(dungeon.id);
            
            return {
                ...dungeon,
                completed: progress.completed,
                enemiesKilled: progress.enemiesKilled,
                attempts: progress.attempts,
                isCurrent: dungeon.id === currentDungeonId
            };
        });
    }
    
    // Get completion count for region
    function getRegionDungeonCompletion(regionId) {
        const dungeons = getDungeonsForRegion(regionId);
        const completed = dungeons.filter(d => dungeonProgress[d.id]?.completed).length;
        
        return {
            completed,
            total: dungeons.length,
            percent: Math.floor((completed / dungeons.length) * 100)
        };
    }
    
    // Check if all dungeons in region are completed
    function isRegionCompleted(regionId) {
        const completion = getRegionDungeonCompletion(regionId);
        return completion.completed === completion.total;
    }
    
    // Reset (for new game)
    function reset() {
        currentDungeonId = null;
        dungeonProgress = {};
        initializeDungeons();
    }
    
    // Save/Load
    function getSaveData() {
        return {
            currentDungeonId,
            dungeonProgress: JSON.parse(JSON.stringify(dungeonProgress))
        };
    }
    
    function loadSaveData(data) {
        if (data.currentDungeonId !== undefined) currentDungeonId = data.currentDungeonId;
        if (data.dungeonProgress) dungeonProgress = data.dungeonProgress;
    }
    
    return {
        getCurrentDungeon,
        enterDungeon,
        exitDungeon,
        addEnemyKill,
        completeDungeon,
        getDungeonProgress,
        getCurrentProgress,
        getDungeonsStatus,
        getRegionDungeonCompletion,
        isRegionCompleted,
        reset,
        getSaveData,
        loadSaveData,
        get currentDungeonId() { return currentDungeonId; }
    };
}