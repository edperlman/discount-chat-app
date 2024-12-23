"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_typings_1 = require("@rocket.chat/core-typings");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const Multiple_1 = require("../business-hour/Multiple");
callbacks_1.callbacks.add('on-business-hour-start', (options = {}) => {
    const { BusinessHourBehaviorClass } = options;
    if (!BusinessHourBehaviorClass) {
        return options;
    }
    if (server_1.settings.get('Livechat_business_hour_type') === core_typings_1.LivechatBusinessHourBehaviors.SINGLE) {
        return options;
    }
    return { BusinessHourBehaviorClass: Multiple_1.MultipleBusinessHoursBehavior };
}, callbacks_1.callbacks.priority.HIGH, 'livechat-on-business-hour-start');
