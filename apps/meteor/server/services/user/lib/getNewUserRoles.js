"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewUserRoles = getNewUserRoles;
const server_1 = require("../../../../app/settings/server");
const parseCSV_1 = require("../../../../lib/utils/parseCSV");
function getNewUserRoles(previousRoles) {
    const currentRoles = previousRoles !== null && previousRoles !== void 0 ? previousRoles : [];
    const defaultUserRoles = (0, parseCSV_1.parseCSV)(server_1.settings.get('Accounts_Registration_Users_Default_Roles') || '');
    return [...new Set([...currentRoles, ...defaultUserRoles])];
}
