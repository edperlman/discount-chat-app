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
const getAvatarSuggestionForUser_1 = require("../../app/lib/server/functions/getAvatarSuggestionForUser");
const deprecationWarningLogger_1 = require("../../app/lib/server/lib/deprecationWarningLogger");
meteor_1.Meteor.methods({
    getAvatarSuggestion() {
        return __awaiter(this, void 0, void 0, function* () {
            deprecationWarningLogger_1.methodDeprecationLogger.method('getAvatarSuggestion', '7.0.0');
            const user = (yield meteor_1.Meteor.userAsync());
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'getAvatarSuggestion',
                });
            }
            return (0, getAvatarSuggestionForUser_1.getAvatarSuggestionForUser)(user);
        });
    },
});
