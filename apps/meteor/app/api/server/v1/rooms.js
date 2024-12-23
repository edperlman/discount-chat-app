"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.findRoomByIdOrName = findRoomByIdOrName;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const meteor_1 = require("meteor/meteor");
const isTruthy_1 = require("../../../../lib/isTruthy");
const omit_1 = require("../../../../lib/utils/omit");
const dataExport = __importStar(require("../../../../server/lib/dataExport"));
const eraseRoom_1 = require("../../../../server/lib/eraseRoom");
const muteUserInRoom_1 = require("../../../../server/methods/muteUserInRoom");
const unmuteUserInRoom_1 = require("../../../../server/methods/unmuteUserInRoom");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const saveRoomSettings_1 = require("../../../channel-settings/server/methods/saveRoomSettings");
const createDiscussion_1 = require("../../../discussion/server/methods/createDiscussion");
const server_1 = require("../../../file-upload/server");
const sendFileMessage_1 = require("../../../file-upload/server/methods/sendFileMessage");
const leaveRoom_1 = require("../../../lib/server/methods/leaveRoom");
const airGappedRestrictionsWrapper_1 = require("../../../license/server/airGappedRestrictionsWrapper");
const server_2 = require("../../../settings/server");
const api_1 = require("../api");
const composeRoomWithLastMessage_1 = require("../helpers/composeRoomWithLastMessage");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
const getUserFromParams_1 = require("../helpers/getUserFromParams");
const getUploadFormData_1 = require("../lib/getUploadFormData");
const maybeMigrateLivechatRoom_1 = require("../lib/maybeMigrateLivechatRoom");
const rooms_1 = require("../lib/rooms");
function findRoomByIdOrName(_a) {
    return __awaiter(this, arguments, void 0, function* ({ params, checkedArchived = true, }) {
        if ((!('roomId' in params) && !('roomName' in params)) ||
            ('roomId' in params && !params.roomId && 'roomName' in params && !params.roomName)) {
            throw new meteor_1.Meteor.Error('error-roomid-param-not-provided', 'The parameter "roomId" or "roomName" is required');
        }
        const projection = Object.assign({}, api_1.API.v1.defaultFieldsToExclude);
        let room;
        if ('roomId' in params) {
            room = yield models_1.Rooms.findOneById(params.roomId || '', { projection });
        }
        else if ('roomName' in params) {
            room = yield models_1.Rooms.findOneByName(params.roomName || '', { projection });
        }
        if (!room) {
            throw new meteor_1.Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any channel');
        }
        if (checkedArchived && room.archived) {
            throw new meteor_1.Meteor.Error('error-room-archived', `The channel, ${room.name}, is archived`);
        }
        return room;
    });
}
api_1.API.v1.addRoute('rooms.nameExists', {
    authRequired: true,
    validateParams: rest_typings_1.isGETRoomsNameExists,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomName } = this.queryParams;
            const room = yield models_1.Rooms.findOneByName(roomName, { projection: { _id: 1 } });
            return api_1.API.v1.success({ exists: !!room });
        });
    },
});
api_1.API.v1.addRoute('rooms.delete', {
    authRequired: true,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.bodyParams;
            if (!roomId) {
                return api_1.API.v1.failure("The 'roomId' param is required");
            }
            yield (0, eraseRoom_1.eraseRoom)(roomId, this.userId);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('rooms.get', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { updatedSince } = this.queryParams;
            let updatedSinceDate;
            if (updatedSince) {
                if (isNaN(Date.parse(updatedSince))) {
                    throw new meteor_1.Meteor.Error('error-updatedSince-param-invalid', 'The "updatedSince" query parameter must be a valid date.');
                }
                else {
                    updatedSinceDate = new Date(updatedSince);
                }
            }
            let result = yield meteor_1.Meteor.callAsync('rooms/get', updatedSinceDate);
            if (Array.isArray(result)) {
                result = {
                    update: result,
                    remove: [],
                };
            }
            return api_1.API.v1.success({
                update: yield Promise.all(result.update.map((room) => (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId))),
                remove: yield Promise.all(result.remove.map((room) => (0, composeRoomWithLastMessage_1.composeRoomWithLastMessage)(room, this.userId))),
            });
        });
    },
});
api_1.API.v1.addRoute('rooms.upload/:rid', {
    authRequired: true,
    deprecation: {
        version: '8.0.0',
        alternatives: ['rooms.media'],
    },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(this.urlParams.rid, this.userId))) {
                return api_1.API.v1.unauthorized();
            }
            const file = yield (0, getUploadFormData_1.getUploadFormData)({
                request: this.request,
            }, { field: 'file', sizeLimit: server_2.settings.get('FileUpload_MaxFileSize') });
            if (!file) {
                throw new meteor_1.Meteor.Error('invalid-field');
            }
            const { fields } = file;
            let { fileBuffer } = file;
            const details = {
                name: file.filename,
                size: fileBuffer.length,
                type: file.mimetype,
                rid: this.urlParams.rid,
                userId: this.userId,
            };
            const stripExif = server_2.settings.get('Message_Attachments_Strip_Exif');
            if (stripExif) {
                // No need to check mime. Library will ignore any files without exif/xmp tags (like BMP, ico, PDF, etc)
                fileBuffer = yield core_services_1.Media.stripExifFromBuffer(fileBuffer);
            }
            const fileStore = server_1.FileUpload.getStore('Uploads');
            const uploadedFile = yield fileStore.insert(details, fileBuffer);
            if (((_b = (_a = fields.description) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > server_2.settings.get('Message_MaxAllowedSize')) {
                throw new meteor_1.Meteor.Error('error-message-size-exceeded');
            }
            uploadedFile.description = fields.description;
            delete fields.description;
            yield (0, airGappedRestrictionsWrapper_1.applyAirGappedRestrictionsValidation)(() => (0, sendFileMessage_1.sendFileMessage)(this.userId, { roomId: this.urlParams.rid, file: uploadedFile, msgData: fields }));
            const message = yield models_1.Messages.getMessageByFileIdAndUsername(uploadedFile._id, this.userId);
            return api_1.API.v1.success({
                message,
            });
        });
    },
});
api_1.API.v1.addRoute('rooms.media/:rid', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(this.urlParams.rid, this.userId))) {
                return api_1.API.v1.unauthorized();
            }
            const file = yield (0, getUploadFormData_1.getUploadFormData)({
                request: this.request,
            }, { field: 'file', sizeLimit: server_2.settings.get('FileUpload_MaxFileSize') });
            if (!file) {
                throw new meteor_1.Meteor.Error('invalid-field');
            }
            let { fileBuffer } = file;
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);
            const { fields } = file;
            let content;
            if (fields.content) {
                try {
                    content = JSON.parse(fields.content);
                }
                catch (e) {
                    console.error(e);
                    throw new meteor_1.Meteor.Error('invalid-field-content');
                }
            }
            const details = {
                name: file.filename,
                size: fileBuffer.length,
                type: file.mimetype,
                rid: this.urlParams.rid,
                userId: this.userId,
                content,
                expiresAt,
            };
            const stripExif = server_2.settings.get('Message_Attachments_Strip_Exif');
            if (stripExif) {
                // No need to check mime. Library will ignore any files without exif/xmp tags (like BMP, ico, PDF, etc)
                fileBuffer = yield core_services_1.Media.stripExifFromBuffer(fileBuffer);
            }
            const fileStore = server_1.FileUpload.getStore('Uploads');
            const uploadedFile = yield fileStore.insert(details, fileBuffer);
            uploadedFile.path = server_1.FileUpload.getPath(`${uploadedFile._id}/${encodeURI(uploadedFile.name || '')}`);
            yield models_1.Uploads.updateFileComplete(uploadedFile._id, this.userId, (0, omit_1.omit)(uploadedFile, '_id'));
            return api_1.API.v1.success({
                file: {
                    _id: uploadedFile._id,
                    url: uploadedFile.path,
                },
            });
        });
    },
});
api_1.API.v1.addRoute('rooms.mediaConfirm/:rid/:fileId', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(this.urlParams.rid, this.userId))) {
                return api_1.API.v1.unauthorized();
            }
            const file = yield models_1.Uploads.findOneById(this.urlParams.fileId);
            if (!file) {
                throw new meteor_1.Meteor.Error('invalid-file');
            }
            if (((_b = (_a = this.bodyParams.description) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > server_2.settings.get('Message_MaxAllowedSize')) {
                throw new meteor_1.Meteor.Error('error-message-size-exceeded');
            }
            file.description = this.bodyParams.description;
            delete this.bodyParams.description;
            yield (0, airGappedRestrictionsWrapper_1.applyAirGappedRestrictionsValidation)(() => (0, sendFileMessage_1.sendFileMessage)(this.userId, { roomId: this.urlParams.rid, file, msgData: this.bodyParams }, { parseAttachmentsForE2EE: false }));
            yield models_1.Uploads.confirmTemporaryFile(this.urlParams.fileId, this.userId);
            const message = yield models_1.Messages.getMessageByFileIdAndUsername(file._id, this.userId);
            return api_1.API.v1.success({
                message,
            });
        });
    },
});
api_1.API.v1.addRoute('rooms.saveNotification', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, notifications } = this.bodyParams;
            if (!roomId) {
                return api_1.API.v1.failure("The 'roomId' param is required");
            }
            if (!notifications || Object.keys(notifications).length === 0) {
                return api_1.API.v1.failure("The 'notifications' param is required");
            }
            yield Promise.all(Object.keys(notifications).map((notificationKey) => __awaiter(this, void 0, void 0, function* () { return meteor_1.Meteor.callAsync('saveNotificationSettings', roomId, notificationKey, notifications[notificationKey]); })));
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('rooms.favorite', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { favorite } = this.bodyParams;
            if (!this.bodyParams.hasOwnProperty('favorite')) {
                return api_1.API.v1.failure("The 'favorite' param is required");
            }
            const room = yield findRoomByIdOrName({ params: this.bodyParams });
            yield meteor_1.Meteor.callAsync('toggleFavorite', room._id, favorite);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('rooms.cleanHistory', { authRequired: true, validateParams: rest_typings_1.isRoomsCleanHistoryProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield findRoomByIdOrName({ params: this.bodyParams });
            const { _id } = room;
            if (!room || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: this.userId }))) {
                return api_1.API.v1.failure('User does not have access to the room [error-not-allowed]', 'error-not-allowed');
            }
            const { latest, oldest, inclusive = false, limit, excludePinned, filesOnly, ignoreThreads, ignoreDiscussion, users, } = this.bodyParams;
            if (!latest) {
                return api_1.API.v1.failure('Body parameter "latest" is required.');
            }
            if (!oldest) {
                return api_1.API.v1.failure('Body parameter "oldest" is required.');
            }
            const count = yield meteor_1.Meteor.callAsync('cleanRoomHistory', {
                roomId: _id,
                latest: new Date(latest),
                oldest: new Date(oldest),
                inclusive,
                limit,
                excludePinned: [true, 'true', 1, '1'].includes(excludePinned !== null && excludePinned !== void 0 ? excludePinned : false),
                filesOnly: [true, 'true', 1, '1'].includes(filesOnly !== null && filesOnly !== void 0 ? filesOnly : false),
                ignoreThreads: [true, 'true', 1, '1'].includes(ignoreThreads !== null && ignoreThreads !== void 0 ? ignoreThreads : false),
                ignoreDiscussion: [true, 'true', 1, '1'].includes(ignoreDiscussion !== null && ignoreDiscussion !== void 0 ? ignoreDiscussion : false),
                fromUsers: users,
            });
            return api_1.API.v1.success({ _id, count });
        });
    },
});
api_1.API.v1.addRoute('rooms.info', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const room = yield findRoomByIdOrName({ params: this.queryParams });
            const { fields } = yield this.parseJsonQuery();
            if (!room || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: this.userId }))) {
                return api_1.API.v1.failure('not-allowed', 'Not Allowed');
            }
            const discussionParent = room.prid &&
                (yield models_1.Rooms.findOneById(room.prid, {
                    projection: { name: 1, fname: 1, t: 1, prid: 1, u: 1, sidepanel: 1 },
                }));
            const { team, parentRoom } = yield core_services_1.Team.getRoomInfo(room);
            const parent = discussionParent || parentRoom;
            const options = { projection: fields };
            return api_1.API.v1.success(Object.assign(Object.assign({ room: (_a = (yield (0, maybeMigrateLivechatRoom_1.maybeMigrateLivechatRoom)(yield models_1.Rooms.findOneByIdOrName(room._id, options), options))) !== null && _a !== void 0 ? _a : undefined }, (team && { team })), (parent && { parent })));
        });
    },
});
api_1.API.v1.addRoute('rooms.leave', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield findRoomByIdOrName({ params: this.bodyParams });
            const user = yield models_1.Users.findOneById(this.userId);
            if (!user) {
                return api_1.API.v1.failure('Invalid user');
            }
            yield (0, leaveRoom_1.leaveRoomMethod)(user, room._id);
            return api_1.API.v1.success();
        });
    },
});
/*
TO-DO: 8.0.0 should use the ajv validation
which will change this endpoint's
response errors.
*/
api_1.API.v1.addRoute('rooms.createDiscussion', { authRequired: true /* , validateParams: isRoomsCreateDiscussionProps */ }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { prid, pmid, reply, t_name, users, encrypted, topic } = this.bodyParams;
            if (!prid) {
                return api_1.API.v1.failure('Body parameter "prid" is required.');
            }
            if (!t_name) {
                return api_1.API.v1.failure('Body parameter "t_name" is required.');
            }
            if (users && !Array.isArray(users)) {
                return api_1.API.v1.failure('Body parameter "users" must be an array.');
            }
            if (encrypted !== undefined && typeof encrypted !== 'boolean') {
                return api_1.API.v1.failure('Body parameter "encrypted" must be a boolean when included.');
            }
            const discussion = yield (0, airGappedRestrictionsWrapper_1.applyAirGappedRestrictionsValidation)(() => (0, createDiscussion_1.createDiscussion)(this.userId, {
                prid,
                pmid,
                t_name,
                reply,
                users: (users === null || users === void 0 ? void 0 : users.filter(isTruthy_1.isTruthy)) || [],
                encrypted,
                topic,
            }));
            return api_1.API.v1.success({ discussion });
        });
    },
});
api_1.API.v1.addRoute('rooms.getDiscussions', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield findRoomByIdOrName({ params: this.queryParams });
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            if (!room || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: this.userId }))) {
                return api_1.API.v1.failure('not-allowed', 'Not Allowed');
            }
            const ourQuery = Object.assign(query, { prid: room._id });
            const { cursor, totalCount } = yield models_1.Rooms.findPaginated(ourQuery, {
                sort: sort || { fname: 1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [discussions, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                discussions,
                count: discussions.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('rooms.images', { authRequired: true, validateParams: rest_typings_1.isRoomsImagesProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield models_1.Rooms.findOneById(this.queryParams.roomId, {
                projection: { t: 1, teamId: 1, prid: 1 },
            });
            if (!room || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: this.userId }))) {
                return api_1.API.v1.unauthorized();
            }
            let initialImage = null;
            if (this.queryParams.startingFromId) {
                initialImage = yield models_1.Uploads.findOneById(this.queryParams.startingFromId);
            }
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { cursor, totalCount } = models_1.Uploads.findImagesByRoomId(room._id, initialImage === null || initialImage === void 0 ? void 0 : initialImage.uploadedAt, {
                skip: offset,
                limit: count,
            });
            const [files, total] = yield Promise.all([cursor.toArray(), totalCount]);
            // If the initial image was not returned in the query, insert it as the first element of the list
            if (initialImage && !files.find(({ _id }) => _id === initialImage._id)) {
                files.splice(0, 0, initialImage);
            }
            return api_1.API.v1.success({
                files,
                count,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('rooms.adminRooms', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { types, filter } = this.queryParams;
            return api_1.API.v1.success(yield (0, rooms_1.findAdminRooms)({
                uid: this.userId,
                filter: filter || '',
                types: (_a = (types && !Array.isArray(types) ? [types] : types)) !== null && _a !== void 0 ? _a : [],
                pagination: {
                    offset,
                    count,
                    sort,
                },
            }));
        });
    },
});
api_1.API.v1.addRoute('rooms.autocomplete.adminRooms', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { selector } = this.queryParams;
            if (!selector) {
                return api_1.API.v1.failure("The 'selector' param is required");
            }
            return api_1.API.v1.success(yield (0, rooms_1.findAdminRoomsAutocomplete)({
                uid: this.userId,
                selector: JSON.parse(selector),
            }));
        });
    },
});
api_1.API.v1.addRoute('rooms.adminRooms.getRoom', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid } = this.queryParams;
            const room = yield (0, rooms_1.findAdminRoom)({
                uid: this.userId,
                rid: rid || '',
            });
            if (!room) {
                return api_1.API.v1.failure('not-allowed', 'Not Allowed');
            }
            return api_1.API.v1.success(room);
        });
    },
});
api_1.API.v1.addRoute('rooms.autocomplete.channelAndPrivate', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { selector } = this.queryParams;
            if (!selector) {
                return api_1.API.v1.failure("The 'selector' param is required");
            }
            return api_1.API.v1.success(yield (0, rooms_1.findChannelAndPrivateAutocomplete)({
                uid: this.userId,
                selector: JSON.parse(selector),
            }));
        });
    },
});
api_1.API.v1.addRoute('rooms.autocomplete.channelAndPrivate.withPagination', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { selector } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            if (!selector) {
                return api_1.API.v1.failure("The 'selector' param is required");
            }
            return api_1.API.v1.success(yield (0, rooms_1.findChannelAndPrivateAutocompleteWithPagination)({
                uid: this.userId,
                selector: JSON.parse(selector),
                pagination: {
                    offset,
                    count,
                    sort,
                },
            }));
        });
    },
});
api_1.API.v1.addRoute('rooms.autocomplete.availableForTeams', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = this.queryParams;
            if (name && typeof name !== 'string') {
                return api_1.API.v1.failure("The 'name' param is invalid");
            }
            return api_1.API.v1.success(yield (0, rooms_1.findRoomsAvailableForTeams)({
                uid: this.userId,
                name: name || '',
            }));
        });
    },
});
api_1.API.v1.addRoute('rooms.saveRoomSettings', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = this.bodyParams, { rid } = _a, params = __rest(_a, ["rid"]);
            const result = yield (0, saveRoomSettings_1.saveRoomSettings)(this.userId, rid, params);
            return api_1.API.v1.success({ rid: result.rid });
        });
    },
});
api_1.API.v1.addRoute('rooms.changeArchivationState', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid, action } = this.bodyParams;
            let result;
            if (action === 'archive') {
                result = yield meteor_1.Meteor.callAsync('archiveRoom', rid);
            }
            else {
                result = yield meteor_1.Meteor.callAsync('unarchiveRoom', rid);
            }
            return api_1.API.v1.success({ result });
        });
    },
});
api_1.API.v1.addRoute('rooms.export', { authRequired: true, validateParams: rest_typings_1.isRoomsExportProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid, type } = this.bodyParams;
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'mail-messages', rid))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Mailing is not allowed');
            }
            const room = yield models_1.Rooms.findOneById(rid);
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room');
            }
            const user = yield models_1.Users.findOneById(this.userId);
            if (!user || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, user))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not Allowed');
            }
            if (type === 'file') {
                const { dateFrom, dateTo } = this.bodyParams;
                const { format } = this.bodyParams;
                const convertedDateFrom = dateFrom ? new Date(dateFrom) : new Date(0);
                const convertedDateTo = dateTo ? new Date(dateTo) : new Date();
                convertedDateTo.setDate(convertedDateTo.getDate() + 1);
                if (convertedDateFrom > convertedDateTo) {
                    throw new meteor_1.Meteor.Error('error-invalid-dates', 'From date cannot be after To date');
                }
                void dataExport.sendFile({
                    rid,
                    format: format,
                    dateFrom: convertedDateFrom,
                    dateTo: convertedDateTo,
                }, user);
                return api_1.API.v1.success();
            }
            if (type === 'email') {
                const { toUsers, toEmails, subject, messages } = this.bodyParams;
                if ((!toUsers || toUsers.length === 0) && (!toEmails || toEmails.length === 0)) {
                    throw new meteor_1.Meteor.Error('error-invalid-recipient');
                }
                const result = yield dataExport.sendViaEmail({
                    rid,
                    toUsers: toUsers || [],
                    toEmails: toEmails || [],
                    subject: subject || '',
                    messages: messages || [],
                    language: user.language || 'en',
                }, user);
                return api_1.API.v1.success(result);
            }
            return api_1.API.v1.failure();
        });
    },
});
api_1.API.v1.addRoute('rooms.isMember', {
    authRequired: true,
    validateParams: rest_typings_1.isRoomsIsMemberProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, userId, username } = this.queryParams;
            const [room, user] = yield Promise.all([
                findRoomByIdOrName({
                    params: { roomId },
                }),
                models_1.Users.findOneByIdOrUsername(userId || username),
            ]);
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                return api_1.API.v1.failure('error-user-not-found');
            }
            if (yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: this.user._id })) {
                return api_1.API.v1.success({
                    isMember: (yield models_1.Subscriptions.countByRoomIdAndUserId(room._id, user._id)) > 0,
                });
            }
            return api_1.API.v1.unauthorized();
        });
    },
});
api_1.API.v1.addRoute('rooms.muteUser', { authRequired: true, validateParams: rest_typings_1.isRoomsMuteUnmuteUserProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            if (!user.username) {
                return api_1.API.v1.failure('Invalid user');
            }
            yield (0, muteUserInRoom_1.muteUserInRoom)(this.userId, { rid: this.bodyParams.roomId, username: user.username });
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('rooms.unmuteUser', { authRequired: true, validateParams: rest_typings_1.isRoomsMuteUnmuteUserProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            if (!user.username) {
                return api_1.API.v1.failure('Invalid user');
            }
            yield (0, unmuteUserInRoom_1.unmuteUserInRoom)(this.userId, { rid: this.bodyParams.roomId, username: user.username });
            return api_1.API.v1.success();
        });
    },
});
