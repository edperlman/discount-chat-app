"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImporterProgress = void 0;
const ImporterProgressStep_1 = require("../../lib/ImporterProgressStep");
class ImporterProgress {
    /**
     * Creates a new progress container for the importer.
     *
     * @param {string} key The unique key of the importer.
     * @param {string} name The name of the importer.
     */
    constructor(key, name) {
        this.key = key;
        this.name = name;
        this.step = ImporterProgressStep_1.ProgressStep.NEW;
        this.count = { completed: 0, total: 0, error: 0 };
    }
}
exports.ImporterProgress = ImporterProgress;
