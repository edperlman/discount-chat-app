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
const meteor_1 = require("meteor/meteor");
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    // Add permissions for discussion
    const permissions = [
        { _id: 'start-discussion', roles: ['admin', 'user', 'guest', 'app'] },
        { _id: 'start-discussion-other-user', roles: ['admin', 'user', 'owner', 'app'] },
    ];
    try {
        for (var _d = true, permissions_1 = __asyncValues(permissions), permissions_1_1; permissions_1_1 = yield permissions_1.next(), _a = permissions_1_1.done, !_a; _d = true) {
            _c = permissions_1_1.value;
            _d = false;
            const permission = _c;
            yield models_1.Permissions.create(permission._id, permission.roles);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = permissions_1.return)) yield _b.call(permissions_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}));
