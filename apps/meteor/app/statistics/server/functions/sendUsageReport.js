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
exports.sendUsageReport = sendUsageReport;
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const tracing_1 = require("@rocket.chat/tracing");
const meteor_1 = require("meteor/meteor");
const __1 = require("..");
const server_1 = require("../../../cloud/server");
function sendStats(logger, cronStatistics) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = yield (0, server_1.getWorkspaceAccessToken)();
            const headers = Object.assign({}, (token && { Authorization: `Bearer ${token}` }));
            const response = yield (0, server_fetch_1.serverFetch)('https://collector.rocket.chat/', {
                method: 'POST',
                body: Object.assign(Object.assign({}, cronStatistics), { host: meteor_1.Meteor.absoluteUrl() }),
                headers,
            });
            const { statsToken } = yield response.json();
            if (statsToken != null) {
                yield models_1.Statistics.updateOne({ _id: cronStatistics._id }, { $set: { statsToken } });
                return statsToken;
            }
        }
        catch (err) {
            logger.error({ msg: 'Failed to send usage report', err });
        }
    });
}
function sendUsageReport(logger) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, tracing_1.tracerSpan)('generateStatistics', {}, () => __awaiter(this, void 0, void 0, function* () {
            const last = yield models_1.Statistics.findLast();
            if (last) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                // if the last data we have has less than 24h and was not sent to yet, send it
                if (last.createdAt > yesterday) {
                    // but if it has the confirmation token, we can skip
                    if (last.statsToken) {
                        return last.statsToken;
                    }
                    // if it doesn't it means the request failed, so we try sending again with the same data
                    return sendStats(logger, last);
                }
            }
            // if our latest stats has more than 24h, it is time to generate a new one and send it
            const cronStatistics = yield __1.statistics.save();
            return sendStats(logger, cronStatistics);
        }));
    });
}
