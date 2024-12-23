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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const server_1 = require("../../../../api/server");
const getPaginationItems_1 = require("../../../../api/server/helpers/getPaginationItems");
const inquiries_1 = require("../../../server/api/lib/inquiries");
const takeInquiry_1 = require("../../../server/methods/takeInquiry");
server_1.API.v1.addRoute('livechat/inquiries.list', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isGETLivechatInquiriesListParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { department } = this.queryParams;
            const ourQuery = { status: 'queued' };
            if (department) {
                const departmentFromDB = yield models_1.LivechatDepartment.findOneByIdOrName(department, { projection: { _id: 1 } });
                if (departmentFromDB) {
                    ourQuery.department = departmentFromDB._id;
                }
            }
            // @ts-expect-error - attachments...
            const { cursor, totalCount } = models_1.LivechatInquiry.findPaginated(ourQuery, {
                sort: sort || { ts: -1 },
                skip: offset,
                limit: count,
                projection: {
                    rid: 1,
                    name: 1,
                    ts: 1,
                    status: 1,
                    department: 1,
                },
            });
            const [inquiries, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return server_1.API.v1.success({
                inquiries,
                offset,
                count: inquiries.length,
                total,
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/inquiries.take', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isPOSTLivechatInquiriesTakeParams }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.bodyParams.userId && !(yield models_1.Users.findOneById(this.bodyParams.userId, { projection: { _id: 1 } }))) {
                return server_1.API.v1.failure('The user is invalid');
            }
            return server_1.API.v1.success({
                inquiry: yield (0, takeInquiry_1.takeInquiry)(this.bodyParams.userId || this.userId, this.bodyParams.inquiryId),
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/inquiries.queuedForUser', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isGETLivechatInquiriesQueuedForUserParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { department } = this.queryParams;
            return server_1.API.v1.success(yield (0, inquiries_1.findInquiries)({
                userId: this.userId,
                department,
                status: core_typings_1.LivechatInquiryStatus.QUEUED,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            }));
        });
    },
});
server_1.API.v1.addRoute('livechat/inquiries.getOne', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isGETLivechatInquiriesGetOneParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.queryParams;
            return server_1.API.v1.success(yield (0, inquiries_1.findOneInquiryByRoomId)({
                roomId,
            }));
        });
    },
});
