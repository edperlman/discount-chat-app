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
exports.sendWelcomeEmail = sendWelcomeEmail;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const Mailer = __importStar(require("../../app/mailer/server/api"));
const server_1 = require("../../app/settings/server");
const isSMTPConfigured_1 = require("../../app/utils/server/functions/isSMTPConfigured");
function sendWelcomeEmail(to) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, isSMTPConfigured_1.isSMTPConfigured)()) {
            throw new meteor_1.Meteor.Error('error-email-send-failed', 'SMTP is not configured', {
                method: 'sendWelcomeEmail',
            });
        }
        const email = to.trim();
        const user = yield models_1.Users.findOneByEmailAddress(email, { projection: { _id: 1 } });
        if (!user) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'sendWelcomeEmail',
            });
        }
        try {
            let html = '';
            Mailer.getTemplate('Accounts_UserAddedEmail_Email', (template) => {
                html = template;
            });
            yield Mailer.send({
                to: email,
                from: server_1.settings.get('From_Email'),
                subject: server_1.settings.get('Accounts_UserAddedEmail_Subject'),
                html,
            });
        }
        catch (error) {
            throw new meteor_1.Meteor.Error('error-email-send-failed', `Error trying to send email: ${error.message}`, {
                method: 'sendWelcomeEmail',
                message: error.message,
            });
        }
    });
}
