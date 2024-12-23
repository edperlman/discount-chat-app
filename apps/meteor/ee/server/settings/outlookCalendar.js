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
exports.addSettings = addSettings;
const server_1 = require("../../../app/settings/server");
function addSettings() {
    void server_1.settingsRegistry.addGroup('Outlook_Calendar', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.with({
                enterprise: true,
                modules: ['outlook-calendar'],
            }, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.add('Outlook_Calendar_Enabled', false, {
                        type: 'boolean',
                        public: true,
                        invalidValue: false,
                    });
                    yield this.add('Outlook_Calendar_Exchange_Url', '', {
                        type: 'string',
                        public: true,
                        invalidValue: '',
                    });
                    yield this.add('Outlook_Calendar_Outlook_Url', '', {
                        type: 'string',
                        public: true,
                        invalidValue: '',
                    });
                    yield this.add('Calendar_MeetingUrl_Regex', '(?:[?&]callUrl=([^\n&<]+))|(?:(?:%3F)|(?:%26))callUrl(?:%3D)((?:(?:[^\n&<](?!%26)))+[^\n&<]?)', {
                        type: 'string',
                        public: true,
                        invalidValue: '',
                    });
                });
            });
        });
    });
}
