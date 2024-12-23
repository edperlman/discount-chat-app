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
exports.BrokerMocked = void 0;
class BrokerMocked {
    constructor() {
        this.actions = {};
        this.services = new Map();
    }
    destroyService(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.services.delete(name);
        });
    }
    createService(instance) {
        this.services.set(instance.name, instance);
    }
    call(method, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.actions[method](data);
        });
    }
    broadcastToServices() {
        return __awaiter(this, void 0, void 0, function* () {
            // no op
        });
    }
    broadcast() {
        return __awaiter(this, void 0, void 0, function* () {
            // no op
        });
    }
    broadcastLocal() {
        return __awaiter(this, void 0, void 0, function* () {
            // no op
        });
    }
    nodeList() {
        return __awaiter(this, void 0, void 0, function* () {
            // no op
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // no op
        });
    }
    mockServices(actions) {
        this.actions = actions;
    }
}
exports.BrokerMocked = BrokerMocked;
