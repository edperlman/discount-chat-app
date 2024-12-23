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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const useIsEnterprise_1 = require("../../../hooks/useIsEnterprise");
const CustomHomePageContent_1 = __importDefault(require("../CustomHomePageContent"));
const CustomContentCard = (props) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const router = (0, ui_contexts_1.useRouter)();
    const { data } = (0, useIsEnterprise_1.useIsEnterprise)();
    const isAdmin = (0, ui_contexts_1.useRole)('admin');
    const customContentBody = (0, ui_contexts_1.useSetting)('Layout_Home_Body', '');
    const isCustomContentBodyEmpty = customContentBody === '';
    const isCustomContentVisible = (0, ui_contexts_1.useSetting)('Layout_Home_Custom_Block_Visible', false);
    const isCustomContentOnly = (0, ui_contexts_1.useSetting)('Layout_Custom_Body_Only', false);
    const setCustomContentVisible = (0, ui_contexts_1.useSettingSetValue)('Layout_Home_Custom_Block_Visible');
    const setCustomContentOnly = (0, ui_contexts_1.useSettingSetValue)('Layout_Custom_Body_Only');
    const handleChangeCustomContentVisibility = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield setCustomContentVisible(!isCustomContentVisible);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    const handleOnlyShowCustomContent = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield setCustomContentOnly(!isCustomContentOnly);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    const isEnterprise = data === null || data === void 0 ? void 0 : data.isEnterprise;
    const willNotShowCustomContent = isCustomContentBodyEmpty || !isCustomContentVisible;
    const userVisibilityTooltipText = isCustomContentVisible ? t('Now_Its_Visible_For_Everyone') : t('Now_Its_Visible_Only_For_Admins');
    let customContentOnlyTooltipText = t('It_Will_Hide_All_Other_Content_Blocks_In_The_Homepage');
    if (willNotShowCustomContent) {
        customContentOnlyTooltipText = t('Action_Available_After_Custom_Content_Added_And_Visible');
    }
    else if (isCustomContentOnly) {
        customContentOnlyTooltipText = t('It_Will_Show_All_Other_Content_Blocks_In_The_Homepage');
    }
    if (isAdmin) {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Card, Object.assign({ "data-qa-id": 'homepage-custom-card' }, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Tag, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { mie: 4, name: willNotShowCustomContent ? 'eye-off' : 'eye', size: 'x12' }), willNotShowCustomContent ? t('Not_Visible_To_Workspace') : t('Visible_To_Workspace')] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.CardBody, { children: isCustomContentBodyEmpty ? t('Homepage_Custom_Content_Default_Message') : (0, jsx_runtime_1.jsx)(CustomHomePageContent_1.default, {}) }), (0, jsx_runtime_1.jsxs)(fuselage_1.CardControls, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { medium: true, onClick: () => router.navigate('/admin/settings/Layout'), title: t('Layout_Home_Page_Content'), children: t('Customize_Content') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: willNotShowCustomContent ? 'eye' : 'eye-off', disabled: isCustomContentBodyEmpty || (isCustomContentVisible && isCustomContentOnly), title: isCustomContentBodyEmpty ? t('Action_Available_After_Custom_Content_Added') : userVisibilityTooltipText, onClick: handleChangeCustomContentVisibility, medium: true, children: willNotShowCustomContent ? t('Show_To_Workspace') : t('Hide_On_Workspace') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'lightning', disabled: willNotShowCustomContent || !isEnterprise, title: !isEnterprise ? t('Premium_only') : customContentOnlyTooltipText, onClick: handleOnlyShowCustomContent, medium: true, children: !isCustomContentOnly ? t('Show_Only_This_Content') : t('Show_default_content') })] })] })));
    }
    if (!willNotShowCustomContent && !isCustomContentOnly) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Card, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 8, children: (0, jsx_runtime_1.jsx)(CustomHomePageContent_1.default, { role: 'status', "aria-label": customContentBody }) }) }));
    }
    return (0, jsx_runtime_1.jsx)(CustomHomePageContent_1.default, { role: 'status', "aria-label": customContentBody });
};
exports.default = CustomContentCard;
