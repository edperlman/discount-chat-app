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
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../app/models/client");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const loggedIn_1 = require("../lib/loggedIn");
meteor_1.Meteor.startup(() => {
    (0, loggedIn_1.onLoggedIn)(() => __awaiter(void 0, void 0, void 0, function* () {
        const { roles } = yield SDKClient_1.sdk.rest.get('/v1/roles.list');
        // if a role is checked before this collection is populated, it will return undefined
        client_1.Roles._collection._docs._map = new Map(roles.map((record) => [client_1.Roles._collection._docs._idStringify(record._id), record]));
        Object.values(client_1.Roles._collection.queries).forEach((query) => client_1.Roles._collection._recomputeResults(query));
        client_1.Roles.ready.set(true);
    }));
    const events = {
        changed: (role) => {
            delete role.type;
            client_1.Roles.upsert({ _id: role._id }, role);
        },
        removed: (role) => {
            client_1.Roles.remove({ _id: role._id });
        },
    };
    tracker_1.Tracker.autorun((c) => {
        if (!meteor_1.Meteor.userId()) {
            return;
        }
        tracker_1.Tracker.afterFlush(() => {
            SDKClient_1.sdk.stream('roles', ['roles'], (role) => {
                var _a;
                (_a = events[role.type]) === null || _a === void 0 ? void 0 : _a.call(events, role);
            });
        });
        c.stop();
    });
});
