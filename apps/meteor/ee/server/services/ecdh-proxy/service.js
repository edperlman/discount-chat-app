"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@rocket.chat/network-broker");
const core_services_1 = require("@rocket.chat/core-services");
const ECDHProxy_1 = require("./ECDHProxy");
core_services_1.api.registerService(new ECDHProxy_1.ECDHProxy());
