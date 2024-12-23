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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ReadReceiptRow_1 = __importDefault(require("./ReadReceiptRow"));
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const GenericModalSkeleton_1 = __importDefault(require("../../../../components/GenericModal/GenericModalSkeleton"));
const ReadReceiptsModal = ({ messageId, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const getReadReceipts = (0, ui_contexts_1.useMethod)('getReadReceipts');
    const readReceiptsResult = (0, react_query_1.useQuery)(['read-receipts', messageId], () => getReadReceipts({ messageId }));
    (0, react_1.useEffect)(() => {
        if (readReceiptsResult.isError) {
            dispatchToastMessage({ type: 'error', message: readReceiptsResult.error });
            onClose();
        }
    }, [dispatchToastMessage, t, onClose, readReceiptsResult.isError, readReceiptsResult.error]);
    if (readReceiptsResult.isLoading || readReceiptsResult.isError) {
        return (0, jsx_runtime_1.jsx)(GenericModalSkeleton_1.default, {});
    }
    const readReceipts = readReceiptsResult.data;
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { title: t('Read_by'), onConfirm: onClose, onClose: onClose, children: [readReceipts.length < 1 && t('No_results_found'), readReceipts.length > 0 && ((0, jsx_runtime_1.jsx)("div", { role: 'list', children: readReceipts.map((receipt) => ((0, jsx_runtime_1.jsx)(ReadReceiptRow_1.default, Object.assign({}, receipt), receipt._id))) }))] }));
};
exports.default = ReadReceiptsModal;
