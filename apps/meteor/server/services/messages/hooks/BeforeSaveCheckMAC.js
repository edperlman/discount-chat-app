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
exports.BeforeSaveCheckMAC = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
class BeforeSaveCheckMAC {
    isWithinLimits(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message, room }) {
            if (!(0, core_typings_1.isOmnichannelRoom)(room)) {
                return;
            }
            if (message.token) {
                return;
            }
            if (message.t) {
                return;
            }
            const canSendMessage = yield core_services_1.Omnichannel.isWithinMACLimit(room);
            if (!canSendMessage) {
                throw new core_services_1.MeteorError('error-mac-limit-reached');
            }
        });
    }
}
exports.BeforeSaveCheckMAC = BeforeSaveCheckMAC;
