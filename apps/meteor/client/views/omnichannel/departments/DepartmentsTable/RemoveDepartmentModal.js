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
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const RemoveDepartmentModal = ({ _id = '', name, reset, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [text, setText] = (0, react_1.useState)('');
    const removeDepartment = (0, ui_contexts_1.useEndpoint)('DELETE', '/v1/livechat/department/:_id', { _id });
    const dispatchToast = (0, ui_contexts_1.useToastMessageDispatch)();
    const onSubmit = (0, fuselage_hooks_1.useMutableCallback)((e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        try {
            yield removeDepartment();
            dispatchToast({ type: 'success', message: t('Department_removed') });
            reset();
            onClose();
        }
        catch (error) {
            dispatchToast({ type: 'error', message: error });
        }
    }));
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: onSubmit }, props)), onCancel: onClose, confirmText: t('Delete'), title: t('Delete_Department?'), onClose: onClose, variant: 'danger', "data-qa-id": 'delete-department-modal', confirmDisabled: text !== name, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 16, children: t('Are_you_sure_delete_department') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 16, display: 'flex', justifyContent: 'stretch', children: (0, jsx_runtime_1.jsx)(fuselage_1.Input, { value: text, name: 'confirmDepartmentName', onChange: (event) => setText(event.currentTarget.value) }) })] }));
};
exports.default = RemoveDepartmentModal;
