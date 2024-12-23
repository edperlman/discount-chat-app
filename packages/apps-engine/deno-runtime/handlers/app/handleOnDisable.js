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
exports.default = handleOnDisable;
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
const mod_ts_1 = require("../../lib/accessors/mod.ts");
function handleOnDisable() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = AppObjectRegistry_ts_1.AppObjectRegistry.get('app');
        if (typeof (app === null || app === void 0 ? void 0 : app.onDisable) !== 'function') {
            throw new Error('App must contain an onDisable function', {
                cause: 'invalid_app',
            });
        }
        yield app.onDisable(mod_ts_1.AppAccessorsInstance.getConfigurationModify());
        return true;
    });
}
