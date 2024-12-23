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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const mongodb_1 = require("mongodb");
const server_1 = require("../../../app/importer/server");
const server_2 = require("../../../app/settings/server");
const validateRoleList_1 = require("../../lib/roles/validateRoleList");
const getNewUserRoles_1 = require("../user/lib/getNewUserRoles");
class ImportService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'import';
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Imports.invalidateAllOperations();
            yield models_1.ImportData.col.deleteMany({});
        });
    }
    newOperation(userId, name, key) {
        return __awaiter(this, void 0, void 0, function* () {
            // Make sure there's no other operation running
            yield this.clear();
            const importId = (yield models_1.Imports.insertOne({
                type: name,
                importerKey: key,
                ts: new Date(),
                status: 'importer_new',
                valid: true,
                user: userId,
            })).insertedId;
            const operation = yield models_1.Imports.findOneById(importId);
            if (!operation) {
                throw new Error('failed to create import operation');
            }
            return operation;
        });
    }
    getStateOfOperation(operation) {
        if (!operation.valid && operation.status !== 'importer_done') {
            return 'error';
        }
        switch (operation.status) {
            case 'importer_new':
                return 'new';
            case 'importer_uploading':
            case 'importer_downloading_file':
            case 'importer_file_loaded':
            case 'importer_preparing_started':
            case 'importer_preparing_users':
            case 'importer_preparing_channels':
            case 'importer_preparing_messages':
            case 'importer_preparing_contacts':
                return 'loading';
            case 'importer_user_selection':
                return 'ready';
            case 'importer_importing_started':
            case 'importer_importing_users':
            case 'importer_importing_channels':
            case 'importer_importing_messages':
            case 'importer_importing_contacts':
            case 'importer_importing_files':
            case 'importer_finishing':
                return 'importing';
            case 'importer_done':
                return 'done';
            case 'importer_import_failed':
                return 'error';
            case 'importer_import_cancelled':
                return 'canceled';
        }
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const operation = yield models_1.Imports.findLastImport();
            if (!operation) {
                return {
                    state: 'none',
                };
            }
            const state = this.getStateOfOperation(operation);
            return {
                state,
                operation,
            };
        });
    }
    assertsValidStateForNewData(operation) {
        if (!(operation === null || operation === void 0 ? void 0 : operation.valid)) {
            throw new Error('Import operation not initialized.');
        }
        const state = this.getStateOfOperation(operation);
        switch (state) {
            case 'loading':
            case 'importing':
                throw new Error('The current import operation can not receive new data.');
            case 'done':
            case 'error':
            case 'canceled':
                throw new Error('The current import operation is already finished.');
        }
    }
    addUsers(users) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, users_1, users_1_1;
            var _b, e_1, _c, _d;
            var _e, _f, _g;
            if (!users.length) {
                return;
            }
            const operation = yield models_1.Imports.findLastImport();
            this.assertsValidStateForNewData(operation);
            const defaultRoles = (0, getNewUserRoles_1.getNewUserRoles)();
            const userRoles = new Set(defaultRoles);
            try {
                for (_a = true, users_1 = __asyncValues(users); users_1_1 = yield users_1.next(), _b = users_1_1.done, !_b; _a = true) {
                    _d = users_1_1.value;
                    _a = false;
                    const user = _d;
                    if (!((_e = user.emails) === null || _e === void 0 ? void 0 : _e.some((value) => value)) || !((_f = user.importIds) === null || _f === void 0 ? void 0 : _f.some((value) => value))) {
                        throw new Error('Users are missing required data.');
                    }
                    if ((_g = user.roles) === null || _g === void 0 ? void 0 : _g.length) {
                        for (const roleId of user.roles) {
                            userRoles.add(roleId);
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = users_1.return)) yield _c.call(users_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (userRoles.size > 0 && !(yield (0, validateRoleList_1.validateRoleList)([...userRoles]))) {
                throw new Error('One or more of the users have been assigned invalid roles.');
            }
            yield models_1.ImportData.col.insertMany(users.map((data) => ({
                _id: new mongodb_1.ObjectId().toHexString(),
                data: Object.assign(Object.assign({}, data), { roles: data.roles ? [...new Set(...data.roles, ...defaultRoles)] : defaultRoles }),
                dataType: 'user',
            })));
            yield models_1.Imports.increaseTotalCount(operation._id, 'users', users.length);
            yield models_1.Imports.setOperationStatus(operation._id, 'importer_user_selection');
        });
    }
    run(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const operation = yield models_1.Imports.findLastImport();
            if (!(operation === null || operation === void 0 ? void 0 : operation.valid)) {
                throw new Error('error-operation-not-found');
            }
            if (operation.status !== 'importer_user_selection') {
                throw new Error('error-invalid-operation-status');
            }
            const { importerKey } = operation;
            const importer = server_1.Importers.get(importerKey);
            if (!importer) {
                throw new Error('error-importer-not-defined');
            }
            // eslint-disable-next-line new-cap
            const instance = new importer.importer(importer, operation, {
                skipUserCallbacks: true,
                skipDefaultChannels: true,
                enableEmail2fa: server_2.settings.get('Accounts_TwoFactorAuthentication_By_Email_Auto_Opt_In'),
                quickUserInsertion: true,
                skipExistingUsers: true,
            });
            yield instance.startImport({ users: { all: true } }, userId);
        });
    }
}
exports.ImportService = ImportService;
