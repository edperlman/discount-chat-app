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
const service_1 = require("../../../../../server/services/omnichannel-voip/service");
const calculateOnHoldTimeForRoom_1 = require("../lib/calculateOnHoldTimeForRoom");
await license_1.License.overwriteClassOnLicense('voip-enterprise', service_1.OmnichannelVoipService, {
    getRoomClosingData(_originalFn, closeInfo, closeSystemMsgData, room, sysMessageId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comment, tags } = options || {};
            if (comment) {
                closeSystemMsgData.msg = comment;
            }
            if (tags === null || tags === void 0 ? void 0 : tags.length) {
                closeInfo.tags = tags;
            }
            if (sysMessageId === 'voip-call-wrapup' && !comment) {
                closeSystemMsgData.t = 'voip-call-ended';
            }
            const now = new Date();
            const callTotalHoldTime = yield (0, calculateOnHoldTimeForRoom_1.calculateOnHoldTimeForRoom)(room, now);
            closeInfo.callTotalHoldTime = callTotalHoldTime;
            return { closeInfo, closeSystemMsgData };
        });
    },
});
