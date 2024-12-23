"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const EditableSettingsContext_1 = require("../../views/admin/EditableSettingsContext");
const GenericGroupPage_1 = __importDefault(require("../../views/admin/settings/groups/GenericGroupPage"));
const NotAuthorizedPage_1 = __importDefault(require("../../views/notAuthorized/NotAuthorizedPage"));
const GROUP_ID = 'Omnichannel';
const SECTION_ID = 'Contact_identification';
const SecurityPrivacyPage = () => {
    const hasPermission = (0, ui_contexts_1.useIsPrivilegedSettingsContext)();
    const sections = (0, EditableSettingsContext_1.useEditableSettingsGroupSections)(GROUP_ID).filter((id) => id === SECTION_ID);
    if (!hasPermission) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(GenericGroupPage_1.default, { i18nLabel: 'Security_and_privacy', sections: sections, _id: GROUP_ID });
};
exports.default = SecurityPrivacyPage;
