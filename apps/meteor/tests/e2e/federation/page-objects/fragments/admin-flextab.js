"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationAdminFlextab = void 0;
const admin_flextab_users_1 = require("./admin-flextab-users");
class FederationAdminFlextab {
    constructor(page) {
        this.users = new admin_flextab_users_1.FederationAdminFlextabUsers(page);
    }
}
exports.FederationAdminFlextab = FederationAdminFlextab;
