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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
meteor_1.Meteor.methods({
    'permissions/get'(updatedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(updatedAt, check_1.Match.Maybe(Date));
            // TODO: should we return this for non logged users?
            // TODO: we could cache this collection
            const records = yield models_1.Permissions.find(updatedAt && { _updatedAt: { $gt: updatedAt } }).toArray();
            if (updatedAt instanceof Date) {
                return {
                    update: records,
                    remove: yield models_1.Permissions.trashFindDeletedAfter(updatedAt, {}, { projection: { _id: 1, _deletedAt: 1 } }).toArray(),
                };
            }
            return records;
        });
    },
});