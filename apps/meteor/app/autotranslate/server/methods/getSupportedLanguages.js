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
const ddp_rate_limiter_1 = require("meteor/ddp-rate-limiter");
const meteor_1 = require("meteor/meteor");
const __1 = require("..");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../settings/server");
meteor_1.Meteor.methods({
    'autoTranslate.getSupportedLanguages'(targetLanguage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!server_1.settings.get('AutoTranslate_Enabled')) {
                throw new meteor_1.Meteor.Error('error-autotranslate-disabled', 'Auto-Translate is disabled');
            }
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'getSupportedLanguages',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'auto-translate'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Auto-Translate is not allowed', {
                    method: 'autoTranslate.saveSettings',
                });
            }
            return __1.TranslationProviderRegistry.getSupportedLanguages(targetLanguage);
        });
    },
});
ddp_rate_limiter_1.DDPRateLimiter.addRule({
    type: 'method',
    name: 'autoTranslate.getSupportedLanguages',
    userId( /* userId*/) {
        return true;
    },
}, 5, 60000);
