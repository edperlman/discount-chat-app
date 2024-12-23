"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PendingFileImporter_1 = require("./PendingFileImporter");
const server_1 = require("../../importer/server");
server_1.Importers.add({
    key: 'pending-files',
    name: 'Pending Files',
    visible: false,
    importer: PendingFileImporter_1.PendingFileImporter,
});
