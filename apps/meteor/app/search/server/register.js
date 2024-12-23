"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultProvider_1 = require("./provider/DefaultProvider");
const service_1 = require("./service");
// register provider
service_1.searchProviderService.register(new DefaultProvider_1.DefaultProvider());
