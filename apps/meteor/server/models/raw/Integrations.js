"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class IntegrationsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'integrations', trash);
    }
    modelIndexes() {
        return [{ key: { type: 1 } }];
    }
    findOneByUrl(url) {
        return this.findOne({ url });
    }
    updateRoomName(oldRoomName, newRoomName) {
        const hashedOldRoomName = `#${oldRoomName}`;
        const hashedNewRoomName = `#${newRoomName}`;
        return this.updateMany({
            channel: hashedOldRoomName,
        }, {
            $set: {
                'channel.$': hashedNewRoomName,
            },
        });
    }
    findOneByIdAndCreatedByIfExists({ _id, createdBy, }) {
        return this.findOne(Object.assign({ _id }, (createdBy && { '_createdBy._id': createdBy })));
    }
    disableByUserId(userId) {
        return this.updateMany({ userId }, { $set: { enabled: false } });
    }
    findByUserId(userId) {
        return this.find({ userId }, { projection: { _id: 1 } });
    }
    findByChannels(channels) {
        return this.find({ channel: { $in: channels } });
    }
}
exports.IntegrationsRaw = IntegrationsRaw;
