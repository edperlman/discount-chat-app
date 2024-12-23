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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateSettingsCachedCollection = void 0;
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
const cachedCollections_1 = require("../cachedCollections");
class PrivateSettingsCachedCollection extends cachedCollections_1.CachedCollection {
    constructor() {
        super({
            name: 'private-settings',
            eventType: 'notify-logged',
        });
    }
    setupListener() {
        return __awaiter(this, void 0, void 0, function* () {
            SDKClient_1.sdk.stream('notify-logged', [this.eventName], (t, _a) => __awaiter(this, void 0, void 0, function* () {
                var { _id } = _a, record = __rest(_a, ["_id"]);
                this.log('record received', t, Object.assign({ _id }, record));
                this.collection.update({ _id }, { $set: record }, { upsert: true });
                this.sync();
            }));
        });
    }
}
const instance = new PrivateSettingsCachedCollection();
exports.PrivateSettingsCachedCollection = instance;
