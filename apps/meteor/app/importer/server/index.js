"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Importers = exports.SelectionUser = exports.SelectionChannel = exports.Selection = exports.ProgressStep = exports.ImporterWebsocket = exports.Importer = void 0;
const ImporterProgressStep_1 = require("../lib/ImporterProgressStep");
Object.defineProperty(exports, "ProgressStep", { enumerable: true, get: function () { return ImporterProgressStep_1.ProgressStep; } });
const Importer_1 = require("./classes/Importer");
Object.defineProperty(exports, "Importer", { enumerable: true, get: function () { return Importer_1.Importer; } });
const ImporterSelection_1 = require("./classes/ImporterSelection");
Object.defineProperty(exports, "Selection", { enumerable: true, get: function () { return ImporterSelection_1.ImporterSelection; } });
const ImporterSelectionChannel_1 = require("./classes/ImporterSelectionChannel");
Object.defineProperty(exports, "SelectionChannel", { enumerable: true, get: function () { return ImporterSelectionChannel_1.SelectionChannel; } });
const ImporterSelectionUser_1 = require("./classes/ImporterSelectionUser");
Object.defineProperty(exports, "SelectionUser", { enumerable: true, get: function () { return ImporterSelectionUser_1.SelectionUser; } });
const ImporterWebsocket_1 = require("./classes/ImporterWebsocket");
Object.defineProperty(exports, "ImporterWebsocket", { enumerable: true, get: function () { return ImporterWebsocket_1.ImporterWebsocket; } });
const ImportersContainer_1 = require("./classes/ImportersContainer");
require("./methods");
require("./startup/setImportsToInvalid");
require("./startup/store");
exports.Importers = new ImportersContainer_1.ImportersContainer();
exports.Importers.add({
    key: 'api',
    name: 'API',
    visible: false,
    importer: Importer_1.Importer,
});
