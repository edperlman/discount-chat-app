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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useEndpointAction_1 = require("../../../hooks/useEndpointAction");
const TwoFactorEmail = (props) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const user = (0, ui_contexts_1.useUser)();
    const isEnabled = (_b = (_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.email2fa) === null || _b === void 0 ? void 0 : _b.enabled;
    const enable2faAction = (0, useEndpointAction_1.useEndpointAction)('POST', '/v1/users.2fa.enableEmail', {
        successMessage: t('Two-factor_authentication_enabled'),
    });
    const disable2faAction = (0, useEndpointAction_1.useEndpointAction)('POST', '/v1/users.2fa.disableEmail', {
        successMessage: t('Two-factor_authentication_disabled'),
    });
    const handleEnable = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield enable2faAction();
    }), [enable2faAction]);
    const handleDisable = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield disable2faAction();
    }), [disable2faAction]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mbs: 16 }, props, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { blockEnd: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', children: t('Two-factor_authentication_email') }), isEnabled && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: handleDisable, children: t('Disable_two-factor_authentication_email') })), !isEnabled && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Two-factor_authentication_email_is_currently_disabled') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleEnable, children: t('Enable_two-factor_authentication_email') })] }))] }) })));
};
exports.default = TwoFactorEmail;
