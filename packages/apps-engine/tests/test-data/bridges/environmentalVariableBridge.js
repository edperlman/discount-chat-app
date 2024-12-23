"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsEnvironmentalVariableBridge = void 0;
const EnvironmentalVariableBridge_1 = require("../../../src/server/bridges/EnvironmentalVariableBridge");
class TestsEnvironmentalVariableBridge extends EnvironmentalVariableBridge_1.EnvironmentalVariableBridge {
    getValueByName(envVarName, appId) {
        throw new Error('Method not implemented.');
    }
    isReadable(envVarName, appId) {
        throw new Error('Method not implemented.');
    }
    isSet(envVarName, appId) {
        throw new Error('Method not implemented.');
    }
}
exports.TestsEnvironmentalVariableBridge = TestsEnvironmentalVariableBridge;
