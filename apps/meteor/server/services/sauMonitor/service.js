"use strict";
// import type { Db } from 'mongodb';
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
exports.SAUMonitorService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const events_1 = require("./events");
class SAUMonitorService extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'sau-monitor';
        this.onEvent('accounts.login', (data) => __awaiter(this, void 0, void 0, function* () {
            events_1.sauEvents.emit('accounts.login', data);
        }));
        this.onEvent('accounts.logout', (data) => __awaiter(this, void 0, void 0, function* () {
            events_1.sauEvents.emit('accounts.logout', data);
        }));
        this.onEvent('socket.disconnected', (data) => __awaiter(this, void 0, void 0, function* () {
            // console.log('socket.disconnected', data);
            events_1.sauEvents.emit('socket.disconnected', data);
        }));
        this.onEvent('socket.connected', (data) => __awaiter(this, void 0, void 0, function* () {
            // console.log('socket.connected', data);
            events_1.sauEvents.emit('socket.connected', data);
        }));
    }
}
exports.SAUMonitorService = SAUMonitorService;
