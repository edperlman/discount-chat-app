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
    version: 301,
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Permissions.updateOne({ _id: 'call-management', roles: { $ne: 'user' } }, { $addToSet: { roles: 'user' } });
        });
    },
});
