"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountBox = exports.isAppAccountBoxItem = void 0;
const SDKClient_1 = require("../../../utils/client/lib/SDKClient");
const isAppAccountBoxItem = (item) => 'isAppButtonItem' in item;
exports.isAppAccountBoxItem = isAppAccountBoxItem;
class AccountBoxBase {
    setStatus(status, statusText) {
        return SDKClient_1.sdk.rest.post('/v1/users.setStatus', { status, message: statusText });
    }
}
exports.AccountBox = new AccountBoxBase();
