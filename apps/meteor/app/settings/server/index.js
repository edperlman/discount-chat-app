"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsRegistry = exports.settings = exports.SettingsEvents = void 0;
/* eslint-disable react-hooks/rules-of-hooks */
const models_1 = require("@rocket.chat/models");
const Middleware_1 = require("./Middleware");
const SettingsRegistry_1 = require("./SettingsRegistry");
const cached_1 = require("./cached");
Object.defineProperty(exports, "settings", { enumerable: true, get: function () { return cached_1.settings; } });
const startup_1 = require("./startup");
require("./applyMiddlewares");
var SettingsRegistry_2 = require("./SettingsRegistry");
Object.defineProperty(exports, "SettingsEvents", { enumerable: true, get: function () { return SettingsRegistry_2.SettingsEvents; } });
exports.settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: cached_1.settings, model: models_1.Settings });
exports.settingsRegistry.add = (0, Middleware_1.use)(exports.settingsRegistry.add, (context, next) => __awaiter(void 0, void 0, void 0, function* () {
    return next(...context);
}));
exports.settingsRegistry.addGroup = (0, Middleware_1.use)(exports.settingsRegistry.addGroup, (context, next) => __awaiter(void 0, void 0, void 0, function* () {
    return next(...context);
}));
await (0, startup_1.initializeSettings)({ model: models_1.Settings, settings: cached_1.settings });
