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
exports.getLastStatistics = getLastStatistics;
const models_1 = require("@rocket.chat/models");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const statistics_1 = require("../lib/statistics");
function getLastStatistics(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, refresh }) {
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-statistics'))) {
            throw new Error('error-not-allowed');
        }
        if (refresh) {
            return statistics_1.statistics.save();
        }
        return models_1.Statistics.findLast();
    });
}
