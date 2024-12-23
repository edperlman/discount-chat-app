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
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const logger_1 = require("./logger");
const server_1 = require("../../../../settings/server");
const JWTHelper_1 = require("../../../../utils/server/lib/JWTHelper");
const api_1 = require("../../api");
// Get the connector version and type
api_1.API.v1.addRoute('connector.getVersion', { authRequired: true, permissionsRequired: ['manage-voip-call-settings'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = yield core_services_1.VoipAsterisk.getConnectorVersion();
            return api_1.API.v1.success(version);
        });
    },
});
// Get the extensions available on the call server
api_1.API.v1.addRoute('connector.extension.list', { authRequired: true, permissionsRequired: ['manage-voip-call-settings'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield core_services_1.VoipAsterisk.getExtensionList();
            const result = list.result;
            return api_1.API.v1.success({ extensions: result });
        });
    },
});
/* Get the details of a single extension.
 * Note : This API will either be called by  the endpoint
 * or will be consumed internally.
 */
api_1.API.v1.addRoute('connector.extension.getDetails', { authRequired: true, permissionsRequired: ['manage-voip-call-settings'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                extension: String,
            }));
            const endpointDetails = yield core_services_1.VoipAsterisk.getExtensionDetails(this.queryParams);
            return api_1.API.v1.success(Object.assign({}, endpointDetails.result));
        });
    },
});
/* Get the details for registration extension.
 */
api_1.API.v1.addRoute('connector.extension.getRegistrationInfoByExtension', { authRequired: true, permissionsRequired: ['manage-voip-call-settings'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                extension: String,
            }));
            const endpointDetails = yield core_services_1.VoipAsterisk.getRegistrationInfo(this.queryParams);
            const encKey = server_1.settings.get('VoIP_JWT_Secret');
            if (!encKey) {
                logger_1.logger.warn('No JWT keys set. Sending registration info as plain text');
                return api_1.API.v1.success(Object.assign({}, endpointDetails.result));
            }
            const result = (0, JWTHelper_1.generateJWT)(endpointDetails.result, encKey);
            return api_1.API.v1.success({ result });
        });
    },
});
api_1.API.v1.addRoute('connector.extension.getRegistrationInfoByUserId', { authRequired: true, permissionsRequired: ['view-agent-extension-association'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                id: String,
            }));
            const { id } = this.queryParams;
            if (id !== this.userId) {
                return api_1.API.v1.unauthorized();
            }
            const { extension } = (yield models_1.Users.getVoipExtensionByUserId(id, {
                projection: {
                    _id: 1,
                    username: 1,
                    extension: 1,
                },
            })) || {};
            if (!extension) {
                return api_1.API.v1.notFound('Extension not found');
            }
            const endpointDetails = yield core_services_1.VoipAsterisk.getRegistrationInfo({ extension });
            const encKey = server_1.settings.get('VoIP_JWT_Secret');
            if (!encKey) {
                logger_1.logger.warn('No JWT keys set. Sending registration info as plain text');
                return api_1.API.v1.success(Object.assign({}, endpointDetails.result));
            }
            const result = (0, JWTHelper_1.generateJWT)(endpointDetails.result, encKey);
            return api_1.API.v1.success({ result });
        });
    },
});
