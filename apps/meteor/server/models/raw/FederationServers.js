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
exports.FederationServersRaw = void 0;
const models_1 = require("@rocket.chat/models");
const BaseRaw_1 = require("./BaseRaw");
class FederationServersRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'federation_servers', trash);
    }
    modelIndexes() {
        return [{ key: { domain: 1 } }];
    }
    saveDomain(domain) {
        return this.updateOne({ domain }, {
            $setOnInsert: {
                domain,
            },
        }, { upsert: true });
    }
    refreshServers() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            // TODO remove model dependency - this logs should be inside a function/service and not in a model
            const domains = yield models_1.Users.getDistinctFederationDomains();
            try {
                for (var _d = true, domains_1 = __asyncValues(domains), domains_1_1; domains_1_1 = yield domains_1.next(), _a = domains_1_1.done, !_a; _d = true) {
                    _c = domains_1_1.value;
                    _d = false;
                    const domain = _c;
                    yield this.saveDomain(domain);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = domains_1.return)) yield _b.call(domains_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield this.deleteMany({ domain: { $nin: domains } });
        });
    }
}
exports.FederationServersRaw = FederationServersRaw;
