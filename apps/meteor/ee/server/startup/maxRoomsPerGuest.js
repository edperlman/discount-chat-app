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
const license_1 = require("@rocket.chat/license");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../lib/callbacks");
const i18n_1 = require("../../../server/lib/i18n");
callbacks_1.callbacks.add('beforeAddedToRoom', (_a) => __awaiter(void 0, [_a], void 0, function* ({ user }) {
    var _b;
    if ((_b = user.roles) === null || _b === void 0 ? void 0 : _b.includes('guest')) {
        if (yield license_1.License.shouldPreventAction('roomsPerGuest', 0, { userId: user._id })) {
            throw new meteor_1.Meteor.Error('error-max-rooms-per-guest-reached', i18n_1.i18n.t('error-max-rooms-per-guest-reached'));
        }
    }
}), callbacks_1.callbacks.priority.MEDIUM, 'check-max-rooms-per-guest');
