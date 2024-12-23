"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const utils_1 = require("../database/utils");
const InstanceStatus_1 = require("./raw/InstanceStatus");
(0, models_1.registerModel)('IInstanceStatusModel', new InstanceStatus_1.InstanceStatusRaw(utils_1.db));
