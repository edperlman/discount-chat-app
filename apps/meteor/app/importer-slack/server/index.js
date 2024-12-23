"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackImporter_1 = require("./SlackImporter");
const server_1 = require("../../importer/server");
server_1.Importers.add({
    key: 'slack',
    name: 'Slack',
    importer: SlackImporter_1.SlackImporter,
});
