"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInquirySortMechanismSetting = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const server_1 = require("../../../settings/server");
const getInquirySortMechanismSetting = () => server_1.settings.get('Omnichannel_sorting_mechanism') || core_typings_1.OmnichannelSortingMechanismSettingType.Timestamp;
exports.getInquirySortMechanismSetting = getInquirySortMechanismSetting;
