"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_base_1 = require("meteor/accounts-base");
const rocketchat_e2e_1 = require("./rocketchat.e2e");
accounts_base_1.Accounts.onLogout(() => {
    void rocketchat_e2e_1.e2e.stopClient();
});
