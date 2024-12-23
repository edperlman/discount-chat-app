"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.require = void 0;
const node_module_1 = require("node:module");
const _require = (0, node_module_1.createRequire)(import.meta.url);
const require = (mod) => {
    // When we try to import something from the apps-engine, we resolve the path using import maps from Deno
    // However, the import maps are configured to look at the source folder for typescript files, but during
    // runtime those files are not available
    if (mod.startsWith('@rocket.chat/apps-engine')) {
        mod = import.meta.resolve(mod).replace('file://', '').replace('src/', '');
    }
    return _require(mod);
};
exports.require = require;
