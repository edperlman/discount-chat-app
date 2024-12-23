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
const models_1 = require("@rocket.chat/models");
const isRunningMs_1 = require("../../../../server/lib/isRunningMs");
const api_1 = require("../api");
const getInstanceList_1 = require("../helpers/getInstanceList");
const getConnections = (() => {
    if ((0, isRunningMs_1.isRunningMs)()) {
        return () => [];
    }
    return () => (0, getInstanceList_1.getInstanceList)();
})();
api_1.API.v1.addRoute('instances.get', { authRequired: true, permissionsRequired: ['view-statistics'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const instanceRecords = yield models_1.InstanceStatus.find().toArray();
            const connections = yield getConnections();
            const result = instanceRecords.map((instanceRecord) => {
                const connection = connections.find((c) => c.id === instanceRecord._id);
                return {
                    address: connection === null || connection === void 0 ? void 0 : connection.ipList[0],
                    currentStatus: {
                        connected: (connection === null || connection === void 0 ? void 0 : connection.available) || false,
                        lastHeartbeatTime: connection === null || connection === void 0 ? void 0 : connection.lastHeartbeatTime,
                        local: connection === null || connection === void 0 ? void 0 : connection.local,
                    },
                    instanceRecord,
                    broadcastAuth: true,
                };
            });
            return api_1.API.v1.success({
                instances: result,
            });
        });
    },
});
