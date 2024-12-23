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
exports.createLayoutSettings = void 0;
const server_1 = require("../../app/settings/server");
const createLayoutSettings = () => server_1.settingsRegistry.addGroup('Layout', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.section('Login', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Layout_Login_Hide_Logo', false, {
                    type: 'boolean',
                    public: true,
                    enterprise: true,
                    invalidValue: false,
                });
                yield this.add('Layout_Login_Hide_Title', false, {
                    type: 'boolean',
                    public: true,
                    enterprise: true,
                    invalidValue: false,
                });
                yield this.add('Layout_Login_Hide_Powered_By', false, {
                    type: 'boolean',
                    public: true,
                    enterprise: true,
                    invalidValue: false,
                });
                yield this.add('Layout_Login_Template', 'horizontal-template', {
                    type: 'select',
                    values: [
                        {
                            key: 'vertical-template',
                            i18nLabel: 'Layout_Login_Template_Vertical',
                        },
                        {
                            key: 'horizontal-template',
                            i18nLabel: 'Layout_Login_Template_Horizontal',
                        },
                    ],
                    public: true,
                    enterprise: true,
                    invalidValue: 'horizontal-template',
                });
                yield this.add('Accounts_ShowFormLogin', true, {
                    type: 'boolean',
                    public: true,
                });
            });
        });
        yield this.section('Layout_Home_Page_Content_Title', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Layout_Home_Title', 'Home', {
                    type: 'string',
                    public: true,
                });
                yield this.add('Layout_Show_Home_Button', true, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('Layout_Home_Body', '', {
                    i18nDescription: 'Layout_Custom_Content_Description',
                    type: 'code',
                    code: 'text/html',
                    multiline: true,
                    public: true,
                });
                yield this.add('Layout_Home_Custom_Block_Visible', false, {
                    type: 'boolean',
                    invalidValue: false,
                    public: true,
                    enableQuery: [
                        {
                            _id: 'Layout_Home_Body',
                            value: {
                                $exists: true,
                                $ne: '',
                            },
                        },
                        {
                            _id: 'Layout_Custom_Body_Only',
                            value: {
                                $exists: true,
                                $ne: true,
                            },
                        },
                    ],
                });
                yield this.add('Layout_Custom_Body_Only', false, {
                    i18nDescription: 'Layout_Custom_Body_Only_Description',
                    type: 'boolean',
                    invalidValue: false,
                    enterprise: true,
                    public: true,
                    enableQuery: [
                        {
                            _id: 'Layout_Home_Body',
                            value: {
                                $exists: true,
                                $ne: '',
                            },
                        },
                        {
                            _id: 'Layout_Home_Custom_Block_Visible',
                            value: {
                                $exists: true,
                                $ne: false,
                            },
                        },
                    ],
                });
                yield this.add('Layout_Terms_of_Service', 'Terms of Service <br> Go to APP SETTINGS &rarr; Layout to customize this page.', {
                    type: 'code',
                    code: 'text/html',
                    multiline: true,
                    public: true,
                });
                yield this.add('Layout_Login_Terms', '', {
                    type: 'code',
                    code: 'text/html',
                    multiline: true,
                    public: true,
                });
                yield this.add('Layout_Privacy_Policy', 'Privacy Policy <br> Go to APP SETTINGS &rarr; Layout to customize this page.', {
                    type: 'code',
                    code: 'text/html',
                    multiline: true,
                    public: true,
                });
                yield this.add('Layout_Legal_Notice', 'Legal Notice <br> Go to APP SETTINGS -> Layout to customize this page.', {
                    type: 'code',
                    code: 'text/html',
                    multiline: true,
                    public: true,
                });
                yield this.add('Layout_Sidenav_Footer_Dark', '<a href="/home"><img src="assets/logo_dark.png" alt="Home" /></a>', {
                    type: 'code',
                    code: 'text/html',
                    public: true,
                    i18nDescription: 'Layout_Sidenav_Footer_description',
                });
                return this.add('Layout_Sidenav_Footer', '<a href="/home"><img src="assets/logo.png" alt="Home" /></a>', {
                    type: 'code',
                    code: 'text/html',
                    public: true,
                    i18nDescription: 'Layout_Sidenav_Footer_description',
                });
            });
        });
        yield this.section('Custom_Scripts', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Custom_Script_On_Logout', '//Add your script', {
                    type: 'code',
                    multiline: true,
                    public: true,
                });
                yield this.add('Custom_Script_Logged_Out', '//Add your script', {
                    type: 'code',
                    multiline: true,
                    public: true,
                });
                return this.add('Custom_Script_Logged_In', '//Add your script', {
                    type: 'code',
                    multiline: true,
                    public: true,
                });
            });
        });
        yield this.section('User_Interface', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('UI_DisplayRoles', true, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('UI_Group_Channels_By_Type', true, {
                    type: 'boolean',
                    public: false,
                });
                yield this.add('UI_Use_Name_Avatar', false, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('UI_Use_Real_Name', false, {
                    type: 'boolean',
                    public: true,
                });
                yield this.add('Number_of_users_autocomplete_suggestions', 5, {
                    type: 'int',
                    public: true,
                });
                yield this.add('UI_Unread_Counter_Style', 'Different_Style_For_User_Mentions', {
                    type: 'select',
                    values: [
                        {
                            key: 'Same_Style_For_Mentions',
                            i18nLabel: 'Same_Style_For_Mentions',
                        },
                        {
                            key: 'Different_Style_For_User_Mentions',
                            i18nLabel: 'Different_Style_For_User_Mentions',
                        },
                    ],
                    public: true,
                });
                yield this.add('UI_Allow_room_names_with_special_chars', false, {
                    type: 'boolean',
                    public: true,
                });
                return this.add('UI_Show_top_navbar_embedded_layout', false, {
                    type: 'boolean',
                    public: true,
                });
            });
        });
        yield this.section('Custom CSS', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('theme-custom-css', '', {
                    type: 'code',
                    code: 'text/css',
                    multiline: true,
                    public: true,
                });
            });
        });
    });
});
exports.createLayoutSettings = createLayoutSettings;
