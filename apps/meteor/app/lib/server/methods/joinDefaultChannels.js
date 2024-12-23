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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const addUserToDefaultChannels_1 = require("../functions/addUserToDefaultChannels");
meteor_1.Meteor.methods({
    joinDefaultChannels(silenced) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(silenced, check_1.Match.Optional(Boolean));
            const user = yield meteor_1.Meteor.userAsync();
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'joinDefaultChannels',
                });
            }
            return (0, addUserToDefaultChannels_1.addUserToDefaultChannels)(user, Boolean(silenced));
        });
    },
});
