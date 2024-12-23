"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsRoleBridge = void 0;
const bridges_1 = require("../../../src/server/bridges");
class TestsRoleBridge extends bridges_1.RoleBridge {
    getOneByIdOrName(idOrName, appId) {
        throw new Error('Method not implemented.');
    }
    getCustomRoles(appId) {
        throw new Error('Method not implemented.');
    }
}
exports.TestsRoleBridge = TestsRoleBridge;
