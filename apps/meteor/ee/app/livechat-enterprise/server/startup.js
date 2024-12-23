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
const meteor_1 = require("meteor/meteor");
const Multiple_1 = require("./business-hour/Multiple");
const Helper_1 = require("./lib/Helper");
const VisitorInactivityMonitor_1 = require("./lib/VisitorInactivityMonitor");
const logger_1 = require("./lib/logger");
const business_hour_1 = require("../../../../app/livechat/server/business-hour");
const Single_1 = require("../../../../app/livechat/server/business-hour/Single");
const server_1 = require("../../../../app/settings/server");
require("./lib/query.helper");
const visitorActivityMonitor = new VisitorInactivityMonitor_1.VisitorInactivityMonitor();
const businessHours = {
    Multiple: new Multiple_1.MultipleBusinessHoursBehavior(),
    Single: new Single_1.SingleBusinessHourBehavior(),
};
server_1.settings.change('Livechat_max_queue_wait_time', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, Helper_1.updateQueueInactivityTimeout)();
}));
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    server_1.settings.watch('Livechat_abandoned_rooms_action', (value) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, Helper_1.updatePredictedVisitorAbandonment)();
        if (!value || value === 'none') {
            return visitorActivityMonitor.stop();
        }
        yield visitorActivityMonitor.start();
    }));
    server_1.settings.change('Livechat_visitor_inactivity_timeout', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, Helper_1.updatePredictedVisitorAbandonment)();
    }));
    server_1.settings.change('Livechat_business_hour_type', (value) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.debug(`Changing business hour type to ${value}`);
        if (!Object.keys(businessHours).includes(value)) {
            logger_1.logger.error(`Invalid business hour type ${value}`);
            return;
        }
        business_hour_1.businessHourManager.registerBusinessHourBehavior(businessHours[value]);
        if (server_1.settings.get('Livechat_enable_business_hours')) {
            yield business_hour_1.businessHourManager.restartManager();
            logger_1.logger.debug(`Business hour manager started`);
        }
    }));
}));
