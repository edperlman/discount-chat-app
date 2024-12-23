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
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const RoleForm_1 = __importDefault(require("./RoleForm"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const EditRolePage = ({ role, isEnterprise }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const usersInRoleRouter = (0, ui_contexts_1.useRoute)('admin-permissions');
    const router = (0, ui_contexts_1.useRoute)('admin-permissions');
    const createRole = (0, ui_contexts_1.useEndpoint)('POST', '/v1/roles.create');
    const updateRole = (0, ui_contexts_1.useEndpoint)('POST', '/v1/roles.update');
    const deleteRole = (0, ui_contexts_1.useEndpoint)('POST', '/v1/roles.delete');
    const methods = (0, react_hook_form_1.useForm)({
        defaultValues: {
            roleId: role === null || role === void 0 ? void 0 : role._id,
            name: role === null || role === void 0 ? void 0 : role.name,
            description: role === null || role === void 0 ? void 0 : role.description,
            scope: (role === null || role === void 0 ? void 0 : role.scope) || 'Users',
            mandatory2fa: !!(role === null || role === void 0 ? void 0 : role.mandatory2fa),
        },
    });
    const handleManageUsers = (0, fuselage_hooks_1.useMutableCallback)(() => {
        if (role === null || role === void 0 ? void 0 : role._id) {
            usersInRoleRouter.push({
                context: 'users-in-role',
                _id: role._id,
            });
        }
    });
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)((data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (data.roleId) {
                yield updateRole(data);
                dispatchToastMessage({ type: 'success', message: t('Saved') });
                return router.push({});
            }
            yield createRole(data);
            dispatchToastMessage({ type: 'success', message: t('Saved') });
            router.push({});
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const handleDelete = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!(role === null || role === void 0 ? void 0 : role._id)) {
            return;
        }
        const deleteRoleAction = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield deleteRole({ roleId: role._id });
                dispatchToastMessage({ type: 'success', message: t('Role_removed') });
                setModal();
                router.push({});
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
                setModal();
            }
        });
        const deleteRoleMessage = isEnterprise ? t('Delete_Role_Warning') : t('Delete_Role_Warning_Not_Enterprise');
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: deleteRoleAction, onClose: () => setModal(), onCancel: () => setModal(), confirmText: t('Delete'), children: deleteRoleMessage }));
    }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'full', alignSelf: 'center', mb: 'neg-x8', children: (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { block: 8, children: (0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)(RoleForm_1.default, { editing: Boolean(role === null || role === void 0 ? void 0 : role._id), isProtected: role === null || role === void 0 ? void 0 : role.protected, isDisabled: !isEnterprise }) })) }) }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { vertical: true, stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !methods.formState.isDirty || !isEnterprise, onClick: methods.handleSubmit(handleSave), children: t('Save') }), !(role === null || role === void 0 ? void 0 : role.protected) && (role === null || role === void 0 ? void 0 : role._id) && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, danger: true, onClick: handleDelete, children: t('Delete') })), (role === null || role === void 0 ? void 0 : role._id) && (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleManageUsers, children: t('Users_in_role') })] }) })] }));
};
exports.default = EditRolePage;
