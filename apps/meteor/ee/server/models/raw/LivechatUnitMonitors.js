"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivechatUnitMonitorsRaw = void 0;
const BaseRaw_1 = require("../../../../server/models/raw/BaseRaw");
class LivechatUnitMonitorsRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'livechat_unit_monitors');
    }
    modelIndexes() {
        return [
            {
                key: {
                    unitId: 1,
                },
            },
            {
                key: {
                    monitorId: 1,
                },
            },
        ];
    }
    findByUnitId(unitId) {
        return this.find({ unitId });
    }
    findByMonitorId(monitorId) {
        return this.find({ monitorId });
    }
    saveMonitor(monitor) {
        return this.updateOne({
            monitorId: monitor.monitorId,
            unitId: monitor.unitId,
        }, {
            $set: {
                monitorId: monitor.monitorId,
                unitId: monitor.unitId,
                username: monitor.username,
            },
        }, { upsert: true });
    }
    removeByUnitIdAndMonitorId(unitId, monitorId) {
        return this.deleteMany({ unitId, monitorId });
    }
    removeByUnitId(unitId) {
        return this.deleteMany({ unitId });
    }
    removeByMonitorId(monitorId) {
        return this.deleteMany({ monitorId });
    }
}
exports.LivechatUnitMonitorsRaw = LivechatUnitMonitorsRaw;
