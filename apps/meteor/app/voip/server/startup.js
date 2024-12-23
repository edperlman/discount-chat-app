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
const server_1 = require("../../settings/server");
server_1.settings.watch('VoIP_Enabled', (value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (value) {
            yield core_services_1.VoipAsterisk.init();
        }
        else {
            yield core_services_1.VoipAsterisk.stop();
        }
    }
    catch (e) {
        // do nothing
    }
}));
server_1.settings.changeMultiple(['VoIP_Management_Server_Host', 'VoIP_Management_Server_Port', 'VoIP_Management_Server_Username', 'VoIP_Management_Server_Password'], (_values) => __awaiter(void 0, void 0, void 0, function* () {
    // Here, if 4 settings are changed at once, we're getting 4 diff callbacks. The good part is that all callbacks are fired almost instantly
    // So to avoid stopping/starting voip too often, we debounce the call and restart 1 second after the last setting has reached us.
    if (server_1.settings.get('VoIP_Enabled')) {
        try {
            yield core_services_1.VoipAsterisk.refresh();
        }
        catch (e) {
            // do nothing
        }
    }
}));
