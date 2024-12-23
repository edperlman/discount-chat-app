"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultUserFields = void 0;
const getBaseUserFields_1 = require("./getBaseUserFields");
const getDefaultUserFields = () => (Object.assign(Object.assign({}, (0, getBaseUserFields_1.getBaseUserFields)()), { 'services.github': 1, 'services.gitlab': 1, 'services.password.bcrypt': 1, 'services.totp.enabled': 1, 'services.email2fa.enabled': 1 }));
exports.getDefaultUserFields = getDefaultUserFields;
