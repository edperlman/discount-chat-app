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
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../app/settings/server");
const migrations_1 = require("../../lib/migrations");
(0, migrations_1.addMigration)({
    version: 300,
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const customOauthServices = yield models_1.Settings.find({ _id: /Accounts_OAuth_Custom-[^-]+$/ }, { projection: { _id: 1 } }).toArray();
            const serviceNames = customOauthServices.map(({ _id }) => _id.replace('Accounts_OAuth_Custom-', ''));
            try {
                for (var _d = true, serviceNames_1 = __asyncValues(serviceNames), serviceNames_1_1; serviceNames_1_1 = yield serviceNames_1.next(), _a = serviceNames_1_1.done, !_a; _d = true) {
                    _c = serviceNames_1_1.value;
                    _d = false;
                    const serviceName = _c;
                    yield server_1.settingsRegistry.add(`Accounts_OAuth_Custom-${serviceName}-merge_users_distinct_services`, false, {
                        type: 'boolean',
                        group: 'OAuth',
                        section: `Custom OAuth: ${serviceName}`,
                        i18nLabel: 'Accounts_OAuth_Custom_Merge_Users_Distinct_Services',
                        i18nDescription: 'Accounts_OAuth_Custom_Merge_Users_Distinct_Services_Description',
                        enableQuery: {
                            _id: `Accounts_OAuth_Custom-${serviceName}-merge_users`,
                            value: true,
                        },
                        persistent: true,
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = serviceNames_1.return)) yield _b.call(serviceNames_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    },
});
