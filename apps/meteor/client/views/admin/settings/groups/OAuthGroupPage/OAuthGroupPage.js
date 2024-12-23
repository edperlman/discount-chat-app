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
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const CreateOAuthModal_1 = __importDefault(require("./CreateOAuthModal"));
const stringUtils_1 = require("../../../../../../lib/utils/stringUtils");
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const EditableSettingsContext_1 = require("../../../EditableSettingsContext");
const SettingsGroupPage_1 = __importDefault(require("../../SettingsGroupPage"));
const SettingsSection_1 = __importDefault(require("../../SettingsSection"));
function OAuthGroupPage(_a) {
    var { _id, onClickBack } = _a, group = __rest(_a, ["_id", "onClickBack"]);
    const sections = (0, EditableSettingsContext_1.useEditableSettingsGroupSections)(_id);
    const solo = sections.length === 1;
    const t = (0, ui_contexts_1.useTranslation)();
    const [settingSections, setSettingSections] = (0, react_1.useState)(sections);
    const sectionIsCustomOAuth = (sectionName) => sectionName && /^Custom OAuth:\s.+/.test(sectionName);
    const getAbsoluteUrl = (0, ui_contexts_1.useAbsoluteUrl)();
    const callbackURL = (sectionName) => {
        const id = (0, stringUtils_1.strRight)(sectionName, 'Custom OAuth: ').toLowerCase();
        return getAbsoluteUrl(`_oauth/${id}`);
    };
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const refreshOAuthService = (0, ui_contexts_1.useMethod)('refreshOAuthService');
    const addOAuthService = (0, ui_contexts_1.useMethod)('addOAuthService');
    const removeOAuthService = (0, ui_contexts_1.useMethod)('removeOAuthService');
    const setModal = (0, ui_contexts_1.useSetModal)();
    const handleRefreshOAuthServicesButtonClick = () => __awaiter(this, void 0, void 0, function* () {
        dispatchToastMessage({ type: 'info', message: t('Refreshing') });
        try {
            yield refreshOAuthService();
            dispatchToastMessage({ type: 'success', message: t('Done') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    const handleAddCustomOAuthButtonClick = () => {
        const onConfirm = (text) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield addOAuthService(text);
                dispatchToastMessage({ type: 'success', message: t('Custom_OAuth_has_been_added') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(CreateOAuthModal_1.default, { onConfirm: onConfirm, onClose: () => setModal(null) }));
    };
    (0, react_1.useEffect)(() => {
        setSettingSections(sections);
    }, [sections]);
    const removeCustomOauthFactory = (id) => () => {
        const handleConfirm = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield removeOAuthService(id);
                dispatchToastMessage({ type: 'success', message: t('Custom_OAuth_has_been_removed') });
                setSettingSections(settingSections.filter((section) => section !== `Custom OAuth: ${(0, string_helpers_1.capitalize)(id)}`));
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { onClose: () => setModal(null), onCancel: () => setModal(null), title: t('Are_you_sure'), variant: 'danger', confirmText: t('Yes_delete_it'), onConfirm: handleConfirm }));
    };
    return ((0, jsx_runtime_1.jsx)(SettingsGroupPage_1.default, Object.assign({ _id: _id }, group, { onClickBack: onClickBack, headerButtons: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleRefreshOAuthServicesButtonClick, children: t('Refresh_oauth_services') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleAddCustomOAuthButtonClick, children: t('Add_custom_oauth') })] }), children: settingSections.map((sectionName) => {
            if (sectionIsCustomOAuth(sectionName)) {
                const id = (0, stringUtils_1.strRight)(sectionName, 'Custom OAuth: ').toLowerCase();
                const handleRemoveCustomOAuthButtonClick = removeCustomOauthFactory(id);
                return ((0, jsx_runtime_1.jsx)(SettingsSection_1.default, { groupId: _id, help: (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                            __html: t('Custom_oauth_helper', callbackURL(sectionName)),
                        } }), sectionName: sectionName, solo: solo, children: (0, jsx_runtime_1.jsx)("div", { className: 'submit', children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, danger: true, onClick: handleRemoveCustomOAuthButtonClick, children: t('Remove_custom_oauth') }) }) }, sectionName));
            }
            return (0, jsx_runtime_1.jsx)(SettingsSection_1.default, { groupId: _id, sectionName: sectionName, solo: solo }, sectionName);
        }) })));
}
exports.default = (0, react_1.memo)(OAuthGroupPage);
