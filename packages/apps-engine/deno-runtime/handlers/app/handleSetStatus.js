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
exports.default = handleSetStatus;
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
const require_ts_1 = require("../../lib/require.ts");
const { AppStatus } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/AppStatus.js');
function handleSetStatus(params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(params) || !Object.values(AppStatus).includes(params[0])) {
            throw new Error('Invalid params', { cause: 'invalid_param_type' });
        }
        const [status] = params;
        const app = AppObjectRegistry_ts_1.AppObjectRegistry.get('app');
        if (!app || typeof app['setStatus'] !== 'function') {
            throw new Error('App must contain a setStatus function', {
                cause: 'invalid_app',
            });
        }
        yield app['setStatus'](status);
        return null;
    });
}
