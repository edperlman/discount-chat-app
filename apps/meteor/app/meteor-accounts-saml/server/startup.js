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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@rocket.chat/logger");
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const meteor_1 = require("meteor/meteor");
const Utils_1 = require("./lib/Utils");
const settings_1 = require("./lib/settings");
const server_1 = require("../../settings/server");
const logger = new logger_1.Logger('steffo:meteor-accounts-saml');
Utils_1.SAMLUtils.setLoggerInstance(logger);
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, settings_1.addSettings)('Default');
}));
server_1.settings.watchByRegex(/^SAML_.+/, (0, lodash_debounce_1.default)(settings_1.loadSamlServiceProviders, 2000));
