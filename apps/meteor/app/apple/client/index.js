"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomOAuth_1 = require("../../custom-oauth/client/CustomOAuth");
const config_1 = require("../lib/config");
new CustomOAuth_1.CustomOAuth('apple', config_1.config);
