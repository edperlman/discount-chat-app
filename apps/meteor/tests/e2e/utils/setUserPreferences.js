"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserPreferences = void 0;
const setUserPreferences = (api, preferences) => api.post(`/users.setPreferences`, { data: preferences });
exports.setUserPreferences = setUserPreferences;
