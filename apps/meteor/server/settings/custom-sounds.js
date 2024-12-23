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
exports.createSoundsSettings = void 0;
const server_1 = require("../../app/settings/server");
const createSoundsSettings = () => server_1.settingsRegistry.addGroup('CustomSoundsFilesystem', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('CustomSounds_Storage_Type', 'GridFS', {
            type: 'select',
            values: [
                {
                    key: 'GridFS',
                    i18nLabel: 'GridFS',
                },
                {
                    key: 'FileSystem',
                    i18nLabel: 'FileSystem',
                },
            ],
            i18nLabel: 'FileUpload_Storage_Type',
        });
        yield this.add('CustomSounds_FileSystemPath', '', {
            type: 'string',
            enableQuery: {
                _id: 'CustomSounds_Storage_Type',
                value: 'FileSystem',
            },
            i18nLabel: 'FileUpload_FileSystemPath',
        });
    });
});
exports.createSoundsSettings = createSoundsSettings;
