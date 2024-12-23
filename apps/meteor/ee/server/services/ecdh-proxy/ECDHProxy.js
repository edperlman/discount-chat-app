"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECDHProxy = void 0;
const core_services_1 = require("@rocket.chat/core-services");
require("./lib/server");
class ECDHProxy extends core_services_1.ServiceClass {
    constructor() {
        super(...arguments);
        this.name = 'ecdh-proxy';
    }
}
exports.ECDHProxy = ECDHProxy;
