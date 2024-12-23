"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isScriptEngineFrozen = exports.validateScriptEngine = void 0;
const tools_1 = require("@rocket.chat/tools");
const FREEZE_INTEGRATION_SCRIPTS_VALUE = String(process.env.FREEZE_INTEGRATION_SCRIPTS).toLowerCase();
const FREEZE_INTEGRATION_SCRIPTS = ['yes', 'true'].includes(FREEZE_INTEGRATION_SCRIPTS_VALUE);
const validateScriptEngine = (engine) => {
    if (FREEZE_INTEGRATION_SCRIPTS) {
        throw new Error('integration-scripts-disabled');
    }
    if (engine && engine !== 'isolated-vm') {
        throw new Error('integration-scripts-unknown-engine');
    }
    const engineCode = 'ivm';
    if (engineCode === FREEZE_INTEGRATION_SCRIPTS_VALUE) {
        throw new Error('integration-scripts-isolated-vm-disabled');
    }
    return true;
};
exports.validateScriptEngine = validateScriptEngine;
const isScriptEngineFrozen = (engine) => (0, tools_1.wrapExceptions)(() => !(0, exports.validateScriptEngine)(engine)).catch(() => true);
exports.isScriptEngineFrozen = isScriptEngineFrozen;
