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
exports.useVoipItemsSection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const ui_voip_1 = require("@rocket.chat/ui-voip");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useVoipItemsSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { clientError, isEnabled, isReady, isRegistered } = (0, ui_voip_1.useVoipState)();
    const { register, unregister, onRegisteredOnce, onUnregisteredOnce } = (0, ui_voip_1.useVoipAPI)();
    const toggleVoip = (0, react_query_1.useMutation)({
        mutationFn: () => __awaiter(void 0, void 0, void 0, function* () {
            if (!isRegistered) {
                yield register();
                return true;
            }
            yield unregister();
            return false;
        }),
        onSuccess: (isEnabled) => {
            if (isEnabled) {
                onRegisteredOnce(() => dispatchToastMessage({ type: 'success', message: t('Voice_calling_enabled') }));
            }
            else {
                onUnregisteredOnce(() => dispatchToastMessage({ type: 'success', message: t('Voice_calling_disabled') }));
            }
        },
        onError: () => {
            dispatchToastMessage({ type: 'error', message: t('Voice_calling_registration_failed') });
        },
    });
    const tooltip = (0, react_1.useMemo)(() => {
        if (clientError) {
            return t(clientError.message);
        }
        if (!isReady || toggleVoip.isLoading) {
            return t('Loading');
        }
        return '';
    }, [clientError, isReady, toggleVoip.isLoading, t]);
    return (0, react_1.useMemo)(() => {
        if (!isEnabled) {
            return;
        }
        return {
            items: [
                {
                    id: 'toggle-voip',
                    icon: isRegistered ? 'phone-disabled' : 'phone',
                    disabled: !isReady || toggleVoip.isLoading,
                    onClick: () => toggleVoip.mutate(),
                    content: ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', title: tooltip, children: isRegistered ? t('Disable_voice_calling') : t('Enable_voice_calling') })),
                },
            ],
        };
    }, [isEnabled, isRegistered, isReady, tooltip, t, toggleVoip]);
};
exports.useVoipItemsSection = useVoipItemsSection;
exports.default = exports.useVoipItemsSection;
