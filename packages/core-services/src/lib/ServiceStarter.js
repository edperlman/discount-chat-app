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
exports.ServiceStarter = void 0;
// This class is used to manage calls to a service's .start and .stop functions
// Specifically for cases where the start function has different conditions that may cause the service to actually start or not,
// or when the start process can take a while to complete
// Using this class, you ensure that calls to .start and .stop will be chained, so you avoid race conditions
// At the same time, it prevents those functions from running more times than necessary if there are several calls to them (for example when loading setting values)
class ServiceStarter {
    constructor(starterFn, stopperFn) {
        this.lock = Promise.resolve();
        this.starterFn = starterFn;
        this.stopperFn = stopperFn;
    }
    checkStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nextCall === 'start') {
                return this.doCall('start');
            }
            if (this.nextCall === 'stop') {
                return this.doCall('stop');
            }
        });
    }
    doCall(call) {
        return __awaiter(this, void 0, void 0, function* () {
            this.nextCall = undefined;
            this.currentCall = call;
            try {
                if (call === 'start') {
                    yield this.starterFn();
                }
                else if (this.stopperFn) {
                    yield this.stopperFn();
                }
            }
            finally {
                this.currentCall = undefined;
                yield this.checkStatus();
            }
        });
    }
    call(call) {
        return __awaiter(this, void 0, void 0, function* () {
            // If something is already chained to run after the current call, it's okay to replace it with the new call
            this.nextCall = call;
            if (this.currentCall) {
                return this.lock;
            }
            this.lock = this.checkStatus();
            return this.lock;
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call('start');
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call('stop');
        });
    }
    wait() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.lock;
        });
    }
}
exports.ServiceStarter = ServiceStarter;
