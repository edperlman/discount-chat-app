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
exports.startup = void 0;
require("./appcache");
require("./callbacks");
require("./cron");
require("./initialData");
require("./serverRunning");
require("./coreApps");
require("./presenceTroubleshoot");
require("../hooks");
require("../lib/rooms/roomTypes");
require("../lib/settingsRegenerator");
const migrations_1 = require("./migrations");
const isRunningMs_1 = require("../lib/isRunningMs");
const startup = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, migrations_1.performMigrationProcedure)();
    // only starts network broker if running in micro services mode
    if (!(0, isRunningMs_1.isRunningMs)()) {
        require('./localServices');
        require('./watchDb');
    }
});
exports.startup = startup;
