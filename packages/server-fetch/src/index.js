"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
exports.serverFetch = serverFetch;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const abort_controller_1 = require("abort-controller");
const http_proxy_agent_1 = require("http-proxy-agent");
const https_proxy_agent_1 = require("https-proxy-agent");
const node_fetch_1 = __importDefault(require("node-fetch"));
const proxy_from_env_1 = require("proxy-from-env");
const parsers_1 = require("./parsers");
function getFetchAgent(url, allowSelfSignedCerts) {
    const isHttps = /^https/.test(url);
    const proxy = (0, proxy_from_env_1.getProxyForUrl)(url);
    if (proxy) {
        const AgentFn = isHttps ? https_proxy_agent_1.HttpsProxyAgent : http_proxy_agent_1.HttpProxyAgent;
        return new AgentFn(proxy);
    }
    if (!allowSelfSignedCerts) {
        return null;
    }
    if (!isHttps) {
        return new http_1.default.Agent();
    }
    if (isHttps) {
        const rejectUnauthorized = process.env.NODE_ENV !== 'production' && allowSelfSignedCerts ? false : true;
        return new https_1.default.Agent({
            rejectUnauthorized,
        });
    }
    return null;
}
function getTimeout(timeout) {
    const controller = new abort_controller_1.AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout !== null && timeout !== void 0 ? timeout : 20000);
    return { controller, timeoutId };
}
function serverFetch(input, options, allowSelfSignedCerts) {
    const agent = getFetchAgent(input, allowSelfSignedCerts);
    const { controller, timeoutId } = getTimeout(options === null || options === void 0 ? void 0 : options.timeout);
    // Keeping the URLSearchParams since it handles other cases and type conversions
    const params = new URLSearchParams(options === null || options === void 0 ? void 0 : options.params);
    const url = new URL(input);
    if (params.toString()) {
        params.forEach((value, key) => {
            if (value) {
                url.searchParams.append(key, value);
            }
        });
    }
    return (0, node_fetch_1.default)(url.toString(), Object.assign(Object.assign({ 
        // @ts-expect-error - This complained when types were moved to file :/
        signal: controller.signal }, (0, parsers_1.parseRequestOptions)(options)), (agent ? { agent } : {}))).finally(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });
}
var node_fetch_2 = require("node-fetch");
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return node_fetch_2.Response; } });
