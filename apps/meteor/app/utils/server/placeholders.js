"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeholders = void 0;
const stringUtils_1 = require("../../../lib/utils/stringUtils");
const server_1 = require("../../settings/server");
exports.placeholders = {
    replace: (str, data) => {
        if (!str) {
            return '';
        }
        str = str.replace(/\[Site_Name\]/g, server_1.settings.get('Site_Name') || '');
        str = str.replace(/\[Site_URL\]/g, server_1.settings.get('Site_Url') || '');
        if (data) {
            str = str.replace(/\[name\]/g, data.name || '');
            str = str.replace(/\[fname\]/g, (0, stringUtils_1.strLeft)(data.name, ' ') || '');
            str = str.replace(/\[lname\]/g, (0, stringUtils_1.strRightBack)(data.name, ' ') || '');
            str = str.replace(/\[email\]/g, data.email || '');
            str = str.replace(/\[password\]/g, data.password || '');
            str = str.replace(/\[reason\]/g, data.reason || '');
            str = str.replace(/\[User\]/g, data.user || '');
            str = str.replace(/\[Room\]/g, data.room || '');
            if (data.unsubscribe) {
                str = str.replace(/\[unsubscribe\]/g, data.unsubscribe);
            }
        }
        str = str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
        return str;
    },
};
