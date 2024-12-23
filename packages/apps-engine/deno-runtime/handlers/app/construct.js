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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleConstructApp;
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
const require_ts_1 = require("../../lib/require.ts");
const sanitizeDeprecatedUsage_ts_1 = require("../../lib/sanitizeDeprecatedUsage.ts");
const mod_ts_1 = require("../../lib/accessors/mod.ts");
const node_net_1 = require("node:net");
const ALLOWED_NATIVE_MODULES = ['path', 'url', 'crypto', 'buffer', 'stream', 'net', 'http', 'https', 'zlib', 'util', 'punycode', 'os', 'querystring', 'fs'];
const ALLOWED_EXTERNAL_MODULES = ['uuid'];
function prepareEnvironment() {
    // Deno does not behave equally to Node when it comes to piping content to a socket
    // So we intervene here
    const originalFinal = node_net_1.Socket.prototype._final;
    node_net_1.Socket.prototype._final = function _final(cb) {
        // Deno closes the readable stream in the Socket earlier than Node
        // The exact reason for that is yet unknown, so we'll need to simply delay the execution
        // which allows data to be read in a response
        setTimeout(() => originalFinal.call(this, cb), 1);
    };
}
// As the apps are bundled, the only times they will call require are
// 1. To require native modules
// 2. To require external npm packages we may provide
// 3. To require apps-engine files
function buildRequire() {
    return (module) => {
        if (ALLOWED_NATIVE_MODULES.includes(module)) {
            return (0, require_ts_1.require)(`node:${module}`);
        }
        if (ALLOWED_EXTERNAL_MODULES.includes(module)) {
            return (0, require_ts_1.require)(`npm:${module}`);
        }
        if (module.startsWith('@rocket.chat/apps-engine')) {
            // Our `require` function knows how to handle these
            return (0, require_ts_1.require)(module);
        }
        throw new Error(`Module ${module} is not allowed`);
    };
}
function wrapAppCode(code) {
    return new Function('require', `
        const { Buffer } = require('buffer');
        const exports = {};
        const module = { exports };
        const _error = console.error.bind(console);
        const _console = {
            log: _error,
            error: _error,
            debug: _error,
            info: _error,
            warn: _error,
        };

        const result = (async (exports,module,require,Buffer,console,globalThis,Deno) => {
            ${code};
        })(exports,module,require,Buffer,_console,undefined,undefined);

        return result.then(() => module.exports);`);
}
function handleConstructApp(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!Array.isArray(params)) {
            throw new Error('Invalid params', { cause: 'invalid_param_type' });
        }
        const [appPackage] = params;
        if (!((_a = appPackage === null || appPackage === void 0 ? void 0 : appPackage.info) === null || _a === void 0 ? void 0 : _a.id) || !((_b = appPackage === null || appPackage === void 0 ? void 0 : appPackage.info) === null || _b === void 0 ? void 0 : _b.classFile) || !(appPackage === null || appPackage === void 0 ? void 0 : appPackage.files)) {
            throw new Error('Invalid params', { cause: 'invalid_param_type' });
        }
        prepareEnvironment();
        AppObjectRegistry_ts_1.AppObjectRegistry.set('id', appPackage.info.id);
        const source = (0, sanitizeDeprecatedUsage_ts_1.sanitizeDeprecatedUsage)(appPackage.files[appPackage.info.classFile]);
        const require = buildRequire();
        const exports = yield wrapAppCode(source)(require);
        // This is the same naive logic we've been using in the App Compiler
        // Applying the correct type here is quite difficult because of the dynamic nature of the code
        // deno-lint-ignore no-explicit-any
        const appClass = Object.values(exports)[0];
        const logger = AppObjectRegistry_ts_1.AppObjectRegistry.get('logger');
        const app = new appClass(appPackage.info, logger, mod_ts_1.AppAccessorsInstance.getDefaultAppAccessors());
        if (typeof app.getName !== 'function') {
            throw new Error('App must contain a getName function');
        }
        if (typeof app.getNameSlug !== 'function') {
            throw new Error('App must contain a getNameSlug function');
        }
        if (typeof app.getVersion !== 'function') {
            throw new Error('App must contain a getVersion function');
        }
        if (typeof app.getID !== 'function') {
            throw new Error('App must contain a getID function');
        }
        if (typeof app.getDescription !== 'function') {
            throw new Error('App must contain a getDescription function');
        }
        if (typeof app.getRequiredApiVersion !== 'function') {
            throw new Error('App must contain a getRequiredApiVersion function');
        }
        AppObjectRegistry_ts_1.AppObjectRegistry.set('app', app);
        return true;
    });
}
