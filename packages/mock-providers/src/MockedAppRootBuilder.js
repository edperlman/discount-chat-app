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
exports.MockedAppRootBuilder = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const emitter_1 = require("@rocket.chat/emitter");
const languages_1 = __importDefault(require("@rocket.chat/i18n/dist/languages"));
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const i18next_1 = require("i18next");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const shim_1 = require("use-sync-external-store/shim");
const MockedDeviceContext_1 = require("./MockedDeviceContext");
class MockedAppRootBuilder {
    constructor() {
        this.wrappers = [];
        this.connectionStatus = {
            connected: true,
            status: 'connected',
            retryTime: undefined,
            reconnect: () => undefined,
        };
        this.server = {
            absoluteUrl: (path) => `http://localhost:3000/${path}`,
            callEndpoint: ({ method, pathPattern, }) => {
                throw new Error(`not implemented (method: ${method}, pathPattern: ${pathPattern})`);
            },
            getStream: () => () => () => undefined,
            uploadToEndpoint: () => Promise.reject(new Error('not implemented')),
            callMethod: () => Promise.reject(new Error('not implemented')),
            info: undefined,
        };
        this.router = {
            buildRoutePath: () => '/',
            defineRoutes: () => () => undefined,
            getLocationPathname: () => '/',
            getLocationSearch: () => '',
            getRouteName: () => undefined,
            getRouteParameters: () => ({}),
            getRoutes: () => [],
            getSearchParameters: () => ({}),
            navigate: () => undefined,
            subscribeToRouteChange: () => () => undefined,
            subscribeToRoutesChange: () => () => undefined,
            getRoomRoute: () => ({ path: '/' }),
        };
        this.settings = {
            hasPrivateAccess: true,
            isLoading: false,
            querySetting: (_id) => [() => () => undefined, () => undefined],
            querySettings: () => [() => () => undefined, () => []],
            dispatch: () => __awaiter(this, void 0, void 0, function* () { return undefined; }),
        };
        this.user = {
            logout: () => Promise.reject(new Error('not implemented')),
            queryPreference: () => [() => () => undefined, () => undefined],
            queryRoom: () => [() => () => undefined, () => undefined],
            querySubscription: () => [() => () => undefined, () => undefined],
            querySubscriptions: () => [() => () => undefined, () => this.subscriptions], // apply query and option
            user: null,
            userId: null,
        };
        this.subscriptions = [];
        this.modal = {
            currentModal: { component: null },
            modal: {
                setModal: (modal) => {
                    this.modal = Object.assign(Object.assign({}, this.modal), { currentModal: { component: modal } });
                    this.events.emit('update-modal');
                },
            },
        };
        this.authorization = {
            queryPermission: () => [() => () => undefined, () => false],
            queryAtLeastOnePermission: () => [() => () => undefined, () => false],
            queryAllPermissions: () => [() => () => undefined, () => false],
            queryRole: () => [() => () => undefined, () => false],
            roleStore: {
                roles: {},
                emit: () => undefined,
                on: () => () => undefined,
                off: () => undefined,
                events: () => ['change'],
                has: () => false,
                once: () => () => undefined,
            },
        };
        this.events = new emitter_1.Emitter();
        this.audioInputDevices = [];
        this.audioOutputDevices = [];
        this.i18n = (0, i18next_1.createInstance)({
            // debug: true,
            lng: 'en',
            fallbackLng: 'en',
            ns: ['core'],
            nsSeparator: '.',
            partialBundledLanguages: true,
            defaultNS: 'core',
            interpolation: {
                escapeValue: false,
            },
            initImmediate: false,
        }).use(react_i18next_1.initReactI18next);
    }
    wrap(wrapper) {
        this.wrappers.push(wrapper);
        return this;
    }
    withEndpoint(method, pathPattern, response) {
        const innerFn = this.server.callEndpoint;
        const outerFn = (args) => {
            if (args.method === String(method) && args.pathPattern === String(pathPattern)) {
                return Promise.resolve(response(args.params));
            }
            return innerFn(args);
        };
        this.server.callEndpoint = outerFn;
        return this;
    }
    withMethod(methodName, response) {
        const innerFn = this.server.callMethod;
        const outerFn = (innerMethodName, ...innerArgs) => {
            if (innerMethodName === String(methodName)) {
                return Promise.resolve(response());
            }
            if (!innerFn) {
                throw new Error('not implemented');
            }
            return innerFn(innerMethodName, ...innerArgs);
        };
        this.server.callMethod = outerFn;
        return this;
    }
    withPermission(permission) {
        const innerFn = this.authorization.queryPermission;
        const outerFn = (innerPermission, innerScope, innerScopedRoles) => {
            if (innerPermission === permission) {
                return [() => () => undefined, () => true];
            }
            return innerFn(innerPermission, innerScope, innerScopedRoles);
        };
        this.authorization.queryPermission = outerFn;
        const innerFn2 = this.authorization.queryAtLeastOnePermission;
        const outerFn2 = (innerPermissions, innerScope, innerScopedRoles) => {
            if (innerPermissions.includes(permission)) {
                return [() => () => undefined, () => true];
            }
            return innerFn2(innerPermissions, innerScope, innerScopedRoles);
        };
        this.authorization.queryAtLeastOnePermission = outerFn2;
        const innerFn3 = this.authorization.queryAllPermissions;
        const outerFn3 = (innerPermissions, innerScope, innerScopedRoles) => {
            if (innerPermissions.includes(permission)) {
                return [() => () => undefined, () => true];
            }
            return innerFn3(innerPermissions, innerScope, innerScopedRoles);
        };
        this.authorization.queryAllPermissions = outerFn3;
        return this;
    }
    withJohnDoe(overrides = {}) {
        this.user.userId = 'john.doe';
        this.user.user = Object.assign({ _id: 'john.doe', username: 'john.doe', name: 'John Doe', createdAt: new Date(), active: true, _updatedAt: new Date(), roles: ['admin'], type: 'user' }, overrides);
        return this;
    }
    withAnonymous() {
        this.user.userId = null;
        this.user.user = null;
        return this;
    }
    withUser(user) {
        this.user.userId = user._id;
        this.user.user = user;
        return this;
    }
    withSubscriptions(subscriptions) {
        this.subscriptions = subscriptions;
        return this;
    }
    withRole(role) {
        if (!this.user.user) {
            throw new Error('user is not defined');
        }
        this.user.user.roles.push(role);
        const innerFn = this.authorization.queryRole;
        const outerFn = (innerRole, innerScope, innerIgnoreSubscriptions) => {
            if (innerRole === role) {
                return [() => () => undefined, () => true];
            }
            return innerFn(innerRole, innerScope, innerIgnoreSubscriptions);
        };
        this.authorization.queryRole = outerFn;
        return this;
    }
    withSetting(id, value) {
        const setting = {
            _id: id,
            value,
        };
        const innerFn = this.settings.querySetting;
        const outerFn = (innerSetting) => {
            if (innerSetting === id) {
                return [() => () => undefined, () => setting];
            }
            return innerFn(innerSetting);
        };
        this.settings.querySetting = outerFn;
        return this;
    }
    withUserPreference(id, value) {
        const innerFn = this.user.queryPreference;
        const outerFn = (key, defaultValue) => {
            if (key === id) {
                return [() => () => undefined, () => value];
            }
            return innerFn(key, defaultValue);
        };
        this.user.queryPreference = outerFn;
        return this;
    }
    withOpenModal(modal) {
        this.modal.currentModal = { component: modal };
        return this;
    }
    withAudioInputDevices(devices) {
        this.audioInputDevices = devices;
        return this;
    }
    withAudioOutputDevices(devices) {
        this.audioOutputDevices = devices;
        return this;
    }
    withTranslations(lng, ns, resources) {
        const addResources = () => {
            this.i18n.addResources(lng, ns, resources);
            for (const [key, value] of Object.entries(resources)) {
                this.i18n.addResource(lng, ns, key, value);
            }
        };
        if (this.i18n.isInitialized) {
            addResources();
            return this;
        }
        this.i18n.on('initialized', addResources);
        return this;
    }
    build() {
        const queryClient = new react_query_1.QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
            logger: {
                log: console.log,
                warn: console.warn,
                error: () => undefined,
            },
        });
        const { connectionStatus, server, router, settings, user, i18n, authorization, wrappers, audioInputDevices, audioOutputDevices } = this;
        const reduceTranslation = (translation) => {
            return Object.assign(Object.assign({}, translation), { language: i18n.isInitialized ? i18n.language : 'en', languages: [
                    {
                        en: 'Default',
                        name: i18n.isInitialized ? i18n.t('Default') : 'Default',
                        ogName: i18n.isInitialized ? i18n.t('Default') : 'Default',
                        key: '',
                    },
                    ...(i18n.isInitialized
                        ? [...new Set([...i18n.languages, ...languages_1.default])].map((key) => {
                            var _a, _b;
                            return ({
                                en: key,
                                name: (_a = new Intl.DisplayNames([key], { type: 'language' }).of(key)) !== null && _a !== void 0 ? _a : key,
                                ogName: (_b = new Intl.DisplayNames([key], { type: 'language' }).of(key)) !== null && _b !== void 0 ? _b : key,
                                key,
                            });
                        })
                        : []),
                ], loadLanguage: (language) => __awaiter(this, void 0, void 0, function* () {
                    if (!i18n.isInitialized) {
                        return;
                    }
                    yield i18n.changeLanguage(language);
                }), translate: Object.assign((key, options) => (i18n.isInitialized ? i18n.t(key, options) : ''), {
                    has: (key, options) => !!key && i18n.isInitialized && i18n.exists(key, options),
                }) });
        };
        const subscribeToModal = (onStoreChange) => this.events.on('update-modal', onStoreChange);
        const getModalSnapshot = () => this.modal;
        i18n.init();
        return function MockedAppRoot({ children }) {
            const [translation, updateTranslation] = (0, react_1.useReducer)(reduceTranslation, undefined, () => reduceTranslation());
            (0, react_1.useEffect)(() => {
                i18n.on('initialized', updateTranslation);
                i18n.on('languageChanged', updateTranslation);
                return () => {
                    i18n.off('initialized', updateTranslation);
                    i18n.off('languageChanged', updateTranslation);
                };
            }, []);
            const modal = (0, shim_1.useSyncExternalStore)(subscribeToModal, getModalSnapshot);
            return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(ui_contexts_1.ConnectionStatusContext.Provider, { value: connectionStatus, children: (0, jsx_runtime_1.jsx)(ui_contexts_1.ServerContext.Provider, { value: server, children: (0, jsx_runtime_1.jsx)(ui_contexts_1.RouterContext.Provider, { value: router, children: (0, jsx_runtime_1.jsx)(ui_contexts_1.SettingsContext.Provider, { value: settings, children: (0, jsx_runtime_1.jsx)(react_i18next_1.I18nextProvider, { i18n: i18n, children: (0, jsx_runtime_1.jsx)(ui_contexts_1.TranslationContext.Provider, { value: translation, children: (0, jsx_runtime_1.jsx)(ui_contexts_1.UserContext.Provider, { value: user, children: (0, jsx_runtime_1.jsx)(MockedDeviceContext_1.MockedDeviceContext, { availableAudioInputDevices: audioInputDevices, availableAudioOutputDevices: audioOutputDevices, children: (0, jsx_runtime_1.jsx)(ui_contexts_1.ModalContext.Provider, { value: modal, children: (0, jsx_runtime_1.jsx)(ui_contexts_1.AuthorizationContext.Provider, { value: authorization, children: (0, jsx_runtime_1.jsx)(ui_contexts_1.ActionManagerContext.Provider, { value: {
                                                                generateTriggerId: () => '',
                                                                emitInteraction: () => Promise.reject(new Error('not implemented')),
                                                                getInteractionPayloadByViewId: () => undefined,
                                                                handleServerInteraction: () => undefined,
                                                                off: () => undefined,
                                                                on: () => undefined,
                                                                openView: () => undefined,
                                                                disposeView: () => undefined,
                                                                notifyBusy: () => undefined,
                                                                notifyIdle: () => undefined,
                                                            }, children: wrappers.reduce((children, wrapper) => wrapper(children), (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [children, modal.currentModal.component] })) }) }) }) }) }) }) }) }) }) }) }) }));
        };
    }
    buildStoryDecorator() {
        const WrapperComponent = this.build();
        // eslint-disable-next-line react/display-name, react/no-multi-comp
        return (fn) => (0, jsx_runtime_1.jsx)(WrapperComponent, { children: fn() });
    }
}
exports.MockedAppRootBuilder = MockedAppRootBuilder;
