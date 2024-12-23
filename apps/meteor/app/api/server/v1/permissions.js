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
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const meteor_1 = require("meteor/meteor");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const api_1 = require("../api");
api_1.API.v1.addRoute('permissions.listAll', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { updatedSince } = this.queryParams;
            let updatedSinceDate;
            if (updatedSince) {
                if (isNaN(Date.parse(updatedSince))) {
                    throw new meteor_1.Meteor.Error('error-roomId-param-invalid', 'The "updatedSince" query parameter must be a valid date.');
                }
                updatedSinceDate = new Date(updatedSince);
            }
            const result = (yield meteor_1.Meteor.callAsync('permissions/get', updatedSinceDate));
            if (Array.isArray(result)) {
                return api_1.API.v1.success({
                    update: result,
                    remove: [],
                });
            }
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('permissions.update', { authRequired: true, permissionsRequired: ['access-permissions'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const { bodyParams } = this;
            if (!(0, rest_typings_1.isBodyParamsValidPermissionUpdate)(bodyParams)) {
                return api_1.API.v1.failure('Invalid body params', 'error-invalid-body-params');
            }
            const permissionKeys = bodyParams.permissions.map(({ _id }) => _id);
            const permissions = yield models_1.Permissions.find({ _id: { $in: permissionKeys } }).toArray();
            if (permissions.length !== bodyParams.permissions.length) {
                return api_1.API.v1.failure('Invalid permission', 'error-invalid-permission');
            }
            const roleKeys = [...new Set(bodyParams.permissions.flatMap((p) => p.roles))];
            const roles = yield models_1.Roles.find({ _id: { $in: roleKeys } }).toArray();
            if (roles.length !== roleKeys.length) {
                return api_1.API.v1.failure('Invalid role', 'error-invalid-role');
            }
            try {
                for (var _d = true, _e = __asyncValues(bodyParams.permissions), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const permission = _c;
                    yield models_1.Permissions.setRoles(permission._id, permission.roles);
                    void (0, notifyListener_1.notifyOnPermissionChangedById)(permission._id);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const result = (yield meteor_1.Meteor.callAsync('permissions/get'));
            return api_1.API.v1.success({
                permissions: result,
            });
        });
    },
});
