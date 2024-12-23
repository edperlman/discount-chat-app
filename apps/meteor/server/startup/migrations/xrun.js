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
exports.performMigrationProcedure = void 0;
const upsertPermissions_1 = require("../../../app/authorization/server/functions/upsertPermissions");
const migrations_1 = require("../../lib/migrations");
const cloudRegistration_1 = require("../cloudRegistration");
const { MIGRATION_VERSION = 'latest' } = process.env;
const [version, ...subcommands] = MIGRATION_VERSION.split(',');
const performMigrationProcedure = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, migrations_1.migrateDatabase)(version === 'latest' ? version : parseInt(version), subcommands);
    // perform operations when the server is starting with a different version
    yield (0, migrations_1.onServerVersionChange)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, upsertPermissions_1.upsertPermissions)();
        yield (0, cloudRegistration_1.ensureCloudWorkspaceRegistered)();
    }));
});
exports.performMigrationProcedure = performMigrationProcedure;
