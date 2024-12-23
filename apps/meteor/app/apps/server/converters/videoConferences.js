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
exports.AppVideoConferencesConverter = void 0;
const core_services_1 = require("@rocket.chat/core-services");
class AppVideoConferencesConverter {
    convertById(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield core_services_1.VideoConf.getUnfiltered(callId);
            return this.convertVideoConference(call);
        });
    }
    convertVideoConference(call) {
        if (!call) {
            return;
        }
        return Object.assign({}, call);
    }
    convertAppVideoConference(call) {
        return Object.assign({}, call);
    }
}
exports.AppVideoConferencesConverter = AppVideoConferencesConverter;
