
Open hypernet-explorer.html to use internal game web browser
---

## CHARACTER & HEALTH SYSTEMS

### Health_Core.js
**Limb/organ damage system (Dwarf Fortress-inspired)**
- **Actor**: Actor 1 only
- **Variables**:
  - Variable 87: Reproduction type (set by archetype)
    - `-1` = None
    - `0` = Testicles (male)
    - `1` = Uterus (female)
    - `2` = Oviparous (egg-laying)
    - `3` = Plant (spore-based)
    - `4` = Mitosis (asexual)
  - Variable 92: Battler name for creature
- **Switches**: Switch 88 (Prosthetic shop flag)
- **Key Features**:
  - Individual health for limbs and organs
  - Damage distribution to body parts
  - Stat penalties for damaged parts
- **Menu Commands**: "Health Status", "Biologics"
- **Plugin Commands**: HealBodyParts, ChangeArchetype, CreateCreature

### Health_BiologicSimulation.js
**Real-time vital and immune system simulation**
- **Dependency**: Requires Health_Core.js
- **Features**:
  - Simulates Heart Rate, Blood Pressure, Temperature, and Cortisol
  - Brain Activity: Tracks 15+ brain regions and neuron firing patterns
  - Immune System: Simulates WBC, Antibodies, Viruses, and Bacteria
  - Ley Veins: Arcane circulation system
  - Pregnancy: Real-time fetus development and hormonal changes
  - State Reactions: Poison, Rage, and Infection affect biologics
- **Integration**: Adds "Biologics" command to Main Menu

### Health_ProstheticShop.js
**Body part replacement and implant system**
- **Dependency**: Requires Health_Core.js
- **Features**:
  - Full-screen UI for installing/removing parts and implants
  - Archetype-based part filtering (e.g., Human vs. Android)
  - Price scaling based on HP percentage and stat bonuses
  - Dynamic stat modification based on installed prosthetics
- **Plugin Command**: openProstheticShop

### TimeDateSystem.js
**Survival mechanics with calorie/nutrition tracking**
- **Variables**:
  - Variable 61: Temperature
  - Variable 66: Bounty (displayed as euros)
  - Variable 88: Calorie value
  - Variable 89: Fat value
  - Variable 90: Protein value
  - Variable 91: Caffeine value
  - Variable 113: Current Date/Time string (Format: "DD MMM YYYY HH:MM")
  - Variable 114: Total game time in minutes
- **Mechanics**:
  - Hunger -0.05/step (3x faster when running)
  - Sleep -0.03/step
  - HP drains 1% max/step when hunger = 0
  - MP drains 1% max/step when sleep = 0
  - Overeating state (ID 41) applied at 110%+
- **Recovery Formula**: (calories × 0.10) + (protein × 2.00) + (fat × 1.50)
- **Plugin Commands**: EatFood, RecoverSleep

### CharacterSwitchEquip.js
**Character switching with persistent stats**
- **Variables**:
  - Variable 86: Arcane stat
  - Variable 87: Substance stat
  - Variable 88: Stealth stat
  - Variable 89: Intimidation stat

### ClassSelector.js
**Character creation system**
- **Variables**:
  - Variable 38: Player 1 gender selection
    - `0` = Male
    - `1` = Female
    - `2` = Non-binary
    - `3` = Cocoon
  - Variable 39: Player 2 gender selection
  - Variable 40: Player 3 gender selection
  - Variable 42: Class choice
  - Variable 87: Player 1 reproduction type (0-4 by species)
    - `-1` = None
    - `0` = Testicles (male)
    - `1` = Uterus (female)
    - `2` = Oviparous (egg-laying)
    - `3` = Plant (spore-based)
    - `4` = Mitosis (asexual)
  - Variable 115: Player 2 reproduction type
  - Variable 116: Player 3 reproduction type
- **Switches**:
  - Switch 9: Permadeath mode
  - Switch 33: Character creation complete
  - Switch 45-46: Card deck slots 1-2
  - Switch 62: Tentacle toggle
- **Available Classes**:
  - 1: Freelancer, 2: Witch, 3: Nun, 4: Knight, 5: Wrestler
  - 6: CEO, 7: Vampire, 8: Cultist, 9: Combat Medic, 10: Elementalist
  - 11: Martial Artist, 12: Enchanter, 13: Berserker, 14: Acrobat, 15: Monk
  - 16: Brawler, 17: Boxer, 18: Pro Wrestler, 19: Fire Mage, 20: Ice Mage
  - 21: Rogue, 22: Paladin, 23: Warlock, 24: Ranger, 25: Cleric
  - 26: Samurai, 27: Archmage, 28: Scout, 29: Oracle, 30: Gladiator
  - 31: Necromancer, 32: Commander, 33: Guardian, 34: Spellblade, 35: Bard
  - 36: Illusionist, 37: Battlemage, 38: Mercenary, 39: Sage, 40: Barbarian
  - 41: Doctor, 42: Scientist, 43: Firefighter, 44: Police Officer, 45: Chef
  - 46: Journalist, 47: Construction Worker, 48: Academic, 49: Psychologist, 50: Archaeologist
  - 51: Nurse, 52: Hunter-Gatherer, 53: Physicist, 54: Mechanic, 55: Shopkeeper
  - 56: Farmer, 57: Lumberjack, 58: Meteorologist, 59: Priest, 60: Entertainer
  - 61: Demigod, 62: Wretch, 63: Beast, 64: Mimic, 65: Monster, 66: Cyborg

---

## FAST TRAVEL & TRANSPORTATION

### FastTravelSystem.js
**Comprehensive fast travel with fuel system**
- **Variables**:
  - Variable 43-44: Player X/Y (map 315)
  - Variable 45: Travel timer/destination map
  - Variable 53: Fuel price base
  - Variable 63-65: Camper X/Y/fuel (max 100L)
  - Variable 67: Camper map ID
  - Variable 69-71: Car X/Y/fuel (max 60L)
  - Variable 72: Car map ID
- **Switches**:
  - Switch 51: Camper available
  - Switch 55: Travel in progress
  - Switch 64: Car available
- **Transport Modes**: 28 types (walking, bicycle, horse, train, helicopter, quantum teleportation, etc.)
- **Cost Formula**: Base 10 gold + distance (0.15L fuel/unit)
- **Plugin Commands**: StartFastTravel, EndTravel, EndTravelCamper, EndTravelCar, ShowRefuelWindow, ShowDestinationPicture

---

## QUEST & TUTORIAL SYSTEMS

### MapTodoList.js
**Map-based todo list with tutorial integration**
- **Switch**: Switch 75 (Tutorial system enable/disable)
- **Task Switches** (configurable per list):
  - Switches 1-4: Village Quests (maps 708-709)
  - Switches 10-12: Forest Exploration (maps 4-6)
  - Switches 20-22: Castle Missions (maps 10-12)
- **Controls**: Press H to toggle hint/todo list
- **Features**:
  - Automatically changes based on current map
  - Adds "Tutorial" option to Options menu
  - Configurable in TodoList object

---

## COOKING & FOOD SYSTEMS

### CookingSystem.js
**Food combining with nutrition tracking**
- **Shares Variables** with TimeDateSystem (88, 89, 90, 91)
- **Required Items**: Items 127-128 (enables Cooking menu)
- **Recipe Format**: `<Recipe: 582x2, 583x1, 585x2, 584x1>`
- **Mechanics**:
  - Combines two food items
  - Result nutrition = first × 2 + second
  - Recovery split among party members
  - Random adjectives for same-item cooking
  - Caps at 100% hunger (never causes overeating)
- **Plugin Commands**: openCookingMenu, cookItems
- **Integration**: Adds "Cooking" to main menu when items present

---

## FACTION & ARMY SYSTEMS

### FactionDataManager.js
**Faction reputation and political influence**
- **Variables**:
  - Variable 53: Soul Tendency (Influenced by faction deeds)
- **Features**:
  - 18 Factions: Includes Mages Guild, Archive Foundation, Hypercapitalist Collective, and procedural sub-factions
  - Reputation: Scale of -100 to +100 affecting quest availability and troop prices
  - Leaders: Unique faction leaders with distinct personalities and sprites
  - Sub-factions: Branch groups like Technomancers or Loyalists
- **Plugin Commands**: open, setReputation, changeReputation, checkQuestAvailability

### ArmyManager.js
**Mount & Blade style troop management**
- **Variables**:
  - Variable 86: Country ID (Used for location-based recruitment)
  - Variable 43/44: World X/Y (Used for random troop seeding)
- **Features**:
  - Recruitment: Hire troops from factions or random location-based pools
  - Upkeep: Weekly maintenance costs paid in euros (gold)
  - Coherence: Bonus system based on army faction homogeneity
  - Squads: Group troops under actor leaders for 8% stat bonuses
  - Upgrades: Release/upgrade mechanics for army progression
- **Plugin Commands**: buyTroops, debugAddTroops

---

## SHOP & ECONOMY SYSTEMS

### NewsSystem.js
**Dynamic news and market influencer**
- **Variables**:
  - Variable 53: Soul Tendency (Value modified by news events)
- **Features**:
  - Daily news events at 8:00 AM
  - Procedural and real (hardcoded) news generation
  - Market effects: Influences Real Estate occupancy and prices
  - Soul Tendency: News category (Positive/Negative/Surreal) shifts world state
  - News History: Track recent market events
- **Plugin Commands**: checkNewsHistory, forceNewsEvent

### RealEstateMarket.js
**Property investment and rental system**
- **Dependency**: Requires NewsSystem.js
- **Features**:
  - 30 randomized European properties (Simple House, Villa, Yacht, Castle, etc.)
  - Star ratings (1-5) affecting base price and occupancy
  - Midnight rent collection (100 gold = 1.00€)
  - Market fluctuations: News events cause immediate price/occupancy shifts
- **Plugin Commands**: openRealEstateMenu, checkDailyIncome, forceMarketUpdate

### WorkSystem.js
**Job and labor system**
- **Variables**:
  - Variable 114: Time tracker (shares with TimeDateSystem)
- **Features**:
  - 30+ jobs across categories (Combat, Magical, Social, Technical, etc.)
  - Success Rates: Influenced by stats (AGI, LUK) and custom attributes (Arcane, Substance, etc.)
  - Labor Risks: Failures can cause HP/MP damage or status effects
  - Procedural Outcomes: Random events during shifts
- **Plugin Commands**: OpenWorkMenu, OpenWorkMenuCategory, ShowSingleJob

### ShopManagement.js
**Complex shop management with production system**
- **Material Items**: IDs 565-587
- **Features**:
  - Multiple shops with category system
  - Production system with recipes
  - Delivery missions
  - NPC auto-production
  - Role switching (Manager/Producer/Rider)
- **Currency**: Gold converted to euros (1200 gold = 12.00€)
- **Plugin Commands**: initializeShop, setCurrentShop, openShopManagement, switchRole, newDelivery, orderMaterials, produceItem

### BankLoanSystem.js
**Loan management**
- **Economy integration** with FastTravelSystem

### StockMarketSystem.js
**Stock trading system**
- **Economy expansion** for wealth management

---

## BATTLE SYSTEMS

### BladeSeedSystem.js
**Spirit weapon binding and evolution**
- **Features**:
  - Bound Weapon: Players can bind a "Blade Seed" spirit weapon to their soul
  - Procedural Names: Generates unique weapon names (e.g., Shardbane, Stormedge)
  - Spirit Companion: Elemental spirit that levels up and evolves (Lv 10, Lv 30)
  - Learning Points: Earn points to learn elemental skills
  - Sealed Slot: Weapon slot is locked while a Blade Seed is bound
- **Plugin Commands**: bindBladeSeed, unbindBladeSeed

### BattleSystemEnhanced.js
- **Variables**: Variable 1 (battle system state)
- **Switches**: Switch 13 (battle end), Switch 34 (victory flag)

### RoguelikeCardSystem.js
**Card-based tactical combat**
- **Switch**: Switch 45 (Activates card system)
- **Mechanics**:
  - 40-card deck (skills and items)
  - Energy System: Max energy starts at 1, gains +1/turn (max 10)
  - Energy Cost: Calculated from skill MP/TP costs
  - Hearthstone-style UI: Animated hand and hover effects
- **Integration**: Overrides standard battle commands when active

### 3DBattlerSystem.js
**3D battle visuals**
- Uses mz3d.js for 3D rendering

### BulletHellBattle.js
**Bullet hell dodge mechanics**

### ArenaBattleHandler.js
**Arena/tournament system**

---

## MINIGAMES & ARCADE SYSTEMS

- **AnimatedSlotMachine.js** - Gambling
- **ArcadeFrogger.js** - Frogger clone
- **ArcadeSnake.js** - Snake game
- **ArcadeBubblePop.js** - Bubble popping
- **BowlingMinigame.js** - Bowling simulation
- **ChessGame.js** - Chess implementation
- **PoolGame.js** - Pool/billiards
- **LockpickTetris.js** - Tetris-based lockpicking
- **ScratchingCardSystem.js** - Scratch card lottery
- **AnimatedHorseRace.js** - Horse racing with betting
- **AnimatedTarotReading.js** - Tarot card reading

### HyperTamer.js
**Virtual Pet simulation (LCD retro style)**
- **Features**:
  - LCD Filter: Monochrome pixelated aesthetic
  - Pet Care: Hunger, Happiness, Cleanliness, Energy, and Health
  - Growth System: Pets grow and level up over time (real-time offline progression)
  - Training: Mini-games to improve Strength, Intelligence, and Agility
  - Personality System: Affects need decay rates
- **Plugin Commands**: openHyperTamer, resetPet

---

## ANIMAL & PLANT HUSBANDRY

### AnimalGrowthSystem.js
**Livestock management and production**
- **Variables**:
  - Variable 114: Game time tracker
- **Features**:
  - Lifecycle: Animals grow from Baby to Adult (direction rows 0 and 1)
  - Production: Adult animals produce items (Milk, Eggs, etc.) at day intervals
  - Skins: Randomized sprite variants upon purchase
  - Slots: Limited by "Animal" named events on map
- **Plugin Commands**: AnimalMenu, BuyAnimal, CollectProduce

### PlantGrowthSystem.js
**Farming and seasonal agriculture**
- **Variables**:
  - Variable 114: Game time tracker
- **Features**:
  - Seasons: Growth restricted to specific seasons (SPRING, SUMMER, etc.)
  - Environmental Effects: Rain (+30% speed), Greenhouse (x1.5 speed), Snow (-50% speed)
  - Stages: 4 growth stages (Seedling, Sprout, Growing, Mature)
  - Yield: Harvest amount depends on effective growth time
- **Plugin Commands**: PlantMenu, PlantSeed, HarvestPlant

---

## PROCEDURAL GENERATION & AI

### MarkovTextGenerator.js
**N-gram based text synthesis**
- **Features**:
  - Training: Analyzes source texts to build probability tables
  - Generation: Produces human-like (but nonsensical) sentences
  - Contexts: Used for NPC dialogue, book content, and item descriptions
- **Plugin Commands**: trainMarkov, generateMarkovText

### RandomBookGenerator.js
**Procedural book creation**
- **Dependency**: Requires BookViewer.js and MarkovTextGenerator.js
- **Features**:
  - Randomly generates titles, authors, and 5-20 pages of content
  - Covers 12+ genres (Science, Occult, History, Fiction, etc.)
  - Integration: Adds books to shelves or libraries dynamically

### RandomTVTransmissionGenerator.js
**Dynamic TV channel simulation**
- **Features**:
  - 20+ Procedural Channels: News, Weather, Shopping, Static, "The Void"
  - Visual Effects: CRT filters, static, and scrolling text
  - Real-time Updates: News channels reflect current game events/NewsSystem
- **Plugin Command**: openTV

### ArctifactGenerator.js
**Unique item and relic generation**
- **Features**:
  - Random names, icons, and stat modifiers
  - Lore generation using Markov chains
  - Rarity tiers from Common to Mythic
- **Plugin Command**: generateArtifact

### WFC_MapGenerator.js
**Wave Function Collapse map synthesis**
- **Features**:
  - Generates complex, rule-based tile patterns
  - Used for indoor layouts and structural details
  - Deterministic based on coordinate seeds

---

## MINIGAMES & HOBBIES

### VisualPiano.js
**Interactive musical instrument**
- **Features**:
  - 88-key piano simulation with mouse/keyboard support
  - Recording/playback of played sequences
  - Learning mode with falling "Synthesia" style notes
- **Plugin Command**: openPiano

### TunableRadio.js
**Signal-based audio simulation**
- **Features**:
  - Frequency tuning (88.0 - 108.0 MHz)
  - Static and interference based on player location/weather
  - Multiple procedural stations with music and talk shows
- **Plugin Command**: openRadio

### ApiarySystem.js
**Beekeeping and honey production**
- **Features**:
  - Hive maintenance: Managing bee health and population
  - Item Production: Honey, Wax, and Royal Jelly
  - Cross-pollination: Boosts nearby PlantGrowthSystem speed by 15%
- **Plugin Command**: openApiaryMenu

### SurfingMiniGame.js
**Wave riding simulation**
- **Features**:
  - Physics-based movement on water tiles
  - Trick system with score multipliers
- **Plugin Command**: startSurfing

---

## WORLD & MAP SYSTEMS

### WorldMap.js
**Minimap display system**
- **Display**: Top-right corner (200×150px default)
- **Shows**: Player (red), Boat (blue), Ship (green), Airship (yellow), Teleports (green)
- **Image**: Uses `worldmap.png` from `img/pictures/`
- **Plugin Commands**: showWorldMap, hideWorldMap

### DiggingSystem.js
**Runtime wall breaking**
- **Parameters**:
  - Breakable Tileset ID: 1
  - Replacement Tile ID: 0
- **Persistence**: Modifications saved in $gameSystem

### FloorListWindow.js
**Multi-floor navigation**
- **Variable**: Variable 17 (selected floor)
- **Switch**: Switch 29 (floor selection trigger)

### DungeonFloorSystem.js & DungeonGenerator.js
**Procedural dungeon generation**

---

## PROCEDURAL MAP GENERATION SYSTEM

### Core Architecture
**Pipeline**: ProceduralMapUtils.js → ProceduralMapRoadGenerator.js → ProceduralMapStructureGenerator.js → ProceduralMapBiomeGenerator.js

The system generates fully procedural maps based on world coordinates and biome types. All generation is deterministic using seeded random number generators.

#### Key Constants
- **Map IDs**: World map = 315, Procedural map = 636, Debug map = 1410
- **Map Dimensions**: 128×128 tiles per procedural map
- **World Tileset**: ID 96 (used on map 315 to define biome tiles)
- **Procedural Tileset**: Matches the biome's associated tileset

#### Getting Current Biome & Coordinates
**For plugins that need to interact with the procedural system:**

```javascript
// Get current world coordinates (when on world map 315)
const worldX = $gameVariables.value(43); // X coordinate
const worldY = $gameVariables.value(44); // Y coordinate

// Get current biome name from world tile
const worldTile = $gameMap.tileId(worldX, worldY, 0);
const biomeName = window.ProcGenUtils.getBiomeForWorldTile(worldTile);

// Get biome object
const biomeObj = window.ProcGenUtils.getBiomeByName(biomeName);

// Get procedural map data (when on proc map 636)
const procMapData = $gameSystem._procGenData.generatedMapData;

// Get current underground state
const isUnderground = $gameSystem._procGenData.underground || false;

// Get current procedural seed (for consistency)
const procSeed = $gameSystem._procGenData.currentSeed;
```

#### Variable Storage
- **$gameSystem._procGenData**: Stores all procedural generation state
  - `currentBiomeName`: String name of current biome
  - `currentSeed`: Number seed used for generation
  - `generatedMapData`: Array of tile IDs for map 636
  - `underground`: Boolean flag for underground layer
  - `worldX/worldY`: Current world coordinates
  - `playerStartPos`: {x, y} - where player entered the biome
  - `mapCache`: Object storing generated maps by coordinate

---

### ProceduralMapUtils.js
**Shared utilities for all procedural generation**

**Exports**: `window.ProcGenUtils`
**Must load before**: All other procedural plugins

**Key Functions**:
- `createSeededRandom(seed)` - Returns seeded RNG function
- `noise2D(x, y, seed)` - 2D Perlin noise
- `smoothNoise(value1, value2, t)` - Noise interpolation
- `fbmNoise(x, y, seed, octaves)` - Fractional Brownian motion
- `calculateIndex(x, y, layer, width, height)` - Get array index for position/layer
- `getBiomeForWorldTile(worldTileId)` - Get biome from world tile ID
- `getBiomeByName(biomeName)` - Get biome object by name
- `getAdjacentBiomesOnWorldMap(originX, originY)` - Get bordering biomes
- `parseTerrainFeatures(tilesetId)` - Extract features from tileset notes
- `parseSingleTileString(tileStr)` - Parse formats: B10, A1 2, E34
- `getTileIdFromTypeAndIndex(type, index)` - Convert type+index to tile ID
- `isWaterBiome(biomeName)` - Check if water/ocean/beach biome
- `isWaterTileId(tileId, biomeObj)` - Check if specific tile is water

**Terrain Feature Parsing** (from tileset notes):
- Single tile: `<Feature: B10>` or `<Feature: A1 2>`
- Multi-tile grid: `<House: [B1, B2],[B3, B4]>`  (2×2 building)
- Returns array of variants with type (single/multi) and tile data

---

### ProceduralMapRoadGenerator.js
**Handles all road terrain generation**

**Exports**: `window.ProcGenRoads`
**Requires**: ProceduralMapUtils.js

**Road Types** (parsed from biome name):
- `<Road: 602 horizontal>` - East-west road
- `<Road: 602 vertical>` - North-south road
- `<Road: 602 cross>` - 4-way intersection
- `<Road: 602 t-up>` - T-junction (stem pointing north)
- `<Road: 602 corner-up-right>` - L-shaped corner

**Key Functions**:
- `isRoadBiome(biomeName)` - Check if biome is a road
- `parseRoadConfig(biomeName)` - Extract road type from biome name
- `generateRoadBiome(mapData, biome, roadTileId, roadDirection)` - Generate road layout
- `getDashedLineTileId(allFeatures)` - Get center line tile
- `isPositionOnRoadTile(x, y, width, height)` - Check if position is on road

**Road Parameters**:
- Road width: 7 tiles
- Dashed line pattern: 3 tiles on, 1 tile off
- Center position: `Math.floor(width / 2)` and `Math.floor(height / 2)`

---

### ProceduralMapStructureGenerator.js
**Generates structured biomes: dungeons, villages, cities**

**Exports**: `window.ProcGenDungeon`
**Requires**: ProceduralMapUtils.js, ProceduralMapBiomeGenerator.js

**Biome Detection**:
- `isDungeonBiome(biomeName)` - Checks for "dungeon" keyword
- `isVillageBiome(biomeName)` - Checks for "village" keyword
- `isCityBiome(biomeName)` - Checks for "city" keyword

**Dungeon Generation** (Binary Space Partition algorithm):
- Uses features: DungeonFloor, DungeonWall, DungeonCeiling
- Room size: 8-16 tiles
- Ceiling placement: 15% chance in walls (decorative layer)
- Floor variety: 30% chance of alternate floor tile
- Wall variety: 20% chance of alternate wall tile
- Integrates with ProceduralMapPrefabs for special room placement

**Village Generation** (Organic roads with building lots):
- Layout types: "LINEAR" (main street) or "CROSS" (intersection)
- Road drawing: Drunken walk with noise sway (40% sway chance)
- Branch generation: 30% chance per main path point
- Building lots: Valid positions 1-3 tiles from road
- Lot priority: Closer to road is better, then random
- Features: Fences and sign posts as decoration
- Integrates prefabs with `placementHints` for road-side placement

**City Generation** (Grid-based roads):
- Cell size: 16-24 tiles (randomized)
- Road width: 3 tiles with dashed center line
- Building lots: Placed in center of each grid cell
- Features: Concrete/Pavement terrain with road grid
- Integrates prefabs for building placement at lot centers

---

### ProceduralMapBiomeGenerator.js
**Main orchestrator for procedural map generation**

**Exports**: None (uses Game_System prototypes)
**Requires**: ProceduralMapUtils, ProceduralMapRoadGenerator, ProceduralMapStructureGenerator

**Plugin Commands**:
- `startProcGen` - Generate biome and move to map 636
- `stopProcGen` - Return to map 315
- `goDown` - Enter underground layer
- `goUp` - Return to surface

**Biome Types**:
- **Normal biomes**: Fill terrain with procedural features (caves/mountain)
- **Road biomes**: Generate road layouts
- **Dungeon biomes**: Generate BSP dungeon structures
- **Village biomes**: Generate organic villages with road-side building lots
- **City biomes**: Generate grid-based cities with building lots
- **Cave biomes**: Generate cave systems (3 methods selectable)
- **Mountain biomes**: Generate mountain terrain with ceilings/walls

**Cave Methods** (selected by hash of world coordinates):
- Drunken Walk (organic cave systems)
- Cellular Automata (dense interconnected caves)
- Voronoi (distinct chamber-based caves)

**Key Functions**:
- `getHardcodedBiomeOverride(worldX, worldY)` - Force specific biome at coordinates
- `isCaveBiome(biomeName)` - Check if cave biome
- `isMountainBiome(biomeName)` - Check if mountain biome
- `shouldDisplayAsBeach(biomeName, adjacentBiomes)` - Check if show beach graphics
- `fillTerrainLayer(mapData, biome, allFeatures)` - Distribute features on map
- `blendBiomeBorders(mapData, biome, adjacentBiomes)` - Smooth transitions to adjacent biomes
- `generateBiomeOnProcMap(biome, seed, cache)` - Main generation pipeline

**Hardcoded Biome Overrides** (`window.WorldGen.HardcodedBiomeOverrides`):
```javascript
"100,50": { biome: "Road", roadDirection: "cross" }
"110,50": { biome: "Forest" }
"120,50": { biome: "Dungeon" }
```
Format: `"worldX,worldY": { biome: "name", roadDirection: "..." }`

**Feature Distribution** (both noise-based and scattered):
- Noise-based: Uses Perlin noise to create clustering
- Scattered: Random placement avoiding water/forbidden zones
- Multi-tile features check bounds and overlap

### ProceduralMapTransfer.js
**Map loading and seamless navigation**
- **Dependency**: Requires ProceduralMapUtils and BiomeGenerator
- **Features**:
  - Seamless Transitions: Teleports player to opposite edge when crossing borders
  - Visual Indicators: Animated arrows point to nearby map exits
  - Layer Navigation: Handles surface/underground depth switching
  - Dynamic Respawn: Refreshes enemies based on the current biome after transfer
- **Plugin Commands**: startProcGen, stopProcGen, goDown, goUp

**Water Handling**:
- Region ID 99 marks water tiles for MovementInteractionSystem
- Edge blending: Different tile variants for water edges
- Corner tiles for diagonal water transitions

---

### ProceduralMapPrefabs.js
**Object/NPC placement on procedural maps**

**Integration Points**:
- Called by dungeon/village/city generators
- Uses world coordinates for seeded prefab selection
- Placement hints from village road-side lots
- Avoids water and forbidden zones

**Key Functions**:
- `applyPrefabsToMap(mapData, biomeName, worldCoords, placementHints)` - Place prefabs
- Uses biome's prefab definitions for placement

---

### ProceduralMapPrefabs.js (Supplementary)
**Prefab system for placing structured objects**

**Features in Biomes**:
- Buildings in villages/cities
- Treasures in dungeons
- Monsters/NPCs as encounters

**Seeding**: Uses world coordinates to ensure same prefabs spawn at same locations

---

---

## MOBILE & COMMUNICATION SYSTEMS

### HexphoneSystem.js
**Modular mobile device ecosystem**
- **Version**: v2.1.0 (Component-based architecture)
- **Features**:
  - Messaging System: Procedural contacts and message threads
  - App Store: Installable mini-games and tools
  - Credits System: Credits used for calls and app downloads
  - Wallpaper/Settings: Personalized UI customization
- **UI Components**:
  - `Hexphone_App`: Base class for modular app development
  - `Hexphone_BaseComponent`: Scalable UI building blocks
- **Plugin Commands**: openHexphone, registerApp, addContact

---

## ADVANCED GAMEPLAY SYSTEMS

### RentSystem.js
**Automated property leasing**
- **Dependency**: Requires RealEstateMarket.js
- **Features**:
  - Renting out player-owned properties to NPCs
  - Daily rent calculation and automated collection
  - Occupancy based on local NewsSystem events
- **Plugin Command**: openRentManagement

### StealingSystem.js
**Thievery and pickpocketing mechanics**
- **Variables**:
  - Variable 88: Stealth stat (affects success chance)
- **Features**:
  - NPC Pickpocketing: Steal gold or items from moving NPCs
  - Crime Integration: Failed attempts increase Bounty (Variable 66)
  - Skill Progression: Higher success leads to "Master Thief" perks
- **Plugin Command**: attemptSteal

### ContainerSystem.js
**Persistent storage and inventory management**
- **Features**:
  - Unlimited storage boxes with custom names
  - Cross-map persistence: Access items from any linked container
  - Weight limits based on container type (Chest, Locker, Safe)
- **Plugin Command**: openContainer

### FurnitureSystem.js
**Dynamic interior customization**
- **Features**:
  - Grid-based placement of 100+ furniture items
  - Rotation and layering support
  - Functional furniture: Beds for sleep, Stoves for cooking
- **Plugin Command**: enterBuildMode

### AutonomousNPCSystem.js
**NPC schedule and AI simulation**
- **Features**:
  - Daily Routines: NPCs move between home, work, and leisure maps based on time
  - Reactive AI: NPCs flee from combat or seek shelter during storms
  - Social Interactions: NPCs talk to each other and form relationships
- **Plugin Commands**: setNPCRoutine, forceNPCObjective

### ErisDateSystem.js
**Social bonding and dating simulation**
- **Features**:
  - Relationship Levels: Rank 1-10 with unique dialogue and rewards
  - Date Locations: 15+ spots (Cafe, Park, Arcade, Cinema)
  - Gift System: Liked/Disliked items based on personality
- **Plugin Command**: openDatingMenu

---

## SPECIAL SYSTEMS

### GalaxySim.js
**Space exploration system**
- **Variables**:
  - Variable 94: Ship speed
  - Variable 95: Fuel level
  - Variable 96: Current star system
  - Variable 97: Target star system

### MultiplayerSystem.js / MultiplayerSystemP2P.js
**Online multiplayer support**
- **Switch**: Switch 66 (multiplayer active)

### CrimeSystem.js
**Crime/bounty system**
- **Integration**: Uses Variable 66 (bounty)

### EnemyTalkSystem.js
**NPCs with dialogue trees**

### SkillMaster.js
**Skill learning/mastery**

### WeaponSystem.js
**Weapon crafting/enhancement**

### SummonSystem.js
**Summon mechanics**

### DreamSystem.js
**Dream sequences**

### ErisTrial.js
**Procedural trial and debate system**
- **Features**:
  - Evidence gathering during exploration
  - Ace Attorney style courtroom battles
  - Logic chains and contradiction spotting
- **Plugin Command**: startErisTrial

### MatrixGameOver.js
**Dynamic game over screen**
- **Features**:
  - Digital rain effect with customizable colors
  - "Resurrection" mechanic allowing one-time continuation
- **Plugin Command**: triggerMatrixGameOver

---

## UI & NAVIGATION

### KanbanQuestLog.js
**Visual quest management board**
- **Features**:
  - Trello-style board with columns: To-Do, In Progress, Completed
  - Drag-and-drop quest prioritization
  - Detail view for rewards and objectives
- **Plugin Command**: openKanbanBoard

### CompassHud.js
**Directional navigation overlay**
- **Features**:
  - Horizontal compass showing N/S/E/W and quest markers
  - Dynamic scaling based on distance to objective

### BookViewer.js
**Full-screen book reading interface**
- **Features**:
  - 2-page spread with realistic page-flip animations
  - Support for images and nested text formatting
- **Plugin Command**: openBook

---

## SHOP & ECONOMY SYSTEMS

### CustomSceneStatus.js
**Custom status screen**

### CustomSkillsMenuSwitcher.js
**Skill menu customization**

### HelpMenu.js
**In-game help system**

### ThoughtsMenu.js & ThinkerMenu.js
**Character thought/dialogue systems**

### VisualNovelBustSystem.js
**Character busts for dialogue** (v1.8.0 with monster battler support)
- **Auto Display**: Busts automatically load on message start based on active event sprite
- **Bust Loading Pipeline**:
  1. Event sprite character name → lookup in `SpritesAssociation` global object (from DB.js)
  2. If match found → loads `img/busts/{bustName}.png`
  3. Monster sprites: If sprite contains "monster/" → uses Variables 106/107/108 (battler images from `img/enemies/`)
  4. Fallback: If image fails to load → uses `img/busts/7.png` as default
- **Display Behavior**:
  - Busts fade in from right edge (256×256px scaled to fit)
  - Name displays in top-left (optional, toggle via parameter)
  - Resizes to 4:3 or 16:9 aspect ratio automatically
  - Auto-hides when event ends (unless batch mode enabled)
- **Key Variables**:
  - Variable 106: Actor 1 battler image name (e.g., "enemies/MonsterName")
  - Variable 107: Actor 2 battler image name
  - Variable 108: Actor 3 battler image name
- **Plugin Commands**:
  - `showBust` - Manually show bust based on current event sprite
  - `hideBusts` - Hide all busts
  - `batchDialogue` - Keep bust visible across multiple messages until event ends
  - `showCustomBust` - Show specific bust from `img/busts/` with optional name
  - `playerBatchDialogue` - Show player bust (framework for future use)

### Titlescreen.js
**Custom title screen**

---

## ENVIRONMENTAL & VISUAL

### DynamicLightingSystem.js
**Real-time lighting**

### WeatherSystem.js
**Dynamic weather system**
- **Map Tags**:
  - `<Exterior>` - Enables weather changes and time-of-day tints
  - `<Interior>` - Disables time tints, keeps temperature tints
  - `<Covered>` - Treated as interior (no weather/light)
  - `<Dark>` - Forces midnight lighting regardless of time or interior/exterior
  - `<Light>` - Forces midday lighting regardless of time or interior/exterior
  - `<BaseTemp:X>` - Sets base temperature (X = Celsius)
  - `<ForceWeather:TYPE>` - Forces weather (none/rain/storm/snow)
- **Plugin Commands**: forceWeatherChange, forceTimeUpdate, forceTemperatureUpdate, changeSunlightMode, setMapExterior, setMapInterior, toggleMapType
- **Key Property**: `$gameWeather.forcedLighting` (null / 'dark' / 'light') - set by Dark/Light map tags

### FogOfWar.js
**Visibility/fog mechanics**

### ParallaxOverlay.js
**Parallax visual effects**

### EarthboundBattleBackgrounds.js
**Battle background effects**

### BloodSplatterFX.js
**Gore effects**

---

## UTILITY & TOOLS

### CustomCommandMapper.js
**Custom menu command mapping**

### DebugMapTeleporter.js
**Development debugging tools**

### F7_DebugCommonEvent.js
**Event debugging**

### MapLevelDisplay.js
**Shows current floor/area level**

### PlaytestBoost.js
**Testing accelerators**

### Hotkeys.js
**Keyboard shortcuts**

### SteamAchievements.js
**Steamworks integration**
- **Dependency**: Requires Greenworks library and NW.js
- **Features**:
  - Grant/Unlock achievements via Steam API
  - Progress tracking for long-term goals
  - In-game notifications for unlocks
- **Plugin Commands**: unlockAchievement, setAchievementProgress

### ModManager.js
**RimWorld-style Mod Management**
- **Features**:
  - External Load: Loads assets from a "mods" folder in the project root
  - Asset Redirection: Overrides default data, img, and audio files
  - Dynamic Data: Loads custom JSONs into `$dataCustom`
  - Load Order: Priority-based management (bottom items load last/override others)
- **UI**: Custom "Mods" command on Title Screen

### BoosterPackSystem.js
**Trading card pack opening**
- **Features**:
  - Randomized card pulls with rarity weights
  - Animated pack opening sequence with PIXI filters
- **Plugin Command**: openBoosterPack

### MoneyFormatter.js
**Global currency styling**
- **Logic**: Formats all gold values to Euro format (e.g. 1500 gold -> 15.00€)

### ResolutionSwitcher.js
**Dynamic display settings**
- **Features**:
  - Switch between windowed, full-screen, and custom resolutions
  - High-DPI scaling support

---

## CORE LIBRARIES

- **mz3d.js** - 3D rendering support
- **UltraMode7.js** - Visual effects and mode 7
- **EliMZ_MobileControls.js** - Mobile input handling
- **Hendrix_Localization.js** - Multi-language (English/Italian)

---

## CRITICAL VARIABLE/SWITCH REFERENCE

### Key Variables (Shared Across Systems)
- **Var 1**: Battle state
- **Var 17**: Floor selection
- **Var 38**: Player 1 gender (0=Male, 1=Female, 2=Non-binary, 3=Cocoon)
- **Var 39**: Player 2 gender
- **Var 40**: Player 3 gender
- **Var 42**: Class
- **Var 43-44**: Player X/Y (map 315)
- **Var 45**: Travel timer / destination map
- **Var 53**: Soul tendency / Fuel price base (System context dependent)
- **Var 61**: Temperature
- **Var 63-67**: Camper position/fuel/map
- **Var 69-72**: Car position/fuel/map
- **Var 86**: Arcane stat
- **Var 87**: Player 1 reproduction type (-1=None, 0=Testicles, 1=Uterus, 2=Oviparous, 3=Plant, 4=Mitosis)
- **Var 88**: Calorie value / Stealth stat
- **Var 89**: Fat value / Intimidation stat
- **Var 90**: Protein value
- **Var 91**: Caffeine value
- **Var 94-97**: Galaxy sim data
- **Var 106**: Actor 1 battler image name (creature/monster bust)
- **Var 107**: Actor 2 battler image name (creature/monster bust)
- **Var 108**: Actor 3 battler image name (creature/monster bust)
- **Var 113**: Current Date/Time string
- **Var 114**: Total game time (minutes)
- **Var 115**: Player 2 reproduction type
- **Var 116**: Player 3 reproduction type


### Key Switches
- **Sw 9**: Permadeath mode
- **Sw 13**: Battle end
- **Sw 29**: Floor selection
- **Sw 33**: Character creation done
- **Sw 34**: Battle victory
- **Sw 45**: Roguelike Card System active
- **Sw 45-46**: Card deck slots
- **Sw 51**: Camper available
- **Sw 55**: Fast travel active
- **Sw 62**: Tentacle mode
- **Sw 64**: Car available
- **Sw 66**: Multiplayer active
- **Sw 75**: Tutorial system
- **Sw 88**: Prosthetic shop

---

## PLUGIN DEPENDENCIES

- **CookingSystem** → TimeDateSystem (shares variables 88-91)
- **Health_Core** ↔ Health_ProstheticShop + Health_BiologicSimulation
- **ClassSelector** → Health_Core (sets archetype)
- **FastTravelSystem** ↔ Vehicle systems
- **Multi-language support**: ConfigManager.language check in modern plugins

---

## ITEM TAGGING & FORMATTING

### Item Tags
- `<Category: Food>` - Food classification
- `<Recipe: 582x2, 583x1, 585x2, 584x1>` - Recipe ingredients
- `<calories:X>`, `<protein:Y>`, `<fat:Z>`, `<caffeine:W>` - Nutrition values

### Event Naming
- "Teleport" prefix - Fast travel destinations
- "Delivery" - Shop delivery points

---

## WEAPON TYPES & ELEMENTS REFERENCE

### Weapon Types
- **Light** - Light weapons (daggers, short swords)
- **Sword** - Standard swords
- **Heavy** - Heavy weapons (greatswords, mauls)
- **Axe** - Axes and hatchets
- **Whip** - Whips and chains
- **Staff** - Staves and polearms
- **Bow** - Bows and crossbows
- **Projectile** - Throwing weapons
- **Gun** - Firearms
- **Claw** - Claw weapons
- **Glove** - Glove weapons
- **Spear** - Spears and lances

### Elements
- **Physical** - 1 Non-elemental physical damage, icon 96 (IT: Fisico)
- **Fire** - 2 Fire element, icon 64 (IT: Fuoco)
- **Ice** - 3 Ice element, icon 65 (IT: Ghiaccio)
- **Thunder** - 4 Lightning element, icon 66 (IT: Fulmine)
- **Water** - 5 Water element, icon 67 (IT: Acqua)
- **Petro** - 6 Oil element, icon 68 (IT: Petrolio)
- **Wind** - 7 Wind element, icon 69 (IT: Vento)
- **Sacred** - 8 Holy/sacred element, icon 70 (IT: Sacro)
- **Cursed** - 9 Curse element, icon 71 (IT: Maledetto)
