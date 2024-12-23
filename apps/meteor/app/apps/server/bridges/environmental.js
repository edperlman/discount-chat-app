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
exports.AppEnvironmentalVariableBridge = void 0;
const EnvironmentalVariableBridge_1 = require("@rocket.chat/apps-engine/server/bridges/EnvironmentalVariableBridge");
class AppEnvironmentalVariableBridge extends EnvironmentalVariableBridge_1.EnvironmentalVariableBridge {
    constructor(orch) {
        super();
        this.orch = orch;
        this.allowed = ['NODE_ENV', 'ROOT_URL', 'INSTANCE_IP'];
    }
    getValueByName(envVarName, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is getting the environmental variable value ${envVarName}.`);
            if (!(yield this.isReadable(envVarName, appId))) {
                throw new Error(`The environmental variable "${envVarName}" is not readable.`);
            }
            return process.env[envVarName];
        });
    }
    isReadable(envVarName, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is checking if the environmental variable is readable ${envVarName}.`);
            return this.allowed.includes(envVarName.toUpperCase()) || this.isAppsOwnVariable(envVarName, appId);
        });
    }
    isAppsOwnVariable(envVarName, appId) {
        /**
         * Replace the letter `-` with `_` since environment variable name doesn't support it
         */
        const appVariablePrefix = `RC_APPS_${appId.toUpperCase().replace(/-/g, '_')}`;
        return envVarName.toUpperCase().startsWith(appVariablePrefix);
    }
    isSet(envVarName, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is checking if the environmental variable is set ${envVarName}.`);
            if (!(yield this.isReadable(envVarName, appId))) {
                throw new Error(`The environmental variable "${envVarName}" is not readable.`);
            }
            return typeof process.env[envVarName] !== 'undefined';
        });
    }
}
exports.AppEnvironmentalVariableBridge = AppEnvironmentalVariableBridge;
