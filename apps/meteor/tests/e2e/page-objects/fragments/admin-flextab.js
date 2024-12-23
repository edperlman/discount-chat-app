"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminFlextab = void 0;
const admin_flextab_users_1 = require("./admin-flextab-users");
class AdminFlextab {
    constructor(page) {
        this.users = new admin_flextab_users_1.AdminFlextabUsers(page);
    }
}
exports.AdminFlextab = AdminFlextab;
