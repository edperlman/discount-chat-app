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
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const api_1 = require("../api");
api_1.API.v1.addRoute('federation/matrixIds.verify', {
    authRequired: true,
    validateParams: rest_typings_1.isFederationVerifyMatrixIdProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { matrixIds } = this.queryParams;
            const federationService = license_1.License.hasValidLicense() ? core_services_1.FederationEE : core_services_1.Federation;
            const results = yield federationService.verifyMatrixIds(matrixIds);
            return api_1.API.v1.success({ results: Object.fromEntries(results) });
        });
    },
});
api_1.API.v1.addRoute('federation/configuration.verify', { authRequired: true, permissionsRequired: ['view-privileged-setting'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const service = license_1.License.hasValidLicense() ? core_services_1.FederationEE : core_services_1.Federation;
            const status = yield service.configurationStatus();
            if (!status.externalReachability.ok || !status.appservice.ok) {
                return api_1.API.v1.failure(status);
            }
            return api_1.API.v1.success(status);
        });
    },
});
