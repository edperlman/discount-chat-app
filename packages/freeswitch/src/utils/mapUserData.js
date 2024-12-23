"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserData = mapUserData;
const parseUserStatus_1 = require("./parseUserStatus");
function mapUserData(user) {
    const { userid: extension, context, domain, groups, contact, callgroup: callGroup, effective_caller_id_name: callerName, effective_caller_id_number: callerNumber, } = user;
    if (!extension) {
        throw new Error('Invalid user identification.');
    }
    return {
        extension,
        context,
        domain,
        groups: (groups === null || groups === void 0 ? void 0 : groups.split('|')) || [],
        status: (0, parseUserStatus_1.parseUserStatus)(contact),
        contact,
        callGroup,
        callerName,
        callerNumber,
    };
}
