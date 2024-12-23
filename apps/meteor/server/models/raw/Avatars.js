"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarsRaw = void 0;
const BaseUploadModel_1 = require("./BaseUploadModel");
class AvatarsRaw extends BaseUploadModel_1.BaseUploadModelRaw {
    constructor(db, trash) {
        super(db, 'avatars', trash);
    }
    findOneByUserId(userId, options) {
        return this.findOne({ userId }, options);
    }
}
exports.AvatarsRaw = AvatarsRaw;
