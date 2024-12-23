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
exports.processMessageEditing = void 0;
const client_1 = require("../../../../app/ui-utils/client");
const toast_1 = require("../../toast");
const processMessageEditing = (chat, message, previewUrls) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!chat.currentEditing) {
        return false;
    }
    if (client_1.MessageTypes.isSystemMessage(message)) {
        return false;
    }
    if (!message.msg && !((_a = message.attachments) === null || _a === void 0 ? void 0 : _a.length) && !message.content) {
        return false;
    }
    try {
        yield chat.data.updateMessage(Object.assign(Object.assign({}, message), { _id: chat.currentEditing.mid }), previewUrls);
    }
    catch (error) {
        (0, toast_1.dispatchToastMessage)({ type: 'error', message: error });
    }
    chat.currentEditing.stop();
    return true;
});
exports.processMessageEditing = processMessageEditing;
