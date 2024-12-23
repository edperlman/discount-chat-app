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
const core_services_1 = require("@rocket.chat/core-services");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const ReadReceipt_1 = require("../../../../server/lib/message-read-receipt/ReadReceipt");
callbacks_1.callbacks.add('afterReadMessages', (rid, params) => __awaiter(void 0, void 0, void 0, function* () {
    if (!server_1.settings.get('Message_Read_Receipt_Enabled')) {
        return;
    }
    const { uid, lastSeen, tmid } = params;
    if (tmid) {
        yield core_services_1.MessageReads.readThread(uid, tmid);
    }
    else if (lastSeen) {
        yield ReadReceipt_1.ReadReceipt.markMessagesAsRead(rid, uid, lastSeen);
    }
}), callbacks_1.callbacks.priority.MEDIUM, 'message-read-receipt-afterReadMessages');
