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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const cannedResponseForm_1 = __importDefault(require("../../components/cannedResponseForm"));
const getInitialData = (cannedResponseData) => ({
    _id: (cannedResponseData === null || cannedResponseData === void 0 ? void 0 : cannedResponseData._id) || '',
    shortcut: (cannedResponseData === null || cannedResponseData === void 0 ? void 0 : cannedResponseData.shortcut) || '',
    text: (cannedResponseData === null || cannedResponseData === void 0 ? void 0 : cannedResponseData.text) || '',
    tags: (cannedResponseData === null || cannedResponseData === void 0 ? void 0 : cannedResponseData.tags) && Array.isArray(cannedResponseData.tags)
        ? cannedResponseData.tags.map((tag) => ({ label: tag, value: tag }))
        : [],
    scope: (cannedResponseData === null || cannedResponseData === void 0 ? void 0 : cannedResponseData.scope) || 'user',
    departmentId: (cannedResponseData === null || cannedResponseData === void 0 ? void 0 : cannedResponseData.departmentId) || '',
});
const CreateCannedResponseModal = ({ cannedResponseData, onClose, reloadCannedList, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const methods = (0, react_hook_form_1.useForm)({ defaultValues: getInitialData(cannedResponseData) });
    const { handleSubmit, formState: { isDirty }, } = methods;
    const saveCannedResponse = (0, ui_contexts_1.useEndpoint)('POST', '/v1/canned-responses');
    const handleCreate = (0, react_1.useCallback)((_a) => __awaiter(void 0, void 0, void 0, function* () {
        var { departmentId } = _a, data = __rest(_a, ["departmentId"]);
        try {
            yield saveCannedResponse(Object.assign(Object.assign({ _id: cannedResponseData === null || cannedResponseData === void 0 ? void 0 : cannedResponseData._id }, data), (departmentId && { departmentId })));
            dispatchToastMessage({
                type: 'success',
                message: t((cannedResponseData === null || cannedResponseData === void 0 ? void 0 : cannedResponseData._id) ? 'Canned_Response_Updated' : 'Canned_Response_Created'),
            });
            onClose();
            reloadCannedList === null || reloadCannedList === void 0 ? void 0 : reloadCannedList();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [cannedResponseData === null || cannedResponseData === void 0 ? void 0 : cannedResponseData._id, saveCannedResponse, onClose, dispatchToastMessage, t, reloadCannedList]);
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { icon: null, variant: 'warning', onCancel: onClose, confirmText: t('Save'), confirmDisabled: !isDirty, title: (cannedResponseData === null || cannedResponseData === void 0 ? void 0 : cannedResponseData._id) ? t('Edit_Canned_Response') : t('Create_canned_response'), wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(handleCreate) }, props)), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)(cannedResponseForm_1.default, {}) })) }));
};
exports.default = (0, react_1.memo)(CreateCannedResponseModal);
