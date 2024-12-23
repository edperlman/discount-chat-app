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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUserEmail = sendUserEmail;
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendPasswordEmail = sendPasswordEmail;
const core_services_1 = require("@rocket.chat/core-services");
const Mailer = __importStar(require("../../../../mailer/server/api"));
const server_1 = require("../../../../settings/server");
let html = '';
let passwordChangedHtml = '';
Meteor.startup(() => {
    Mailer.getTemplate('Accounts_UserAddedEmail_Email', (template) => {
        html = template;
    });
    Mailer.getTemplate('Password_Changed_Email', (template) => {
        passwordChangedHtml = template;
    });
});
function sendUserEmail(subject, html, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userData.email) {
            return;
        }
        const email = {
            to: userData.email,
            from: server_1.settings.get('From_Email'),
            subject,
            html,
            data: Object.assign({ email: userData.email, password: userData.password }, (typeof userData.name !== 'undefined' ? { name: userData.name } : {})),
        };
        try {
            yield Mailer.send(email);
        }
        catch (error) {
            const errorMessage = typeof error === 'object' && error && 'message' in error ? error.message : '';
            throw new core_services_1.MeteorError('error-email-send-failed', `Error trying to send email: ${errorMessage}`, {
                function: 'RocketChat.saveUser',
                message: errorMessage,
            });
        }
    });
}
function sendWelcomeEmail(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        return sendUserEmail(server_1.settings.get('Accounts_UserAddedEmail_Subject'), html, userData);
    });
}
function sendPasswordEmail(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        return sendUserEmail(server_1.settings.get('Password_Changed_Email_Subject'), passwordChangedHtml, userData);
    });
}
