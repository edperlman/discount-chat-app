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
const check_1 = require("meteor/check");
const api_1 = require("../../api");
api_1.API.v1.addRoute('voip/queues.getSummary', { authRequired: true, permissionsRequired: ['inbound-voip-calls'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const queueSummary = yield core_services_1.VoipAsterisk.getQueueSummary();
            return api_1.API.v1.success({ summary: queueSummary.result });
        });
    },
});
api_1.API.v1.addRoute('voip/queues.getQueuedCallsForThisExtension', { authRequired: true, permissionsRequired: ['inbound-voip-calls'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                extension: String,
            }));
            const membershipDetails = yield core_services_1.VoipAsterisk.getQueuedCallsForThisExtension(this.queryParams);
            return api_1.API.v1.success(membershipDetails.result);
        });
    },
});
api_1.API.v1.addRoute('voip/queues.getMembershipSubscription', { authRequired: true, permissionsRequired: ['inbound-voip-calls'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                extension: String,
            }));
            const membershipDetails = yield core_services_1.VoipAsterisk.getQueueMembership(this.queryParams);
            return api_1.API.v1.success(membershipDetails.result);
        });
    },
});
