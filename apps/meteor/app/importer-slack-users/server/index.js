"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackUsersImporter_1 = require("./SlackUsersImporter");
const server_1 = require("../../importer/server");
server_1.Importers.add({
    key: 'slack-users',
    name: 'Slack_Users',
    importer: SlackUsersImporter_1.SlackUsersImporter,
});
