"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSettingValueById = void 0;
const setSettingValueById = (api, settingId, value) => api.post(`/settings/${settingId}`, { value });
exports.setSettingValueById = setSettingValueById;
