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
exports.configureLogLevel = void 0;
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const configureLogLevel = () => __awaiter(void 0, void 0, void 0, function* () {
    const LogLevel = yield models_1.Settings.getValueById('Log_Level');
    if (LogLevel) {
        logger_1.logLevel.emit('changed', LogLevel);
    }
});
exports.configureLogLevel = configureLogLevel;
