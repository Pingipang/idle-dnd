import { regions, getRegionById, getAvailableRegions } from "./regions.js";

export function createRegionSystem() {
    let currentRegionId = "corporate"; // Start at first region
    
    // Progress tracking: { regionId: { enemyKills: X, bossDefeated: bool } }
    let regionProgress = {
        corporate: { enemyKills: 0, bossDefeated: false }
    };
    
    // Initialize all regions with 0 progress
    regions.forEach(region => {
        if (!regionProgress[region.id]) {
            regionProgress[region.id] = { enemyKills: 0, bossDefeated: false };
        }
    });
    
    // Get current region data
    function getCurrentRegion() {
        return getRegionById(currentRegionId);
    }
    
    // Change to different region
    function changeRegion(regionId, playerLevel, dungeonSystem) {
        const available = getAvailableRegions(playerLevel, regionProgress, dungeonSystem);
        const targetRegion = available.find(r => r.id === regionId);
        
        if (!targetRegion) {
            return { success: false, reason: "Region locked or not available" };
        }
        
        currentRegionId = regionId;
        return { success: true, region: targetRegion };
    }
    
    // Track enemy kill in current region
    function addEnemyKill(enemyName) {
        const region = getCurrentRegion();
        if (!region) return;
        
        // Only count kills from this region's enemy pool
        const isRegionEnemy = region.enemies.some(e => e.name === enemyName);
        if (!isRegionEnemy && enemyName !== region.boss) return;
        
        regionProgress[currentRegionId].enemyKills++;
    }
    
    // Track boss defeat
    function defeatBoss(bossName) {
        const region = getCurrentRegion();
        if (!region) return;
        
        if (bossName === region.boss) {
            regionProgress[currentRegionId].bossDefeated = true;
        }
    }
    
    // Calculate region completion percentage
    function getRegionCompletion(regionId, dungeonSystem) {
        const region = getRegionById(regionId);
        if (!region) return 0;
        
        const progress = regionProgress[regionId] || { enemyKills: 0, bossDefeated: false };
        
        // 40% from enemy kills, 40% from dungeon completion, 20% from boss
        const enemyPercent = Math.min((progress.enemyKills / region.enemyRequirement) * 40, 40);
        
        let dungeonPercent = 0;
        if (dungeonSystem) {
            const dungeonCompletion = dungeonSystem.getRegionDungeonCompletion(regionId);
            dungeonPercent = (dungeonCompletion.percent / 100) * 40;
        }
        
        const bossPercent = progress.bossDefeated ? 20 : 0;
        
        return Math.floor(enemyPercent + dungeonPercent + bossPercent);
    }
    
    // Get current region completion
    function getCurrentCompletion(dungeonSystem) {
        return getRegionCompletion(currentRegionId, dungeonSystem);
    }
    
    // Get progress data for current region
    function getCurrentProgress(dungeonSystem) {
        const region = getCurrentRegion();
        const progress = regionProgress[currentRegionId];
        
        return {
            enemyKills: progress.enemyKills,
            enemyRequired: region.enemyRequirement,
            bossDefeated: progress.bossDefeated,
            completion: getCurrentCompletion(dungeonSystem)
        };
    }
    
    // Get all regions with their completion status
    function getAllRegionsStatus(playerLevel, dungeonSystem) {
        const available = getAvailableRegions(playerLevel, regionProgress, dungeonSystem);
        
        return regions.map(region => {
            const isAvailable = available.some(r => r.id === region.id);
            const completion = getRegionCompletion(region.id, dungeonSystem);
            const progress = regionProgress[region.id];
            
            return {
                ...region,
                isAvailable,
                isLocked: !isAvailable,
                isCurrent: region.id === currentRegionId,
                completion,
                enemyKills: progress.enemyKills,
                bossDefeated: progress.bossDefeated
            };
        });
    }
    
    // Check if can spawn boss (based on enemy kills)
    function canSpawnBoss() {
        const region = getCurrentRegion();
        const progress = regionProgress[currentRegionId];
        
        // Boss spawns after 50% enemy requirement met
        return progress.enemyKills >= Math.floor(region.enemyRequirement * 0.5);
    }
    
    // Reset progress (for testing or new game)
    function reset() {
        currentRegionId = "corporate";
        regionProgress = {};
        regions.forEach(region => {
            regionProgress[region.id] = { enemyKills: 0, bossDefeated: false };
        });
    }
    
    // Save/Load support (for future localStorage)
    function getSaveData() {
        return {
            currentRegionId,
            regionProgress: JSON.parse(JSON.stringify(regionProgress))
        };
    }
    
    function loadSaveData(data) {
        if (data.currentRegionId) currentRegionId = data.currentRegionId;
        if (data.regionProgress) regionProgress = data.regionProgress;
    }
    
    return {
        getCurrentRegion,
        changeRegion,
        addEnemyKill,
        defeatBoss,
        getRegionCompletion,
        getCurrentCompletion,
        getCurrentProgress,
        getAllRegionsStatus,
        canSpawnBoss,
        reset,
        getSaveData,
        loadSaveData,
        get currentRegionId() { return currentRegionId; }
    };
}