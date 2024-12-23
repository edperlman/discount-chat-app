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
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const client_1 = require("../../../../../../../app/authorization/client");
const Contextualbar_1 = require("../../../../../../components/Contextualbar");
const Tags_1 = __importDefault(require("../../../../../../components/Omnichannel/Tags"));
const useOmnichannelPriorities_1 = require("../../../../../../omnichannel/hooks/useOmnichannelPriorities");
const additionalForms_1 = require("../../../../additionalForms");
const FormSkeleton_1 = require("../../../components/FormSkeleton");
const useCustomFieldsMetadata_1 = require("../../../hooks/useCustomFieldsMetadata");
const useSlaPolicies_1 = require("../../../hooks/useSlaPolicies");
const ROOM_INTIAL_VALUE = {
    topic: '',
    tags: [],
    livechatData: {},
    slaId: '',
};
const getInitialValuesRoom = (room) => {
    const { topic, tags, livechatData, slaId, priorityId } = room !== null && room !== void 0 ? room : ROOM_INTIAL_VALUE;
    return {
        topic: topic !== null && topic !== void 0 ? topic : '',
        tags: tags !== null && tags !== void 0 ? tags : [],
        livechatData: livechatData !== null && livechatData !== void 0 ? livechatData : {},
        slaId: slaId !== null && slaId !== void 0 ? slaId : '',
        priorityId: priorityId !== null && priorityId !== void 0 ? priorityId : '',
    };
};
function RoomEdit({ room, visitor, reload, reloadInfo, onClose }) {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const canViewCustomFields = (0, client_1.hasAtLeastOnePermission)(['view-livechat-room-customfields', 'edit-livechat-room-customfields']);
    const saveRoom = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/room.saveInfo');
    const { data: slaPolicies, isInitialLoading: isSlaPoliciesLoading } = (0, useSlaPolicies_1.useSlaPolicies)();
    const { data: customFieldsMetadata, isInitialLoading: isCustomFieldsLoading } = (0, useCustomFieldsMetadata_1.useCustomFieldsMetadata)({
        scope: 'room',
        enabled: canViewCustomFields,
    });
    const { data: priorities, isLoading: isPrioritiesLoading } = (0, useOmnichannelPriorities_1.useOmnichannelPriorities)();
    const { register, control, formState: { isDirty: isFormDirty, isValid: isFormValid, isSubmitting }, handleSubmit, } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
        defaultValues: getInitialValuesRoom(room),
    });
    const { field: tagsField } = (0, react_hook_form_1.useController)({ control, name: 'tags' });
    const { field: slaIdField } = (0, react_hook_form_1.useController)({ control, name: 'slaId' });
    const { field: priorityIdField } = (0, react_hook_form_1.useController)({ control, name: 'priorityId' });
    const handleSave = (0, react_1.useCallback)((data) => __awaiter(this, void 0, void 0, function* () {
        if (!isFormValid) {
            return;
        }
        const { topic, tags, livechatData, slaId, priorityId } = data;
        const guestData = {
            _id: visitor._id,
        };
        const roomData = Object.assign({ _id: room._id, topic, tags: tags.sort(), livechatData,
            priorityId }, (slaId && { slaId }));
        try {
            yield saveRoom({ guestData, roomData });
            yield queryClient.invalidateQueries(['/v1/rooms.info', room._id]);
            dispatchToastMessage({ type: 'success', message: t('Saved') });
            reload === null || reload === void 0 ? void 0 : reload();
            reloadInfo === null || reloadInfo === void 0 ? void 0 : reloadInfo();
            onClose();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [dispatchToastMessage, isFormValid, onClose, queryClient, reload, reloadInfo, room._id, saveRoom, t, visitor._id]);
    if (isCustomFieldsLoading || isSlaPoliciesLoading || isPrioritiesLoading) {
        return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)(FormSkeleton_1.FormSkeleton, {}) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { is: 'form', onSubmit: handleSubmit(handleSave), children: [canViewCustomFields && customFieldsMetadata && ((0, jsx_runtime_1.jsx)(ui_client_1.CustomFieldsForm, { formName: 'livechatData', formControl: control, metadata: customFieldsMetadata })), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Topic') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, register('topic'), { flexGrow: 1 })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(Tags_1.default, { tags: tagsField.value, handler: tagsField.onChange, department: room.departmentId }) }), additionalForms_1.SlaPoliciesSelect && !!(slaPolicies === null || slaPolicies === void 0 ? void 0 : slaPolicies.length) && ((0, jsx_runtime_1.jsx)(additionalForms_1.SlaPoliciesSelect, { label: t('SLA_Policy'), value: slaIdField.value, options: slaPolicies, onChange: slaIdField.onChange })), additionalForms_1.PrioritiesSelect && !!(priorities === null || priorities === void 0 ? void 0 : priorities.length) && ((0, jsx_runtime_1.jsx)(additionalForms_1.PrioritiesSelect, { label: t('Priority'), value: priorityIdField.value, options: priorities, onChange: priorityIdField.onChange }))] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { flexGrow: 1, onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { mie: 'none', flexGrow: 1, onClick: handleSubmit(handleSave), loading: isSubmitting, disabled: !isFormValid || !isFormDirty, primary: true, children: t('Save') })] }) })] }));
}
exports.default = RoomEdit;
