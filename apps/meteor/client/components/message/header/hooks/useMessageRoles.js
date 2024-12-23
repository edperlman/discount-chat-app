"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageRoles = void 0;
const react_1 = require("react");
const client_1 = require("../../../../../app/models/client");
const useReactiveValue_1 = require("../../../../hooks/useReactiveValue");
const useMessageRoles = (userId, roomId, shouldLoadRoles) => (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => {
    if (!shouldLoadRoles || !userId) {
        return [];
    }
    const userRoles = client_1.UserRoles.findOne(userId);
    const roomRoles = client_1.RoomRoles.findOne({
        'u._id': userId,
        'rid': roomId,
    });
    const roles = [...((userRoles === null || userRoles === void 0 ? void 0 : userRoles.roles) || []), ...((roomRoles === null || roomRoles === void 0 ? void 0 : roomRoles.roles) || [])];
    const result = client_1.Roles.find({
        _id: {
            $in: roles,
        },
        description: {
            $exists: true,
            $ne: '',
        },
    }, {
        fields: {
            description: 1,
        },
    }).fetch();
    return result.map(({ description }) => description);
}, [userId, roomId, shouldLoadRoles]));
exports.useMessageRoles = useMessageRoles;
