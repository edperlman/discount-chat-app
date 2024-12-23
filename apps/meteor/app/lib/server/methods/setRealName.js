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
const server_1 = require("../../../settings/server");
const setRealName_1 = require("../functions/setRealName");
const lib_1 = require("../lib");
meteor_1.Meteor.methods({
    setRealName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(name, String);
            if (!meteor_1.Meteor.userId()) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'setRealName' });
            }
            if (!server_1.settings.get('Accounts_AllowRealNameChange')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'setRealName' });
            }
            if (!(yield (0, setRealName_1.setRealName)(meteor_1.Meteor.userId(), name))) {
                throw new meteor_1.Meteor.Error('error-could-not-change-name', 'Could not change name', {
                    method: 'setRealName',
                });
            }
            return name;
        });
    },
});
lib_1.RateLimiter.limitMethod('setRealName', 1, 1000, {
    userId: () => true,
});
