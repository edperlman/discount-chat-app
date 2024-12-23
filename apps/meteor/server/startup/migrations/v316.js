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
    version: 316,
    name: 'Remove Cloud_Workspace_Access_Token and Cloud_Workspace_Access_Token_Expires_At from the settings collection',
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = (yield models_1.Settings.getValueById('Cloud_Workspace_Access_Token')) || '';
            const expirationDate = (yield models_1.Settings.getValueById('Cloud_Workspace_Access_Token_Expires_At')) || new Date(0);
            if (accessToken) {
                yield models_1.Settings.removeById('Cloud_Workspace_Access_Token');
            }
            if (expirationDate) {
                yield models_1.Settings.removeById('Cloud_Workspace_Access_Token_Expires_At');
            }
        });
    },
});
