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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHistory = void 0;
const models_1 = require("@rocket.chat/models");
const omit_1 = require("../../../../lib/utils/omit");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const updateHistory = (_a) => __awaiter(void 0, [_a], void 0, function* ({ historyId, step, integration, event, data, triggerWord, ranPrepareScript, prepareSentMessage, processSentMessage, resultMessage, finished, url, httpCallData, httpError, httpResult, error, errorStack, }) {
    const _b = data || {}, { user: userData, room: roomData } = _b, fullData = __rest(_b, ["user", "room"]);
    const history = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ type: 'outgoing-webhook', step }, (integration ? { integration } : {})), (event ? { event } : {})), (fullData
        ? {
            data: Object.assign(Object.assign(Object.assign({}, fullData), (userData ? { user: (0, omit_1.omit)(userData, 'services') } : {})), (roomData ? { room: roomData } : {})),
        }
        : {})), (triggerWord ? { triggerWord } : {})), (typeof ranPrepareScript !== 'undefined' ? { ranPrepareScript } : {})), (prepareSentMessage ? { prepareSentMessage } : {})), (processSentMessage ? { processSentMessage } : {})), (resultMessage ? { resultMessage } : {})), (typeof finished !== 'undefined' ? { finished } : {})), (url ? { url } : {})), (typeof httpCallData !== 'undefined' ? { httpCallData } : {})), (httpError ? { httpError } : {})), (typeof httpResult !== 'undefined' ? { httpResult: JSON.stringify(httpResult, null, 2) } : {})), (typeof error !== 'undefined' ? { error } : {})), (typeof errorStack !== 'undefined' ? { errorStack } : {}));
    if (historyId) {
        // Projecting just integration field to comply with existing listener behaviour
        const integrationHistory = yield models_1.IntegrationHistory.updateById(historyId, history, { projection: { 'integration._id': 1 } });
        if (!integrationHistory) {
            throw new Error('error-updating-integration-history');
        }
        void (0, notifyListener_1.notifyOnIntegrationHistoryChanged)(integrationHistory, 'updated', history);
        return historyId;
    }
    // Can't create a new history without there being an integration
    if (!history.integration) {
        throw new Error('error-invalid-integration');
    }
    // TODO: Had to force type cast here because of function's signature
    // It would be easier if we separate into create and update functions
    const { insertedId } = yield models_1.IntegrationHistory.create(history);
    if (!insertedId) {
        throw new Error('error-creating-integration-history');
    }
    void (0, notifyListener_1.notifyOnIntegrationHistoryChangedById)(insertedId, 'inserted');
    return insertedId;
});
exports.updateHistory = updateHistory;
