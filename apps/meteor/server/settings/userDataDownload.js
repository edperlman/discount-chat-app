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
exports.createUserDataSettings = void 0;
const server_1 = require("../../app/settings/server");
const createUserDataSettings = () => server_1.settingsRegistry.addGroup('UserDataDownload', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('UserData_EnableDownload', true, {
            type: 'boolean',
            public: true,
            i18nLabel: 'UserData_EnableDownload',
        });
        yield this.add('UserData_FileSystemPath', '', {
            type: 'string',
            public: true,
            i18nLabel: 'UserData_FileSystemPath',
        });
        yield this.add('UserData_FileSystemZipPath', '', {
            type: 'string',
            public: true,
            i18nLabel: 'UserData_FileSystemZipPath',
        });
        yield this.add('UserData_ProcessingFrequency', 2, {
            type: 'int',
            public: true,
            i18nLabel: 'UserData_ProcessingFrequency',
        });
        yield this.add('UserData_MessageLimitPerRequest', 1000, {
            type: 'int',
            public: true,
            i18nLabel: 'UserData_MessageLimitPerRequest',
        });
    });
});
exports.createUserDataSettings = createUserDataSettings;
