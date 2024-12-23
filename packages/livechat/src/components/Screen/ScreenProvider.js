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
exports.ScreenProvider = exports.ScreenContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const preact_1 = require("preact");
const hooks_1 = require("preact/hooks");
const query_string_1 = require("query-string");
const isActiveSession_1 = require("../../helpers/isActiveSession");
const main_1 = require("../../lib/main");
const parentCall_1 = require("../../lib/parentCall");
const room_1 = require("../../lib/room");
const triggers_1 = __importDefault(require("../../lib/triggers"));
const store_1 = require("../../store");
exports.ScreenContext = (0, preact_1.createContext)({
    theme: {
        color: '',
        fontColor: '',
        iconColor: '',
        hideAgentAvatar: false,
        hideGuestAvatar: true,
    },
    notificationsEnabled: true,
    minimized: true,
    windowed: false,
    onEnableNotifications: () => undefined,
    onDisableNotifications: () => undefined,
    onMinimize: () => undefined,
    onRestore: () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }),
    onOpenWindow: () => undefined,
});
const ScreenProvider = ({ children }) => {
    const _a = (0, hooks_1.useContext)(store_1.StoreContext), { dispatch, config, sound, minimized = true, undocked, expanded = false, alerts, modal, iframe } = _a, store = __rest(_a, ["dispatch", "config", "sound", "minimized", "undocked", "expanded", "alerts", "modal", "iframe"]);
    const { department, name, email } = iframe.guest || {};
    const { color, position: configPosition, background } = config.theme || {};
    const { livechatLogo, hideWatermark = false } = config.settings || {};
    const { color: customColor, fontColor: customFontColor, iconColor: customIconColor, guestBubbleBackgroundColor, agentBubbleBackgroundColor, position: customPosition, background: customBackground, hideAgentAvatar = false, hideGuestAvatar = true, } = iframe.theme || {};
    const [poppedOut, setPopedOut] = (0, hooks_1.useState)(false);
    const position = customPosition || configPosition || 'right';
    (0, hooks_1.useEffect)(() => {
        (0, parentCall_1.parentCall)('setWidgetPosition', position || 'right');
    }, [position]);
    const handleEnableNotifications = () => {
        dispatch({ sound: Object.assign(Object.assign({}, sound), { enabled: true }) });
    };
    const handleDisableNotifications = () => {
        dispatch({ sound: Object.assign(Object.assign({}, sound), { enabled: false }) });
    };
    const handleMinimize = () => {
        (0, parentCall_1.parentCall)('minimizeWindow');
        dispatch({ minimized: true });
    };
    const handleRestore = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        (0, parentCall_1.parentCall)('restoreWindow');
        if (undocked) {
            // Cross-tab communication will not work here due cross origin (usually the widget parent and the RC server will have different urls)
            // So we manually update the widget to get the messages and actions done while undocked
            yield (0, main_1.loadConfig)();
            yield (0, room_1.loadMessages)();
        }
        dispatch({ minimized: false, undocked: false });
        (_a = triggers_1.default.callbacks) === null || _a === void 0 ? void 0 : _a.emit('chat-opened-by-visitor');
    });
    const handleOpenWindow = () => {
        (0, parentCall_1.parentCall)('openPopout', store.token);
        dispatch({ undocked: true, minimized: false });
    };
    const handleDismissAlert = (id) => {
        dispatch({ alerts: alerts.filter((alert) => alert.id !== id) });
    };
    const dismissNotification = () => !(0, isActiveSession_1.isActiveSession)();
    const checkPoppedOutWindow = (0, hooks_1.useCallback)(() => {
        // Checking if the window is poppedOut and setting parent minimized if yes for the restore purpose
        const poppedOut = (0, query_string_1.parse)(window.location.search).mode === 'popout';
        setPopedOut(poppedOut);
        if (poppedOut) {
            dispatch({ minimized: false, undocked: true });
        }
    }, [dispatch]);
    (0, hooks_1.useEffect)(() => {
        checkPoppedOutWindow();
    }, [checkPoppedOutWindow]);
    const screenProps = {
        theme: {
            color: customColor || color,
            fontColor: customFontColor,
            iconColor: customIconColor,
            position,
            guestBubbleBackgroundColor,
            agentBubbleBackgroundColor,
            background: customBackground || background,
            hideAgentAvatar,
            hideGuestAvatar,
        },
        notificationsEnabled: sound === null || sound === void 0 ? void 0 : sound.enabled,
        minimized: !poppedOut && (minimized || undocked),
        expanded: !minimized && expanded,
        windowed: poppedOut,
        livechatLogo,
        hideWatermark,
        sound,
        alerts,
        modal,
        nameDefault: name,
        emailDefault: email,
        departmentDefault: department,
        onEnableNotifications: handleEnableNotifications,
        onDisableNotifications: handleDisableNotifications,
        onMinimize: handleMinimize,
        onRestore: handleRestore,
        onOpenWindow: handleOpenWindow,
        onDismissAlert: handleDismissAlert,
        dismissNotification,
    };
    return (0, jsx_runtime_1.jsx)(exports.ScreenContext.Provider, { value: screenProps, children: children });
};
exports.ScreenProvider = ScreenProvider;
