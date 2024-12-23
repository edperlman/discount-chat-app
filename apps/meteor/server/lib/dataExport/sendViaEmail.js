"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.sendViaEmail = sendViaEmail;
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const Mailer = __importStar(require("../../../app/mailer/server/api"));
const server_1 = require("../../../app/settings/server");
const server_2 = require("../../../app/ui-utils/server");
const getMomentLocale_1 = require("../getMomentLocale");
function sendViaEmail(data, user) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const emails = data.toEmails.map((email) => email.trim()).filter(Boolean);
        const missing = [...data.toUsers].filter(Boolean);
        (yield models_1.Users.findUsersByUsernames(data.toUsers, {
            projection: { 'username': 1, 'emails.address': 1 },
        }).toArray()).forEach((user) => {
            var _a;
            const emailAddress = (_a = user.emails) === null || _a === void 0 ? void 0 : _a[0].address;
            if (!emailAddress) {
                return;
            }
            if (!Mailer.checkAddressFormat(emailAddress)) {
                throw new Error('error-invalid-email');
            }
            const found = missing.indexOf(String(user.username));
            if (found !== -1) {
                missing.splice(found, 1);
            }
            emails.push(emailAddress);
        });
        const email = (_b = (_a = user.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.address;
        const lang = data.language || user.language || 'en';
        const localMoment = (0, moment_1.default)();
        if (lang !== 'en') {
            const localeFn = yield (0, getMomentLocale_1.getMomentLocale)(lang);
            if (localeFn) {
                Function(localeFn).call({ moment: moment_1.default });
                localMoment.locale(lang);
            }
        }
        const html = (yield models_1.Messages.findByRoomIdAndMessageIds(data.rid, data.messages, {
            sort: { ts: 1 },
        }).toArray())
            .map((message) => {
            const dateTime = (0, moment_1.default)(message.ts).locale(lang).format('L LT');
            return `<p style='margin-bottom: 5px'><b>${message.u.username}</b> <span style='color: #aaa; font-size: 12px'>${dateTime}</span><br/>${server_2.Message.parse(message, data.language)}</p>`;
        })
            .join('');
        yield Mailer.send({
            to: emails,
            from: server_1.settings.get('From_Email'),
            replyTo: email,
            subject: data.subject,
            html,
        });
        return { missing };
    });
}
