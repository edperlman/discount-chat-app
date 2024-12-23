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
const i18next_1 = __importDefault(require("i18next"));
const api_1 = require("../api");
const store_1 = require("../store");
const customFields_1 = __importDefault(require("./customFields"));
const main_1 = require("./main");
const parentCall_1 = require("./parentCall");
const random_1 = require("./random");
const room_1 = require("./room");
const triggers_1 = __importDefault(require("./triggers"));
const evaluateChangesAndLoadConfigByFields = (fn) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const oldStore = JSON.parse(JSON.stringify({
        user: store_1.store.state.user || {},
        token: store_1.store.state.token,
    }));
    yield fn();
    /**
     * it solves the issues where the registerGuest is called every time the widget is opened
     * and the guest is already registered. If there is nothing different in the data,
     * it will not call the loadConfig again.
     *
     * if user changes, it will call loadConfig
     * if department changes, it will call loadConfig
     * if token changes, it will call loadConfig
     */
    if (oldStore.user._id !== ((_a = store_1.store.state.user) === null || _a === void 0 ? void 0 : _a._id)) {
        yield (0, main_1.loadConfig)();
        yield (0, room_1.loadMessages)();
        return;
    }
    if (oldStore.token !== store_1.store.state.token) {
        yield (0, main_1.loadConfig)();
        yield (0, room_1.loadMessages)();
    }
});
const createOrUpdateGuest = (guest) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!guest) {
        return;
    }
    const { token } = guest;
    token && (yield store_1.store.setState({ token }));
    const { iframe: { defaultDepartment }, } = store_1.store.state;
    if (defaultDepartment && !guest.department) {
        guest.department = defaultDepartment;
    }
    const { visitor: user } = yield api_1.Livechat.grantVisitor({ visitor: Object.assign({}, guest) });
    if (!user) {
        return;
    }
    store_1.store.setState({ user });
    (_a = triggers_1.default.callbacks) === null || _a === void 0 ? void 0 : _a.emit('chat-visitor-registered');
});
const updateIframeGuestData = (data) => {
    const { iframe, iframe: { guest }, user, token, } = store_1.store.state;
    const iframeGuest = Object.assign(Object.assign({}, guest), data);
    store_1.store.setState({ iframe: Object.assign(Object.assign({}, iframe), { guest: iframeGuest || {} }) });
    if (!user) {
        return;
    }
    const guestData = Object.assign({ token }, data);
    createOrUpdateGuest(guestData);
};
const updateIframeData = (data) => {
    const { iframe } = store_1.store.state;
    if (data.guest) {
        throw new Error('Guest data changes not allowed. Use updateIframeGuestData instead.');
    }
    const iframeData = Object.assign(Object.assign({}, iframe), data);
    store_1.store.setState({ iframe: Object.assign({}, iframeData) });
};
const api = {
    pageVisited(info) {
        const { token, room } = store_1.store.state;
        const { _id: rid } = room || {};
        const { change, title, location: { href }, } = info;
        api_1.Livechat.sendVisitorNavigation({ token, rid, pageInfo: { change, title, location: { href } } });
    },
    setCustomField: (key, value = '', overwrite = true) => {
        customFields_1.default.setCustomField(key, value, overwrite);
    },
    setTheme: (theme) => {
        const { iframe, iframe: { theme: currentTheme }, } = store_1.store.state;
        store_1.store.setState({
            iframe: Object.assign(Object.assign({}, iframe), { theme: Object.assign(Object.assign({}, currentTheme), theme) }),
        });
    },
    setDepartment: (value) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { config: { departments = [] }, defaultAgent, } = store_1.store.state;
        const department = ((_a = departments.find((dep) => dep._id === value || dep.name === value)) === null || _a === void 0 ? void 0 : _a._id) || '';
        if (!department) {
            console.warn('The selected department is invalid. Check departments configuration to ensure the department exists, is enabled and has at least 1 agent');
        }
        updateIframeData({ defaultDepartment: department });
        if (defaultAgent && defaultAgent.department !== department) {
            store_1.store.setState({ defaultAgent: undefined });
        }
    }),
    setBusinessUnit: (newBusinessUnit) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(newBusinessUnit === null || newBusinessUnit === void 0 ? void 0 : newBusinessUnit.trim().length)) {
            throw new Error('Error! Invalid business ids');
        }
        const { businessUnit: existingBusinessUnit } = store_1.store.state;
        return existingBusinessUnit !== newBusinessUnit && (0, main_1.updateBusinessUnit)(newBusinessUnit);
    }),
    clearBusinessUnit: () => __awaiter(void 0, void 0, void 0, function* () {
        const { businessUnit } = store_1.store.state;
        return businessUnit && (0, main_1.updateBusinessUnit)();
    }),
    clearDepartment: () => {
        updateIframeGuestData({ department: '' });
    },
    clearWidgetData: () => __awaiter(void 0, void 0, void 0, function* () {
        const _a = (0, store_1.initialState)(), { minimized, visible, undocked, expanded, businessUnit } = _a, initial = __rest(_a, ["minimized", "visible", "undocked", "expanded", "businessUnit"]);
        yield store_1.store.setState(initial);
    }),
    setAgent: (agent) => {
        if (!agent) {
            return;
        }
        const { _id, username } = agent, props = __rest(agent, ["_id", "username"]);
        if (!_id || !username) {
            return console.warn('The fields _id and username are mandatory.');
        }
        store_1.store.setState({
            defaultAgent: Object.assign(Object.assign({}, props), { _id,
                username, ts: Date.now() }),
        });
    },
    setExpanded: (expanded) => {
        store_1.store.setState({ expanded });
    },
    setGuestToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const { token: localToken } = store_1.store.state;
        if (token === localToken) {
            return;
        }
        yield evaluateChangesAndLoadConfigByFields(() => __awaiter(void 0, void 0, void 0, function* () {
            yield createOrUpdateGuest({ token });
        }));
    }),
    setGuestName: (name) => {
        updateIframeGuestData({ name });
    },
    setGuestEmail: (email) => {
        updateIframeGuestData({ email });
    },
    registerGuest: (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (typeof data !== 'object') {
            return;
        }
        yield evaluateChangesAndLoadConfigByFields(() => __awaiter(void 0, void 0, void 0, function* () {
            if (!data.token) {
                data.token = (0, random_1.createToken)();
            }
            const { iframe: { defaultDepartment }, } = store_1.store.state;
            if (defaultDepartment && !data.department) {
                data.department = defaultDepartment;
            }
            api_1.Livechat.unsubscribeAll();
            yield createOrUpdateGuest(data);
        }));
    }),
    transferChat: (department) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { config: { departments = [] }, room, } = store_1.store.state;
        const dep = ((_a = departments.find((dep) => dep._id === department || dep.name === department)) === null || _a === void 0 ? void 0 : _a._id) || '';
        if (!dep) {
            throw new Error('The selected department is invalid. Check departments configuration to ensure the department exists, is enabled and has at least 1 agent');
        }
        if (!room) {
            throw new Error("Conversation has not been started yet, can't transfer");
        }
        const { _id: rid } = room;
        yield api_1.Livechat.transferChat({ rid, department: dep });
    }),
    setLanguage: (language) => __awaiter(void 0, void 0, void 0, function* () {
        const { iframe } = store_1.store.state;
        yield store_1.store.setState({ iframe: Object.assign(Object.assign({}, iframe), { language }) });
        i18next_1.default.changeLanguage(language);
    }),
    showWidget: () => {
        const { iframe } = store_1.store.state;
        store_1.store.setState({ iframe: Object.assign(Object.assign({}, iframe), { visible: true }) });
        (0, parentCall_1.parentCall)('showWidget');
    },
    hideWidget: () => {
        const { iframe } = store_1.store.state;
        store_1.store.setState({ iframe: Object.assign(Object.assign({}, iframe), { visible: false }) });
        (0, parentCall_1.parentCall)('hideWidget');
    },
    minimizeWidget: () => {
        store_1.store.setState({ minimized: true });
        (0, parentCall_1.parentCall)('closeWidget');
    },
    maximizeWidget: () => {
        store_1.store.setState({ minimized: false });
        (0, parentCall_1.parentCall)('openWidget');
    },
    setParentUrl: (parentUrl) => {
        store_1.store.setState({ parentUrl });
    },
    setGuestMetadata(metadata) {
        const { iframe } = store_1.store.state;
        store_1.store.setState({ iframe: Object.assign(Object.assign({}, iframe), { guestMetadata: metadata }) });
    },
    setHiddenSystemMessages: (hiddenSystemMessages) => {
        const { iframe } = store_1.store.state;
        store_1.store.setState({ iframe: Object.assign(Object.assign({}, iframe), { hiddenSystemMessages }) });
    },
};
function onNewMessageHandler(event) {
    if (event.source === event.target) {
        return;
    }
    if (!event.data || typeof event.data !== 'object') {
        return;
    }
    if (!event.data.src || event.data.src !== 'rocketchat') {
        return;
    }
    const { fn, args } = event.data;
    if (!api.hasOwnProperty(fn)) {
        return;
    }
    // There is an existing issue with overload resolution with type union arguments please see https://github.com/microsoft/TypeScript/issues/14107
    // @ts-expect-error: A spread argument must either have a tuple type or be passed to a rest parameter
    api[fn](...args);
}
class Hooks {
    constructor() {
        if (instance) {
            throw new Error('Hooks already has an instance.');
        }
        this._started = false;
    }
    init() {
        if (this._started) {
            return;
        }
        this._started = true;
        window.addEventListener('message', onNewMessageHandler, false);
    }
    reset() {
        this._started = false;
        window.removeEventListener('message', onNewMessageHandler, false);
    }
}
const instance = new Hooks();
exports.default = instance;
