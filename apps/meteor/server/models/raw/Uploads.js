"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsRaw = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const BaseUploadModel_1 = require("./BaseUploadModel");
class UploadsRaw extends BaseUploadModel_1.BaseUploadModelRaw {
    constructor(db, trash) {
        super(db, 'uploads', trash);
    }
    modelIndexes() {
        return [...super.modelIndexes(), { key: { uploadedAt: -1 } }, { key: { rid: 1, _hidden: 1, typeGroup: 1 } }];
    }
    findNotHiddenFilesOfRoom(roomId, searchText, fileType, limit) {
        const fileQuery = Object.assign(Object.assign({ rid: roomId, complete: true, uploading: false, _hidden: {
                $ne: true,
            } }, (searchText && { name: { $regex: new RegExp((0, string_helpers_1.escapeRegExp)(searchText), 'i') } })), (fileType && fileType !== 'all' && { typeGroup: fileType }));
        return this.find(fileQuery, {
            limit,
            sort: {
                uploadedAt: -1,
            },
            projection: {
                _id: 1,
                userId: 1,
                rid: 1,
                name: 1,
                description: 1,
                type: 1,
                url: 1,
                uploadedAt: 1,
                typeGroup: 1,
            },
        });
    }
    findPaginatedWithoutThumbs(query = {}, options) {
        return this.findPaginated(Object.assign(Object.assign({ typeGroup: { $ne: 'thumb' } }, query), { _hidden: { $ne: true } }), options);
    }
    findImagesByRoomId(rid, uploadedAt, options = {}) {
        return this.findPaginated(Object.assign({ rid, _hidden: { $ne: true }, typeGroup: 'image' }, (Boolean(uploadedAt) && {
            uploadedAt: {
                $lte: uploadedAt,
            },
        })), Object.assign(Object.assign({}, options), { sort: { uploadedAt: -1 } }));
    }
}
exports.UploadsRaw = UploadsRaw;
