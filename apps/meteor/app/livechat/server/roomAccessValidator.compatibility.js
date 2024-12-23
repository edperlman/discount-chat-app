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
exports.validators = void 0;
const models_1 = require("@rocket.chat/models");
const RoutingManager_1 = require("./lib/RoutingManager");
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
const hasRole_1 = require("../../authorization/server/functions/hasRole");
exports.validators = [
    function (_room, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                return false;
            }
            return (0, hasPermission_1.hasPermissionAsync)(user._id, 'view-livechat-rooms');
        });
    },
    function (room, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                return false;
            }
            const { _id: userId } = user;
            const { servedBy: { _id: agentId } = {} } = room;
            return userId === agentId || (!room.open && (0, hasPermission_1.hasPermissionAsync)(user._id, 'view-livechat-room-closed-by-another-agent'));
        });
    },
    function (room, _user, extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (extraData === null || extraData === void 0 ? void 0 : extraData.rid) {
                const dbRoom = yield models_1.LivechatRooms.findOneById(extraData.rid);
                if (dbRoom) {
                    room = dbRoom;
                }
            }
            return (extraData === null || extraData === void 0 ? void 0 : extraData.visitorToken) && room.v && room.v.token === extraData.visitorToken && room.open === true;
        });
    },
    function (room, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                return false;
            }
            if (!((_a = RoutingManager_1.RoutingManager.getConfig()) === null || _a === void 0 ? void 0 : _a.previewRoom)) {
                return;
            }
            let departmentIds;
            if (!(yield (0, hasRole_1.hasRoleAsync)(user._id, 'livechat-manager'))) {
                const departmentAgents = (yield models_1.LivechatDepartmentAgents.findByAgentId(user._id, { projection: { departmentId: 1 } }).toArray()).map((d) => d.departmentId);
                departmentIds = (yield models_1.LivechatDepartment.findEnabledInIds(departmentAgents, { projection: { _id: 1 } }).toArray()).map((d) => d._id);
            }
            const filter = {
                rid: room._id,
                $or: [
                    {
                        $and: [{ defaultAgent: { $exists: true } }, { 'defaultAgent.agentId': user._id }],
                    },
                    Object.assign({}, (departmentIds && departmentIds.length > 0 && { department: { $in: departmentIds } })),
                    {
                        department: { $exists: false }, // No department == public queue
                    },
                ],
            };
            const inquiry = yield models_1.LivechatInquiry.findOne(filter, { projection: { status: 1 } });
            return inquiry && inquiry.status === 'queued';
        });
    },
    function (room, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!room.departmentId || room.open || !(user === null || user === void 0 ? void 0 : user._id)) {
                return;
            }
            const agentOfDepartment = yield models_1.LivechatDepartmentAgents.findOneByAgentIdAndDepartmentId(user._id, room.departmentId, {
                projection: { _id: 1 },
            });
            if (!agentOfDepartment) {
                return;
            }
            return (0, hasPermission_1.hasPermissionAsync)(user._id, 'view-livechat-room-closed-same-department');
        });
    },
    function (_room, user) {
        // Check if user is rocket.cat
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return false;
        }
        // This opens the ability for rocketcat to upload files to a livechat room without being included in it :)
        // Worst case, someone manages to log in as rocketcat lol
        return user._id === 'rocket.cat';
    },
];
