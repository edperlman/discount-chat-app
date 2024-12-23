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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRequestNotififyForUsers = void 0;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const server_1 = require("../../../../app/cloud/server");
const i18n_1 = require("../../../../server/lib/i18n");
const sendDirectMessageToUsers_1 = require("../../../../server/lib/sendDirectMessageToUsers");
const ROCKET_CAT_USERID = 'rocket.cat';
const DEFAULT_LIMIT = 100;
const notifyBatchOfUsersError = (error) => {
    return new Error(`could not notify the batch of users. Error ${error}`);
};
const notifyBatchOfUsers = (appName, learnMoreUrl, appRequests) => __awaiter(void 0, void 0, void 0, function* () {
    const batchRequesters = appRequests.reduce((acc, appRequest) => {
        // Prevent duplicate requesters
        if (!acc.includes(appRequest.requester.id)) {
            acc.push(appRequest.requester.id);
        }
        return acc;
    }, []);
    const msgFn = (user) => {
        const defaultLang = user.language || 'en';
        const msg = `${i18n_1.i18n.t('App_request_enduser_message', { appName, learnmore: learnMoreUrl, lng: defaultLang })}`;
        return msg;
    };
    try {
        return yield (0, sendDirectMessageToUsers_1.sendDirectMessageToUsers)(ROCKET_CAT_USERID, batchRequesters, msgFn);
    }
    catch (e) {
        throw e;
    }
});
const appRequestNotififyForUsers = (marketplaceBaseUrl, workspaceUrl, appId, appName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const token = yield (0, server_1.getWorkspaceAccessToken)();
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        // First request
        const pagination = { limit: DEFAULT_LIMIT, offset: 0 };
        // First request to get the total and the first batch
        const response = yield (0, server_fetch_1.serverFetch)(`${marketplaceBaseUrl}/v1/app-request`, {
            headers,
            params: {
                appId,
                q: 'notification-not-sent',
                limit: pagination.limit,
                offset: pagination.offset,
            },
        });
        const data = (yield response.json());
        const { total } = data.meta;
        if (total === undefined || total === 0) {
            return [];
        }
        // Calculate the number of loops - 1 because the first request was already made
        const loops = Math.ceil(total / pagination.limit) - 1;
        const requestsCollection = [];
        const learnMore = `${workspaceUrl}marketplace/explore/info/${appId}`;
        // Notify first batch
        requestsCollection.push(notifyBatchOfUsers(appName, learnMore, data.data).catch(notifyBatchOfUsersError));
        try {
            // Batch requests
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (var _d = true, _e = __asyncValues(Array.from({ length: loops })), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const _i = _c;
                pagination.offset += pagination.limit;
                const request = yield (0, server_fetch_1.serverFetch)(`${marketplaceBaseUrl}/v1/app-request?appId=${appId}&q=notification-not-sent&limit=${pagination.limit}&offset=${pagination.offset}`, { headers });
                const { data } = yield request.json();
                requestsCollection.push(notifyBatchOfUsers(appName, learnMore, data));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const finalResult = yield Promise.all(requestsCollection);
        // Return the list of users that were notified
        return finalResult.flat();
    }
    catch (e) {
        throw e;
    }
});
exports.appRequestNotififyForUsers = appRequestNotififyForUsers;
