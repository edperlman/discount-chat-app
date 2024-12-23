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
exports.BeforeSavePreventMention = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const i18n_1 = require("../../../lib/i18n");
class BeforeSavePreventMention {
    preventMention(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message, user, mention, permission, }) {
            var _b;
            if (!((_b = message.mentions) === null || _b === void 0 ? void 0 : _b.some(({ _id }) => _id === mention))) {
                return true;
            }
            // Check if the user has permissions to use @all in both global and room scopes.
            if (yield core_services_1.Authorization.hasPermission(message.u._id, permission)) {
                return true;
            }
            if (yield core_services_1.Authorization.hasPermission(message.u._id, permission, message.rid)) {
                return true;
            }
            const action = i18n_1.i18n.t('Notify_all_in_this_room', { lng: user.language });
            // Also throw to stop propagation of 'sendMessage'.
            throw new core_services_1.MeteorError('error-action-not-allowed', `Notify ${mention} in this room not allowed`, {
                action,
            });
        });
    }
}
exports.BeforeSavePreventMention = BeforeSavePreventMention;
