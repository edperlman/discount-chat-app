"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Header_1 = require("../../../../components/Header");
const BackButton = ({ routeName }) => {
    const router = (0, ui_contexts_1.useRouter)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const back = (0, fuselage_hooks_1.useMutableCallback)(() => {
        switch (routeName) {
            case 'omnichannel-directory':
                router.navigate({
                    name: 'omnichannel-directory',
                    params: Object.assign(Object.assign({}, router.getRouteParameters()), { bar: 'info' }),
                });
                break;
            case 'omnichannel-current-chats':
                router.navigate({ name: 'omnichannel-current-chats' });
                break;
        }
    });
    return (0, jsx_runtime_1.jsx)(Header_1.HeaderToolbarAction, { title: t('Back'), icon: 'back', onClick: back });
};
exports.default = BackButton;
