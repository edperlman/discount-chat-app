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
const migrations_1 = require("../../lib/migrations");
(0, migrations_1.addMigration)({
    version: 310,
    name: 'Update translation key on "Forgot password" e-mail body setting',
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            const forgotPasswordEmail = yield models_1.Settings.findOneById('Forgot_Password_Email', { projection: { value: 1 } });
            if (!forgotPasswordEmail) {
                return;
            }
            const newPackageValue = '<h2>{Forgot_password}</h2><p>{Lets_get_you_new_one_}</p><a class="btn" href="[Forgot_Password_Url]">{Reset}</a><p class="advice">{If_you_didnt_ask_for_reset_ignore_this_email}</p>';
            // TODO: audit
            yield models_1.Settings.updateOne({ _id: 'Forgot_Password_Email' }, {
                $set: {
                    packageValue: newPackageValue,
                    value: forgotPasswordEmail.value.replace(/{Lets_get_you_new_one}/g, '{Lets_get_you_new_one_}'),
                },
            });
        });
    },
});
