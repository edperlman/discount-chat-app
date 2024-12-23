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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AddCustomEmoji_1 = __importDefault(require("./AddCustomEmoji"));
const CustomEmoji_1 = __importDefault(require("./CustomEmoji"));
const EditCustomEmojiWithData_1 = __importDefault(require("./EditCustomEmojiWithData"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const Page_1 = require("../../../components/Page");
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const CustomEmojiRoute = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const route = (0, ui_contexts_1.useRoute)('emoji-custom');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    const canManageEmoji = (0, ui_contexts_1.usePermission)('manage-emoji');
    const handleItemClick = (_id) => () => {
        route.push({
            context: 'edit',
            id: _id,
        });
    };
    const handleAddEmoji = (0, react_1.useCallback)(() => {
        route.push({ context: 'new' });
    }, [route]);
    const handleClose = () => {
        route.push({});
    };
    const reload = (0, react_1.useRef)(() => null);
    const handleChange = (0, react_1.useCallback)(() => {
        reload.current();
    }, [reload]);
    if (!canManageEmoji) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { name: 'admin-emoji-custom', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Emoji'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleAddEmoji, "aria-label": t('New'), children: t('New') }) }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(CustomEmoji_1.default, { reload: reload, onClick: handleItemClick }) })] }), context && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarDialog, { children: (0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarTitle, { children: [context === 'edit' && t('Custom_Emoji_Info'), context === 'new' && t('Custom_Emoji_Add')] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleClose })] }), context === 'edit' && id && (0, jsx_runtime_1.jsx)(EditCustomEmojiWithData_1.default, { _id: id, close: handleClose, onChange: handleChange }), context === 'new' && (0, jsx_runtime_1.jsx)(AddCustomEmoji_1.default, { close: handleClose, onChange: handleChange })] }) }))] }));
};
exports.default = CustomEmojiRoute;
