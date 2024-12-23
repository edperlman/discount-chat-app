"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoleBridge = void 0;
const bridges_1 = require("@rocket.chat/apps-engine/server/bridges");
const models_1 = require("@rocket.chat/models");
class AppRoleBridge extends bridges_1.RoleBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    getOneByIdOrName(idOrName, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the roleByIdOrName: "${idOrName}"`);
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const role = yield models_1.Roles.findOneByIdOrName(idOrName);
            return (_a = this.orch
                .getConverters()) === null || _a === void 0 ? void 0 : _a.get('roles').convertRole(role);
        });
    }
    getCustomRoles(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            var _d;
            this.orch.debugLog(`The App ${appId} is getting the custom roles`);
            const cursor = models_1.Roles.findCustomRoles();
            const roles = [];
            try {
                for (var _e = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _e = true) {
                    _c = cursor_1_1.value;
                    _e = false;
                    const role = _c;
                    const convRole = yield ((_d = this.orch.getConverters()) === null || _d === void 0 ? void 0 : _d.get('roles').convertRole(role));
                    roles.push(convRole);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_e && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return roles;
        });
    }
}
exports.AppRoleBridge = AppRoleBridge;
