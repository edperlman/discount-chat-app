"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instance = exports.LDAPEE = void 0;
const core_services_1 = require("@rocket.chat/core-services");
exports.LDAPEE = (0, core_services_1.proxify)('ldap-enterprise');
exports.Instance = (0, core_services_1.proxify)('instance');
