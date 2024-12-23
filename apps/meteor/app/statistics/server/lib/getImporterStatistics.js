"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImporterStatistics = getImporterStatistics;
const server_1 = require("../../../settings/server");
function getImporterStatistics() {
    return {
        totalCSVImportedUsers: server_1.settings.get('CSV_Importer_Count'),
        totalHipchatEnterpriseImportedUsers: server_1.settings.get('Hipchat_Enterprise_Importer_Count'),
        totalSlackImportedUsers: server_1.settings.get('Slack_Importer_Count'),
        totalSlackUsersImportedUsers: server_1.settings.get('Slack_Users_Importer_Count'),
    };
}
