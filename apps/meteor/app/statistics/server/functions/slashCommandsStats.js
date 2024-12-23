"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommandsStats = slashCommandsStats;
const updateStatsCounter_1 = require("./updateStatsCounter");
const telemetryEvents_1 = __importDefault(require("../lib/telemetryEvents"));
function slashCommandsStats(data) {
    if (data.command === 'jitsi') {
        (0, updateStatsCounter_1.updateCounter)({ settingsId: 'Jitsi_Start_SlashCommands_Count' });
    }
}
telemetryEvents_1.default.register('slashCommandsStats', slashCommandsStats);
