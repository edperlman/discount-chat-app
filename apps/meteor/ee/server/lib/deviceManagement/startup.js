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
exports.createEmailTemplates = exports.createPermissions = void 0;
const models_1 = require("@rocket.chat/models");
const index_1 = require("../../../../app/settings/server/index");
const createPermissions = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        models_1.Permissions.create('logout-device-management', ['admin']),
        models_1.Permissions.create('block-ip-device-management', ['admin']),
    ]);
});
exports.createPermissions = createPermissions;
const createEmailTemplates = () => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.settingsRegistry.addGroup('Email', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.section('Device Management - Login Detected', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.add('Device_Management_Email_Subject', '{Device_Management_Email_Subject}', {
                        type: 'string',
                        i18nLabel: 'Subject',
                    });
                    yield this.add('Device_Management_Email_Body', '<h2 class="rc-color">{Login_Detected}</h2><p><strong>[name] ([username]) {Logged_In_Via}</strong></p><p><strong>{Device_Management_Client}:</strong> [browserInfo]<br><strong>{Device_Management_OS}:</strong> [osInfo]<br><strong>{Device_Management_Device}:</strong> [deviceInfo]<br><strong>{Device_Management_IP}:</strong>[ipInfo]<br><strong>{Date}:</strong> [date]</p><p><small>[userAgent]</small></p><a class="btn" href="[Site_URL]">{Access_Your_Account}</a><p>{Or_Copy_And_Paste_This_URL_Into_A_Tab_Of_Your_Browser}<br><a href="[Site_URL]">[SITE_URL]</a></p><p>{Thank_You_For_Choosing_RocketChat}</p>', {
                        type: 'code',
                        code: 'text/html',
                        multiline: true,
                        i18nLabel: 'Body',
                        i18nDescription: 'Device_Management_Email_Body',
                    });
                });
            });
        });
    });
});
exports.createEmailTemplates = createEmailTemplates;
