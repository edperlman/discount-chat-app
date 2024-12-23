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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
api_1.API.v1.addRoute('custom-user-status.list', { authRequired: true, validateParams: rest_typings_1.isCustomUserStatusListProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, query } = yield this.parseJsonQuery();
            const { name, _id } = this.queryParams;
            const filter = Object.assign(Object.assign(Object.assign({}, query), (name ? { name: { $regex: (0, string_helpers_1.escapeRegExp)(name), $options: 'i' } } : {})), (_id ? { _id } : {}));
            const { cursor, totalCount } = models_1.CustomUserStatus.findPaginated(filter, {
                sort: sort || { name: 1 },
                skip: offset,
                limit: count,
            });
            const [statuses, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                statuses,
                count: statuses.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('custom-user-status.create', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                name: String,
                statusType: check_1.Match.Maybe(String),
            });
            const userStatusData = {
                name: this.bodyParams.name,
                statusType: this.bodyParams.statusType,
            };
            yield meteor_1.Meteor.callAsync('insertOrUpdateUserStatus', userStatusData);
            const customUserStatus = yield models_1.CustomUserStatus.findOneByName(userStatusData.name);
            if (!customUserStatus) {
                throw new meteor_1.Meteor.Error('error-creating-custom-user-status', 'Error creating custom user status');
            }
            return api_1.API.v1.success({
                customUserStatus,
            });
        });
    },
});
api_1.API.v1.addRoute('custom-user-status.delete', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { customUserStatusId } = this.bodyParams;
            if (!customUserStatusId) {
                return api_1.API.v1.failure('The "customUserStatusId" params is required!');
            }
            yield meteor_1.Meteor.callAsync('deleteCustomUserStatus', customUserStatusId);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('custom-user-status.update', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                _id: String,
                name: String,
                statusType: check_1.Match.Maybe(String),
            });
            const userStatusData = {
                _id: this.bodyParams._id,
                name: this.bodyParams.name,
                statusType: this.bodyParams.statusType,
            };
            const customUserStatusToUpdate = yield models_1.CustomUserStatus.findOneById(userStatusData._id);
            // Ensure the message exists
            if (!customUserStatusToUpdate) {
                return api_1.API.v1.failure(`No custom user status found with the id of "${userStatusData._id}".`);
            }
            yield meteor_1.Meteor.callAsync('insertOrUpdateUserStatus', userStatusData);
            const customUserStatus = yield models_1.CustomUserStatus.findOneById(userStatusData._id);
            if (!customUserStatus) {
                throw new meteor_1.Meteor.Error('error-updating-custom-user-status', 'Error updating custom user status');
            }
            return api_1.API.v1.success({
                customUserStatus,
            });
        });
    },
});
