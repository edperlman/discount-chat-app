"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSsl = exports.host = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const query_string_1 = require("query-string");
const ConnectionStatusProvider_1 = __importDefault(require("../../providers/ConnectionStatusProvider"));
const SDKProvider_1 = __importDefault(require("../../providers/SDKProvider"));
const ServerProvider_1 = __importDefault(require("../../providers/ServerProvider"));
const store_1 = require("../../store");
const App_1 = __importDefault(require("./App"));
exports.host = (_b = (_a = window.SERVER_URL) !== null && _a !== void 0 ? _a : (0, query_string_1.parse)(window.location.search).serverUrl) !== null && _b !== void 0 ? _b : (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null);
exports.useSsl = Boolean((_c = (Array.isArray(exports.host) ? exports.host[0] : exports.host)) === null || _c === void 0 ? void 0 : _c.match(/^https:/));
const AppConnector = () => ((0, jsx_runtime_1.jsx)("div", { id: 'app', children: (0, jsx_runtime_1.jsx)(store_1.Provider, { children: (0, jsx_runtime_1.jsx)(SDKProvider_1.default, { serverURL: exports.host, children: (0, jsx_runtime_1.jsx)(ConnectionStatusProvider_1.default, { children: (0, jsx_runtime_1.jsx)(ServerProvider_1.default, { children: (0, jsx_runtime_1.jsx)(store_1.Consumer, { children: ({ config, user, triggered, gdpr, sound, undocked, minimized = true, expanded = false, alerts, modal, dispatch, iframe, }) => ((0, jsx_runtime_1.jsx)(App_1.default, { config: config, gdpr: gdpr, triggered: triggered, user: user, sound: sound, undocked: undocked, minimized: minimized, expanded: expanded, alerts: alerts, modal: modal, dispatch: dispatch, iframe: iframe })) }) }) }) }) }) }));
exports.default = AppConnector;
