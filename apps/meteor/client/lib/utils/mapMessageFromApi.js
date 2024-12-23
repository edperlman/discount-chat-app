"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapMessageFromApi = void 0;
const mapMessageFromApi = (_a) => {
    var { attachments, tlm, ts, _updatedAt, pinnedAt, webRtcCallEndTs } = _a, message = __rest(_a, ["attachments", "tlm", "ts", "_updatedAt", "pinnedAt", "webRtcCallEndTs"]);
    return (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, message), { ts: new Date(ts) }), (tlm && { tlm: new Date(tlm) })), { _updatedAt: new Date(_updatedAt) }), (pinnedAt && { pinnedAt: new Date(pinnedAt) })), (webRtcCallEndTs && { webRtcCallEndTs: new Date(webRtcCallEndTs) })), (attachments && {
        attachments: attachments.map((_a) => {
            var { ts } = _a, attachment = __rest(_a, ["ts"]);
            return (Object.assign(Object.assign({}, (ts && { ts: new Date(ts) })), attachment));
        }),
    })));
};
exports.mapMessageFromApi = mapMessageFromApi;
