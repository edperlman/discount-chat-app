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
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useAddMatrixUsers_1 = require("./AddMatrixUsers/useAddMatrixUsers");
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const UserAutoCompleteMultiple_1 = __importDefault(require("../../../../../components/UserAutoCompleteMultiple"));
const UserAutoCompleteMultipleFederated_1 = __importDefault(require("../../../../../components/UserAutoCompleteMultiple/UserAutoCompleteMultipleFederated"));
const RoomContext_1 = require("../../../contexts/RoomContext");
const RoomToolboxContext_1 = require("../../../contexts/RoomToolboxContext");
const AddUsers = ({ rid, onClickBack, reload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const room = (0, RoomContext_1.useRoom)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const saveAction = (0, ui_contexts_1.useMethod)('addUsersToRoom');
    const { handleSubmit, control, getValues, formState: { isDirty, isSubmitting }, } = (0, react_hook_form_1.useForm)({ defaultValues: { users: [] } });
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)((_a) => __awaiter(void 0, [_a], void 0, function* ({ users }) {
        try {
            yield saveAction({ rid, users });
            dispatchToastMessage({ type: 'success', message: t('Users_added') });
            onClickBack();
            reload();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const addClickHandler = (0, useAddMatrixUsers_1.useAddMatrixUsers)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [onClickBack && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarBack, { onClick: onClickBack }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Add_users') }), closeTab && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: closeTab })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { flexGrow: 0, children: t('Choose_users') }), (0, core_typings_1.isRoomFederated)(room) ? ((0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'users', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(UserAutoCompleteMultipleFederated_1.default, Object.assign({}, field, { placeholder: t('Choose_users') })) })) : ((0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'users', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(UserAutoCompleteMultiple_1.default, Object.assign({}, field, { placeholder: t('Choose_users') })) }))] }) }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, core_typings_1.isRoomFederated)(room) ? ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: addClickHandler.isLoading, onClick: () => addClickHandler.mutate({
                            users: getValues('users'),
                            handleSave,
                        }), children: t('Add_users') })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, loading: isSubmitting, disabled: !isDirty, onClick: handleSubmit(handleSave), children: t('Add_users') })) }) })] }));
};
exports.default = AddUsers;
