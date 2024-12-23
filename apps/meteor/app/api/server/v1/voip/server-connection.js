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
const check_1 = require("meteor/check");
const api_1 = require("../../api");
api_1.API.v1.addRoute('voip/managementServer/checkConnection', { authRequired: true, permissionsRequired: ['manage-voip-contact-center-settings'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                host: String,
                port: String,
                username: String,
                password: String,
            }));
            const { host, port, username, password } = this.queryParams;
            return api_1.API.v1.success(yield core_services_1.VoipAsterisk.checkManagementConnection(host, port, username, password));
        });
    },
});
api_1.API.v1.addRoute('voip/callServer/checkConnection', { authRequired: true, permissionsRequired: ['manage-voip-contact-center-settings'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                websocketUrl: check_1.Match.Maybe(String),
                host: check_1.Match.Maybe(String),
                port: check_1.Match.Maybe(String),
                path: check_1.Match.Maybe(String),
            }));
            const { websocketUrl, host, port, path } = this.queryParams;
            if (!websocketUrl && !(host && port && path)) {
                return api_1.API.v1.failure('Incorrect / Insufficient Parameters');
            }
            let socketUrl = websocketUrl;
            if (!socketUrl) {
                // We will assume that it is always secure.
                // This is because you can not have webRTC working with non-secure server.
                // It works on non-secure server if it is tested on localhost.
                if (parseInt(port) !== 443) {
                    socketUrl = `wss://${host}:${port}/${path.replace('/', '')}`;
                }
                else {
                    socketUrl = `wss://${host}/${path.replace('/', '')}`;
                }
            }
            return api_1.API.v1.success(yield core_services_1.VoipAsterisk.checkCallserverConnection(socketUrl));
        });
    },
});
