"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webapp_1 = require("meteor/webapp");
const auth_1 = require("./auth");
const browserVersion_1 = require("./browserVersion");
webapp_1.WebApp.connectHandlers.use(browserVersion_1.handleBrowserVersionCheck);
webapp_1.WebApp.connectHandlers.use('/avatar/uid/', auth_1.protectAvatars);
webapp_1.WebApp.connectHandlers.use('/avatar/', auth_1.protectAvatarsWithFallback);
