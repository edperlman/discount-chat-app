"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAgent = void 0;
const baseUrl_1 = require("./baseUrl");
const formatAgent = (agent) => {
    var _a, _b, _c, _d, _e;
    if (!agent) {
        return;
    }
    return {
        _id: agent._id,
        name: agent.name,
        status: agent.status,
        email: (_b = (_a = agent.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.address,
        username: agent.username,
        phone: ((_d = (_c = agent.phone) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.phoneNumber) || ((_e = agent.customFields) === null || _e === void 0 ? void 0 : _e.phone),
        avatar: agent.username
            ? {
                description: agent.username,
                src: (0, baseUrl_1.getAvatarUrl)(agent.username),
            }
            : undefined,
    };
};
exports.formatAgent = formatAgent;
