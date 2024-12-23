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
exports.DeviceManagementService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const events_1 = require("./events");
class DeviceManagementService extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'device-management';
        this.onEvent('accounts.login', (data) => __awaiter(this, void 0, void 0, function* () {
            // TODO need to add loginToken to data
            events_1.deviceManagementEvents.emit('device-login', data);
        }));
    }
}
exports.DeviceManagementService = DeviceManagementService;
