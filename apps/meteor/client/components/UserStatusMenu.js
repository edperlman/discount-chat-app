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
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const UserStatus_1 = require("./UserStatus");
const UserStatusMenu = ({ margin, onChange, initialStatus = core_typings_1.UserStatus.OFFLINE, optionWidth = undefined, placement = 'bottom-end', }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [status, setStatus] = (0, react_1.useState)(initialStatus);
    const allowInvisibleStatus = (0, ui_contexts_1.useSetting)('Accounts_AllowInvisibleStatusOption', true);
    const options = (0, react_1.useMemo)(() => {
        const renderOption = (status, label) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { marginInlineEnd: 8, children: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { status: status }) }), label] }));
        const statuses = [
            [core_typings_1.UserStatus.ONLINE, renderOption(core_typings_1.UserStatus.ONLINE, t('Online'))],
            [core_typings_1.UserStatus.AWAY, renderOption(core_typings_1.UserStatus.AWAY, t('Away'))],
            [core_typings_1.UserStatus.BUSY, renderOption(core_typings_1.UserStatus.BUSY, t('Busy'))],
        ];
        if (allowInvisibleStatus) {
            statuses.push([core_typings_1.UserStatus.OFFLINE, renderOption(core_typings_1.UserStatus.OFFLINE, t('Offline'))]);
        }
        return statuses;
    }, [t, allowInvisibleStatus]);
    const [cursor, handleKeyDown, handleKeyUp, reset, [visible, hide, show]] = (0, fuselage_1.useCursor)(-1, options, ([selected], [, hide]) => {
        setStatus(selected);
        reset();
        hide();
    });
    const ref = (0, react_1.useRef)(null);
    const onClick = (0, react_1.useCallback)(() => {
        if (!(ref === null || ref === void 0 ? void 0 : ref.current)) {
            return;
        }
        ref.current.focus();
        show();
        ref.current.classList.add('focus-visible');
    }, [show]);
    const handleSelection = (0, react_1.useCallback)(([selected]) => {
        setStatus(selected);
        reset();
        hide();
    }, [hide, reset]);
    (0, react_1.useEffect)(() => onChange(status), [status, onChange]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { ref: ref, small: true, square: true, secondary: true, onClick: onClick, onBlur: hide, onKeyUp: handleKeyUp, onKeyDown: handleKeyDown, margin: margin, "aria-label": t('User_status_menu'), children: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { status: status }) }), (0, jsx_runtime_1.jsx)(fuselage_1.PositionAnimated, { width: 'auto', visible: visible, anchor: ref, placement: placement, children: (0, jsx_runtime_1.jsx)(fuselage_1.Options, { width: optionWidth, onSelect: handleSelection, options: options, cursor: cursor }) })] }));
};
exports.default = UserStatusMenu;
