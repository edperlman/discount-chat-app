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
const focus_1 = require("@react-aria/focus");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_aria_1 = require("react-aria");
const react_hook_form_1 = require("react-hook-form");
const tinykeys_1 = __importDefault(require("tinykeys"));
const SearchList_1 = __importDefault(require("./SearchList"));
const CreateRoom_1 = __importDefault(require("./actions/CreateRoom"));
const Sort_1 = __importDefault(require("./actions/Sort"));
const wrapperStyle = (0, css_in_js_1.css) `
	position: absolute;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	z-index: 99;
	top: 0;
	left: 0;
	background-color: ${fuselage_1.Palette.surface['surface-sidebar']};
`;
const mobileCheck = function () {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera || '');
    return check;
};
const shortcut = (() => {
    var _a;
    if (((_a = navigator.userAgentData) === null || _a === void 0 ? void 0 : _a.mobile) || mobileCheck()) {
        return '';
    }
    if (window.navigator.platform.toLowerCase().includes('mac')) {
        return '(\u2318+K)';
    }
    return '(Ctrl+K)';
})();
const isRecentButton = (node) => node.title === 'Recent';
const SearchSection = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const focusManager = (0, focus_1.useFocusManager)();
    const user = (0, ui_contexts_1.useUser)();
    const [recentButtonPressed, setRecentButtonPressed] = (0, react_1.useState)(false);
    const { formState: { isDirty }, register, watch, resetField, setFocus, } = (0, react_hook_form_1.useForm)({ defaultValues: { filterText: '' } });
    const { filterText } = watch();
    const _a = register('filterText'), { ref: filterRef } = _a, rest = __rest(_a, ["ref"]);
    const showRecentList = Boolean(recentButtonPressed && !filterText);
    const inputRef = (0, react_1.useRef)(null);
    const wrapperRef = (0, react_1.useRef)(null);
    const mergedRefs = (0, fuselage_hooks_1.useMergedRefs)(filterRef, inputRef);
    const handleEscSearch = (0, react_1.useCallback)(() => {
        var _a;
        resetField('filterText');
        setRecentButtonPressed(false);
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
    }, [resetField]);
    (0, fuselage_hooks_1.useOutsideClick)([wrapperRef], handleEscSearch);
    (0, react_1.useEffect)(() => {
        const unsubscribe = (0, tinykeys_1.default)(window, {
            '$mod+K': (event) => {
                event.preventDefault();
                setFocus('filterText');
            },
            '$mod+P': (event) => {
                event.preventDefault();
                setFocus('filterText');
            },
            'Shift+$mod+K': (event) => {
                event.preventDefault();
                setRecentButtonPressed(true);
                focusManager.focusNext({ accept: (node) => isRecentButton(node) });
            },
            'Escape': (event) => {
                event.preventDefault();
                handleEscSearch();
            },
        });
        return () => {
            unsubscribe();
        };
    }, [focusManager, handleEscSearch, setFocus]);
    const placeholder = [t('Search'), shortcut].filter(Boolean).join(' ');
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { className: ['rcx-sidebar', (isDirty || showRecentList) && wrapperStyle], ref: wrapperRef, role: 'search', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.SidebarV2Section, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ placeholder: placeholder }, rest, { ref: mergedRefs, role: 'searchbox', small: true, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: isDirty ? 'cross' : 'magnifier', size: 'x20', onClick: handleEscSearch }) })), user && !isDirty && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { small: true, icon: 'clock', title: t('Recent'), onClick: () => setRecentButtonPressed(!recentButtonPressed), pressed: recentButtonPressed }), recentButtonPressed ? (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'sort', disabled: true, small: true }) : (0, jsx_runtime_1.jsx)(Sort_1.default, {}), (0, jsx_runtime_1.jsx)(CreateRoom_1.default, {})] }))] }), (isDirty || recentButtonPressed) && ((0, jsx_runtime_1.jsx)(react_aria_1.FocusScope, { children: (0, jsx_runtime_1.jsx)(SearchList_1.default, { filterText: filterText, onEscSearch: handleEscSearch, showRecentList: showRecentList }) }))] }));
};
exports.default = SearchSection;
