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
const apps_1 = require("@rocket.chat/apps");
const migrations_1 = require("../../lib/migrations");
(0, migrations_1.addMigration)({
    version: 294,
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            var _d;
            if (!apps_1.Apps.self) {
                throw new Error('Apps Orchestrator not registered.');
            }
            apps_1.Apps.initialize();
            const sigMan = (_d = apps_1.Apps.getManager()) === null || _d === void 0 ? void 0 : _d.getSignatureManager();
            const appsStorage = apps_1.Apps.getStorage();
            const apps = yield appsStorage.retrieveAll();
            try {
                for (var _e = true, _f = __asyncValues(apps.values()), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
                    _c = _g.value;
                    _e = false;
                    const app = _c;
                    if (app.installationSource && app.signature) {
                        continue;
                    }
                    const updatedApp = Object.assign(Object.assign({}, app), { migrated: true, installationSource: 'marketplaceInfo' in app ? 'marketplace' : 'private' });
                    yield appsStorage.update(Object.assign(Object.assign({}, updatedApp), { signature: yield sigMan.signApp(updatedApp) }));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_e && !_a && (_b = _f.return)) yield _b.call(_f);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    },
});
