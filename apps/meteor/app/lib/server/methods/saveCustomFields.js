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
const saveCustomFields_1 = require("../functions/saveCustomFields");
const lib_1 = require("../lib");
meteor_1.Meteor.methods({
    saveCustomFields() {
        return __awaiter(this, arguments, void 0, function* (fields = {}) {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'saveCustomFields' });
            }
            yield (0, saveCustomFields_1.saveCustomFields)(uid, fields);
        });
    },
});
lib_1.RateLimiter.limitMethod('saveCustomFields', 1, 1000, {
    userId() {
        return true;
    },
});
