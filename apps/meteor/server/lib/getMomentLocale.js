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
exports.getMomentLocale = getMomentLocale;
const meteor_1 = require("meteor/meteor");
function getMomentLocale(locale) {
    return __awaiter(this, void 0, void 0, function* () {
        const localeLower = locale.toLowerCase();
        try {
            return Assets.getTextAsync(`moment-locales/${localeLower}.js`);
        }
        catch (error) {
            try {
                return Assets.getTextAsync(`moment-locales/${String(localeLower.split('-').shift())}.js`);
            }
            catch (error) {
                throw new meteor_1.Meteor.Error('moment-locale-not-found', `Moment locale not found: ${locale}`);
            }
        }
    });
}
