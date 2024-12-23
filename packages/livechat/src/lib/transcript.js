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
exports.handleTranscript = void 0;
const i18next_1 = __importDefault(require("i18next"));
const api_1 = require("../api");
const Modal_1 = require("../components/Modal");
const store_1 = __importDefault(require("../store"));
const promptTranscript = () => __awaiter(void 0, void 0, void 0, function* () {
    const { config: { messages: { transcriptMessage }, }, user, room, } = store_1.default.state;
    if (!room || !user) {
        console.warn('Only call promptTranscript when there is a room and a user');
        return;
    }
    const { visitorEmails } = user;
    const { _id } = room;
    const email = visitorEmails && visitorEmails.length > 0 ? visitorEmails[0].address : '';
    if (!email) {
        return;
    }
    const message = transcriptMessage || i18next_1.default.t('would_you_like_a_copy_of_this_chat_emailed');
    return Modal_1.ModalManager.confirm({
        text: message,
    }).then((result) => {
        if (typeof result.success === 'boolean' && result.success) {
            return api_1.Livechat.requestTranscript(email, { rid: _id });
        }
    });
});
const transcriptSentAlert = (message) => Modal_1.ModalManager.alert({
    text: message,
    timeout: 1000,
});
const handleTranscript = () => __awaiter(void 0, void 0, void 0, function* () {
    const { config: { settings: { transcript } = {} }, } = store_1.default.state;
    if (!transcript) {
        return;
    }
    const result = yield promptTranscript();
    // TODO: Check why the api results are not returning the correct type
    if (result === null || result === void 0 ? void 0 : result.success) {
        transcriptSentAlert(i18next_1.default.t('transcript_success'));
    }
});
exports.handleTranscript = handleTranscript;
