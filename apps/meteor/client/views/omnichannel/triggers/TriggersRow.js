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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const GenericTable_1 = require("../../../components/GenericTable");
const TriggersRow = ({ _id, name, description, enabled, reload }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const triggersRoute = (0, ui_contexts_1.useRoute)('omnichannel-triggers');
    const deleteTrigger = (0, ui_contexts_1.useEndpoint)('DELETE', '/v1/livechat/triggers/:_id', { _id });
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleClick = (0, fuselage_hooks_1.useMutableCallback)(() => {
        triggersRoute.push({
            context: 'edit',
            id: _id,
        });
    });
    const handleKeyDown = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        if (!['Enter', 'Space'].includes(e.nativeEvent.code)) {
            return;
        }
        handleClick();
    });
    const handleDelete = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        e.stopPropagation();
        const onDeleteTrigger = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield deleteTrigger();
                dispatchToastMessage({ type: 'success', message: t('Trigger_removed') });
                reload();
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            setModal();
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: onDeleteTrigger, onCancel: () => setModal(), confirmText: t('Delete') }));
    });
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { role: 'link', action: true, tabIndex: 0, onClick: handleClick, onKeyDown: handleKeyDown, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: name }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: description }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: enabled ? t('Yes') : t('No') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'trash', small: true, title: t('Remove'), onClick: handleDelete }) })] }, _id));
};
exports.default = (0, react_1.memo)(TriggersRow);
