"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsSingleBusinessHours = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const BusinessHours_1 = require("../../../../app/livechat/client/views/app/business-hours/BusinessHours");
const useReactiveValue_1 = require("../../../hooks/useReactiveValue");
const useIsSingleBusinessHours = () => (0, useReactiveValue_1.useReactiveValue)((0, fuselage_hooks_1.useMutableCallback)(() => BusinessHours_1.businessHourManager.getTemplate())) === 'livechatBusinessHoursForm';
exports.useIsSingleBusinessHours = useIsSingleBusinessHours;
