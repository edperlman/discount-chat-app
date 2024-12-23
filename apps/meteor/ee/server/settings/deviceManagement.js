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
    return __awaiter(this, void 0, void 0, function* () {
        yield server_1.settingsRegistry.addGroup('Device_Management', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.with({
                    enterprise: true,
                    modules: ['device-management'],
                }, function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('Device_Management_Enable_Login_Emails', true, {
                            type: 'boolean',
                            public: true,
                            invalidValue: true,
                        });
                        yield this.add('Device_Management_Allow_Login_Email_preference', true, {
                            type: 'boolean',
                            public: true,
                            invalidValue: true,
                            enableQuery: { _id: 'Device_Management_Enable_Login_Emails', value: true },
                        });
                    });
                });
            });
        });
    });
}
