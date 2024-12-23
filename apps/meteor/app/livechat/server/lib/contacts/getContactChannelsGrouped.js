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
exports.getContactChannelsGrouped = getContactChannelsGrouped;
const models_1 = require("@rocket.chat/models");
function getContactChannelsGrouped(contactId) {
    return __awaiter(this, void 0, void 0, function* () {
        const contact = yield models_1.LivechatContacts.findOneById(contactId, { projection: { channels: 1 } });
        if (!(contact === null || contact === void 0 ? void 0 : contact.channels)) {
            return [];
        }
        const groupedChannels = new Map();
        contact.channels.forEach((channel) => {
            var _a, _b, _c, _d;
            const existingChannel = groupedChannels.get(channel.name);
            if (!existingChannel) {
                return groupedChannels.set(channel.name, channel);
            }
            if ((((_b = (_a = channel.lastChat) === null || _a === void 0 ? void 0 : _a.ts) === null || _b === void 0 ? void 0 : _b.valueOf()) || 0) > (((_d = (_c = existingChannel === null || existingChannel === void 0 ? void 0 : existingChannel.lastChat) === null || _c === void 0 ? void 0 : _c.ts) === null || _d === void 0 ? void 0 : _d.valueOf()) || 0)) {
                groupedChannels.set(channel.name, channel);
            }
        });
        return [...groupedChannels.values()];
    });
}
