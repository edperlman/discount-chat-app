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
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../app/settings/server");
const system_1 = require("../../lib/logger/system");
const migrations_1 = require("../../lib/migrations");
(0, migrations_1.addMigration)({
    version: 296,
    name: 'Reset the default value of Login Terms setting and replace by empty string',
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            const oldLoginTermsValue = 'By proceeding you are agreeing to our <a href="terms-of-service">Terms of Service</a>, <a href="privacy-policy">Privacy Policy</a> and <a href="legal-notice">Legal Notice</a>.';
            const loginTermsValue = server_1.settings.get('Layout_Login_Terms');
            if (loginTermsValue === oldLoginTermsValue) {
                // TODO: audit
                yield models_1.Settings.updateOne({ _id: 'Layout_Login_Terms' }, { $set: { value: '', packageValue: '' } });
                system_1.SystemLogger.warn(`The default value of the setting 'Login Terms' has changed to an empty string. Please review your settings.`);
            }
        });
    },
});
