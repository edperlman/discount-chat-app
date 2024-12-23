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
exports.useValidateInviteQuery = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useInviteTokenMutation_1 = require("./useInviteTokenMutation");
const useValidateInviteQuery = (userId, token) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const registrationForm = (0, ui_contexts_1.useSetting)('Accounts_RegistrationForm');
    const setLoginDefaultState = (0, ui_contexts_1.useSessionDispatch)('loginDefaultState');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const getInviteRoomMutation = (0, useInviteTokenMutation_1.useInviteTokenMutation)();
    const handleValidateInviteToken = (0, ui_contexts_1.useEndpoint)('POST', '/v1/validateInviteToken');
    return (0, react_query_1.useQuery)(['invite', token], () => __awaiter(void 0, void 0, void 0, function* () {
        if (!token) {
            return false;
        }
        try {
            const { valid } = yield handleValidateInviteToken({ token });
            return valid;
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: t('Failed_to_validate_invite_token') });
            return false;
        }
    }), {
        onSuccess: (valid) => __awaiter(void 0, void 0, void 0, function* () {
            if (!token) {
                return;
            }
            if (registrationForm !== 'Disabled') {
                setLoginDefaultState('invite-register');
            }
            else {
                setLoginDefaultState('login');
            }
            if (!valid || !userId) {
                return;
            }
            return getInviteRoomMutation(token);
        }),
    });
};
exports.useValidateInviteQuery = useValidateInviteQuery;
