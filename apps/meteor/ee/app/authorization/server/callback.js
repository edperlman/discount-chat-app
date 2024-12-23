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
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const validateUserRoles_1 = require("./validateUserRoles");
const callbacks_1 = require("../../../../lib/callbacks");
const i18n_1 = require("../../../../server/lib/i18n");
license_1.License.onInstall(() => {
    callbacks_1.callbacks.add('beforeSaveUser', (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, oldUser }) { return (0, validateUserRoles_1.validateUserRoles)(user, oldUser); }), callbacks_1.callbacks.priority.HIGH, 'validateUserRoles');
    callbacks_1.callbacks.add('afterSaveUser', (user) => __awaiter(void 0, void 0, void 0, function* () {
        yield license_1.License.shouldPreventAction('activeUsers');
        return user;
    }), callbacks_1.callbacks.priority.HIGH, 'validateUserRoles');
    callbacks_1.callbacks.add('afterDeleteUser', (user) => __awaiter(void 0, void 0, void 0, function* () {
        yield license_1.License.shouldPreventAction('activeUsers');
        return user;
    }), callbacks_1.callbacks.priority.HIGH, 'validateUserRoles');
    callbacks_1.callbacks.add('afterDeactivateUser', (user) => __awaiter(void 0, void 0, void 0, function* () {
        yield license_1.License.shouldPreventAction('activeUsers');
        return user;
    }), callbacks_1.callbacks.priority.HIGH, 'validateUserStatus');
    callbacks_1.callbacks.add('beforeActivateUser', () => __awaiter(void 0, void 0, void 0, function* () {
        if (yield license_1.License.shouldPreventAction('activeUsers')) {
            throw new core_services_1.MeteorError('error-license-user-limit-reached', i18n_1.i18n.t('error-license-user-limit-reached'));
        }
        return undefined;
    }), callbacks_1.callbacks.priority.HIGH, 'validateUserStatus');
});
license_1.License.onInvalidate(() => {
    callbacks_1.callbacks.remove('beforeSaveUser', 'validateUserRoles');
    callbacks_1.callbacks.remove('afterSaveUser', 'validateUserRoles');
    callbacks_1.callbacks.remove('afterDeleteUser', 'validateUserRoles');
    callbacks_1.callbacks.remove('afterDeactivateUser', 'validateUserStatus');
    callbacks_1.callbacks.remove('beforeActivateUser', 'validateUserStatus');
});
