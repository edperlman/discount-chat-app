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
exports.sendOfflineMessage = sendOfflineMessage;
const dns_1 = __importDefault(require("dns"));
const util = __importStar(require("util"));
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
const Mailer = __importStar(require("../../../mailer/server/api"));
const server_1 = require("../../../settings/server");
const dnsResolveMx = util.promisify(dns_1.default.resolveMx);
function sendOfflineMessage(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!server_1.settings.get('Livechat_display_offline_form')) {
            throw new Error('error-offline-form-disabled');
        }
        const { message, name, email, department, host } = data;
        if (!email) {
            throw new Error('error-invalid-email');
        }
        const emailMessage = `${message}`.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
        let html = '<h1>New livechat message</h1>';
        if (host && host !== '') {
            html = html.concat(`<p><strong>Sent from:</strong><a href='${host}'> ${host}</a></p>`);
        }
        html = html.concat(`
			<p><strong>Visitor name:</strong> ${name}</p>
			<p><strong>Visitor email:</strong> ${email}</p>
			<p><strong>Message:</strong><br>${emailMessage}</p>`);
        const fromEmail = server_1.settings.get('From_Email').match(/\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}\b/i);
        let from;
        if (fromEmail) {
            from = fromEmail[0];
        }
        else {
            from = server_1.settings.get('From_Email');
        }
        if (server_1.settings.get('Livechat_validate_offline_email')) {
            const emailDomain = email.substr(email.lastIndexOf('@') + 1);
            try {
                yield dnsResolveMx(emailDomain);
            }
            catch (e) {
                throw new Meteor.Error('error-invalid-email-address');
            }
        }
        // TODO Block offline form if Livechat_offline_email is undefined
        // (it does not make sense to have an offline form that does nothing)
        // `this.sendEmail` will throw an error if the email is invalid
        // thus this breaks livechat, since the "to" email is invalid, and that returns an [invalid email] error to the livechat client
        let emailTo = server_1.settings.get('Livechat_offline_email');
        if (department && department !== '') {
            const dep = yield models_1.LivechatDepartment.findOneByIdOrName(department, { projection: { email: 1 } });
            if (dep) {
                emailTo = dep.email || emailTo;
            }
        }
        const fromText = `${name} - ${email} <${from}>`;
        const replyTo = `${name} <${email}>`;
        const subject = `Livechat offline message from ${name}: ${`${emailMessage}`.substring(0, 20)}`;
        yield sendEmail(fromText, emailTo, replyTo, subject, html);
        setImmediate(() => {
            void callbacks_1.callbacks.run('livechat.offlineMessage', data);
        });
    });
}
function sendEmail(from, to, replyTo, subject, html) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Mailer.send({
            to,
            from,
            replyTo,
            subject,
            html,
        });
    });
}
