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
exports.executeStartImport = void 0;
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const meteor_1 = require("meteor/meteor");
const __1 = require("..");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const executeStartImport = (_a, startedByUserId_1) => __awaiter(void 0, [_a, startedByUserId_1], void 0, function* ({ input }, startedByUserId) {
    const operation = yield models_1.Imports.findLastImport();
    if (!operation) {
        throw new meteor_1.Meteor.Error('error-operation-not-found', 'Import Operation Not Found', 'startImport');
    }
    const { importerKey } = operation;
    const importer = __1.Importers.get(importerKey);
    if (!importer) {
        throw new meteor_1.Meteor.Error('error-importer-not-defined', `The importer (${importerKey}) has no import class defined.`, 'startImport');
    }
    const instance = new importer.importer(importer, operation); // eslint-disable-line new-cap
    yield instance.startImport(input, startedByUserId);
});
exports.executeStartImport = executeStartImport;
meteor_1.Meteor.methods({
    startImport(_a) {
        return __awaiter(this, arguments, void 0, function* ({ input }) {
            if (!input || typeof input !== 'object' || !(0, rest_typings_1.isStartImportParamsPOST)({ input })) {
                throw new meteor_1.Meteor.Error(`Invalid Selection data provided to the importer.`);
            }
            const userId = meteor_1.Meteor.userId();
            // Takes name and object with users / channels selected to import
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', 'startImport');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'run-import'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Importing is not allowed', 'startImport');
            }
            return (0, exports.executeStartImport)({ input }, userId);
        });
    },
});
