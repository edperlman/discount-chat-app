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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const meteor_1 = require("meteor/meteor");
const canned_responses_1 = require("./lib/canned-responses");
const server_1 = require("../../../../app/api/server");
const getPaginationItems_1 = require("../../../../app/api/server/helpers/getPaginationItems");
server_1.API.v1.addRoute('canned-responses.get', { authRequired: true, permissionsRequired: ['view-canned-responses'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return server_1.API.v1.success({
                responses: yield (0, canned_responses_1.findAllCannedResponses)({ userId: this.userId }),
            });
        });
    },
});
server_1.API.v1.addRoute('canned-responses', {
    authRequired: true,
    permissionsRequired: { GET: ['view-canned-responses'], POST: ['save-canned-responses'], DELETE: ['remove-canned-responses'] },
    validateParams: { POST: rest_typings_1.isPOSTCannedResponsesProps, DELETE: rest_typings_1.isDELETECannedResponsesProps, GET: rest_typings_1.isCannedResponsesProps },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields } = yield this.parseJsonQuery();
            const { shortcut, text, scope, tags, departmentId, createdBy } = this.queryParams;
            const { cannedResponses, total } = yield (0, canned_responses_1.findAllCannedResponsesFilter)({
                shortcut,
                text,
                scope,
                tags,
                departmentId,
                userId: this.userId,
                createdBy,
                options: {
                    sort,
                    offset,
                    count,
                    fields,
                },
            });
            return server_1.API.v1.success({
                cannedResponses,
                count: cannedResponses.length,
                offset,
                total,
            });
        });
    },
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, shortcut, text, scope, departmentId, tags } = this.bodyParams;
            yield meteor_1.Meteor.callAsync('saveCannedResponse', _id, Object.assign(Object.assign({ shortcut,
                text,
                scope }, (tags && { tags })), (departmentId && { departmentId })));
            return server_1.API.v1.success();
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = this.bodyParams;
            yield meteor_1.Meteor.callAsync('removeCannedResponse', _id);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('canned-responses/:_id', { authRequired: true, permissionsRequired: ['view-canned-responses'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = this.urlParams;
            const cannedResponse = yield (0, canned_responses_1.findOneCannedResponse)({
                userId: this.userId,
                _id,
            });
            if (!cannedResponse) {
                return server_1.API.v1.notFound();
            }
            return server_1.API.v1.success({ cannedResponse });
        });
    },
});
