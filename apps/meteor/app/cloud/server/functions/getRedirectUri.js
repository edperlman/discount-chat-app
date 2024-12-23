"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedirectUri = getRedirectUri;
const server_1 = require("../../../settings/server");
function getRedirectUri() {
    return `${server_1.settings.get('Site_Url')}/admin/cloud/oauth-callback`.replace(/\/\/admin+/g, '/admin');
}
