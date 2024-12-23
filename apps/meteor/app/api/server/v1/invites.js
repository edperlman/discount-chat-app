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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const findOrCreateInvite_1 = require("../../../invites/server/functions/findOrCreateInvite");
const listInvites_1 = require("../../../invites/server/functions/listInvites");
const removeInvite_1 = require("../../../invites/server/functions/removeInvite");
const sendInvitationEmail_1 = require("../../../invites/server/functions/sendInvitationEmail");
const useInviteToken_1 = require("../../../invites/server/functions/useInviteToken");
const validateInviteToken_1 = require("../../../invites/server/functions/validateInviteToken");
const api_1 = require("../api");
api_1.API.v1.addRoute('listInvites', {
    authRequired: true,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, listInvites_1.listInvites)(this.userId);
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('findOrCreateInvite', {
    authRequired: true,
    validateParams: rest_typings_1.isFindOrCreateInviteParams,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid, days, maxUses } = this.bodyParams;
            return api_1.API.v1.success((yield (0, findOrCreateInvite_1.findOrCreateInvite)(this.userId, { rid, days, maxUses })));
        });
    },
});
api_1.API.v1.addRoute('removeInvite/:_id', { authRequired: true }, {
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = this.urlParams;
            return api_1.API.v1.success(yield (0, removeInvite_1.removeInvite)(this.userId, { _id }));
        });
    },
});
api_1.API.v1.addRoute('useInviteToken', {
    authRequired: true,
    validateParams: rest_typings_1.isUseInviteTokenProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = this.bodyParams;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return api_1.API.v1.success(yield (0, useInviteToken_1.useInviteToken)(this.userId, token));
        });
    },
});
api_1.API.v1.addRoute('validateInviteToken', {
    authRequired: false,
    validateParams: rest_typings_1.isValidateInviteTokenProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = this.bodyParams;
            try {
                return api_1.API.v1.success({ valid: Boolean(yield (0, validateInviteToken_1.validateInviteToken)(token)) });
            }
            catch (_) {
                return api_1.API.v1.success({ valid: false });
            }
        });
    },
});
api_1.API.v1.addRoute('sendInvitationEmail', {
    authRequired: true,
    validateParams: rest_typings_1.isSendInvitationEmailParams,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { emails } = this.bodyParams;
            try {
                return api_1.API.v1.success({ success: Boolean(yield (0, sendInvitationEmail_1.sendInvitationEmail)(this.userId, emails)) });
            }
            catch (e) {
                return api_1.API.v1.failure({ error: e.message });
            }
        });
    },
});
