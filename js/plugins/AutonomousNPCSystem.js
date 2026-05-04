/*:
 * @target MZ
 * @plugindesc Enhanced Autonomous NPC System v2.1.0 - TreasureRoom Integration (Refactored)
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Enhanced Autonomous NPC System - TreasureRoom Integration
 * ============================================================================
 * (Help text remains identical to original)
 * ...
 */

(() => {
  "use strict";

  // ==========================================================================
  // CONFIGURATION & CONSTANTS
  // ==========================================================================
  const pluginName = "EnhancedAutonomousNPCSystem";
  const parameters = PluginManager.parameters(pluginName);

  const Config = {
    debugMode: parameters["debugMode"] === "true",
    interactionTime: Number(parameters["interactionTime"]) || 5000,
    spawnChance: Number(parameters["spawnChance"]) || 0.02,
    playerAwarenessRange: Number(parameters["playerAwarenessRange"]) || 4,
    flockingEnabled: parameters["flockingEnabled"] === "true",
    gameHourVariable: 23,
    nightStartHour: Number(parameters["nightStartHour"]) || 23,
    nightEndHour: Number(parameters["nightEndHour"]) || 6,

    EXIT_CHANCE_AFTER_ACTIVITY: 0.3,
    ABSENCE_UPDATE_INTERVAL: 300000,
    NIGHT_HOME_PROBABILITY: 0.85,
    DAY_HOME_PROBABILITY: 0.3,
    NIGHT_OUTSIDE_PROBABILITY: 0.2,
    DAY_OUTSIDE_PROBABILITY: 0.8,

    Zones: {
      BENCH: 100,
      SOCIAL: 101,
      MARKET: 102,
      AVOID: 103,
    },

    treasureRoomParentIds: [133],
    housePoolParentIds: [1132, 1133, 1134, 1135, 1136, 1137, 1394, 1156, 1157],

    mapGroups: {
      Ghent: { id: 618, type: "City", maps: [689, 704, 708, 709, 710, 715, 827, 1078, 1036, 1022, 1040, 1092, 1095, 1096, 1098, 1099, 1100, 1114, 1115, 1074, 1071, 1006] },
      GhentFields: { id: 1408, type: "Village", maps: [1035, 1037, 1038, 1041, 1042] },
      Antwerpen: { id: 1407, type: "Village", maps: [397, 1043, 1017, 1018, 1044, 1020, 1414] },
      OmegaTower: { id: 536, type: "City", maps: [1, 102, 141, 313, 349, 503, 508, 532, 533, 540, 541, 631, 635, 686, 1129, 1130, 1131, 721] },
    },

    CHARACTER_GRAPHICS: ["Actor1", "Actor1RMVX", "Actor2", "Actor2RMVX", "Actor3", "Actor3RMVX", "Dungeon_Monsters1", "Evil01", "Evil01Color", "Fantasy_Characters1", "Fantasy_Characters3", "Fantasy_Characters4", "FarmCharacters01RM", "GrayHeroes01", "GrayEvil01", "GrayHeroes02", "GrayNPCs01", "Heroes01Color", "NPCs01Color", "NPCs02Color", "NPCs03Color", "Occult_Characters", "School01RM", "School01RM-GB", "School01RM-Gray"],
    SKAB_CHARACTER_GRAPHICS: ["Skab/!$KillerBot", "Skab/!$2", "Skab/!$3", "Skab/!$AirlinePilot", "Skab/!$AlienDargos", "Skab/!$AlienGrey", "Skab/!$AlienTrucker", "Skab/!$AlpineGuide", "Skab/!$Anarchist", "Skab/!$AnarchistSamurai", "Skab/!$11", "Skab/!$AndroidArchpriest", "Skab/!$AndroidExperiment", "Skab/!$14", "Skab/!$Archivist", "Skab/!$ArchivistBackpacker", "Skab/!$AvianCommando", "Skab/!$ArchivistGuard", "Skab/!$19", "Skab/!$AvianNoble", "Skab/!$21", "Skab/!$Farmer", "Skab/!$GoblinRecruit", "Skab/!$GoblinShogun", "Skab/!$BotSpaceman", "Skab/!$BotGuardian", "Skab/!$GnomeExplorer", "Skab/!$28", "Skab/!$Catboy", "Skab/!$CatCourier", "Skab/!$ElvenPirate", "Skab/!$32", "Skab/!$33", "Skab/!$VoidPerson", "Skab/!$Witch1", "Skab/!$SwordInstructor", "Skab/!$Samurai", "Skab/!$SchoolTeacher", "Skab/!$PirateAdventurer", "Skab/!$OrcSamurai", "Skab/!$AncientWitch", "Skab/!$BotSamurai", "Skab/!$DesertPunk", "Skab/!$Doctor2", "Skab/!$ElvenSpacer", "Skab/!$ExoticBard", "Skab/!$Fisherman", "Skab/!$GoblinIllusionist", "Skab/!$HighCommand", "Skab/!$LeatherDaddy", "Skab/!$Lich", "Skab/!$Madman", "Skab/!$Mafia", "Skab/!$Nurse2", "Skab/!$PrimaryDoctor", "Skab/!$WastelandParamedic"],
    NAME_DATABASES: ["entomologist", "perifery", "temporal_drift", "petro_vessel", "wannabe_wizard", "inmate", "girlboss", "fortune_teller", "rapper", "cleaner", "priest", "guide", "farmer", "taxi", "blacksmith", "steelworker", "artist", "hypernet_worker", "politician", "elven_ambassador", "dungeon_explorer", "mailman", "communist_preacher", "shy_vampire", "decadent_noble", "goth", "thug", "scribe", "zombie_alien", "commuter", "fae_queen", "caveman", "fisherman", "semiwild_goblin", "botique", "icecream"]
  };
  Config.MIXED_CHARACTER_POOL = [...Config.CHARACTER_GRAPHICS, ...Config.SKAB_CHARACTER_GRAPHICS];

  // ==========================================================================
  // UTILITIES
  // ==========================================================================
  const Utils = {
    debug: (message) => {
      if (Config.debugMode) console.log(`[NPC System] ${message}`);
    },
    distance: (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
    euclideanDistance: (a, b) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    randomElement: (array) => array[Math.floor(Math.random() * array.length)],
    randBetween: (min, max) => min + Math.random() * (max - min),
    seededRandom: (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    },
    createSeed: (mapId, x, y) => mapId * 1000000 + x * 1000 + y,
    isExitEvent: (name) => name.startsWith("House") || name.startsWith("Transfer") || name.startsWith("Door ("),
    isValidTileType: (x, y) => {
      const tileId = $gameMap.tileId(x, y, 0);
      return (tileId >= 1536 && tileId < 1664) || (tileId >= 2048 && tileId < 2816) || (tileId >= 2816 && tileId < 4352);
    }
  };

  // ==========================================================================
  // TIME & PRESENCE MANAGEMENT
  // ==========================================================================
  const PresenceManager = {
    lastAbsenceUpdateTime: 0,
    currentHouseAbsenceProbability: 0.5,

    getGameHour: () => $gameVariables ? ($gameVariables.value(Config.gameHourVariable) || 0) : 12,
    isNightTime: (hour) => Config.nightStartHour > Config.nightEndHour
      ? (hour >= Config.nightStartHour || hour < Config.nightEndHour)
      : (hour >= Config.nightStartHour && hour < Config.nightEndHour),

    updateGlobalHouseAbsenceProbability: function () {
      const currentTime = Date.now();
      if (currentTime - this.lastAbsenceUpdateTime < Config.ABSENCE_UPDATE_INTERVAL) return;

      const isNight = this.isNightTime(this.getGameHour());
      const baseProbability = isNight ? Config.NIGHT_HOME_PROBABILITY : Config.DAY_HOME_PROBABILITY;
      const variance = (Math.random() - 0.5) * 0.2;

      this.currentHouseAbsenceProbability = Math.max(0.1, Math.min(0.9, baseProbability + variance));
      this.lastAbsenceUpdateTime = currentTime;
      Utils.debug(`[House Prob Update] Time: ${this.getGameHour()}:00 | Home prob: ${(this.currentHouseAbsenceProbability * 100).toFixed(1)}%`);
    },

    getHouseHomeProbability: function () {
      this.updateGlobalHouseAbsenceProbability();
      return this.currentHouseAbsenceProbability;
    },

    getOutsidePresenceProbability: function () {
      const isNight = this.isNightTime(this.getGameHour());
      const baseProbability = isNight ? Config.NIGHT_OUTSIDE_PROBABILITY : Config.DAY_OUTSIDE_PROBABILITY;
      const variance = (Math.random() - 0.5) * 0.2;
      return Math.max(0.05, Math.min(0.95, baseProbability + variance));
    }
  };

  // ==========================================================================
  // MAP & DATA MANAGEMENT
  // ==========================================================================
  const MapManager = {
    getMapName: (mapId) => ($dataMapInfos && $dataMapInfos[mapId]) ? $dataMapInfos[mapId].name : `Map ${mapId}`,
    isMapChild: (mapId, parentIds) => {
      if (!mapId || typeof mapId !== "number" || !$dataMapInfos || !$dataMapInfos[mapId]) return false;
      return parentIds.includes($dataMapInfos[mapId].parentId);
    },
    isTreasureRoom: (mapId) => MapManager.isMapChild(mapId, Config.treasureRoomParentIds),
    isHouseMap: (mapId) => MapManager.isMapChild(mapId, Config.housePoolParentIds),

    setCurrentMapGroup: (mapGroup) => {
      if (!$gameSystem) return;
      $gameSystem._npcSystemCurrentMapGroup = mapGroup;
    },
    getCurrentMapGroup: () => $gameSystem ? $gameSystem._npcSystemCurrentMapGroup : null,

    findMapGroupByMap: (mapId) => {
      for (const [groupName, group] of Object.entries(Config.mapGroups)) {
        if (group.maps && group.maps.includes(mapId)) return groupName;
      }
      return null;
    },

    getNPCSpawnLimit: () => MapManager.isHouseMap($gameMap.mapId()) ? 3 : 8,

    getBorderTiles: (onlyValid = false) => {
      const tiles = [];
      const w = $gameMap.width();
      const h = $gameMap.height();

      for (let x = 0; x < w; x++) {
        if ($gameMap.isPassable(x, 0, 2) && (!onlyValid || Utils.isValidTileType(x, 0))) tiles.push({ x, y: 0 });
        if ($gameMap.isPassable(x, h - 1, 8) && (!onlyValid || Utils.isValidTileType(x, h - 1))) tiles.push({ x, y: h - 1 });
      }
      for (let y = 0; y < h; y++) {
        if ($gameMap.isPassable(0, y, 6) && (!onlyValid || Utils.isValidTileType(0, y))) tiles.push({ x: 0, y });
        if ($gameMap.isPassable(w - 1, y, 4) && (!onlyValid || Utils.isValidTileType(w - 1, y))) tiles.push({ x: w - 1, y });
      }
      return tiles;
    },

    findPassableTerrainTiles: () => {
      const mapId = $gameMap.mapId();
      if ($gameMap._passableTerrainCache && $gameMap._passableTerrainCache.mapId === mapId) {
        return $gameMap._passableTerrainCache.tiles;
      }

      const passableTiles = [];
      const w = $gameMap.width();
      const h = $gameMap.height();

      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          if (![2, 4, 6, 8].some(dir => $gameMap.isPassable(x, y, dir))) continue;

          const regionId = $gameMap.regionId(x, y);
          if (regionId === 10 || regionId === Config.Zones.AVOID) continue;
          if ($gameMap.eventsXy(x, y).length > 0) continue;

          if (Utils.isValidTileType(x, y)) {
            passableTiles.push({ x, y });
          }
        }
      }
      $gameMap._passableTerrainCache = { mapId, tiles: passableTiles };
      return passableTiles;
    },

    loadMapData: (mapId) => {
      if ($dataMap && $dataMap.id === mapId) return $dataMap;
      const mapFileName = `Map${String(mapId).padStart(3, "0")}.json`;

      try {
        if (typeof StorageManager !== "undefined" && StorageManager.fileExists) {
          const fullPath = (StorageManager.isLocalMode ? "data/" : "data/") + mapFileName;
          if (StorageManager.fileExists(fullPath)) return JSON.parse(StorageManager.fileRead(fullPath));
        }
      } catch (e) { }

      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `data/${mapFileName}`, false);
        xhr.send();
        if (xhr.status === 200) return JSON.parse(xhr.responseText);
      } catch (e) { }

      return window.$dataMap && window.$dataMap.id === mapId ? window.$dataMap : null;
    }
  };

  // ==========================================================================
  // PERSISTENCE SYSTEM
  // ==========================================================================
  const Persistence = {
    initializeMapData: () => {
      if (!$gameSystem) return null;
      if (!$gameSystem._npcMapData) {
        $gameSystem._npcMapData = {
          npcPositions: {}, mapAssignments: {}, visitedMaps: {}, lastMigrationTime: {}, recentMaps: [],
        };
      }
      return $gameSystem._npcMapData;
    },

    saveNPCPositions: () => {
      if (!$gameSystem || !$gameSystem.npcControllers) return;
      const npcData = Persistence.initializeMapData();
      if (!npcData) return;

      const mapId = $gameMap.mapId();
      const npcSnapshot = $gameSystem.npcControllers.reduce((acc, c) => {
        const evData = c.event?.event();
        if (evData && c.eventName) {
          acc.push({
            name: c.eventName, x: c.event.x, y: c.event.y,
            isAbsent: c.isAbsent || false,
            characterName: evData.characterName, characterIndex: evData.characterIndex
          });
        }
        return acc;
      }, []);

      npcData.recentMaps = (npcData.recentMaps || []).filter(m => m.mapId !== mapId);
      npcData.recentMaps.unshift({ mapId, npcs: npcSnapshot, timestamp: Date.now() });
      if (npcData.recentMaps.length > 2) npcData.recentMaps = npcData.recentMaps.slice(0, 2);
    },

    getRecentMapNPCs: (mapId) => {
      const npcData = Persistence.initializeMapData();
      return npcData?.recentMaps?.find(m => m.mapId === mapId)?.npcs || null;
    }
  };

  // ==========================================================================
  // SPAWN & PROCEDURAL MANAGERS
  // ==========================================================================
  const SpawnManager = {
    buildNPCPool: (mapData) => {
      return (mapData?.events || []).filter(ev =>
        ev && ev.note?.toLowerCase().includes("ai") &&
        ev.pages?.length > 0 && ev.pages.some(p => p?.list?.length > 1)
      ).map(ev => ({ eventData: ev, eventId: ev.id }));
    },

    getPlaceholders: () => {
      let placeholders = [];
      for (let i = 1; i <= 8; i++) {
        const ev = $gameMap.events().find(e => e?.event()?.name === `Player${i}`);
        if (ev) placeholders.push({ event: ev, originalX: ev.x, originalY: ev.y });
      }
      if (!placeholders.length) {
        placeholders = $gameMap.events()
          .filter(e => e?.event()?.name.startsWith("NPC") || e?.event()?.name.startsWith("Placeholder"))
          .map(ev => ({ event: ev, originalX: ev.x, originalY: ev.y }));
      }
      return placeholders;
    },

    transplantData: (targetEvent, npcData, index) => {
      const originalData = targetEvent.event();
      originalData.pages = JSON.parse(JSON.stringify(npcData.pages));
      originalData.name = npcData.name || `NPC${index + 1}`;
      originalData.characterName = npcData.characterName;
      originalData.characterIndex = npcData.characterIndex;
      originalData.note = npcData.note;

      for (const page of originalData.pages) {
        if (!page.conditions) continue;
        Object.assign(page.conditions, { switch1Valid: false, switch2Valid: false, variableValid: false, actorValid: false, itemValid: false, selfSwitchValid: false });
      }

      const refImg = originalData.pages.map(p => p?.image).find(img => img?.characterName);
      if (refImg) {
        for (const page of originalData.pages) {
          if (page?.image && !page.image.characterName) {
            page.image.characterName = refImg.characterName;
            page.image.characterIndex = refImg.characterIndex;
          }
        }
      }

      targetEvent.refresh();
      targetEvent.setupPage();
      return !!targetEvent.page();
    },

    injectBrain: (targetEvent, originalData, npcDataItem, isHouse) => {
      if (!originalData.note?.includes('<AI>')) {
        targetEvent.setOpacity(255);
        targetEvent.setThrough(false);
        return;
      }

      const controller = new NPCController(originalData.name);
      targetEvent.setMoveSpeed(controller.moveSpeed);
      targetEvent.setMoveFrequency(5);

      if (npcDataItem.isAbsent !== undefined) {
        controller.isAbsent = npcDataItem.isAbsent;
      } else if (isHouse) {
        controller.isAbsent = Math.random() >= PresenceManager.getHouseHomeProbability();
      } else {
        controller.isAbsent = Math.random() >= PresenceManager.getOutsidePresenceProbability();
      }

      if (controller.isAbsent) {
        const borderTiles = MapManager.getBorderTiles(isHouse);
        if (borderTiles.length > 0) {
          const hidingSpot = Utils.randomElement(borderTiles);
          targetEvent.locate(hidingSpot.x, hidingSpot.y);
        }
        targetEvent.setOpacity(0);
        targetEvent.setThrough(true);
      } else {
        targetEvent.setOpacity(255);
        targetEvent.setThrough(false);
      }

      $gameSystem.npcControllers = $gameSystem.npcControllers || [];
      $gameSystem.npcControllers.push(controller);
      controller.decideNextGoal();
    },

    replacePlayerEventsWithNPCs: (mapGroup, seed = null) => {
      const currentMapId = $gameMap.mapId();
      if (!mapGroup || !$gameMap?.events || MapManager.isTreasureRoom(currentMapId)) return;

      const poolMapData = MapManager.loadMapData(mapGroup.id);
      if (!poolMapData) return;

      const npcPool = SpawnManager.buildNPCPool(poolMapData);
      const allPlaceholders = SpawnManager.getPlaceholders();
      if (!npcPool.length || !allPlaceholders.length) return;

      const isHouse = MapManager.isHouseMap(currentMapId);
      const recentNPCs = Persistence.getRecentMapNPCs(currentMapId);

      let selectedNPCs = [];
      let actualCount = 0;

      if (recentNPCs?.length) {
        actualCount = Math.min(recentNPCs.length, allPlaceholders.length);
        for (let i = 0; i < actualCount; i++) {
          const npcData = npcPool.find(n => n.eventData.name === recentNPCs[i].name);
          if (npcData) selectedNPCs.push({ ...npcData, savedPosition: { x: recentNPCs[i].x, y: recentNPCs[i].y }, isAbsent: recentNPCs[i].isAbsent });
        }
      } else {
        const maxNPCs = Math.min(Math.floor(($gameMap.width() * $gameMap.height()) / 120), MapManager.getNPCSpawnLimit());
        actualCount = Math.min(Math.floor(Math.random() * (maxNPCs + 1)), allPlaceholders.length, npcPool.length);
        const poolCopy = [...npcPool];
        for (let i = 0; i < actualCount; i++) {
          const randIdx = Math.floor(Math.random() * poolCopy.length);
          selectedNPCs.push(poolCopy.splice(randIdx, 1)[0]);
        }
      }

      const validTiles = MapManager.findPassableTerrainTiles().filter(t => $gameMap.regionId(t.x, t.y) !== Config.Zones.AVOID).sort(() => Math.random() - 0.5);
      const activePlaceholders = allPlaceholders.sort(() => Math.random() - 0.5).slice(0, actualCount);
      const unusedPlaceholders = allPlaceholders.slice(actualCount);

      for (let i = 0; i < activePlaceholders.length; i++) {
        const { event: targetEvent } = activePlaceholders[i];
        const npcDataItem = selectedNPCs[i];

        if (!targetEvent || !npcDataItem?.eventData) { targetEvent?.erase(); continue; }

        if (!SpawnManager.transplantData(targetEvent, npcDataItem.eventData, i)) {
          targetEvent.erase();
          continue;
        }

        if (npcDataItem.savedPosition) {
          targetEvent.locate(npcDataItem.savedPosition.x, npcDataItem.savedPosition.y);
        } else if (i < validTiles.length) {
          targetEvent.locate(validTiles[i].x, validTiles[i].y);
        }

        SpawnManager.injectBrain(targetEvent, targetEvent.event(), npcDataItem, isHouse);
      }

      unusedPlaceholders.forEach(u => u.event.erase());
    }
  };

  const ProceduralManager = {
    setupProceduralMapNPCs: () => {
      if (!$gameMap || !$dataMap) return;

      const worldX = $gameVariables.value(43) || 1;
      const worldY = $gameVariables.value(44) || 1;
      const baseSeed = (worldX * 73856093) ^ (worldY * 19349663);

      const npcEvents = $gameMap.events().filter(e => e?.event()?.name.match(/^(NPC|Player)/));
      if (!npcEvents.length) return;

      const isCityBiome = ($gameSystem?._procGenData?.currentBiome || "Fields").toLowerCase().includes("city");
      let activeEvents = npcEvents;

      if (!isCityBiome) {
        const cullRng = Utils.seededRandom(baseSeed ^ 0xdeadbeef);
        const keepCount = Math.max(1, Math.ceil(npcEvents.length * (0.3 + cullRng * 0.4)));
        const indices = Array.from({ length: npcEvents.length }, (_, i) => i);

        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Utils.seededRandom(baseSeed ^ (i * 12345)) * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const toCull = indices.slice(keepCount);
        toCull.forEach(idx => $gameMap.eraseEvent(npcEvents[idx].eventId()));
        activeEvents = npcEvents.filter((_, i) => !toCull.includes(i));
      }

      const validTiles = MapManager.findPassableTerrainTiles();
      for (let i = validTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Utils.seededRandom(baseSeed ^ (i * 54321)) * (i + 1));
        [validTiles[i], validTiles[j]] = [validTiles[j], validTiles[i]];
      }

      activeEvents.forEach((ev, i) => {
        if (i < validTiles.length) ev.locate(validTiles[i].x, validTiles[i].y);

        const graphicSeed = baseSeed ^ (ev.eventId() * 83492791);
        const charName = Config.MIXED_CHARACTER_POOL[Math.floor(Utils.seededRandom(graphicSeed) * Config.MIXED_CHARACTER_POOL.length)];
        const charIdx = Math.floor(Utils.seededRandom(graphicSeed * 2) * 8);

        const evData = ev.event();
        evData.pages?.forEach(p => { if (p) { p.image = p.image || {}; p.image.characterName = charName; p.image.characterIndex = charIdx; } });
        evData.characterName = charName;
        evData.characterIndex = charIdx;

        ev.setImage(charName, charIdx);
        ev.refresh();
        ev.setupPage();

        let genName = "NPC";
        if (window.generateSeededMarkovName) {
          const dbId = Config.NAME_DATABASES[Math.floor(Utils.seededRandom(graphicSeed) * Config.NAME_DATABASES.length)];
          try { genName = window.generateSeededMarkovName(worldX, worldY, ev.eventId(), dbId, 2, 4, 12); } catch (e) { }
        }
        evData.name = genName;

        const controller = new NPCController(genName);
        $gameSystem.npcControllers.push(controller);
        controller.decideNextGoal();
      });
    }
  };

  // ==========================================================================
  // CORE AI CLASSES
  // ==========================================================================
  class Pathfinder {
    constructor(character) { this.character = character; }

    isPassable(x, y, d) {
      const r = $gameMap.regionId(x, y);
      if (r === 5) return true;
      if (r === 10 || r === Config.Zones.AVOID) return false;

      const events = $gameMap.eventsXyNt(x, y);
      if (events.some(ev => ev && !ev.isThrough() && ev !== this.character && !ev.event()?.name.startsWith("door_"))) return false;

      if (d) return this.character.canPass(x, y, d);
      return [2, 4, 6, 8].some(dir => $gameMap.isPassable(x, y, dir));
    }

    findPath(startX, startY, goalX, goalY, avoidEnemies = true, avoidNPCs = true) {
      const openSet = [], closedSet = new Set(), cameFrom = new Map(), gScore = new Map(), fScore = new Map();
      const mapW = $gameMap.width();
      const getKey = (x, y) => x + y * mapW;

      const startK = getKey(startX, startY);
      const goalK = getKey(goalX, goalY);

      openSet.push(startK);
      gScore.set(startK, 0);
      fScore.set(startK, Utils.distance({ x: startX, y: startY }, { x: goalX, y: goalY }));

      let iterations = 0;
      while (openSet.length > 0 && iterations++ < 500) {
        openSet.sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity));
        const currentK = openSet.shift();

        if (currentK === goalK) return this.reconstructPath(cameFrom, currentK);
        closedSet.add(currentK);

        const x = currentK % mapW, y = Math.floor(currentK / mapW);
        const neighbors = [{ x, y: y - 1, d: 8 }, { x, y: y + 1, d: 2 }, { x: x - 1, y, d: 4 }, { x: x + 1, y, d: 6 }];

        for (const { x: nx, y: ny, d: dir } of neighbors) {
          const nK = getKey(nx, ny);
          if (!$gameMap.isValid(nx, ny) || closedSet.has(nK) || !this.character.canPass(x, y, dir) || !this.isPassable(nx, ny)) continue;

          if (avoidEnemies && $gameMap.events().some(e => e?.event()?.name.startsWith("Enemy") && Utils.distance({ x: nx, y: ny }, { x: e.x, y: e.y }) < 3)) continue;
          if (avoidNPCs && $gameSystem.npcControllers?.some(c => c.event && c.event !== this.character && c.event.x === nx && c.event.y === ny)) continue;

          const tGScore = (gScore.get(currentK) || 0) + 1;
          if (!openSet.includes(nK)) openSet.push(nK);
          else if (tGScore >= (gScore.get(nK) || Infinity)) continue;

          cameFrom.set(nK, { pos: currentK, dir });
          gScore.set(nK, tGScore);
          fScore.set(nK, tGScore + Utils.distance({ x: nx, y: ny }, { x: goalX, y: goalY }));
        }
      }
      return null;
    }

    reconstructPath(cameFrom, current) {
      const path = [];
      while (cameFrom.has(current)) {
        const node = cameFrom.get(current);
        path.unshift(node.dir);
        current = node.pos;
      }
      return path;
    }
  }

  class NPCController {
    constructor(eventName) {
      this.eventName = eventName;
      this.refreshEvent();
      this.state = "idle";
      this.target = null;
      this.path = [];
      this.isAbsent = false;

      this.lastUpdateTime = performance.now();
      this.nextMoveTime = this.lastUpdateTime + Utils.randBetween(2000, 5000);
      this.stateEndTime = this.lastUpdateTime + Utils.randBetween(3000, 6000);

      this.moveSpeed = 3;
      this.playerAware = false;
      this.lastPlayerReaction = 0;
      this.velocity = { x: 0, y: 0 };
    }

    refreshEvent() {
      this.event = $gameMap.events().find(e => e?.event()?.name === this.eventName);
      this.eventId = this.event?.eventId();
      if (this.event) this.pathfinder = new Pathfinder(this.event);
    }

    update() {
      const time = performance.now();
      this.lastUpdateTime = time;

      if (!this.event || this.isAbsent) return this.handleAbsence();
      if ($gameMap.isEventRunning() && $gameMap._interpreter.eventId() === this.eventId) {
        if (this.state !== "talkingToPlayer") { this.state = "talkingToPlayer"; this.path = []; }
        this.turnToward($gamePlayer);
        return;
      }
      if (this.state === "talkingToPlayer") this.decideNextGoal();
      if (this.checkForExit()) return;

      this.updatePlayerAwareness(time);
      this[`update${this.state.charAt(0).toUpperCase() + this.state.slice(1)}`]?.(time);
    }

    handleAbsence() { if (Math.random() < Config.spawnChance * 0.016) this.spawn(); }

    spawn() {
      const pts = MapManager.getBorderTiles(MapManager.isHouseMap($gameMap.mapId()));
      if (!pts.length) return;
      this.refreshEvent();
      if (this.event) {
        this.event.locate(Utils.randomElement(pts).x, Utils.randomElement(pts).y);
        this.event.setOpacity(0);
        this.event.fadeIn();
        this.event.setThrough(false);
        this.isAbsent = false;
        this.decideNextGoal();
      }
    }

    updatePlayerAwareness(time) {
      if (!this.event) return;
      const wasAware = this.playerAware;
      this.playerAware = Utils.distance(this.event, $gamePlayer) <= Config.playerAwarenessRange * 0.5;
      if (this.playerAware && !wasAware && time - this.lastPlayerReaction > 20000 && Math.random() < 0.25) {
        this.lastPlayerReaction = time;
        $gameTemp.requestBalloon(this.event, Utils.randomElement([1, 11, 4, 3]));
        this.turnToward($gamePlayer);
      }
    }

    updateIdle(time) {
      if (time >= this.nextMoveTime) this.decideNextGoal();
      else if (Math.random() < 0.02) this.event.setDirection(2 + Math.floor(Math.random() * 4) * 2);
    }

    updateWandering(time) {
      if (time >= this.stateEndTime) return this.decideNextGoal();
      if (!this.event.isMoving() && time >= this.nextMoveTime) {
        const dir = this.getWanderDir();
        if (dir) this.event.moveStraight(dir);
        this.nextMoveTime = time + Utils.randBetween(1000, 3000);
      }
    }

    updateGoingToZone(time) {
      if (!this.target || time >= this.stateEndTime) return this.decideNextGoal();
      if (!this.path.length) return this.enterZone();
      if (!this.event.isMoving()) {
        const dir = this.path.shift();
        if (dir && this.event.canPass(this.event.x, this.event.y, dir)) this.event.moveStraight(dir);
        else this.calculatePath();
      }
    }

    updateInZone(time) {
      const rId = $gameMap.regionId(this.event.x, this.event.y);
      if (rId === Config.Zones.BENCH) this.updateResting(time);
      else if (rId === Config.Zones.SOCIAL) this.updateSocializing(time);
      else if (rId === Config.Zones.MARKET) this.updateShopping(time);
      else if (time >= this.stateEndTime) this.decideNextGoal();
    }

    updateResting(time) {
      if (time >= this.stateEndTime) Math.random() < Config.EXIT_CHANCE_AFTER_ACTIVITY ? this.startExiting() : this.decideNextGoal();
      else if (Math.random() < 0.01) $gameTemp.requestBalloon(this.event, 10);
    }

    updateShopping(time) {
      if (time >= this.stateEndTime) return Math.random() < Config.EXIT_CHANCE_AFTER_ACTIVITY ? this.startExiting() : this.decideNextGoal();
      if (!this.event.isMoving() && Math.random() < 0.05) {
        const dir = 2 + Math.floor(Math.random() * 4) * 2;
        if ($gameMap.regionId($gameMap.roundXWithDirection(this.event.x, dir), $gameMap.roundYWithDirection(this.event.y, dir)) === Config.Zones.MARKET) {
          this.event.moveStraight(dir);
        }
      }
    }

    updateSocializing(time) {
      if (time >= this.stateEndTime) Math.random() < Config.EXIT_CHANCE_AFTER_ACTIVITY ? this.startExiting() : this.decideNextGoal();
    }

    updateExiting() {
      if (!this.path.length || this.checkForExit()) return;
      if (!this.event.isMoving() && this.path[0]) this.event.moveStraight(this.path.shift());
    }

    decideNextGoal() {
      const zones = this.getZones();
      const goals = [{ t: "wander", w: 30 }, { t: "exit", w: 10 }];
      if (zones.bench.length) goals.push({ t: "rest", w: 15 });
      if (zones.social.length) goals.push({ t: "socialize", w: 25 });
      if (zones.market.length) goals.push({ t: "shop", w: 20 });

      let rand = Math.random() * goals.reduce((s, g) => s + g.w, 0);
      for (const g of goals) {
        if ((rand -= g.w) <= 0) return this.setGoal(g.t, zones);
      }
    }

    setGoal(type, zones) {
      const time = performance.now();
      if (type === "wander") { this.state = "wandering"; this.stateEndTime = time + Utils.randBetween(10000, 20000); }
      else if (type === "exit") this.startExiting();
      else {
        this.target = Utils.randomElement(zones[{ rest: 'bench', socialize: 'social', shop: 'market' }[type]]);
        this.state = "goingToZone";
        this.calculatePath();
      }
      if (this.event) this.event.setMoveSpeed(type === "wander" && Math.random() < 0.7 ? 3 : 4);
    }

    calculatePath() {
      if (this.event && this.target) this.path = this.pathfinder.findPath(this.event.x, this.event.y, this.target.x, this.target.y) || [];
      if (!this.path.length) this.decideNextGoal();
    }

    enterZone() {
      const map = { [Config.Zones.BENCH]: 'resting', [Config.Zones.SOCIAL]: 'socializing', [Config.Zones.MARKET]: 'shopping' };
      this.state = map[$gameMap.regionId(this.event.x, this.event.y)] || "inZone";
      this.stateEndTime = performance.now() + Utils.randBetween(5000, 15000);
    }

    getZones() {
      const z = { bench: [], social: [], market: [] };
      for (let x = 0; x < $gameMap.width(); x++) for (let y = 0; y < $gameMap.height(); y++) {
        const r = $gameMap.regionId(x, y);
        if (r === Config.Zones.BENCH) z.bench.push({ x, y });
        else if (r === Config.Zones.SOCIAL) z.social.push({ x, y });
        else if (r === Config.Zones.MARKET) z.market.push({ x, y });
      }
      return z;
    }

    getWanderDir() {
      const dirs = [2, 4, 6, 8], weights = [];
      for (const dir of dirs) {
        let w = this.event.canPass(this.event.x, this.event.y, dir) ? 1 : 0;
        if (w > 0) {
          const nx = $gameMap.roundXWithDirection(this.event.x, dir), ny = $gameMap.roundYWithDirection(this.event.y, dir);
          const r = $gameMap.regionId(nx, ny);
          if (r === Config.Zones.AVOID) w = 0;
          else if ([Config.Zones.BENCH, Config.Zones.SOCIAL, Config.Zones.MARKET].includes(r)) w *= 1.5;
          if ($gameSystem.npcControllers.some(c => c.event && c.event !== this.event && c.event.x === nx && c.event.y === ny)) w *= 0.3;
        }
        weights.push(w);
      }
      const tw = weights.reduce((a, b) => a + b, 0);
      if (!tw) return null;
      let r = Math.random() * tw;
      return dirs[weights.findIndex(w => (r -= w) <= 0)];
    }

    turnToward(char) {
      if (!this.event || !char) return;
      const sx = this.event.deltaXFrom(char.x), sy = this.event.deltaYFrom(char.y);
      this.event.setDirection(Math.abs(sx) > Math.abs(sy) ? (sx > 0 ? 4 : 6) : (sy > 0 ? 8 : 2));
    }

    startExiting() {
      const exits = $gameMap.events().filter(e => Utils.isExitEvent(e?.event()?.name || ""));
      if (!exits.length) return this.decideNextGoal();
      const dest = Utils.randomElement(exits);
      this.path = this.pathfinder.findPath(this.event.x, this.event.y, dest.x, dest.y);
      this.path?.length ? this.state = "exiting" : this.decideNextGoal();
    }

    checkForExit() {
      if (!this.event) return false;
      const chk = (x, y) => $gameMap.eventsXy(x, y).some(e => Utils.isExitEvent(e?.event()?.name || ""));
      if (chk(this.event.x, this.event.y) || chk($gameMap.roundXWithDirection(this.event.x, this.event.direction()), $gameMap.roundYWithDirection(this.event.y, this.event.direction()))) {
        this.exitMap();
        return true;
      }
      return false;
    }

    exitMap() {
      this.event.setImage("", 0);
      this.event._moveType = 0;
      this.event.fadeOut();
      setTimeout(() => {
        if (this.event) {
          const pts = MapManager.getBorderTiles(MapManager.isHouseMap($gameMap.mapId()));
          if (pts.length) this.event.locate(Utils.randomElement(pts).x, Utils.randomElement(pts).y);
          this.event.setOpacity(0);
          this.event.setThrough(true);
        }
      }, 500);
      this.isAbsent = true;
      this.state = "idle";
    }
  }

  // ==========================================================================
  // ENGINE HOOKS & OVERRIDES
  // ==========================================================================

  // Safe findProperPageIndex override
  const _Game_Event_findProperPageIndex = Game_Event.prototype.findProperPageIndex;
  Game_Event.prototype.findProperPageIndex = function () {
    try { return _Game_Event_findProperPageIndex.call(this); }
    catch (e) { return -1; }
  };

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this.npcControllers = [];
    this._npcSystemCurrentMapGroup = null;
    Persistence.initializeMapData();
    PresenceManager.lastAbsenceUpdateTime = 0;
  };

  const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function () {
    _Game_System_onAfterLoad?.call(this);
    this.restoreNPCControllers();
  };

  Game_System.prototype.restoreNPCControllers = function () {
    if (!$dataMap || !$gameMap?.events) return setTimeout(() => this.restoreNPCControllers(), 100);
    this.npcControllers?.forEach((data, i) => {
      if (data && typeof data.update !== "function") {
        const c = new NPCController(data.eventName);
        Object.assign(c, data);
        c.refreshEvent();
        this.npcControllers[i] = c;
      }
    });
  };

  const _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function (mapId) {
    if ($gameMap && $gameMap._mapId !== mapId) Persistence.saveNPCPositions();
    _Game_Map_setup.call(this, mapId);
  };

  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function () {
    _Scene_Map_onMapLoaded.call(this);
    $gameMap?.setupNPCControllers();
  };

  Game_Map.prototype.setupNPCControllers = function () {
    $gameSystem.npcControllers = [];
    if (!$dataMap?.note || !$gameMap) return;

    const currentMapId = $gameMap.mapId();
    if (currentMapId === 636) return ProceduralManager.setupProceduralMapNPCs();

    if (MapManager.isHouseMap(currentMapId)) {
      const houseGrp = MapManager.getCurrentMapGroup();
      if (houseGrp) SpawnManager.replacePlayerEventsWithNPCs(houseGrp);
      return;
    }

    const groupName = MapManager.findMapGroupByMap(currentMapId);
    if (groupName) {
      MapManager.setCurrentMapGroup(Config.mapGroups[groupName]);
      SpawnManager.replacePlayerEventsWithNPCs(Config.mapGroups[groupName]);
    }

    if ($dataMap.note.includes("<NPC>")) {
      const npcEvents = $gameMap.events().filter(e => e?.event()?.note?.toLowerCase().includes("ai"));
      const tiles = MapManager.findPassableTerrainTiles().sort(() => Math.random() - 0.5);

      npcEvents.forEach((npc, i) => {
        if (i < tiles.length) npc.locate(tiles[i].x, tiles[i].y);
        npc.setMoveSpeed(3);
        npc.setMoveFrequency(3);
        npc.setThrough(false);
        npc.setPriorityType(1);
        $gameSystem.npcControllers.push(new NPCController(npc.event().name));
      });

      if (npcEvents.length > 1) {
        for (let i = 0; i < Math.min(Math.floor(Math.random() * 2) + 1, npcEvents.length - 1); i++) {
          const c = Utils.randomElement($gameSystem.npcControllers);
          if (c && !c.isAbsent) { c.isAbsent = true; c.event.setOpacity(0); c.event.locate(0, 0); }
        }
      }
    }
  };

  const _Game_Map_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function (sceneActive) {
    _Game_Map_update.call(this, sceneActive);
    if (sceneActive) $gameSystem.npcControllers?.forEach(c => c.update());
  };

  Game_CharacterBase.prototype.fadeIn = function () { this._fadeType = "in"; this._fadeSpeed = 10; };
  Game_CharacterBase.prototype.fadeOut = function () { this._fadeType = "out"; this._fadeSpeed = 10; };

  const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function () {
    _Game_CharacterBase_update.call(this);
    if (this._fadeType === "in") {
      this.setOpacity(Math.min(this.opacity() + this._fadeSpeed, 255));
      if (this.opacity() >= 255) this._fadeType = null;
    } else if (this._fadeType === "out") {
      this.setOpacity(Math.max(this.opacity() - this._fadeSpeed, 0));
      if (this.opacity() <= 0) this._fadeType = null;
    }
  };

  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
    _Game_Interpreter_pluginCommand.call(this, cmd, args);
    if (cmd === "ReplacePlayerEvents") SpawnManager.replacePlayerEventsWithNPCs(MapManager.getCurrentMapGroup());
    else if (cmd === "NPC") {
      const c = $gameSystem.npcControllers?.find(c => c.eventName === args[1]);
      if (c && args[0] === "spawn" && c.isAbsent) c.spawn();
      if (c && args[0] === "exit" && !c.isAbsent) c.exitMap();
    }
    else if (cmd === "SetMapGroup") MapManager.setCurrentMapGroup(Config.mapGroups[args[0]]);
    else if (cmd === "ClearMapGroup") MapManager.setCurrentMapGroup(null);
  };
})();