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
exports.AnalyticsService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
class AnalyticsService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'analytics';
    }
    saveSeatRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Analytics.update({ type: 'seat-request' }, { $inc: { count: 1 } }, { upsert: true });
        });
    }
    getSeatRequestCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield models_1.Analytics.findOne({ type: 'seat-request' }, {}));
            return (result === null || result === void 0 ? void 0 : result.count) ? result.count : 0;
        });
    }
    resetSeatRequestCount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Analytics.update({ type: 'seat-request' }, { $set: { count: 0 } }, { upsert: true });
        });
    }
}
exports.AnalyticsService = AnalyticsService;
