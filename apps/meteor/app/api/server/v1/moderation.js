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
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const deleteReportedMessages_1 = require("../../../../server/lib/moderation/deleteReportedMessages");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
api_1.API.v1.addRoute('moderation.reportsByUsers', {
    authRequired: true,
    validateParams: rest_typings_1.isReportHistoryProps,
    permissionsRequired: ['view-moderation-console'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { latest: _latest, oldest: _oldest, selector = '' } = this.queryParams;
            const { count = 20, offset = 0 } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const latest = _latest ? new Date(_latest) : new Date();
            const oldest = _oldest ? new Date(_oldest) : new Date(0);
            const escapedSelector = (0, string_helpers_1.escapeRegExp)(selector);
            const reports = yield models_1.ModerationReports.findMessageReportsGroupedByUser(latest, oldest, escapedSelector, {
                offset,
                count,
                sort,
            }).toArray();
            if (reports.length === 0) {
                return api_1.API.v1.success({
                    reports,
                    count: 0,
                    offset,
                    total: 0,
                });
            }
            const total = yield models_1.ModerationReports.getTotalUniqueReportedUsers(latest, oldest, escapedSelector, true);
            return api_1.API.v1.success({
                reports,
                count: reports.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('moderation.userReports', {
    authRequired: true,
    validateParams: rest_typings_1.isReportHistoryProps,
    permissionsRequired: ['view-moderation-console'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { latest: _latest, oldest: _oldest, selector = '' } = this.queryParams;
            const { count = 20, offset = 0 } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const latest = _latest ? new Date(_latest) : new Date();
            const oldest = _oldest ? new Date(_oldest) : new Date(0);
            const escapedSelector = (0, string_helpers_1.escapeRegExp)(selector);
            const reports = yield models_1.ModerationReports.findUserReports(latest, oldest, escapedSelector, {
                offset,
                count,
                sort,
            }).toArray();
            if (reports.length === 0) {
                return api_1.API.v1.success({
                    reports,
                    count: 0,
                    offset,
                    total: 0,
                });
            }
            const total = yield models_1.ModerationReports.getTotalUniqueReportedUsers(latest, oldest, escapedSelector);
            const result = {
                reports,
                count: reports.length,
                offset,
                total,
            };
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('moderation.user.reportedMessages', {
    authRequired: true,
    validateParams: rest_typings_1.isGetUserReportsParams,
    permissionsRequired: ['view-moderation-console'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, selector = '' } = this.queryParams;
            const { sort } = yield this.parseJsonQuery();
            const { count = 50, offset = 0 } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const user = yield models_1.Users.findOneById(userId, {
                projection: { _id: 1, username: 1, name: 1 },
            });
            const escapedSelector = (0, string_helpers_1.escapeRegExp)(selector);
            const { cursor, totalCount } = models_1.ModerationReports.findReportedMessagesByReportedUserId(userId, escapedSelector, {
                offset,
                count,
                sort,
            });
            const [reports, total] = yield Promise.all([cursor.toArray(), totalCount]);
            const uniqueMessages = [];
            const visited = new Set();
            for (const report of reports) {
                if (visited.has(report.message._id)) {
                    continue;
                }
                visited.add(report.message._id);
                uniqueMessages.push(report);
            }
            return api_1.API.v1.success({
                user,
                messages: uniqueMessages,
                count: reports.length,
                total,
                offset,
            });
        });
    },
});
api_1.API.v1.addRoute('moderation.user.reportsByUserId', {
    authRequired: true,
    validateParams: rest_typings_1.isGetUserReportsParams,
    permissionsRequired: ['view-moderation-console'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, selector = '' } = this.queryParams;
            const { sort } = yield this.parseJsonQuery();
            const { count = 50, offset = 0 } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const user = yield models_1.Users.findOneById(userId, {
                projection: {
                    _id: 1,
                    username: 1,
                    name: 1,
                    avatarETag: 1,
                    active: 1,
                    roles: 1,
                    emails: 1,
                    createdAt: 1,
                },
            });
            const escapedSelector = (0, string_helpers_1.escapeRegExp)(selector);
            const { cursor, totalCount } = models_1.ModerationReports.findUserReportsByReportedUserId(userId, escapedSelector, {
                offset,
                count,
                sort,
            });
            const [reports, total] = yield Promise.all([cursor.toArray(), totalCount]);
            const emailSet = new Map();
            reports.forEach((report) => {
                var _a, _b;
                const email = (_b = (_a = report.reportedUser) === null || _a === void 0 ? void 0 : _a.emails) === null || _b === void 0 ? void 0 : _b[0];
                if (email) {
                    emailSet.set(email.address, email);
                }
            });
            if (user) {
                user.emails = Array.from(emailSet.values());
            }
            return api_1.API.v1.success({
                user,
                reports,
                count: reports.length,
                total,
                offset,
            });
        });
    },
});
api_1.API.v1.addRoute('moderation.user.deleteReportedMessages', {
    authRequired: true,
    validateParams: rest_typings_1.isModerationDeleteMsgHistoryParams,
    permissionsRequired: ['manage-moderation-actions'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO change complicated params
            const { userId, reason } = this.bodyParams;
            const sanitizedReason = (reason === null || reason === void 0 ? void 0 : reason.trim()) ? reason : 'No reason provided';
            const { user: moderator } = this;
            const { count = 50, offset = 0 } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { cursor, totalCount } = models_1.ModerationReports.findReportedMessagesByReportedUserId(userId, '', {
                offset,
                count,
                sort: { ts: -1 },
            });
            const [messages, total] = yield Promise.all([cursor.toArray(), totalCount]);
            if (total === 0) {
                return api_1.API.v1.failure('No reported messages found for this user.');
            }
            yield (0, deleteReportedMessages_1.deleteReportedMessages)(messages.map((message) => message.message), moderator);
            yield models_1.ModerationReports.hideMessageReportsByUserId(userId, this.userId, sanitizedReason, 'DELETE Messages');
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('moderation.dismissReports', {
    authRequired: true,
    validateParams: rest_typings_1.isArchiveReportProps,
    permissionsRequired: ['manage-moderation-actions'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, msgId, reason, action: actionParam } = this.bodyParams;
            if (userId) {
                const report = yield models_1.ModerationReports.findOne({ 'message.u._id': userId, '_hidden': { $ne: true } }, { projection: { _id: 1 } });
                if (!report) {
                    return api_1.API.v1.failure('no-reports-found');
                }
            }
            if (msgId) {
                const report = yield models_1.ModerationReports.findOne({ 'message._id': msgId, '_hidden': { $ne: true } }, { projection: { _id: 1 } });
                if (!report) {
                    return api_1.API.v1.failure('no-reports-found');
                }
            }
            const sanitizedReason = (reason === null || reason === void 0 ? void 0 : reason.trim()) ? reason : 'No reason provided';
            const action = actionParam !== null && actionParam !== void 0 ? actionParam : 'None';
            const { userId: moderatorId } = this;
            if (userId) {
                yield models_1.ModerationReports.hideMessageReportsByUserId(userId, moderatorId, sanitizedReason, action);
            }
            else {
                yield models_1.ModerationReports.hideMessageReportsByMessageId(msgId, moderatorId, sanitizedReason, action);
            }
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('moderation.dismissUserReports', {
    authRequired: true,
    validateParams: rest_typings_1.isArchiveReportProps,
    permissionsRequired: ['manage-moderation-actions'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, reason, action: actionParam } = this.bodyParams;
            if (!userId) {
                return api_1.API.v1.failure('error-user-id-param-not-provided');
            }
            const sanitizedReason = reason !== null && reason !== void 0 ? reason : 'No reason provided';
            const action = actionParam !== null && actionParam !== void 0 ? actionParam : 'None';
            const { userId: moderatorId } = this;
            yield models_1.ModerationReports.hideUserReportsByUserId(userId, moderatorId, sanitizedReason, action);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('moderation.reports', {
    authRequired: true,
    validateParams: rest_typings_1.isReportsByMsgIdParams,
    permissionsRequired: ['view-moderation-console'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { msgId } = this.queryParams;
            const { count = 50, offset = 0 } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { selector = '' } = this.queryParams;
            const escapedSelector = (0, string_helpers_1.escapeRegExp)(selector);
            const { cursor, totalCount } = models_1.ModerationReports.findReportsByMessageId(msgId, escapedSelector, { count, sort, offset });
            const [reports, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                reports,
                count: reports.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('moderation.reportInfo', {
    authRequired: true,
    permissionsRequired: ['view-moderation-console'],
    validateParams: rest_typings_1.isReportInfoParams,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { reportId } = this.queryParams;
            const report = yield models_1.ModerationReports.findOneById(reportId);
            if (!report) {
                return api_1.API.v1.failure('error-report-not-found');
            }
            return api_1.API.v1.success({ report });
        });
    },
});
api_1.API.v1.addRoute('moderation.reportUser', {
    authRequired: true,
    validateParams: rest_typings_1.isModerationReportUserPost,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, description } = this.bodyParams;
            const { user: { _id, name, username, createdAt }, } = this;
            const reportedUser = yield models_1.Users.findOneById(userId, { projection: { _id: 1, name: 1, username: 1, emails: 1, createdAt: 1 } });
            if (!reportedUser) {
                return api_1.API.v1.failure('Invalid user id provided.');
            }
            yield models_1.ModerationReports.createWithDescriptionAndUser(reportedUser, description, { _id, name, username, createdAt });
            return api_1.API.v1.success();
        });
    },
});
