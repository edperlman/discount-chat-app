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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const i18next_1 = __importDefault(require("i18next"));
const preact_1 = require("preact");
const preact_router_1 = __importStar(require("preact-router"));
const react_i18next_1 = require("react-i18next");
const cookies_1 = require("../../helpers/cookies");
const isRTL_1 = require("../../helpers/isRTL");
const visibility_1 = require("../../helpers/visibility");
const history_1 = __importDefault(require("../../history"));
const connection_1 = __importDefault(require("../../lib/connection"));
const customFields_1 = __importDefault(require("../../lib/customFields"));
const hooks_1 = __importDefault(require("../../lib/hooks"));
const parentCall_1 = require("../../lib/parentCall");
const triggers_1 = __importDefault(require("../../lib/triggers"));
const userPresence_1 = __importDefault(require("../../lib/userPresence"));
const Chat_1 = require("../../routes/Chat");
const ChatFinished_1 = __importDefault(require("../../routes/ChatFinished"));
const GDPRAgreement_1 = __importDefault(require("../../routes/GDPRAgreement"));
const LeaveMessage_1 = __importDefault(require("../../routes/LeaveMessage"));
const Register_1 = __importDefault(require("../../routes/Register"));
const SwitchDepartment_1 = __importDefault(require("../../routes/SwitchDepartment"));
const TriggerMessage_1 = __importDefault(require("../../routes/TriggerMessage"));
const ScreenProvider_1 = require("../Screen/ScreenProvider");
class App extends preact_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            initialized: false,
            poppedOut: false,
        };
        this.handleRoute = (_a) => __awaiter(this, [_a], void 0, function* ({ url }) {
            setTimeout(() => {
                const { config: { settings: { registrationForm, nameFieldRegistrationForm, emailFieldRegistrationForm, forceAcceptDataProcessingConsent: gdprRequired, }, online, departments, }, gdpr: { accepted: gdprAccepted }, user, } = this.props;
                (0, cookies_1.setInitCookies)();
                if (gdprRequired && !gdprAccepted) {
                    return (0, preact_router_1.route)('/gdpr');
                }
                if (!online) {
                    (0, parentCall_1.parentCall)('callback', 'no-agent-online');
                    return (0, preact_router_1.route)('/leave-message');
                }
                const showDepartment = departments.some((dept) => dept.showOnRegistration);
                const isAnyFieldVisible = nameFieldRegistrationForm || emailFieldRegistrationForm || showDepartment;
                const showRegistrationForm = !(user === null || user === void 0 ? void 0 : user.token) && registrationForm && isAnyFieldVisible && !triggers_1.default.hasTriggersBeforeRegistration();
                if (url === '/' && showRegistrationForm) {
                    return (0, preact_router_1.route)('/register');
                }
            }, 100);
        });
        this.handleVisibilityChange = () => __awaiter(this, void 0, void 0, function* () {
            const { dispatch } = this.props;
            dispatch({ visible: !visibility_1.visibility.hidden });
        });
        this.handleLanguageChange = () => {
            this.forceUpdate();
        };
        this.render = (_, { initialized }) => {
            if (!initialized) {
                return null;
            }
            return ((0, jsx_runtime_1.jsx)(ScreenProvider_1.ScreenProvider, { children: (0, jsx_runtime_1.jsxs)(preact_router_1.default, { history: history_1.default, onChange: this.handleRoute, children: [(0, jsx_runtime_1.jsx)(Chat_1.ChatConnector, { path: '/', default: true }), (0, jsx_runtime_1.jsx)(ChatFinished_1.default, { path: '/chat-finished' }), (0, jsx_runtime_1.jsx)(GDPRAgreement_1.default, { path: '/gdpr' }), (0, jsx_runtime_1.jsx)(LeaveMessage_1.default, { path: '/leave-message' }), (0, jsx_runtime_1.jsx)(Register_1.default, { path: '/register' }), (0, jsx_runtime_1.jsx)(SwitchDepartment_1.default, { path: '/switch-department' }), (0, jsx_runtime_1.jsx)(TriggerMessage_1.default, { path: '/trigger-messages' })] }) }));
        };
    }
    handleTriggers() {
        const { config: { online, enabled }, } = this.props;
        if (online && enabled) {
            triggers_1.default.init();
        }
        triggers_1.default.processTriggers();
    }
    initWidget() {
        const { minimized, iframe: { visible }, config: { theme }, dispatch, } = this.props;
        (0, parentCall_1.parentCall)(minimized ? 'minimizeWindow' : 'restoreWindow');
        (0, parentCall_1.parentCall)(visible ? 'showWidget' : 'hideWidget');
        (0, parentCall_1.parentCall)('setWidgetPosition', theme.position || 'right');
        visibility_1.visibility.addListener(this.handleVisibilityChange);
        this.handleVisibilityChange();
        window.addEventListener('beforeunload', () => {
            visibility_1.visibility.removeListener(this.handleVisibilityChange);
            dispatch({ minimized: true, undocked: false });
        });
        i18next_1.default.on('languageChanged', this.handleLanguageChange);
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: split these behaviors into composable components
            yield connection_1.default.init();
            customFields_1.default.init();
            userPresence_1.default.init();
            hooks_1.default.init();
            this.handleTriggers();
            this.initWidget();
            this.setState({ initialized: true });
            (0, parentCall_1.parentCall)('ready');
        });
    }
    finalize() {
        return __awaiter(this, void 0, void 0, function* () {
            customFields_1.default.reset();
            userPresence_1.default.reset();
            visibility_1.visibility.removeListener(this.handleVisibilityChange);
        });
    }
    componentDidMount() {
        this.initialize();
    }
    componentWillUnmount() {
        this.finalize();
    }
    componentDidUpdate() {
        const { i18n } = this.props;
        if (i18n.t) {
            document.dir = (0, isRTL_1.isRTL)(i18n.t('yes')) ? 'rtl' : 'ltr';
        }
    }
}
exports.App = App;
exports.default = (0, react_i18next_1.withTranslation)()(App);
