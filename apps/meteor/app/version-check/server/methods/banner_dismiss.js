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
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
meteor_1.Meteor.methods({
    'banner/dismiss'(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'banner/dismiss' });
            }
            yield models_1.Users.setBannerReadById(userId, id);
            void (0, notifyListener_1.notifyOnUserChange)({
                id: userId,
                clientAction: 'updated',
                diff: {
                    [`banners.${id}.read`]: true,
                },
            });
        });
    },
});
