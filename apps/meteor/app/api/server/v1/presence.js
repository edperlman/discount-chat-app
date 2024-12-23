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
const api_1 = require("../api");
api_1.API.v1.addRoute('presence.getConnections', { authRequired: true, permissionsRequired: ['manage-user-status'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield core_services_1.Presence.getConnectionCount();
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('presence.enableBroadcast', { authRequired: true, permissionsRequired: ['manage-user-status'], twoFactorRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            yield core_services_1.Presence.toggleBroadcast(true);
            return api_1.API.v1.success();
        });
    },
});
