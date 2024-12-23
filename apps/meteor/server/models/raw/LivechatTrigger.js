"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivechatTriggerRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class LivechatTriggerRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'livechat_trigger', trash);
    }
    modelIndexes() {
        return [{ key: { enabled: 1 } }];
    }
    findEnabled() {
        return this.find({ enabled: true });
    }
    updateById(_id, data) {
        return this.updateOne({ _id }, { $set: data }); // TODO: remove this cast when TypeScript is updated
    }
}
exports.LivechatTriggerRaw = LivechatTriggerRaw;
