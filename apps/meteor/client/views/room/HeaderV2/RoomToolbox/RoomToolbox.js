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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Header_1 = require("../../../../components/Header");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const RoomToolbox = ({ className }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { roomToolboxExpanded } = (0, ui_contexts_1.useLayout)();
    const toolbox = (0, RoomToolboxContext_1.useRoomToolbox)();
    const { actions, openTab } = toolbox;
    const featuredActions = actions.filter((action) => action.featured);
    const normalActions = actions.filter((action) => !action.featured);
    const visibleActions = !roomToolboxExpanded ? [] : normalActions.slice(0, 6);
    const hiddenActions = (!roomToolboxExpanded ? actions : normalActions.slice(6))
        .filter((item) => !item.disabled && !item.featured)
        .map((item) => {
        var _a;
        return (Object.assign({ 'key': item.id, 'content': t(item.title), 'onClick': (_a = item.action) !== null && _a !== void 0 ? _a : (() => {
                openTab(item.id);
            }), 'data-qa-id': `ToolBoxAction-${item.icon}` }, item));
    })
        .reduce((acc, item) => {
        const group = item.type ? item.type : '';
        const section = acc.find((section) => section.id === group);
        if (section) {
            section.items.push(item);
            return acc;
        }
        const newSection = { id: group, key: item.key, title: group === 'apps' ? t('Apps') : '', items: [item] };
        acc.push(newSection);
        return acc;
    }, []);
    const renderDefaultToolboxItem = (0, fuselage_hooks_1.useEffectEvent)(({ id, className, index, icon, title, toolbox: { tab }, action, disabled, tooltip }) => {
        return ((0, jsx_runtime_1.jsx)(Header_1.HeaderToolbarAction, { className: className, index: index, id: id, icon: icon, title: t(title), pressed: id === (tab === null || tab === void 0 ? void 0 : tab.id), action: action, disabled: disabled, tooltip: tooltip }, id));
    });
    const mapToToolboxItem = (action, index) => {
        var _a, _b, _c;
        return (_b = ((_a = action.renderToolboxItem) !== null && _a !== void 0 ? _a : renderDefaultToolboxItem)) === null || _b === void 0 ? void 0 : _b(Object.assign(Object.assign({}, action), { action: (_c = action.action) !== null && _c !== void 0 ? _c : (() => toolbox.openTab(action.id)), className,
            index,
            toolbox }));
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [featuredActions.map(mapToToolboxItem), featuredActions.length > 0 && (0, jsx_runtime_1.jsx)(Header_1.HeaderToolbarDivider, {}), visibleActions.map(mapToToolboxItem), (normalActions.length > 6 || !roomToolboxExpanded) && !!hiddenActions.length && ((0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { title: t('Options'), "data-qa-id": 'ToolBox-Menu', sections: hiddenActions, placement: 'bottom-end' }))] }));
};
exports.default = (0, react_1.memo)(RoomToolbox);
