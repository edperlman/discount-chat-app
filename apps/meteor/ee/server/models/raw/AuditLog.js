"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRaw = void 0;
const BaseRaw_1 = require("../../../../server/models/raw/BaseRaw");
class AuditLogRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'audit_log', trash);
    }
}
exports.AuditLogRaw = AuditLogRaw;
