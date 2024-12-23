"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.userDataDownloadsCron = void 0;
const cron_1 = require("@rocket.chat/cron");
const server_1 = require("../../app/settings/server");
const dataExport = __importStar(require("../lib/dataExport"));
const userDataDownloadsCron = () => {
    const jobName = 'Generate download files for user data';
    const name = 'UserDataDownload';
    const plug = (_a) => __awaiter(void 0, [_a], void 0, function* ({ disabled, processingFrequency, }) {
        if (disabled) {
            return;
        }
        yield cron_1.cronJobs.add(name, `*/${processingFrequency} * * * *`, () => __awaiter(void 0, void 0, void 0, function* () { return dataExport.processDataDownloads(); }));
        return () => __awaiter(void 0, void 0, void 0, function* () {
            yield cron_1.cronJobs.remove(jobName);
        });
    });
    let unplug;
    server_1.settings.watchMultiple(['Troubleshoot_Disable_Data_Exporter_Processor', 'UserData_ProcessingFrequency'], (_a) => __awaiter(void 0, [_a], void 0, function* ([disabled, processingFrequency]) {
        yield (unplug === null || unplug === void 0 ? void 0 : unplug());
        unplug = yield plug({
            disabled: disabled === true,
            processingFrequency: typeof processingFrequency === 'number' && processingFrequency > 0 ? processingFrequency : 2,
        });
    }));
};
exports.userDataDownloadsCron = userDataDownloadsCron;
