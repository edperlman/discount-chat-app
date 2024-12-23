"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTempPassword = generateTempPassword;
function generateTempPassword(userData) {
    return `${Date.now()}${userData.name || ''}${userData.emails.length ? userData.emails[0].toUpperCase() : ''}`;
}
