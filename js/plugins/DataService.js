/*:
 * @target MZ
 * @plugindesc Automatically registers JSON files from js/db/ to global window objects.
 * @author Antigravity
 *
 * @help
 * This plugin scans the js/db/ directory and its subdirectories, loading all .json
 * files and registering them to namespaced window objects.
 *
 * Rules:
 * - Window object name = Folder name (e.g., js/db/Health/ -> window.Health)
 * - Property name = Filename without extension (e.g., BodyParts.json -> window.Health.BodyParts)
 *
 * Example:
 * js/db/Worldgen/Biomes.json -> window.WorldGen.Biomes
 */

(() => {
    const fs = require('fs');
    const path = require('path');

    const DB_PATH = path.join(process.cwd(), 'js', 'db');

    function loadDatabase() {
        if (!fs.existsSync(DB_PATH)) {
            console.warn(`DataService: DB path not found: ${DB_PATH}`);
            return;
        }

        const folders = fs.readdirSync(DB_PATH);

        folders.forEach(folder => {
            const folderPath = path.join(DB_PATH, folder);
            if (!fs.statSync(folderPath).isDirectory()) return;

            const windowName = folder;
            window[windowName] = window[windowName] || {};

            const files = fs.readdirSync(folderPath);
            files.forEach(file => {
                if (path.extname(file).toLowerCase() !== '.json') return;

                const filePath = path.join(folderPath, file);
                const fileName = path.basename(file, '.json');

                try {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                    // Register using the exact filename
                    window[windowName][fileName] = data;

                    console.log(`DataService: Registered window.${windowName}.${fileName}`);
                } catch (e) {
                    console.error(`DataService: Failed to load ${filePath}: ${e.message}`);
                }
            });
        });
    }

    if (Utils.isNwjs()) {
        loadDatabase();
    } else {
        console.warn("DataService: Synchronous fs loading not supported in browser environment.");
    }
})();
