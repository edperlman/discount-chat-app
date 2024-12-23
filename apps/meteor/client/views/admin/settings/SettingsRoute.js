"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRoute = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const EditableSettingsProvider_1 = __importDefault(require("./EditableSettingsProvider"));
const SettingsGroupSelector_1 = __importDefault(require("./SettingsGroupSelector"));
const SettingsPage_1 = __importDefault(require("./SettingsPage"));
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const omittedSettings = ['Cloud_Workspace_AirGapped_Restrictions_Remaining_Days'];
const SettingsRoute = () => {
    const hasPermission = (0, ui_contexts_1.useIsPrivilegedSettingsContext)();
    const groupId = (0, ui_contexts_1.useRouteParameter)('group');
    const router = (0, ui_contexts_1.useRouter)();
    if (!hasPermission) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    if (!groupId) {
        return (0, jsx_runtime_1.jsx)(SettingsPage_1.default, {});
    }
    return ((0, jsx_runtime_1.jsx)(EditableSettingsProvider_1.default, { omit: omittedSettings, children: (0, jsx_runtime_1.jsx)(SettingsGroupSelector_1.default, { groupId: groupId, onClickBack: () => router.navigate('/admin/settings') }) }));
};
exports.SettingsRoute = SettingsRoute;
exports.default = exports.SettingsRoute;
