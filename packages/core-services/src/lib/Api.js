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
exports.Api = void 0;
class Api {
    constructor() {
        this.services = new Set();
    }
    // set a broker for the API and registers all services in the broker
    setBroker(broker) {
        this.broker = broker;
        this.services.forEach((service) => { var _a; return (_a = this.broker) === null || _a === void 0 ? void 0 : _a.createService(service); });
    }
    destroyService(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.services.has(instance)) {
                return;
            }
            if (this.broker) {
                yield this.broker.destroyService(instance);
            }
            this.services.delete(instance);
        });
    }
    registerService(instance, serviceDependencies) {
        this.services.add(instance);
        instance.setApi(this);
        if (this.broker) {
            this.broker.createService(instance, serviceDependencies);
        }
    }
    call(method, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.broker) === null || _a === void 0 ? void 0 : _a.call(method, data);
        });
    }
    broadcast(event, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.broker) {
                throw new Error(`No broker set to broadcast: ${event}, ${JSON.stringify(args)}`);
            }
            return this.broker.broadcast(event, ...args);
        });
    }
    broadcastToServices(services, event, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.broker) === null || _a === void 0 ? void 0 : _a.broadcastToServices(services, event, ...args);
        });
    }
    broadcastLocal(event, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.broker) === null || _a === void 0 ? void 0 : _a.broadcastLocal(event, ...args);
        });
    }
    nodeList() {
        if (!this.broker) {
            throw new Error('No broker set to start.');
        }
        return this.broker.nodeList();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.broker) {
                throw new Error('No broker set to start.');
            }
            yield this.broker.start();
        });
    }
}
exports.Api = Api;
