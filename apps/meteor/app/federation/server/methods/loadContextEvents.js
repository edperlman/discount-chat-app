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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
meteor_1.Meteor.methods({
    'federation:loadContextEvents': (latestEventTimestamp) => __awaiter(void 0, void 0, void 0, function* () {
        const uid = meteor_1.Meteor.userId();
        if (!uid) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'loadContextEvents' });
        }
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'view-federation-data'))) {
            throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                method: 'loadContextEvents',
            });
        }
        return models_1.FederationRoomEvents.find({ timestamp: { $gt: new Date(latestEventTimestamp) } }, { sort: { timestamp: 1 } }).toArray();
    }),
});
