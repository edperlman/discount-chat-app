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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnitsFromUser = getUnitsFromUser;
const models_1 = require("@rocket.chat/models");
const mem_1 = __importDefault(require("mem"));
const meteor_1 = require("meteor/meteor");
function hasUnits() {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-expect-error - this prop is injected dynamically on ee license
        return (yield models_1.LivechatUnit.countUnits({ type: 'u' })) > 0;
    });
}
// Units should't change really often, so we can cache the result
const memoizedHasUnits = (0, mem_1.default)(hasUnits, { maxAge: process.env.TEST_MODE ? 1 : 10000 });
function getUnitsFromUser() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield memoizedHasUnits())) {
            return;
        }
        return meteor_1.Meteor.callAsync('livechat:getUnitsFromUser');
    });
}
