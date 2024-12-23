"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFeatures = void 0;
const loggedIn_1 = require("./loggedIn");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const fetchFeatures = () => (0, loggedIn_1.whenLoggedIn)().then(() => SDKClient_1.sdk.call('license:getModules'));
exports.fetchFeatures = fetchFeatures;
