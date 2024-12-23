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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBlockChannel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const BlockChannelModal_1 = __importDefault(require("./BlockChannelModal"));
const useHasLicenseModule_1 = require("../../../../../hooks/useHasLicenseModule");
const AdvancedContactModal_1 = __importDefault(require("../../AdvancedContactModal"));
const useBlockChannel = ({ blocked, association }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('contact-id-verification');
    const queryClient = (0, react_query_1.useQueryClient)();
    const blockContact = (0, ui_contexts_1.useEndpoint)('POST', '/v1/omnichannel/contacts.block');
    const unblockContact = (0, ui_contexts_1.useEndpoint)('POST', '/v1/omnichannel/contacts.unblock');
    const handleUnblock = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield unblockContact({ visitor: association });
            dispatchToastMessage({ type: 'success', message: t('Contact_unblocked') });
            queryClient.invalidateQueries(['getContactById']);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [association, dispatchToastMessage, queryClient, t, unblockContact]);
    const handleBlock = (0, react_1.useCallback)(() => {
        if (!hasLicense) {
            return setModal((0, jsx_runtime_1.jsx)(AdvancedContactModal_1.default, { onCancel: () => setModal(null) }));
        }
        const blockAction = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield blockContact({ visitor: association });
                dispatchToastMessage({ type: 'success', message: t('Contact_blocked') });
                queryClient.invalidateQueries(['getContactById']);
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(BlockChannelModal_1.default, { onCancel: () => setModal(null), onConfirm: blockAction }));
    }, [association, blockContact, dispatchToastMessage, hasLicense, queryClient, setModal, t]);
    return blocked ? handleUnblock : handleBlock;
};
exports.useBlockChannel = useBlockChannel;
