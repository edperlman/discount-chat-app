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
exports.setEmail = void 0;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const Mailer = __importStar(require("../../../mailer/server/api"));
const server_1 = require("../../../settings/server");
const lib_1 = require("../lib");
const checkEmailAvailability_1 = require("./checkEmailAvailability");
let html = '';
meteor_1.Meteor.startup(() => {
    Mailer.getTemplate('Email_Changed_Email', (template) => {
        html = template;
    });
});
const _sendEmailChangeNotification = function (to, newEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = String(server_1.settings.get('Email_Changed_Email_Subject'));
        const email = {
            to,
            from: String(server_1.settings.get('From_Email')),
            subject,
            html,
            data: {
                email: (0, string_helpers_1.escapeHTML)(newEmail),
            },
        };
        try {
            yield Mailer.send(email);
        }
        catch (error) {
            throw new meteor_1.Meteor.Error('error-email-send-failed', `Error trying to send email: ${error.message}`, {
                function: 'setEmail',
                message: error.message,
            });
        }
    });
};
const _setEmail = function (userId_1, email_1) {
    return __awaiter(this, arguments, void 0, function* (userId, email, shouldSendVerificationEmail = true) {
        var _a, _b;
        email = email.trim();
        if (!userId) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { function: '_setEmail' });
        }
        if (!email) {
            throw new meteor_1.Meteor.Error('error-invalid-email', 'Invalid email', { function: '_setEmail' });
        }
        yield (0, lib_1.validateEmailDomain)(email);
        const user = yield models_1.Users.findOneById(userId);
        if (!user) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { function: '_setEmail' });
        }
        // User already has desired username, return
        if (((_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0]) && user.emails[0].address === email) {
            return user;
        }
        // Check email availability
        if (!(yield (0, checkEmailAvailability_1.checkEmailAvailability)(email))) {
            throw new meteor_1.Meteor.Error('error-field-unavailable', `${email} is already in use :(`, {
                function: '_setEmail',
                field: email,
            });
        }
        const oldEmail = (_b = user === null || user === void 0 ? void 0 : user.emails) === null || _b === void 0 ? void 0 : _b[0];
        if (oldEmail) {
            yield _sendEmailChangeNotification(oldEmail.address, email);
        }
        // Set new email
        yield models_1.Users.setEmail(user === null || user === void 0 ? void 0 : user._id, email);
        const result = Object.assign(Object.assign({}, user), { email });
        if (shouldSendVerificationEmail === true) {
            yield meteor_1.Meteor.callAsync('sendConfirmationEmail', result.email);
        }
        return result;
    });
};
exports.setEmail = lib_1.RateLimiter.limitFunction(_setEmail, 1, 60000, {
    0() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            return !userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-other-user-info'));
        });
    }, // Administrators have permission to change others emails, so don't limit those
});
