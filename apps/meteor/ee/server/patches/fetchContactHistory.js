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
const models_1 = require("@rocket.chat/models");
const getContactHistory_1 = require("../../../app/livechat/server/lib/contacts/getContactHistory");
getContactHistory_1.fetchContactHistory.patch((next, params) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactId, options, extraParams } = params;
    if (!(extraParams === null || extraParams === void 0 ? void 0 : extraParams.source) || typeof extraParams.source !== 'string') {
        return next(params);
    }
    return models_1.LivechatRooms.findClosedRoomsByContactAndSourcePaginated({
        contactId,
        source: extraParams.source,
        options,
    });
}), () => license_1.License.hasModule('contact-id-verification'));
