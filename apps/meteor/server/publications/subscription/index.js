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
const publishFields_1 = require("../../../lib/publishFields");
meteor_1.Meteor.methods({
    'subscriptions/get'(updatedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                return [];
            }
            const options = { projection: publishFields_1.subscriptionFields };
            const records = yield models_1.Subscriptions.findByUserId(uid, options).toArray();
            if (updatedAt instanceof Date) {
                return {
                    update: records.filter((record) => {
                        return record._updatedAt > updatedAt;
                    }),
                    remove: yield models_1.Subscriptions.trashFindDeletedAfter(updatedAt, {
                        'u._id': uid,
                    }, {
                        projection: {
                            _id: 1,
                            _deletedAt: 1,
                        },
                    }).toArray(),
                };
            }
            return records;
        });
    },
});
