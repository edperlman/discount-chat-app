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
exports.AppOAuthAppsBridge = void 0;
const OAuthAppsBridge_1 = require("@rocket.chat/apps-engine/server/bridges/OAuthAppsBridge");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const uuid_1 = require("uuid");
class AppOAuthAppsBridge extends OAuthAppsBridge_1.OAuthAppsBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    create(oAuthApp, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is creating a new OAuth app.`);
            const { clientId, clientSecret } = oAuthApp;
            const botUser = yield models_1.Users.findOne({ appId });
            if (!botUser) {
                throw new Error(`The user for app ${appId} is not registered.`);
            }
            const { _id, username } = botUser;
            return (yield models_1.OAuthApps.insertOne(Object.assign(Object.assign({}, oAuthApp), { _id: (0, uuid_1.v4)(), appId, clientId: clientId !== null && clientId !== void 0 ? clientId : random_1.Random.id(), clientSecret: clientSecret !== null && clientSecret !== void 0 ? clientSecret : random_1.Random.secret(), _createdAt: new Date(), _createdBy: {
                    _id,
                    username,
                } }))).insertedId;
        });
    }
    getById(id, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is getting the OAuth app by ID ${id}.`);
            const data = yield models_1.OAuthApps.findOne({ _id: id, appId });
            if (data) {
                const _a = data, { _id, _createdAt, _createdBy, _updatedAt } = _a, rest = __rest(_a, ["_id", "_createdAt", "_createdBy", "_updatedAt"]);
                return Object.assign(Object.assign({}, rest), { id: _id, createdAt: _createdAt.toDateString(), createdBy: {
                        id: _createdBy._id,
                        username: _createdBy.username,
                    }, updatedAt: _updatedAt });
            }
            return null;
        });
    }
    getByName(name, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is getting the OAuth apps by name.`);
            return models_1.OAuthApps.find({ name, appId }).toArray();
        });
    }
    update(oAuthApp, id, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is updating the OAuth app ${id}.`);
            yield models_1.OAuthApps.updateOne({ _id: id, appId }, { $set: oAuthApp }, { upsert: true });
        });
    }
    delete(id, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is deleting the OAuth app ${id}.`);
            yield models_1.OAuthApps.deleteOne({ _id: id, appId });
        });
    }
    purge(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is deleting an OAuth app.`);
            yield models_1.OAuthApps.deleteMany({ appId });
        });
    }
}
exports.AppOAuthAppsBridge = AppOAuthAppsBridge;
