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
exports.TestsApiBridge = void 0;
const bridges_1 = require("../../../src/server/bridges");
const utilities_1 = require("../utilities");
class TestsApiBridge extends bridges_1.ApiBridge {
    constructor() {
        super();
        this.apis = new Map();
        this.apis.set('appId', new Map());
        this.apis.get('appId').set('it-exists', utilities_1.TestData.getApi('it-exists'));
    }
    registerApi(api, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.apis.has(appId)) {
                this.apis.set(appId, new Map());
            }
            if (this.apis.get(appId)) {
                api.api.endpoints.forEach((endpoint) => {
                    if (this.apis.get(appId).has(endpoint.path)) {
                        throw new Error(`Api "${api.endpoint.path}" has already been registered for app ${appId}.`);
                    }
                });
                api.api.endpoints.forEach((endpoint) => {
                    this.apis.get(appId).set(api.endpoint.path, api.api);
                });
            }
        });
    }
    unregisterApis(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.apis.delete(appId);
        });
    }
}
exports.TestsApiBridge = TestsApiBridge;
