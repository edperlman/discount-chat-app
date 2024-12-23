"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportersContainer = void 0;
/** Container class which holds all of the importer details. */
class ImportersContainer {
    constructor() {
        this.importers = new Map();
    }
    add({ key, name, importer, visible }) {
        this.importers.set(key, {
            key,
            name,
            visible: visible !== false,
            importer,
        });
    }
    get(key) {
        return this.importers.get(key);
    }
    getAllVisible() {
        return Array.from(this.importers.values()).filter(({ visible }) => visible);
    }
}
exports.ImportersContainer = ImportersContainer;
