"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./tracing");
require("./models/startup");
/**
 * ./settings uses top level await, in theory the settings creation
 * and the startup should be done in parallel
 */
require("./settings");
require("../app/settings/server");
const configuration_1 = require("./configuration");
const configureLogLevel_1 = require("./configureLogLevel");
const startup_1 = require("./services/startup");
const startup_2 = require("./startup");
const startup_3 = require("../ee/app/license/server/startup");
const server_1 = require("../ee/server");
const services_1 = require("../ee/server/startup/services");
require("./routes");
require("../app/lib/server/startup");
require("./importPackages");
require("./methods");
require("./publications");
require("./lib/logger/startup");
require("../lib/oauthRedirectUriServer");
require("./lib/pushConfig");
require("./features/EmailInbox/index");
await Promise.all([(0, configureLogLevel_1.configureLogLevel)(), (0, startup_1.registerServices)(), (0, server_1.registerEEBroker)(), (0, startup_2.startup)()]);
await (0, startup_3.startLicense)();
await Promise.all([(0, configuration_1.configureLoginServices)(), (0, services_1.startFederationService)()]);
