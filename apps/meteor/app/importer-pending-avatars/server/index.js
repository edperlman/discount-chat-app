"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PendingAvatarImporter_1 = require("./PendingAvatarImporter");
const server_1 = require("../../importer/server");
server_1.Importers.add({
    key: 'pending-avatars',
    name: 'Pending Avatars',
    visible: false,
    importer: PendingAvatarImporter_1.PendingAvatarImporter,
});
