"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const LoginServiceConfiguration_1 = require("./raw/LoginServiceConfiguration");
(0, models_1.registerModel)('ILoginServiceConfigurationModel', new LoginServiceConfiguration_1.LoginServiceConfigurationRaw(utils_1.db));
