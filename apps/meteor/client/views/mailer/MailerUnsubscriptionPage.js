"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const layout_1 = require("@rocket.chat/layout");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useAsyncState_1 = require("../../hooks/useAsyncState");
const useMailerUnsubscriptionState = () => {
    const _a = (0, useAsyncState_1.useAsyncState)(), { resolve, reject } = _a, unsubscribedState = __rest(_a, ["resolve", "reject"]);
    const unsubscribe = (0, ui_contexts_1.useEndpoint)('POST', '/v1/mailer.unsubscribe');
    const _id = (0, ui_contexts_1.useRouteParameter)('_id');
    const createdAt = (0, ui_contexts_1.useRouteParameter)('createdAt');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    (0, react_1.useEffect)(() => {
        const doUnsubscribe = (_id, createdAt) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield unsubscribe({ _id, createdAt });
                resolve(true);
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
        if (!_id || !createdAt) {
            return;
        }
        doUnsubscribe(_id, createdAt);
    }, [resolve, reject, unsubscribe, _id, createdAt, dispatchToastMessage]);
    return unsubscribedState;
};
const MailerUnsubscriptionPage = () => {
    const { phase, error } = useMailerUnsubscriptionState();
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(layout_1.HeroLayout, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'default', marginInline: 'auto', marginBlock: 16, maxWidth: 800, children: (phase === useAsyncState_1.AsyncStatePhase.LOADING && (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { disabled: true })) ||
                (phase === useAsyncState_1.AsyncStatePhase.REJECTED && (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', title: error === null || error === void 0 ? void 0 : error.message })) ||
                (phase === useAsyncState_1.AsyncStatePhase.RESOLVED && (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'success', title: t('You_have_successfully_unsubscribed') })) }) }));
};
exports.default = MailerUnsubscriptionPage;
