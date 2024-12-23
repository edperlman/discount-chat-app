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
const server_1 = require("../../../../api/server");
const getPaginationItems_1 = require("../../../../api/server/helpers/getPaginationItems");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const rooms_1 = require("../../../server/api/lib/rooms");
const validateDateParams = (property, date) => {
    let parsedDate = undefined;
    if (date) {
        parsedDate = JSON.parse(date);
    }
    if ((parsedDate === null || parsedDate === void 0 ? void 0 : parsedDate.start) && isNaN(Date.parse(parsedDate.start))) {
        throw new Error(`The "${property}.start" query parameter must be a valid date.`);
    }
    if ((parsedDate === null || parsedDate === void 0 ? void 0 : parsedDate.end) && isNaN(Date.parse(parsedDate.end))) {
        throw new Error(`The "${property}.end" query parameter must be a valid date.`);
    }
    return parsedDate;
};
const isBoolean = (value) => value === 'true' || value === 'false' || typeof value === 'boolean';
server_1.API.v1.addRoute('livechat/rooms', { authRequired: true, validateParams: rest_typings_1.isGETLivechatRoomsParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields } = yield this.parseJsonQuery();
            const { agents, departmentId, open, tags, roomName, onhold, queued } = this.queryParams;
            const { createdAt, customFields, closedAt } = this.queryParams;
            const createdAtParam = validateDateParams('createdAt', createdAt);
            const closedAtParam = validateDateParams('closedAt', closedAt);
            const hasAdminAccess = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-livechat-rooms');
            const hasAgentAccess = (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-l-room')) && (agents === null || agents === void 0 ? void 0 : agents.includes(this.userId)) && (agents === null || agents === void 0 ? void 0 : agents.length) === 1;
            if (!hasAdminAccess && !hasAgentAccess) {
                return server_1.API.v1.unauthorized();
            }
            let parsedCf = undefined;
            if (customFields) {
                try {
                    const parsedCustomFields = JSON.parse(customFields);
                    if (typeof parsedCustomFields !== 'object' || Array.isArray(parsedCustomFields) || parsedCustomFields === null) {
                        throw new Error('Invalid custom fields');
                    }
                    // Model's already checking for the keys, so we don't need to do it here.
                    parsedCf = parsedCustomFields;
                }
                catch (e) {
                    throw new Error('The "customFields" query parameter must be a valid JSON.');
                }
            }
            return server_1.API.v1.success(yield (0, rooms_1.findRooms)(Object.assign(Object.assign({ agents,
                roomName,
                departmentId }, (isBoolean(open) && { open: open === 'true' })), { createdAt: createdAtParam, closedAt: closedAtParam, tags, customFields: parsedCf, onhold,
                queued, options: { offset, count, sort, fields } })));
        });
    },
});
server_1.API.v1.addRoute('livechat/rooms/filters', { authRequired: true, permissionsRequired: ['view-l-room'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return server_1.API.v1.success({
                filters: (yield models_1.LivechatRooms.findAvailableSources().toArray())[0].fullTypes,
            });
        });
    },
});
