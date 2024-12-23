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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuditRoomMembersProps = void 0;
const models_1 = require("@rocket.chat/models");
const ajv_1 = __importDefault(require("ajv"));
const api_1 = require("../../../app/api/server/api");
const getPaginationItems_1 = require("../../../app/api/server/helpers/getPaginationItems");
const findUsersOfRoom_1 = require("../../../server/lib/findUsersOfRoom");
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const auditRoomMembersSchema = {
    type: 'object',
    properties: {
        roomId: { type: 'string', minLength: 1 },
        filter: { type: 'string' },
        count: { type: 'number' },
        offset: { type: 'number' },
        sort: { type: 'string' },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isAuditRoomMembersProps = ajv.compile(auditRoomMembersSchema);
api_1.API.v1.addRoute('audit/rooms.members', { authRequired: true, permissionsRequired: ['view-members-list-all-rooms'], validateParams: exports.isAuditRoomMembersProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, filter } = this.queryParams;
            const { count: limit, offset: skip } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const room = yield models_1.Rooms.findOneById(roomId, { projection: { _id: 1, name: 1, fname: 1 } });
            if (!room) {
                return api_1.API.v1.notFound();
            }
            const { cursor, totalCount } = (0, findUsersOfRoom_1.findUsersOfRoom)(Object.assign({ rid: room._id, filter,
                skip,
                limit }, ((sort === null || sort === void 0 ? void 0 : sort.username) && { sort: { username: sort.username } })));
            const [members, total] = yield Promise.all([cursor.toArray(), totalCount]);
            yield models_1.AuditLog.insertOne({
                ts: new Date(),
                results: total,
                u: {
                    _id: this.user._id,
                    username: this.user.username,
                    name: this.user.name,
                    avatarETag: this.user.avatarETag,
                },
                fields: {
                    msg: 'Room_members_list',
                    rids: [room._id],
                    type: 'room_member_list',
                    room: room.name || room.fname,
                    filters: filter,
                },
            });
            return api_1.API.v1.success({
                members,
                count: members.length,
                offset: skip,
                total,
            });
        });
    },
});
