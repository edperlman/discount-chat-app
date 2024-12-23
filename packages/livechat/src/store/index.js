"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = exports.Consumer = exports.Provider = exports.StoreContext = exports.store = exports.initialState = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const preact_1 = require("preact");
const hooks_1 = require("preact/hooks");
const parentCall_1 = require("../lib/parentCall");
const random_1 = require("../lib/random");
const Store_1 = __importDefault(require("./Store"));
const initialState = () => ({
    token: (0, random_1.createToken)(),
    typing: [],
    config: {
        messages: {},
        settings: {},
        theme: {
            position: 'right',
        },
        triggers: [],
        departments: [],
        resources: {},
    },
    messages: [],
    user: undefined,
    sound: {
        src: '',
        enabled: true,
        play: false,
    },
    iframe: {
        guest: {},
        theme: {
            hideGuestAvatar: true,
            hideAgentAvatar: false,
        },
        visible: true,
    },
    gdpr: {
        accepted: false,
    },
    alerts: [],
    visible: true,
    minimized: true,
    unread: null,
    incomingCallAlert: null,
    ongoingCall: null, // TODO: store call info like url, startTime, timeout, etc here
    businessUnit: null,
    renderedTriggers: [],
});
exports.initialState = initialState;
const dontPersist = [
    'messages',
    'typing',
    'loading',
    'alerts',
    'unread',
    'noMoreMessages',
    'modal',
    'incomingCallAlert',
    'ongoingCall',
    'parentUrl',
];
exports.store = new Store_1.default((0, exports.initialState)(), { dontPersist });
const { sessionStorage } = window;
window.addEventListener('load', () => {
    const sessionId = (0, random_1.createToken)();
    sessionStorage.setItem('sessionId', sessionId);
    const { openSessionIds = [] } = exports.store.state;
    exports.store.setState({ openSessionIds: [sessionId, ...openSessionIds] });
});
window.addEventListener('visibilitychange', () => {
    !exports.store.state.minimized && !exports.store.state.triggered && (0, parentCall_1.parentCall)('openWidget');
    exports.store.state.iframe.visible ? (0, parentCall_1.parentCall)('showWidget') : (0, parentCall_1.parentCall)('hideWidget');
});
window.addEventListener('beforeunload', () => {
    const sessionId = sessionStorage.getItem('sessionId');
    const { openSessionIds = [] } = exports.store.state;
    exports.store.setState({ openSessionIds: openSessionIds.filter((session) => session !== sessionId) });
});
if (process.env.NODE_ENV === 'development') {
    exports.store.on('change', ([, , partialState]) => {
        console.log('%cstore.setState %c%o', 'color: blue', 'color: initial', partialState);
    });
}
exports.StoreContext = (0, preact_1.createContext)(Object.assign(Object.assign({}, exports.store.state), { dispatch: exports.store.setState.bind(exports.store), on: exports.store.on.bind(exports.store), off: exports.store.off.bind(exports.store) }));
class Provider extends preact_1.Component {
    constructor() {
        super(...arguments);
        this.state = Object.assign(Object.assign({}, exports.store.state), { dispatch: exports.store.setState.bind(exports.store), on: exports.store.on.bind(exports.store), off: exports.store.off.bind(exports.store) });
        this.handleStoreChange = () => {
            this.setState(Object.assign({}, exports.store.state));
        };
        this.render = ({ children }) => {
            return (0, jsx_runtime_1.jsx)(exports.StoreContext.Provider, { value: this.state, children: children });
        };
    }
    componentDidMount() {
        exports.store.on('change', this.handleStoreChange);
    }
    componentWillUnmount() {
        exports.store.off('change', this.handleStoreChange);
    }
}
exports.Provider = Provider;
Provider.displayName = 'StoreProvider';
exports.Consumer = exports.StoreContext.Consumer;
exports.default = exports.store;
const useStore = () => {
    const store = (0, hooks_1.useContext)(exports.StoreContext);
    return store;
};
exports.useStore = useStore;
