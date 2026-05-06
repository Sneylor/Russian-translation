/*:
 * @target MZ
 * @plugindesc v2.0.0 - Unified Split-Screen Local Multiplayer with Gamepad Support.
 * @author Omni-Lex (Unification of SplitScreenMultiplayer & SplitScreenTwoPlayer)
 * @help
 * This plugin implements a high-performance local split-screen system.
 * 
 * --- FEATURES ---
 * - TRUE SPLIT-SCREEN: Independent viewports for both players using PIXI masks.
 * - DYNAMIC MERGING: Viewports merge into one when players are close.
 * - SMART INPUT: Automatically detects and assigns gamepads.
 * - P2 AGENCY: Player 2 can interact with events and triggers.
 * - UNIFIED MENU: Managed via a dedicated "Split-Screen" menu scene.
 *
 * --- SETUP ---
 * 1. Create an event named "Player 2" on your maps to define the spawn point.
 * 2. Access the "Multiplayer" (Local) menu via the Title or Pause screen.
 * 3. Configure controls and orientation in the plugin parameters.
 *
 * @param ---General---
 * @default
 *
 * @param Player2EventName
 * @text Player 2 Event Name
 * @desc The name of the event on the map that marks Player 2's spawn point.
 * @type text
 * @default Player 2
 *
 * @param ProximityThreshold
 * @text Proximity Threshold (tiles)
 * @desc How close (in tiles) players must be to merge into single-screen.
 * @type number
 * @min 1
 * @max 30
 * @default 8
 *
 * @param SplitOrientation
 * @text Split Orientation
 * @desc How the screen is split for two players.
 * @type select
 * @option Vertical (Left/Right)
 * @value vertical
 * @option Horizontal (Top/Bottom)
 * @value horizontal
 * @default vertical
 *
 * @param ---Character Pool---
 * @default
 *
 * @param CharacterPool
 * @text Character Image Pool
 * @desc JSON array of character image names for random P2 selection.
 * @type text
 * @default ["Actor1","Actor2","Actor3"]
 *
 * @param CharacterIndexPool
 * @text Character Index Pool
 * @desc JSON array of character indexes (0-7) matching the pool above.
 * @type text
 * @default [0,1,2]
 *
 * @param ---Keyboard Controls---
 * @default
 *
 * @param P2KeyUp
 * @text P2 Key Up
 * @default w
 *
 * @param P2KeyDown
 * @text P2 Key Down
 * @default s
 *
 * @param P2KeyLeft
 * @text P2 Key Left
 * @default a
 *
 * @param P2KeyRight
 * @text P2 Key Right
 * @default d
 *
 * @param P2KeyAction
 * @text P2 Key Action (OK)
 * @default e
 *
 * @param ---Gamepad---
 * @default
 *
 * @param P2StickDeadzone
 * @text P2 Left Stick Deadzone
 * @desc Deadzone threshold for the left analog stick (0.0-1.0).
 * @type text
 * @default 0.25
 *
 */

(() => {
    "use strict";

    const PLUGIN_NAME = "SplitScreenMultiplayer";
    const params = PluginManager.parameters(PLUGIN_NAME);

    const P2_EVENT_NAME = String(params["Player2EventName"] || "Player2");
    const PROXIMITY = Number(params["ProximityThreshold"] || 8);
    const SPLIT_DIR = String(params["SplitOrientation"] || "vertical");

    let CHAR_POOL, INDEX_POOL;
    
    const SKAB_POOL = [
        "!$11", "!$14", "!$19", "!$2", "!$21", "!$28", "!$3", "!$32", "!$33", "!$46", "!$49", "!$59",
        "!$AirlinePilot", "!$AlienDargos", "!$AlienGrey", "!$AlienTrucker", "!$AlpineGuide", "!$Anarchist", "!$AnarchistSamurai",
        "!$AncientWitch", "!$AndroidArchpriest", "!$AndroidExperiment", "!$Archivist", "!$ArchivistBackpacker", "!$ArchivistGuard",
        "!$ArcticWorker", "!$AvianCommando", "!$AvianNoble", "!$BotGuardian", "!$BotSamurai", "!$BotSpaceman", "!$Catboy",
        "!$CatCourier", "!$CyberWitch", "!$DesertPunk", "!$Doctor2", "!$ElvenArchmage", "!$ElvenPirate", "!$ElvenSpacer",
        "!$EM", "!$emtest2", "!$Enchantress", "!$ExoticBard", "!$Farmer", "!$Fisherman", "!$GnomeExplorer", "!$GoblinIllusionist",
        "!$GoblinRecruit", "!$GoblinShogun", "!$GoblinWitch", "!$HighCommand", "!$KillerBot", "!$KoboldAssassin", "!$KoboldPunk",
        "!$LeatherDaddy", "!$Lich", "!$Madman", "!$Mafia", "!$Noblewoman", "!$Nun", "!$Nurse2", "!$OperaSinger",
        "!$OrcSamurai", "!$OrcSecretary", "!$PirateAdventurer", "!$Porcupine", "!$PrimaryDoctor", "!$Samurai", "!$SchoolTeacher",
        "!$SwordInstructor", "!$TarotWitch", "!$TribalChief", "!$VillageSpritist", "!$VoidPerson", "!$VoidSpacer", "!$VoidWorm",
        "!$WarManager", "!$WarPilot", "!$WastelandDJ", "!$WastelandParamedic", "!$Witch1", "46", "49", "59", "emtest2"
    ].map(name => "Skab/" + name);

    try {
        CHAR_POOL = SKAB_POOL;
        INDEX_POOL = SKAB_POOL.map(name => name.includes("!$") ? 0 : 0); // Default to 0 for index
    } catch (e) {
        CHAR_POOL = SKAB_POOL;
        INDEX_POOL = SKAB_POOL.map(name => 0);
    }

    const P2_KEYS = {
        up: String(params["P2KeyUp"] || "w").toLowerCase(),
        down: String(params["P2KeyDown"] || "s").toLowerCase(),
        left: String(params["P2KeyLeft"] || "a").toLowerCase(),
        right: String(params["P2KeyRight"] || "d").toLowerCase(),
        action: String(params["P2KeyAction"] || "e").toLowerCase()
    };

    const P2_STICK_DEAD = parseFloat(params["P2StickDeadzone"] || "0.25");

    // Remove Numpad from standard Input to reserve for P2
    delete Input.keyMapper[96];  // Numpad 0
    delete Input.keyMapper[98];  // Numpad 2
    delete Input.keyMapper[100]; // Numpad 4
    delete Input.keyMapper[102]; // Numpad 6
    delete Input.keyMapper[104]; // Numpad 8
    delete Input.keyMapper[107]; // Numpad +
    delete Input.keyMapper[110]; // Numpad .

    // =========================================================================
    // GamepadManager (Smart Detection)
    // =========================================================================
    class GamepadManager {
        static getConnectedCount() {
            const gps = navigator.getGamepads ? navigator.getGamepads() : [];
            return Array.from(gps).filter(gp => !!gp).length;
        }

        static getP2GamepadIndex() {
            const count = this.getConnectedCount();
            // If 2+ controllers: P1=0, P2=1. If 1 controller: P1=KB, P2=0.
            return count >= 2 ? 1 : (count === 1 ? 0 : -1);
        }

        static getP1GamepadIndex() {
            const count = this.getConnectedCount();
            return count >= 2 ? 0 : -1; // P1 only gets a gamepad if 2+ are connected
        }

        static isButtonPressed(gpIndex, btnIndex) {
            if (gpIndex < 0) return false;
            const gp = navigator.getGamepads()[gpIndex];
            return gp && gp.buttons[btnIndex] && gp.buttons[btnIndex].pressed;
        }

        static getAxisValue(gpIndex, axisIndex) {
            if (gpIndex < 0) return 0;
            const gp = navigator.getGamepads()[gpIndex];
            if (!gp || !gp.axes) return 0;
            const val = gp.axes[axisIndex];
            return Math.abs(val) > P2_STICK_DEAD ? val : 0;
        }
    }

    // =========================================================================
    // Equipment Lock
    // =========================================================================
    const _Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
    Game_Actor.prototype.isEquipChangeOk = function (slotId) {
        if (this._p2Generated) return false;
        return _Game_Actor_isEquipChangeOk.call(this, slotId);
    };

    // Hide Followers when Split-Screen is active
    const _Game_Followers_update = Game_Followers.prototype.update;
    Game_Followers.prototype.update = function () {
        if (SplitScreenManager.active && SplitScreenManager.p2Event) {
            this._data.forEach(follower => follower.setOpacity(0));
            return;
        }
        _Game_Followers_update.call(this);
    };

    const _Game_Follower_isVisible = Game_Follower.prototype.isVisible;
    Game_Follower.prototype.isVisible = function () {
        if (SplitScreenManager.active && SplitScreenManager.p2Event) return false;
        return _Game_Follower_isVisible.call(this);
    };

    // =========================================================================
    // SplitScreenManager
    // =========================================================================
    const SplitScreenManager = {
        active: false,
        p2EventName: P2_EVENT_NAME,
        p2CharName: "",
        p2CharIndex: 0,
        p2Event: null,
        isSplit: false,
        p2Input: { up: false, down: false, left: false, right: false, action: false },
        _prevP2Input: { up: false, down: false, left: false, right: false, action: false },
        _savedPartyIds: [],

        init() {
            this.active = false;
            this.p2Event = null;
            this.isSplit = false;
            this._savedPartyIds = [];
        },

        resolveP2Character() {
            if ($gameParty && $gameParty.members().length >= 2) {
                const actor = $gameParty.members()[1];
                this.p2CharName = actor.characterName();
                this.p2CharIndex = actor.characterIndex();
                this._p2ActorId = actor.actorId();
            } else {
                // Fallback
                this.p2CharName = "";
                this.p2CharIndex = 0;
            }
        },

        createSelectionPool() {
            const pool = [];
            // 1. Existing members (skip P1)
            if ($gameParty) {
                const members = $gameParty.members();
                for (let i = 1; i < members.length; i++) {
                    const actor = members[i];
                    pool.push({
                        type: "existing",
                        actor: actor,
                        name: actor.name(),
                        className: actor.currentClass().name,
                        characterName: actor.characterName(),
                        characterIndex: actor.characterIndex(),
                        traits: actor._selectedTraits || [],
                        weapon: actor.weapons()[0],
                        stats: {
                            atk: actor.atk, def: actor.def, mat: actor.mat,
                            mdf: actor.mdf, agi: actor.agi, luk: actor.luk
                        }
                    });
                }
            }
            // 2. Generated candidates
            this.generateCandidates().forEach(c => {
                c.type = "generated";
                pool.push(c);
            });
            return pool;
        },

        generateCandidates() {
            const candidates = [];
            const names = ["Aria", "Boran", "Caelum", "Dara", "Eon", "Fay", "Gael", "Hera", "Ikar", "Juno", "Kael", "Lina"];

            // Get available classes from ClassSelection plugin or default
            const classParams = PluginManager.parameters("CharacterCreationClassSelector");
            let availableClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            if (classParams && classParams["availableClasses"]) {
                availableClasses = classParams["availableClasses"].split(",").map(id => Number(id.trim()));
            }

            const TraitsArray = (window.Health && window.Health.Traits) || [];

            for (let i = 0; i < 3; i++) {
                const classId = availableClasses[Math.floor(Math.random() * availableClasses.length)];
                const classData = $dataClasses[classId];
                const charIdx = Math.floor(Math.random() * SKAB_POOL.length);
                const charName = SKAB_POOL[charIdx];
                const charIndex = charName.includes("!$") ? 0 : Math.floor(Math.random() * 8);

                // Pick 2 random traits
                const traits = [];
                if (TraitsArray.length > 0) {
                    for (let j = 0; j < 2; j++) {
                        const trait = TraitsArray[Math.floor(Math.random() * TraitsArray.length)];
                        if (!traits.includes(trait)) traits.push(trait);
                        else j--;
                    }
                }

                // Pre-determine weapon
                let weapon = null;
                if (window.StartingEquipment) {
                    const types = window.StartingEquipment.getCompatibleWeaponTypes(classId);
                    const pool = window.StartingEquipment.getCompatibleWeapons(types);
                    if (pool.length > 0) {
                        weapon = pool[Math.floor(Math.random() * pool.length)];
                    }
                }

                candidates.push({
                    name: names[Math.floor(Math.random() * names.length)],
                    classId: classId,
                    className: classData.name,
                    characterName: charName,
                    characterIndex: charIndex,
                    traits: traits,
                    weapon: weapon,
                    stats: {
                        atk: classData.params[2][1] + Math.randomInt(5),
                        def: classData.params[3][1] + Math.randomInt(5),
                        mat: classData.params[4][1] + Math.randomInt(5),
                        mdf: classData.params[5][1] + Math.randomInt(5),
                        agi: classData.params[6][1] + Math.randomInt(5),
                        luk: classData.params[7][1] + Math.randomInt(5)
                    }
                });
            }
            return candidates;
        },

        applyCandidateToActor(candidate, actorId) {
            const actor = $gameActors.actor(actorId);
            actor.setup(actorId);
            actor.setName(candidate.name);
            actor.changeClass(candidate.classId, false);
            actor.setCharacterImage(candidate.characterName, candidate.characterIndex);

            // Apply stats
            for (let i = 2; i < 8; i++) {
                const paramName = ["atk", "def", "mat", "mdf", "agi", "luk"][i - 2];
                actor.addParam(i, candidate.stats[paramName] - actor.param(i));
            }

            // Apply Traits
            if (window.CharacterCreationUtils && window.CharacterCreationUtils.applyTraitsToActor) {
                window.CharacterCreationUtils.applyTraitsToActor(actor, candidate.traits.map(t => t.id));
            }

            // Apply Equipment
            if (candidate.weapon) {
                $gameParty.gainItem(candidate.weapon, 1);
                actor.changeEquip(0, candidate.weapon);
                if (window.StartingEquipment && window.StartingEquipment.learnStarterSkills) {
                    window.StartingEquipment.learnStarterSkills(actor);
                }
            } else if (window.StartingEquipment && window.StartingEquipment.applyStartingGear) {
                window.StartingEquipment.applyStartingGear(actor, candidate.classId);
            }

            // Lock equipment
            actor._p2Generated = true;
            this._p2ActorId = actorId;
        },

        startSession(candidate) {
            this._savedPartyIds = $gameParty._actors.slice();
            const p1Id = $gameParty._actors[0];
            
            if (candidate.type === "existing") {
                const p2Id = candidate.actor.actorId();
                $gameParty._actors = [p1Id, p2Id];
                this._p2ActorId = p2Id;
            } else {
                const guestId = 4; // Using Actor 4 for generated guest
                this.applyCandidateToActor(candidate, guestId);
                $gameParty._actors = [p1Id, guestId];
                this._p2ActorId = guestId;
            }
            
            $gamePlayer.refresh();
            this.active = true;
            $gameSwitches.setValue(67, true);
            this.resolveP2Character();
            if (typeof findOrCreateP2Event === 'function') findOrCreateP2Event();
        },

        stopSession() {
            this.active = false;
            if (this._p2ActorId) {
                const actor = $gameActors.actor(this._p2ActorId);
                if (actor && actor._p2Generated) {
                    actor._p2Generated = false;
                }
            }
            if (this._savedPartyIds && this._savedPartyIds.length > 0) {
                $gameParty._actors = this._savedPartyIds.slice();
                this._savedPartyIds = [];
            }
            $gameSwitches.setValue(67, false);
            this.p2Event = null;
            this.isSplit = false;
            $gamePlayer.refresh();
        },

        pollInput() {
            // Save previous
            Object.assign(this._prevP2Input, this.p2Input);

            // Keyboard
            const keys = window._p2Keys || {};
            const codes = window._p2Codes || {};

            let up = !!keys[P2_KEYS.up] || !!codes["Numpad8"];
            let down = !!keys[P2_KEYS.down] || !!codes["Numpad2"];
            let left = !!keys[P2_KEYS.left] || !!codes["Numpad4"];
            let right = !!keys[P2_KEYS.right] || !!codes["Numpad6"];
            let action = !!keys[P2_KEYS.action] || !!codes["NumpadEnter"] || !!codes["Numpad0"];

            // Gamepad
            const gpIndex = GamepadManager.getP2GamepadIndex();
            if (gpIndex >= 0) {
                if (GamepadManager.isButtonPressed(gpIndex, 12)) up = true;    // D-Pad Up
                if (GamepadManager.isButtonPressed(gpIndex, 13)) down = true;  // D-Pad Down
                if (GamepadManager.isButtonPressed(gpIndex, 14)) left = true;  // D-Pad Left
                if (GamepadManager.isButtonPressed(gpIndex, 15)) right = true; // D-Pad Right
                if (GamepadManager.isButtonPressed(gpIndex, 0)) action = true;  // A button

                const stickX = GamepadManager.getAxisValue(gpIndex, 0);
                const stickY = GamepadManager.getAxisValue(gpIndex, 1);
                if (stickY < 0) up = true;
                if (stickY > 0) down = true;
                if (stickX < 0) left = true;
                if (stickX > 0) right = true;
            }

            this.p2Input = { up, down, left, right, action };
        },

        isTriggered(key) {
            return this.p2Input[key] && !this._prevP2Input[key];
        }
    };
    window.$gameSplitScreen = SplitScreenManager;

    // Keyboard listener
    window._p2Keys = {};
    window._p2Codes = {};
    document.addEventListener("keydown", e => {
        window._p2Keys[e.key.toLowerCase()] = true;
        window._p2Codes[e.code] = true;
    });
    document.addEventListener("keyup", e => {
        window._p2Keys[e.key.toLowerCase()] = false;
        window._p2Codes[e.code] = false;
    });

    // =========================================================================
    // Scene_SplitScreen (Styled like MultiplayerSystem.js)
    // =========================================================================
    class Scene_SplitScreen extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this.createStatusWindow();
            this.createCommandWindow();
        }

        createHelpWindow() {
            const rect = new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.calcWindowHeight(1, false));
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText("Local Split-Screen Management");
            this.addWindow(this._helpWindow);
        }

        createStatusWindow() {
            const ww = Math.floor(Graphics.boxWidth * 0.4);
            const wh = this.calcWindowHeight(6, true);
            const wx = Graphics.boxWidth - ww;
            const wy = this._helpWindow.y + this._helpWindow.height;
            this._statusWindow = new Window_SplitScreenStatus(new Rectangle(wx, wy, ww, wh));
            this.addWindow(this._statusWindow);
        }

        createCommandWindow() {
            const ww = Graphics.boxWidth - this._statusWindow.width;
            const wh = this._statusWindow.height;
            const wx = 0;
            const wy = this._statusWindow.y;
            this._commandWindow = new Window_SplitScreenCommand(new Rectangle(wx, wy, ww, wh));
            this._commandWindow.setHandler("toggle", this.commandToggle.bind(this));
            this._commandWindow.setHandler("cancel", this.popScene.bind(this));
            this.addWindow(this._commandWindow);
        }

        commandToggle() {
            if (!SplitScreenManager.active) {
                // Turning ON - always go to selection to choose P2
                SceneManager.push(Scene_SplitScreenCharacterSelection);
            } else {
                // Turning OFF
                SplitScreenManager.stopSession();
                this._commandWindow.refresh();
                this._statusWindow.refresh();
                this._commandWindow.activate();
            }
        }

        update() {
            super.update();
            this._statusWindow.refresh();
        }
    }

    class Window_SplitScreenCommand extends Window_Command {
        makeCommandList() {
            const label = SplitScreenManager.active ? "► Disable Split-Screen" : "► Enable Split-Screen";
            this.addCommand(label, "toggle");
        }
    }

    // =========================================================================
    // Scene_SplitScreenCharacterSelection
    // =========================================================================
    class Scene_SplitScreenCharacterSelection extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this.createCandidates();
            this.createCommandWindow();
        }

        createHelpWindow() {
            const rect = new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.calcWindowHeight(1, false));
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText("Choose your companion for Local Split-Screen");
            this.addWindow(this._helpWindow);
        }

        createCandidates() {
            this._candidates = SplitScreenManager.createSelectionPool();
        }

        createCommandWindow() {
            const ww = Graphics.boxWidth;
            const wh = 200;
            const wx = 0;
            const wy = Graphics.boxHeight - wh;
            this._commandWindow = new Window_SplitScreenCharSelect(new Rectangle(wx, wy, ww, wh), this._candidates);
            this._commandWindow.setHandler("ok", this.onCandidateOk.bind(this));
            this._commandWindow.setHandler("cancel", this.popScene.bind(this));
            this._commandWindow.setHandler("select", this.onCandidateChange.bind(this));
            this.addWindow(this._commandWindow);

            this.createDetailsWindow();
        }

        createDetailsWindow() {
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - this._helpWindow.height - this._commandWindow.height;
            const wx = 0;
            const wy = this._helpWindow.height;
            this._detailsWindow = new Window_SplitScreenCharDetails(new Rectangle(wx, wy, ww, wh));
            this.addWindow(this._detailsWindow);
            this.onCandidateChange();
        }

        onCandidateChange() {
            if (this._detailsWindow) {
                const candidate = this._candidates[this._commandWindow.index()];
                this._detailsWindow.setCandidate(candidate);
            }
        }

        onCandidateOk() {
            const candidate = this._candidates[this._commandWindow.index()];
            SplitScreenManager.startSession(candidate);
            SceneManager.goto(Scene_Map);
        }
    }

    class Window_SplitScreenCharSelect extends Window_HorzCommand {
        initialize(rect, candidates) {
            this._candidates = candidates;
            super.initialize(rect);
        }

        maxCols() { return this._candidates.length; }

        makeCommandList() {
            this._candidates.forEach((c, i) => {
                this.addCommand(c.name, "candidate" + i);
            });
        }

        drawItem(index) {
            const rect = this.itemLineRect(index);
            const candidate = this._candidates[index];
            this.drawText(candidate.name, rect.x, rect.y, rect.width, "center");
            this.drawText(candidate.className, rect.x, rect.y + this.lineHeight(), rect.width, "center");
        }

        itemHeight() { return this.lineHeight() * 2; }

        updateHelp() {
            super.updateHelp();
            this.callHandler("select");
        }
    }

    class Window_SplitScreenCharDetails extends Window_Base {
        setCandidate(candidate) {
            this._candidate = candidate;
            this.refresh();
        }

        getTraitName(trait) {
            const lang = ConfigManager.language || "en";
            if (trait.name && typeof trait.name === "object") {
                return trait.name[lang] || trait.name["en"];
            }
            return trait.name || "Unknown Trait";
        }

        refresh() {
            this.contents.clear();
            if (!this._candidate) return;

            const c = this._candidate;
            this.contents.fontSize = 32;
            this.drawText(c.name, 0, 0, this.contentsWidth(), "center");
            this.contents.fontSize = 24;
            this.drawText(c.className, 0, this.lineHeight(), this.contentsWidth(), "center");
            this.resetFontSettings();

            let y = this.lineHeight() * 2.5;
            const half = this.contentsWidth() / 2;

            // Stats
            this.changeTextColor(this.systemColor());
            this.drawText("Stats", 20, y, half);
            this.resetTextColor();
            y += this.lineHeight();

            const stats = [
                { n: "ATK", v: c.stats.atk }, { n: "DEF", v: c.stats.def },
                { n: "MAT", v: c.stats.mat }, { n: "MDF", v: c.stats.mdf },
                { n: "AGI", v: c.stats.agi }, { n: "LUK", v: c.stats.luk }
            ];

            stats.forEach((s, i) => {
                const sx = (i % 2) * (half / 2) + 40;
                const sy = y + Math.floor(i / 2) * this.lineHeight();
                this.drawText(`${s.n}: ${s.v}`, sx, sy, half / 2);
            });

            // Equipment & Traits
            let ty = this.lineHeight() * 2.5;
            
            // Equipment
            this.changeTextColor(this.systemColor());
            this.drawText("Equipment", half, ty, half);
            this.resetTextColor();
            ty += this.lineHeight();
            if (c.weapon) {
                this.drawIcon(c.weapon.iconIndex, half + 20, ty);
                this.drawText(c.weapon.name, half + 56, ty, half - 60);
            } else {
                this.drawText("None", half + 56, ty, half - 60);
            }
            ty += this.lineHeight() * 1.5;

            // Traits
            this.changeTextColor(this.systemColor());
            this.drawText("Traits", half, ty, half);
            this.resetTextColor();
            ty += this.lineHeight();

            c.traits.forEach(t => {
                const icon = t.icon || 0;
                if (icon) this.drawIcon(icon, half + 20, ty);
                this.drawText(this.getTraitName(t), half + 56, ty, half - 60);
                ty += this.lineHeight();
            });

            // Preview (Actual Player Sprite - Scaled)
            this.drawLargeCharacter(c.characterName, c.characterIndex, this.contentsWidth() - 80, this.contentsHeight() - 20);
        }

        drawLargeCharacter(characterName, characterIndex, x, y) {
            const bitmap = ImageManager.loadCharacter(characterName);
            if (bitmap.isReady()) {
                this.contentsDrawCharacter(bitmap, characterIndex, x, y);
            } else {
                bitmap.addLoadListener(() => this.contentsDrawCharacter(bitmap, characterIndex, x, y));
            }
        }

        contentsDrawCharacter(bitmap, characterIndex, x, y) {
            if (!this._candidate) return;
            const big = ImageManager.isBigCharacter(this._candidate.characterName);
            const pw = bitmap.width / (big ? 3 : 12);
            const ph = bitmap.height / (big ? 4 : 8);
            const n = big ? 0 : characterIndex;
            const sx = ((n % 4) * 3 + 1) * pw;
            const sy = Math.floor(n / 4) * 4 * ph;
            const scale = 2;
            const dw = pw * scale;
            const dh = ph * scale;
            this.contents.blt(bitmap, sx, sy, pw, ph, x - dw / 2, y - dh, dw, dh);
        }
    }

    class Window_SplitScreenStatus extends Window_Base {
        refresh() {
            this.contents.clear();
            this.changeTextColor(this.systemColor());
            this.drawText("Status", 0, 0, this.contentsWidth(), "center");
            this.resetTextColor();

            let y = this.lineHeight();
            const gpCount = GamepadManager.getConnectedCount();
            this.drawText(`Gamepads: ${gpCount}`, 4, y);
            y += this.lineHeight();

            const active = SplitScreenManager.active;
            this.drawText(`Active: ${active ? "YES" : "NO"}`, 4, y);
            y += this.lineHeight();

            if (active) {
                const gpIdx = GamepadManager.getP2GamepadIndex();
                const inputMode = gpIdx >= 0 ? `Gamepad ${gpIdx}` : "Keyboard (WASD)";
                this.drawText(`P2 Input: ${inputMode}`, 4, y);
            }
        }
    }

    // =========================================================================
    // Core Engine Integration
    // =========================================================================
    class Scene_SplitScreenTerminate extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this._helpWindow.setText("Active Multiplayer Session");
            this.createCommandWindow();
        }

        createCommandWindow() {
            const ww = 400;
            const wh = this.calcWindowHeight(1, true);
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2;
            this._commandWindow = new Window_MultiplayerTerminate(new Rectangle(wx, wy, ww, wh));
            this._commandWindow.setHandler("terminate", this.commandTerminate.bind(this));
            this._commandWindow.setHandler("cancel", this.popScene.bind(this));
            this.addWindow(this._commandWindow);
        }

        commandTerminate() {
            SplitScreenManager.stopSession();
            SceneManager.goto(Scene_Map);
        }
    }

    class Window_MultiplayerTerminate extends Window_Command {
        makeCommandList() {
            this.addCommand("Terminate Session", "terminate");
        }
    }

    // Export to window for access from MultiplayerSystem.js
    window.Scene_SplitScreenCharacterSelection = Scene_SplitScreenCharacterSelection;
    window.Scene_SplitScreenTerminate = Scene_SplitScreenTerminate;

    // Integrated with MultiplayerSystem's selection menu

    // Title Menu Integration removed as requested

    // Input Hijacking for P1 (if 2+ gamepads, P1 uses GP0, otherwise default)
    const _Input_update = Input.update;
    Input.update = function () {
        _Input_update.call(this);
        const p1GpIdx = GamepadManager.getP1GamepadIndex();
        if (p1GpIdx >= 0) {
            const gp = navigator.getGamepads()[p1GpIdx];
            if (gp) {
                if (GamepadManager.isButtonPressed(p1GpIdx, 12)) Input._currentState['up'] = true;
                if (GamepadManager.isButtonPressed(p1GpIdx, 13)) Input._currentState['down'] = true;
                if (GamepadManager.isButtonPressed(p1GpIdx, 14)) Input._currentState['left'] = true;
                if (GamepadManager.isButtonPressed(p1GpIdx, 15)) Input._currentState['right'] = true;
                if (GamepadManager.isButtonPressed(p1GpIdx, 0)) Input._currentState['ok'] = true;
            }
        }
    };

    const _SceneManager_updateInputData = SceneManager.updateInputData;
    SceneManager.updateInputData = function () {
        _SceneManager_updateInputData.call(this);
        if (SplitScreenManager.active && SplitScreenManager.p2Event) SplitScreenManager.pollInput();
    };

    // =========================================================================
    // Map & Camera (From SplitScreenMultiplayer)
    // =========================================================================
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        _Scene_Map_onMapLoaded.call(this);
        if (SplitScreenManager.active) findOrCreateP2Event();
    };

    function findOrCreateP2Event() {
        SplitScreenManager.p2Event = null;
        if (!$gameMap) return;
        SplitScreenManager.resolveP2Character();
        const event = $gameMap.events().find(ev => ev && ev.event().name === P2_EVENT_NAME);
        if (event) {
            SplitScreenManager.p2Event = event;
            event.setImage(SplitScreenManager.p2CharName, SplitScreenManager.p2CharIndex);
            event.setOpacity(255);
            event.setPriorityType(1);
            event.setMoveSpeed(5);
            // Teleport near P1
            event.locate($gamePlayer.x, $gamePlayer.y);
        }
    }

    const _Game_Map_updateEvents = Game_Map.prototype.updateEvents;
    Game_Map.prototype.updateEvents = function () {
        _Game_Map_updateEvents.call(this);
        if (SplitScreenManager.active && SplitScreenManager.p2Event && !SplitScreenManager.p2Event.isMoving()) {
            updateP2Movement();
        }
    };

    function updateP2Movement() {
        const ev = SplitScreenManager.p2Event;
        const input = SplitScreenManager.p2Input;
        let dir = 0;
        if (input.up) dir = 8;
        if (input.down) dir = 2;
        if (input.left) dir = 4;
        if (input.right) dir = 6;
        if (dir > 0) ev.moveStraight(dir);

        if (SplitScreenManager.isTriggered("action")) {
            const d = ev.direction();
            const x2 = $gameMap.roundXWithDirection(ev.x, d);
            const y2 = $gameMap.roundYWithDirection(ev.y, d);
            $gameMap.eventsXy(x2, y2).forEach(target => {
                if (target !== ev && target.isTriggerIn([0])) target.start();
            });
            $gameMap.eventsXy(ev.x, ev.y).forEach(target => {
                if (target !== ev && target.isTriggerIn([1, 2])) target.start();
            });
        }
    }

    // Rendering
    const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function () {
        _Scene_Map_createSpriteset.call(this);
        this._p2DisplayX = 0;
        this._p2DisplayY = 0;
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        if (SplitScreenManager.active && SplitScreenManager.p2Event) {
            this.updateSplitScreen();
        }
    };

    Scene_Map.prototype.updateSplitScreen = function () {
        const p1 = $gamePlayer;
        const p2 = SplitScreenManager.p2Event;
        const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        const shouldSplit = dist > PROXIMITY;

        if (shouldSplit && !this._splitScreenActive) this.activateSplitScreen();
        else if (!shouldSplit && this._splitScreenActive) this.deactivateSplitScreen();

        if (this._splitScreenActive) this.updateSplitViewports();
        else this.updateMergedCamera();
    };

    Scene_Map.prototype.activateSplitScreen = function () {
        this._splitScreenActive = true;
        const gw = Graphics.width;
        const gh = Graphics.height;

        const mask1 = new PIXI.Graphics().beginFill(0xffffff);
        if (SPLIT_DIR === "vertical") mask1.drawRect(0, 0, Math.floor(gw / 2), gh);
        else mask1.drawRect(0, 0, gw, Math.floor(gh / 2));
        this.addChild(mask1);
        this._spriteset.mask = mask1;
        this._p1Mask = mask1;

        // Initialize P2 display coordinates to avoid jumping
        this._p2DisplayX = $gameMap.displayX();
        this._p2DisplayY = $gameMap.displayY();

        this._p2Spriteset = new Spriteset_Map();
        
        // Hijack update to use P2-specific display coordinates
        const scene = this;
        const _p2Update = this._p2Spriteset.update;
        this._p2Spriteset.update = function() {
            const lastX = $gameMap._displayX;
            const lastY = $gameMap._displayY;
            $gameMap._displayX = scene._p2DisplayX;
            $gameMap._displayY = scene._p2DisplayY;
            _p2Update.call(this);
            $gameMap._displayX = lastX;
            $gameMap._displayY = lastY;
        };

        const mask2 = new PIXI.Graphics().beginFill(0xffffff);
        if (SPLIT_DIR === "vertical") {
            mask2.drawRect(Math.floor(gw / 2), 0, Math.floor(gw / 2), gh);
        } else {
            mask2.drawRect(0, Math.floor(gh / 2), gw, Math.floor(gh / 2));
        }
        this.addChild(mask2);
        this._p2Spriteset.mask = mask2;
        this._p2Mask = mask2;
        this.addChild(this._p2Spriteset);
    };

    Scene_Map.prototype.deactivateSplitScreen = function () {
        this._splitScreenActive = false;
        if (this._spriteset && this._p1Mask) {
            this.removeChild(this._p1Mask);
            this._spriteset.mask = null;
            this._p1Mask = null;
        }
        if (this._p2Spriteset) {
            if (this._p2Mask) {
                this.removeChild(this._p2Mask);
                this._p2Mask = null;
            }
            this.removeChild(this._p2Spriteset);
            this._p2Spriteset.destroy({ children: true });
            this._p2Spriteset = null;
        }
        this._spriteset.x = 0;
        this._spriteset.y = 0;
    };

    Scene_Map.prototype.updateSplitViewports = function () {
        const p1 = $gamePlayer;
        const ev = SplitScreenManager.p2Event;
        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const gw = Graphics.width;
        const gh = Graphics.height;
        const vpW = SPLIT_DIR === "vertical" ? gw / 2 : gw;
        const vpH = SPLIT_DIR === "vertical" ? gh : gh / 2;

        // P1 Centering (Center of their viewport)
        const p1TargetX = Math.max(0, Math.min(p1._realX - vpW / tw / 2 + 0.5, $gameMap.width() - vpW / tw));
        const p1TargetY = Math.max(0, Math.min(p1._realY - vpH / th / 2 + 0.5, $gameMap.height() - vpH / th));
        $gameMap._displayX = p1TargetX;
        $gameMap._displayY = p1TargetY;

        // P2 Centering (Center of their viewport)
        const p2TargetX = Math.max(0, Math.min(ev._realX - vpW / tw / 2 + 0.5, $gameMap.width() - vpW / tw));
        const p2TargetY = Math.max(0, Math.min(ev._realY - vpH / th / 2 + 0.5, $gameMap.height() - vpH / th));

        this._p2DisplayX += (p2TargetX - this._p2DisplayX) * 0.15;
        this._p2DisplayY += (p2TargetY - this._p2DisplayY) * 0.15;

        // Visual Offsets (Base positions for viewports)
        if (SPLIT_DIR === "vertical") {
            this._spriteset.x = 0;
            this._p2Spriteset.x = Math.floor(gw / 2);
            this._p2Spriteset.y = 0;
        } else {
            this._spriteset.y = 0;
            this._p2Spriteset.x = 0;
            this._p2Spriteset.y = Math.floor(gh / 2);
        }
    };

    Scene_Map.prototype.updateMergedCamera = function () {
        const p1 = $gamePlayer;
        const p2 = SplitScreenManager.p2Event;
        const midX = (p1._realX + p2._realX) / 2;
        const midY = (p1._realY + p2._realY) / 2;
        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const gw = Graphics.width;
        const gh = Graphics.height;

        const targetX = Math.max(0, Math.min(midX - gw / tw / 2 + 0.5, $gameMap.width() - gw / tw));
        const targetY = Math.max(0, Math.min(midY - gh / th / 2 + 0.5, $gameMap.height() - gh / th));

        $gameMap._displayX += (targetX - $gameMap._displayX) * 0.12;
        $gameMap._displayY += (targetY - $gameMap._displayY) * 0.12;
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        if (this._splitScreenActive) this.deactivateSplitScreen();
        _Scene_Map_terminate.call(this);
    };

})();
