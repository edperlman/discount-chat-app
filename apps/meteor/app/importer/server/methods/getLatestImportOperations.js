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
exports.executeGetLatestImportOperations = void 0;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const executeGetLatestImportOperations = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = models_1.Imports.find({}, {
        sort: { _updatedAt: -1 },
        limit: 20,
    });
    return data.toArray();
});
exports.executeGetLatestImportOperations = executeGetLatestImportOperations;
meteor_1.Meteor.methods({
    getLatestImportOperations() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', 'getLatestImportOperations');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-import-operations'))) {
                throw new meteor_1.Meteor.Error('not_authorized', 'User not authorized', 'getLatestImportOperations');
            }
            return (0, exports.executeGetLatestImportOperations)();
        });
    },
});
