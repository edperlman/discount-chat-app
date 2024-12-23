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
exports.parseTranscriptRequest = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../settings/server");
const parseTranscriptRequest = (room, options, visitor, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const visitorDecideTranscript = server_1.settings.get('Livechat_enable_transcript');
    // visitor decides, no changes
    if (visitorDecideTranscript) {
        return options;
    }
    // send always is disabled, no changes
    const sendAlways = server_1.settings.get('Livechat_transcript_send_always');
    if (!sendAlways) {
        return options;
    }
    const visitorData = visitor ||
        (yield models_1.LivechatVisitors.findOneById(room.v._id, { projection: { visitorEmails: 1 } }));
    // no visitor, no changes
    if (!visitorData) {
        return options;
    }
    const visitorEmail = (_b = (_a = visitorData === null || visitorData === void 0 ? void 0 : visitorData.visitorEmails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.address;
    // visitor doesnt have email, no changes
    if (!visitorEmail) {
        return options;
    }
    const defOptions = { projection: { _id: 1, username: 1, name: 1 } };
    const requestedBy = user ||
        (room.servedBy && (yield models_1.Users.findOneById(room.servedBy._id, defOptions))) ||
        (yield models_1.Users.findOneById('rocket.cat', defOptions));
    // no user available for backing request, no changes
    if (!requestedBy) {
        return options;
    }
    return Object.assign(Object.assign({}, options), { emailTranscript: {
            sendToVisitor: true,
            requestData: {
                email: visitorEmail,
                requestedAt: new Date(),
                subject: '',
                requestedBy,
            },
        } });
});
exports.parseTranscriptRequest = parseTranscriptRequest;
