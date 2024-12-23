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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const ComposerAnonymous = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatch = (0, ui_contexts_1.useToastMessageDispatch)();
    const isAnonymousWriteEnabled = (0, ui_contexts_1.useSetting)('Accounts_AllowAnonymousWrite');
    const loginWithToken = (0, ui_contexts_1.useLoginWithToken)();
    const anonymousUser = (0, ui_contexts_1.useMethod)('registerUser');
    const setForceLogin = (0, ui_contexts_1.useSessionDispatch)('forceLogin');
    const registerAnonymous = (0, react_query_1.useMutation)((...params) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield anonymousUser(...params);
        if (typeof result !== 'string' && result.token) {
            yield loginWithToken(result.token);
        }
        return result;
    }), {
        onError: (error) => {
            dispatch({ type: 'error', message: error });
        },
    });
    const joinAnonymous = () => {
        registerAnonymous.mutate({ email: null });
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 16, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, primary: true, onClick: () => setForceLogin(true), children: t('Sign_in_to_start_talking') }), isAnonymousWriteEnabled && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, secondary: true, onClick: () => joinAnonymous(), children: t('Or_talk_as_anonymous') }))] }) }));
};
exports.default = ComposerAnonymous;
