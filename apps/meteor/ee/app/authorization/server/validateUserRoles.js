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
exports.validateUserRoles = validateUserRoles;
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const i18n_1 = require("../../../../server/lib/i18n");
function validateUserRoles(userData, currentUserData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const isApp = Boolean(userData.type === 'app');
        const wasApp = Boolean((currentUserData === null || currentUserData === void 0 ? void 0 : currentUserData.type) === 'app');
        const isBot = Boolean(userData.type === 'bot');
        const wasBot = Boolean((currentUserData === null || currentUserData === void 0 ? void 0 : currentUserData.type) === 'bot');
        const isGuest = Boolean(((_a = userData.roles) === null || _a === void 0 ? void 0 : _a.includes('guest')) && userData.roles.length === 1);
        const wasGuest = Boolean(((_b = currentUserData === null || currentUserData === void 0 ? void 0 : currentUserData.roles) === null || _b === void 0 ? void 0 : _b.includes('guest')) && currentUserData.roles.length === 1);
        const isSpecialType = isApp || isBot;
        const hasGuestToChanged = isGuest && !wasGuest;
        if (isSpecialType) {
            return;
        }
        if (hasGuestToChanged && (yield license_1.License.shouldPreventAction('guestUsers'))) {
            throw new core_services_1.MeteorError('error-max-guests-number-reached', 'Maximum number of guests reached.', {
                method: 'insertOrUpdateUser',
                field: 'Assign_role',
            });
        }
        if (isGuest) {
            return;
        }
        const isActive = Boolean(userData.active !== false);
        const wasActive = currentUserData && (currentUserData === null || currentUserData === void 0 ? void 0 : currentUserData.active) !== false;
        const hasRemovedSpecialType = (wasApp && !isApp) || (wasBot && !isBot);
        if (!isActive) {
            return;
        }
        if (!hasRemovedSpecialType && wasActive) {
            return;
        }
        if (yield license_1.License.shouldPreventAction('activeUsers')) {
            throw new core_services_1.MeteorError('error-license-user-limit-reached', i18n_1.i18n.t('error-license-user-limit-reached'));
        }
    });
}
