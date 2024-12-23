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
exports.findTags = findTags;
exports.findTagById = findTagById;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const departments_1 = require("./departments");
const hasPermission_1 = require("../../../../../../app/authorization/server/functions/hasPermission");
const logger_1 = require("../../lib/logger");
// If viewAll is true
//  -> & user has access to all tags
//      -> then all tags will be returned
//          -> Pages:
//              - Admin > Omnichannel > Tags
//              - Current chat's panel, filter by tags
//              - Canned response creation
//  -> & user does not have access to all tags
//      -> then only public tags will be returned (unauthorized access - no page uses this)
// If viewAll is false
// -> & user has access to all tags
//      -> & department is not specified
//          -> only public tags will be returned (Pages: Close chat modal tag selection for chats not associated with a department being closed by manager)
//      -> & department is specified
//          -> only tags associated with the department will be returned (Page: Close chat modal tag selection for chats associated with a department being closed by manager)
// -> & user does not have access to all tags (same as viewAll = false & user has access to all tags)
//      -> & department is not specified
//          -> only public tags will be returned (Page: Close chat modal tag selection for chats not associated with a department being closed by agent)
//      -> & department is specified
//          -> only tags associated with the department will be returned (Page: Close chat modal tag selection for chats associated with a department being closed by agent)
function findTags(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, text, department, viewAll, pagination: { offset, count, sort }, }) {
        var _b;
        let filteredDepartmentIds = [];
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-livechat-tags'))) {
            if (viewAll) {
                viewAll = false;
            }
            // Get a list of all departments this user has access to and only
            // return tags that are associated with those departments
            filteredDepartmentIds = yield (0, departments_1.getDepartmentsWhichUserCanAccess)(userId);
            logger_1.helperLogger.debug({
                msg: 'User does not have permission to manage livechat tags. Filtering tags by departments user has access to.',
                userId,
                accessibleDepartmentsLength: filteredDepartmentIds.length,
                top5AccessibleDepartments: filteredDepartmentIds.slice(0, 5),
            });
            if (department && !filteredDepartmentIds.includes(department)) {
                department = undefined;
            }
        }
        if (department) {
            // In certain cases, the user would only want to see tags for a specific department
            // EG: When closing the chat which is associated with a specific department
            // user get's to choose which tag to use to close the chat
            // (only tags associated with the department should be shown)
            filteredDepartmentIds = [department];
        }
        const query = {
            $and: [
                ...(text ? [{ $or: [{ name: new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i') }, { description: new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i') }] }] : []),
                ...(!viewAll
                    ? [
                        {
                            $or: [
                                { departments: { $size: 0 } },
                                ...(filteredDepartmentIds.length ? [{ departments: { $in: filteredDepartmentIds } }] : []),
                            ],
                        },
                    ]
                    : []),
            ],
        };
        if (!((_b = query === null || query === void 0 ? void 0 : query.$and) === null || _b === void 0 ? void 0 : _b.length)) {
            delete query.$and;
        }
        const { cursor, totalCount } = models_1.LivechatTag.findPaginated(query, {
            sort: sort || { name: 1 },
            skip: offset,
            limit: count,
        });
        const [tags, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            tags,
            count: tags.length,
            offset,
            total,
        };
    });
}
function findTagById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ tagId }) {
        return models_1.LivechatTag.findOneById(tagId);
    });
}
