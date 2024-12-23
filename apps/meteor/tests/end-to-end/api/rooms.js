"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const sleep_1 = require("../../../lib/utils/sleep");
const api_data_1 = require("../../data/api-data");
const chat_helper_1 = require("../../data/chat.helper");
const interactions_1 = require("../../data/interactions");
const permissions_helper_1 = require("../../data/permissions.helper");
const rooms_helper_1 = require("../../data/rooms.helper");
const teams_helper_1 = require("../../data/teams.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
const constants_1 = require("../../e2e/config/constants");
const lstURL = './tests/e2e/fixtures/files/lst-test.lst';
const drawioURL = './tests/e2e/fixtures/files/diagram.drawio';
const svgLogoURL = './public/images/logo/logo.svg';
const svgLogoFileName = 'logo.svg';
(0, mocha_1.describe)('[Rooms]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.it)('/rooms.get', (done) => {
        void api_data_1.request
            .get((0, api_data_1.api)('rooms.get'))
            .set(api_data_1.credentials)
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('update');
            (0, chai_1.expect)(res.body).to.have.property('remove');
        })
            .end(done);
    });
    (0, mocha_1.it)('/rooms.get?updatedSince', (done) => {
        void api_data_1.request
            .get((0, api_data_1.api)('rooms.get'))
            .set(api_data_1.credentials)
            .query({
            updatedSince: new Date(),
        })
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('update').that.have.lengthOf(0);
            (0, chai_1.expect)(res.body).to.have.property('remove').that.have.lengthOf(0);
        })
            .end(done);
    });
    (0, mocha_1.describe)('/rooms.saveNotification:', () => {
        let testChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.${Date.now()}-${Math.random()}` })).body.channel;
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
        (0, mocha_1.it)('/rooms.saveNotification:', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.saveNotification'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                notifications: {
                    disableNotifications: '0',
                    emailNotifications: 'nothing',
                    audioNotificationValue: 'beep',
                    desktopNotifications: 'nothing',
                    mobilePushNotifications: 'mentions',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/rooms.upload', () => {
        let testChannel;
        let user;
        let userCredentials;
        const testChannelName = `channel.test.upload.${Date.now()}-${Math.random()}`;
        let blockedMediaTypes;
        let testPrivateChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: testChannelName })).body.channel;
            testPrivateChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `channel.test.private.${Date.now()}-${Math.random()}` })).body.group;
            blockedMediaTypes = yield (0, permissions_helper_1.getSettingValueById)('FileUpload_MediaTypeBlackList');
            const newBlockedMediaTypes = blockedMediaTypes
                .split(',')
                .filter((type) => type !== 'image/svg+xml')
                .join(',');
            yield (0, permissions_helper_1.updateSetting)('FileUpload_MediaTypeBlackList', newBlockedMediaTypes);
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, users_helper_1.deleteUser)(user),
            (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_room_members', true),
            (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_users_who_can_access_room', false),
            (0, permissions_helper_1.updateSetting)('FileUpload_ProtectFiles', true),
            (0, permissions_helper_1.updateSetting)('FileUpload_MediaTypeBlackList', blockedMediaTypes),
            (0, rooms_helper_1.deleteRoom)({ roomId: testPrivateChannel._id, type: 'p' }),
        ]));
        (0, mocha_1.it)("don't upload a file to room with file field other than file", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('test', interactions_1.imgURL)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', '[invalid-field]');
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-field');
            })
                .end(done);
        });
        (0, mocha_1.it)("don't upload a file to room with empty file", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', '')
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', res.body.error);
            })
                .end(done);
        });
        (0, mocha_1.it)("don't upload a file to room with more than 1 file", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', interactions_1.imgURL)
                .attach('file', interactions_1.imgURL)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Just 1 file is allowed');
            })
                .end(done);
        });
        let fileNewUrl;
        let fileOldUrl;
        (0, mocha_1.it)('should upload a PNG file to room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', interactions_1.imgURL)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                const message = res.body.message;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message');
                (0, chai_1.expect)(res.body.message).to.have.property('attachments');
                (0, chai_1.expect)(res.body.message.attachments).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('image_type', 'image/png');
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('title', '1024x1024.png');
                (0, chai_1.expect)(res.body.message).to.have.property('files');
                (0, chai_1.expect)(res.body.message.files).to.be.an('array').of.length(2);
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('type', 'image/png');
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('name', '1024x1024.png');
                chai_1.assert.isDefined(message.file);
                fileNewUrl = `/file-upload/${message.file._id}/${message.file.name}`;
                fileOldUrl = `/ufs/GridFS:Uploads/${message.file._id}/${message.file.name}`;
            });
        }));
        (0, mocha_1.it)('should upload a LST file to room', () => {
            return api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', lstURL)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message');
                (0, chai_1.expect)(res.body.message).to.have.property('attachments');
                (0, chai_1.expect)(res.body.message.attachments).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('format', 'LST');
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('title', 'lst-test.lst');
                (0, chai_1.expect)(res.body.message).to.have.property('files');
                (0, chai_1.expect)(res.body.message.files).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('name', 'lst-test.lst');
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('type', 'text/plain');
            });
        });
        (0, mocha_1.it)('should upload a DRAWIO file (unknown media type) to room', () => {
            return api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', drawioURL)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message');
                (0, chai_1.expect)(res.body.message).to.have.property('attachments');
                (0, chai_1.expect)(res.body.message.attachments).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('format', 'DRAWIO');
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('title', 'diagram.drawio');
                (0, chai_1.expect)(res.body.message).to.have.property('files');
                (0, chai_1.expect)(res.body.message.files).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('name', 'diagram.drawio');
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('type', 'application/octet-stream');
            });
        });
        (0, mocha_1.it)('should not allow uploading a blocked media type to a room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_MediaTypeBlackList', 'text/plain');
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', lstURL)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-file-type');
            });
        }));
        (0, mocha_1.it)('should not allow uploading an unknown media type to a room if the default one is blocked', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_MediaTypeBlackList', 'application/octet-stream');
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', drawioURL)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-file-type');
            });
        }));
        (0, mocha_1.it)('should be able to get the file', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get(fileNewUrl).set(api_data_1.credentials).expect('Content-Type', 'image/png').expect(200);
            yield api_data_1.request.get(fileOldUrl).set(api_data_1.credentials).expect('Content-Type', 'image/png').expect(200);
        }));
        (0, mocha_1.it)('should be able to get the file when no access to the room if setting allows it', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_room_members', false);
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_users_who_can_access_room', false);
            yield api_data_1.request.get(fileNewUrl).set(userCredentials).expect('Content-Type', 'image/png').expect(200);
            yield api_data_1.request.get(fileOldUrl).set(userCredentials).expect('Content-Type', 'image/png').expect(200);
        }));
        (0, mocha_1.it)('should not be able to get the file when no access to the room if setting blocks', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_room_members', true);
            yield api_data_1.request.get(fileNewUrl).set(userCredentials).expect(403);
            yield api_data_1.request.get(fileOldUrl).set(userCredentials).expect(403);
        }));
        (0, mocha_1.it)('should be able to get the file if member and setting blocks outside access', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_room_members', true);
            yield api_data_1.request.get(fileNewUrl).set(api_data_1.credentials).expect('Content-Type', 'image/png').expect(200);
            yield api_data_1.request.get(fileOldUrl).set(api_data_1.credentials).expect('Content-Type', 'image/png').expect(200);
        }));
        (0, mocha_1.it)('should be able to get the file if not member but can access room if setting allows', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_room_members', false);
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_users_who_can_access_room', true);
            yield api_data_1.request.get(fileNewUrl).set(userCredentials).expect('Content-Type', 'image/png').expect(200);
            yield api_data_1.request.get(fileOldUrl).set(userCredentials).expect('Content-Type', 'image/png').expect(200);
        }));
        (0, mocha_1.it)('should not be able to get the file if not member and cannot access room', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testPrivateChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', interactions_1.imgURL)
                .expect('Content-Type', 'application/json')
                .expect(200);
            const fileUrl = `/file-upload/${body.message.file._id}/${body.message.file.name}`;
            yield api_data_1.request.get(fileUrl).set(userCredentials).expect(403);
        }));
        (0, mocha_1.it)('should respect the setting with less permissions when both are true', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_ProtectFiles', true);
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_room_members', true);
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_users_who_can_access_room', true);
            yield api_data_1.request.get(fileNewUrl).set(userCredentials).expect(403);
            yield api_data_1.request.get(fileOldUrl).set(userCredentials).expect(403);
        }));
        (0, mocha_1.it)('should not be able to get the file without credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get(fileNewUrl).attach('file', interactions_1.imgURL).expect(403);
            yield api_data_1.request.get(fileOldUrl).attach('file', interactions_1.imgURL).expect(403);
        }));
        (0, mocha_1.it)('should be able to get the file without credentials if setting allows', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_ProtectFiles', false);
            yield api_data_1.request.get(fileNewUrl).expect('Content-Type', 'image/png').expect(200);
            yield api_data_1.request.get(fileOldUrl).expect('Content-Type', 'image/png').expect(200);
        }));
        (0, mocha_1.it)('should generate thumbnail for SVG files correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedFileName = `thumb-${svgLogoFileName}`;
            const res = yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', svgLogoURL)
                .expect('Content-Type', 'application/json')
                .expect(200);
            const message = res.body.message;
            const { files, attachments } = message;
            (0, chai_1.expect)(files).to.be.an('array');
            const hasThumbFile = files === null || files === void 0 ? void 0 : files.some((file) => file.type === 'image/png' && file.name === expectedFileName);
            (0, chai_1.expect)(hasThumbFile).to.be.true;
            (0, chai_1.expect)(attachments).to.be.an('array');
            const thumbAttachment = attachments === null || attachments === void 0 ? void 0 : attachments.find((attachment) => attachment.title === svgLogoFileName);
            chai_1.assert.isDefined(thumbAttachment);
            (0, chai_1.expect)(thumbAttachment).to.be.an('object');
            const thumbUrl = thumbAttachment.image_url;
            yield api_data_1.request.get(thumbUrl).set(api_data_1.credentials).expect('Content-Type', 'image/png');
        }));
        (0, mocha_1.it)('should generate thumbnail for JPEG files correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedFileName = `thumb-sample-jpeg.jpg`;
            const res = yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../mocks/files/sample-jpeg.jpg')))
                .expect('Content-Type', 'application/json')
                .expect(200);
            const message = res.body.message;
            const { files, attachments } = message;
            (0, chai_1.expect)(files).to.be.an('array');
            chai_1.assert.isDefined(files);
            const hasThumbFile = files.some((file) => file.type === 'image/jpeg' && file.name === expectedFileName);
            (0, chai_1.expect)(hasThumbFile).to.be.true;
            (0, chai_1.expect)(attachments).to.be.an('array');
            chai_1.assert.isDefined(attachments);
            const thumbAttachment = attachments.find((attachment) => attachment.title === `sample-jpeg.jpg`);
            (0, chai_1.expect)(thumbAttachment).to.be.an('object');
            const thumbUrl = thumbAttachment.image_url;
            yield api_data_1.request.get(thumbUrl).set(api_data_1.credentials).expect('Content-Type', 'image/jpeg');
        }));
        // Support legacy behavior (not encrypting file)
        (0, mocha_1.it)('should correctly save file description and properties with type e2e', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`))
                .set(api_data_1.credentials)
                .field('description', 'some_file_description')
                .attach('file', interactions_1.imgURL)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message');
                (0, chai_1.expect)(res.body.message).to.have.property('attachments');
                (0, chai_1.expect)(res.body.message.attachments).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('image_type', 'image/png');
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('title', '1024x1024.png');
                (0, chai_1.expect)(res.body.message).to.have.property('files');
                (0, chai_1.expect)(res.body.message.files).to.be.an('array').of.length(2);
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('type', 'image/png');
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('name', '1024x1024.png');
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('description', 'some_file_description');
            });
        }));
    });
    (0, mocha_1.describe)('/rooms.media', () => {
        let testChannel;
        let user;
        let userCredentials;
        const testChannelName = `channel.test.upload.${Date.now()}-${Math.random()}`;
        let blockedMediaTypes;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: testChannelName })).body.channel;
            blockedMediaTypes = yield (0, permissions_helper_1.getSettingValueById)('FileUpload_MediaTypeBlackList');
            const newBlockedMediaTypes = blockedMediaTypes
                .split(',')
                .filter((type) => type !== 'image/svg+xml')
                .join(',');
            yield (0, permissions_helper_1.updateSetting)('FileUpload_MediaTypeBlackList', newBlockedMediaTypes);
            yield (0, permissions_helper_1.updateSetting)('E2E_Enable_Encrypt_Files', true);
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, users_helper_1.deleteUser)(user),
            (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_room_members', true),
            (0, permissions_helper_1.updateSetting)('FileUpload_ProtectFiles', true),
            (0, permissions_helper_1.updateSetting)('FileUpload_MediaTypeBlackList', blockedMediaTypes),
            (0, permissions_helper_1.updateSetting)('E2E_Enable_Encrypt_Files', true),
        ]));
        (0, mocha_1.it)("don't upload a file to room with file field other than file", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('test', interactions_1.imgURL)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', '[invalid-field]');
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-field');
            })
                .end(done);
        });
        (0, mocha_1.it)("don't upload a file to room with empty file", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', '')
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', res.body.error);
            })
                .end(done);
        });
        (0, mocha_1.it)("don't upload a file to room with more than 1 file", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', interactions_1.imgURL)
                .attach('file', interactions_1.imgURL)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Just 1 file is allowed');
            })
                .end(done);
        });
        let fileNewUrl;
        let fileOldUrl;
        let fileId;
        (0, mocha_1.it)('should upload a PNG file to room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', interactions_1.imgURL)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('file');
                (0, chai_1.expect)(res.body.file).to.have.property('_id');
                (0, chai_1.expect)(res.body.file).to.have.property('url');
                // expect(res.body.message.files[0]).to.have.property('type', 'image/png');
                // expect(res.body.message.files[0]).to.have.property('name', '1024x1024.png');
                fileNewUrl = res.body.file.url;
                fileOldUrl = res.body.file.url.replace('/file-upload/', '/ufs/GridFS:Uploads/');
                fileId = res.body.file._id;
            });
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.mediaConfirm/${testChannel._id}/${fileId}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message');
                (0, chai_1.expect)(res.body.message).to.have.property('attachments');
                (0, chai_1.expect)(res.body.message.attachments).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('image_type', 'image/png');
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('title', '1024x1024.png');
                (0, chai_1.expect)(res.body.message).to.have.property('files');
                (0, chai_1.expect)(res.body.message.files).to.be.an('array').of.length(2);
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('type', 'image/png');
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('name', '1024x1024.png');
            });
        }));
        (0, mocha_1.it)('should upload a LST file to room', () => __awaiter(void 0, void 0, void 0, function* () {
            let fileId;
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', lstURL)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('file');
                (0, chai_1.expect)(res.body.file).to.have.property('_id');
                (0, chai_1.expect)(res.body.file).to.have.property('url');
                fileId = res.body.file._id;
            });
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.mediaConfirm/${testChannel._id}/${fileId}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message');
                (0, chai_1.expect)(res.body.message).to.have.property('attachments');
                (0, chai_1.expect)(res.body.message.attachments).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('format', 'LST');
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('title', 'lst-test.lst');
                (0, chai_1.expect)(res.body.message).to.have.property('files');
                (0, chai_1.expect)(res.body.message.files).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('name', 'lst-test.lst');
            });
        }));
        (0, mocha_1.describe)('/rooms.media - Max allowed size', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () { return (0, permissions_helper_1.updateSetting)('Message_MaxAllowedSize', 10); }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () { return (0, permissions_helper_1.updateSetting)('Message_MaxAllowedSize', 5000); }));
            (0, mocha_1.it)('should allow uploading a file with description under the max character limit', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                    .set(api_data_1.credentials)
                    .attach('file', interactions_1.imgURL)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('file');
                    (0, chai_1.expect)(res.body.file).to.have.property('_id');
                    (0, chai_1.expect)(res.body.file).to.have.property('url');
                    fileNewUrl = res.body.file.url;
                    fileOldUrl = res.body.file.url.replace('/file-upload/', '/ufs/GridFS:Uploads/');
                    fileId = res.body.file._id;
                });
                yield api_data_1.request
                    .post((0, api_data_1.api)(`rooms.mediaConfirm/${testChannel._id}/${fileId}`))
                    .set(api_data_1.credentials)
                    .send({
                    description: '123456789',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('message');
                    (0, chai_1.expect)(res.body.message).to.have.property('attachments');
                    (0, chai_1.expect)(res.body.message.attachments).to.be.an('array').of.length(1);
                    (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('image_type', 'image/png');
                    (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('title', '1024x1024.png');
                    (0, chai_1.expect)(res.body.message).to.have.property('files');
                    (0, chai_1.expect)(res.body.message.files).to.be.an('array').of.length(2);
                    (0, chai_1.expect)(res.body.message.files[0]).to.have.property('type', 'image/png');
                    (0, chai_1.expect)(res.body.message.files[0]).to.have.property('name', '1024x1024.png');
                });
            }));
            (0, mocha_1.it)('should not allow uploading a file with description over the max character limit', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                    .set(api_data_1.credentials)
                    .attach('file', interactions_1.imgURL)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('file');
                    (0, chai_1.expect)(res.body.file).to.have.property('_id');
                    (0, chai_1.expect)(res.body.file).to.have.property('url');
                    fileNewUrl = res.body.file.url;
                    fileOldUrl = res.body.file.url.replace('/file-upload/', '/ufs/GridFS:Uploads/');
                    fileId = res.body.file._id;
                });
                yield api_data_1.request
                    .post((0, api_data_1.api)(`rooms.mediaConfirm/${testChannel._id}/${fileId}`))
                    .set(api_data_1.credentials)
                    .send({
                    description: '12345678910',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-message-size-exceeded');
                });
            }));
        });
        (0, mocha_1.it)('should not allow uploading a blocked media type to a room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_MediaTypeBlackList', 'text/plain');
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', lstURL)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-file-type');
            });
        }));
        (0, mocha_1.it)('should be able to get the file', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get(fileNewUrl).set(api_data_1.credentials).expect('Content-Type', 'image/png').expect(200);
            yield api_data_1.request.get(fileOldUrl).set(api_data_1.credentials).expect('Content-Type', 'image/png').expect(200);
        }));
        (0, mocha_1.it)('should be able to get the file when no access to the room if setting allows it', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_room_members', false);
            yield api_data_1.request.get(fileNewUrl).set(userCredentials).expect('Content-Type', 'image/png').expect(200);
            yield api_data_1.request.get(fileOldUrl).set(userCredentials).expect('Content-Type', 'image/png').expect(200);
        }));
        (0, mocha_1.it)('should not be able to get the file when no access to the room if setting blocks', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_room_members', true);
            yield api_data_1.request.get(fileNewUrl).set(userCredentials).expect(403);
            yield api_data_1.request.get(fileOldUrl).set(userCredentials).expect(403);
        }));
        (0, mocha_1.it)('should be able to get the file if member and setting blocks outside access', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Restrict_to_room_members', true);
            yield api_data_1.request.get(fileNewUrl).set(api_data_1.credentials).expect('Content-Type', 'image/png').expect(200);
            yield api_data_1.request.get(fileOldUrl).set(api_data_1.credentials).expect('Content-Type', 'image/png').expect(200);
        }));
        (0, mocha_1.it)('should not be able to get the file without credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get(fileNewUrl).attach('file', interactions_1.imgURL).expect(403);
            yield api_data_1.request.get(fileOldUrl).attach('file', interactions_1.imgURL).expect(403);
        }));
        (0, mocha_1.it)('should be able to get the file without credentials if setting allows', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_ProtectFiles', false);
            yield api_data_1.request.get(fileNewUrl).expect('Content-Type', 'image/png').expect(200);
            yield api_data_1.request.get(fileOldUrl).expect('Content-Type', 'image/png').expect(200);
        }));
        (0, mocha_1.it)('should generate thumbnail for SVG files correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedFileName = `thumb-${svgLogoFileName}`;
            let res = yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', svgLogoURL)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('file');
            (0, chai_1.expect)(res.body.file).to.have.property('_id');
            (0, chai_1.expect)(res.body.file).to.have.property('url');
            const fileId = res.body.file._id;
            res = yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.mediaConfirm/${testChannel._id}/${fileId}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            const message = res.body.message;
            const { files, attachments } = message;
            (0, chai_1.expect)(files).to.be.an('array');
            const hasThumbFile = files === null || files === void 0 ? void 0 : files.some((file) => file.type === 'image/png' && file.name === expectedFileName);
            (0, chai_1.expect)(hasThumbFile).to.be.true;
            (0, chai_1.expect)(attachments).to.be.an('array');
            const thumbAttachment = attachments === null || attachments === void 0 ? void 0 : attachments.find((attachment) => attachment.title === svgLogoFileName);
            chai_1.assert.isDefined(thumbAttachment);
            (0, chai_1.expect)(thumbAttachment).to.be.an('object');
            const thumbUrl = thumbAttachment.image_url;
            yield api_data_1.request.get(thumbUrl).set(api_data_1.credentials).expect('Content-Type', 'image/png');
        }));
        (0, mocha_1.it)('should generate thumbnail for JPEG files correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedFileName = `thumb-sample-jpeg.jpg`;
            let res = yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../mocks/files/sample-jpeg.jpg')))
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('file');
            (0, chai_1.expect)(res.body.file).to.have.property('_id');
            (0, chai_1.expect)(res.body.file).to.have.property('url');
            const fileId = res.body.file._id;
            res = yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.mediaConfirm/${testChannel._id}/${fileId}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            const message = res.body.message;
            const { files, attachments } = message;
            (0, chai_1.expect)(files).to.be.an('array');
            const hasThumbFile = files === null || files === void 0 ? void 0 : files.some((file) => file.type === 'image/jpeg' && file.name === expectedFileName);
            (0, chai_1.expect)(hasThumbFile).to.be.true;
            (0, chai_1.expect)(attachments).to.be.an('array');
            const thumbAttachment = attachments === null || attachments === void 0 ? void 0 : attachments.find((attachment) => attachment.title === `sample-jpeg.jpg`);
            (0, chai_1.expect)(thumbAttachment).to.be.an('object');
            const thumbUrl = thumbAttachment.image_url;
            yield api_data_1.request.get(thumbUrl).set(api_data_1.credentials).expect('Content-Type', 'image/jpeg');
        }));
        // Support legacy behavior (not encrypting file)
        (0, mocha_1.it)('should correctly save file description and properties with type e2e', () => __awaiter(void 0, void 0, void 0, function* () {
            let fileId;
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', interactions_1.imgURL)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('file');
                (0, chai_1.expect)(res.body.file).to.have.property('_id');
                (0, chai_1.expect)(res.body.file).to.have.property('url');
                fileId = res.body.file._id;
            });
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.mediaConfirm/${testChannel._id}/${fileId}`))
                .set(api_data_1.credentials)
                .send({
                description: 'some_file_description',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message');
                (0, chai_1.expect)(res.body.message).to.have.property('attachments');
                (0, chai_1.expect)(res.body.message.attachments).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('image_type', 'image/png');
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('title', '1024x1024.png');
                (0, chai_1.expect)(res.body.message).to.have.property('files');
                (0, chai_1.expect)(res.body.message.files).to.be.an('array').of.length(2);
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('type', 'image/png');
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('name', '1024x1024.png');
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('description', 'some_file_description');
            });
        }));
        (0, mocha_1.it)('should correctly save encrypted file', () => __awaiter(void 0, void 0, void 0, function* () {
            let fileId;
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../mocks/files/diagram.drawio')), {
                contentType: 'application/octet-stream',
            })
                .field({ content: JSON.stringify({ algorithm: 'rc.v1.aes-sha2', ciphertext: 'something' }) })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('file');
                (0, chai_1.expect)(res.body.file).to.have.property('_id');
                (0, chai_1.expect)(res.body.file).to.have.property('url');
                fileId = res.body.file._id;
            });
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.mediaConfirm/${testChannel._id}/${fileId}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message');
                (0, chai_1.expect)(res.body.message).to.have.property('files');
                (0, chai_1.expect)(res.body.message.files).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('type', 'application/octet-stream');
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('name', 'diagram.drawio');
            });
        }));
        (0, mocha_1.it)('should correctly save encrypted file with the default media type even if another type is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            let fileId;
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../mocks/files/sample-jpeg.jpg')), {
                contentType: 'image/jpeg',
            })
                .field({ content: JSON.stringify({ algorithm: 'rc.v1.aes-sha2', ciphertext: 'something' }) })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('file');
                (0, chai_1.expect)(res.body.file).to.have.property('_id');
                (0, chai_1.expect)(res.body.file).to.have.property('url');
                fileId = res.body.file._id;
            });
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.mediaConfirm/${testChannel._id}/${fileId}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message');
                (0, chai_1.expect)(res.body.message).to.have.property('files');
                (0, chai_1.expect)(res.body.message.files).to.be.an('array').of.length(1);
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('type', 'application/octet-stream');
                (0, chai_1.expect)(res.body.message.files[0]).to.have.property('name', 'sample-jpeg.jpg');
            });
        }));
        (0, mocha_1.it)('should fail encrypted file upload when files encryption is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('E2E_Enable_Encrypt_Files', false);
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../mocks/files/diagram.drawio')), {
                contentType: 'application/octet-stream',
            })
                .field({ content: JSON.stringify({ algorithm: 'rc.v1.aes-sha2', ciphertext: 'something' }) })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-file-type');
            });
        }));
        (0, mocha_1.it)('should fail encrypted file upload on blacklisted application/octet-stream media type', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_MediaTypeBlackList', 'application/octet-stream');
            yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.media/${testChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../mocks/files/diagram.drawio')), {
                contentType: 'application/octet-stream',
            })
                .field({ content: JSON.stringify({ algorithm: 'rc.v1.aes-sha2', ciphertext: 'something' }) })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-file-type');
            });
        }));
    });
    (0, mocha_1.describe)('/rooms.favorite', () => {
        let testChannel;
        const testChannelName = `channel.test.${Date.now()}-${Math.random()}`;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: testChannelName })).body.channel;
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
        (0, mocha_1.it)('should favorite the room when send favorite: true by roomName', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.favorite'))
                .set(api_data_1.credentials)
                .send({
                roomName: testChannelName,
                favorite: true,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should unfavorite the room when send favorite: false by roomName', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.favorite'))
                .set(api_data_1.credentials)
                .send({
                roomName: testChannelName,
                favorite: false,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should favorite the room when send favorite: true by roomId', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.favorite'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                favorite: true,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should unfavorite room when send favorite: false by roomId', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.favorite'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                favorite: false,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when send an invalid room', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.favorite'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'foo',
                favorite: false,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/rooms.nameExists', () => {
        let testChannel;
        const testChannelName = `channel.test.${Date.now()}-${Math.random()}`;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: testChannelName })).body.channel;
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
        (0, mocha_1.it)('should return 401 unauthorized when user is not logged in', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.nameExists'))
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return true if this room name exists', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.nameExists'))
                .set(api_data_1.credentials)
                .query({
                roomName: testChannelName,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('exists', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return false if this room name does not exist', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.nameExists'))
                .set(api_data_1.credentials)
                .query({
                roomName: 'foo',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('exists', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the require parameter (roomName) is not provided', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.nameExists'))
                .set(api_data_1.credentials)
                .query({
                roomId: 'foo',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/rooms.cleanHistory]', () => {
        let publicChannel;
        let privateChannel;
        let directMessageChannelId;
        let user;
        let userCredentials;
        (0, mocha_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, permissions_helper_1.updateSetting)('Message_ShowDeletedStatus', true);
            publicChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `testeChannel${+new Date()}` })).body.channel;
            privateChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `testPrivateChannel${+new Date()}` })).body.group;
            directMessageChannelId = (yield (0, rooms_helper_1.createRoom)({ type: 'd', username: user.username })).body.room.rid;
        }));
        (0, mocha_1.afterEach)(() => Promise.all([
            (0, users_helper_1.deleteUser)(user),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: publicChannel._id }),
            (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: privateChannel._id }),
            (0, rooms_helper_1.deleteRoom)({ type: 'd', roomId: directMessageChannelId }),
        ]));
        (0, mocha_1.after)(() => (0, permissions_helper_1.updateSetting)('Message_ShowDeletedStatus', false));
        (0, mocha_1.it)('should return success when send a valid public channel', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.cleanHistory'))
                .set(api_data_1.credentials)
                .send({
                roomId: publicChannel._id,
                latest: '2016-12-09T13:42:25.304Z',
                oldest: '2016-08-30T13:42:25.304Z',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should not count hidden or deleted messages when limit param is not sent', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: publicChannel._id });
            yield (0, chat_helper_1.deleteMessage)({ roomId: publicChannel._id, msgId: res.body.message._id });
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.cleanHistory'))
                .set(api_data_1.credentials)
                .send({
                roomId: publicChannel._id,
                latest: '9999-12-31T23:59:59.000Z',
                oldest: '0001-01-01T00:00:00.000Z',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count', 0);
            });
        }));
        (0, mocha_1.it)('should not count hidden or deleted messages when limit param is sent', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: publicChannel._id });
            yield (0, chat_helper_1.deleteMessage)({ roomId: publicChannel._id, msgId: res.body.message._id });
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.cleanHistory'))
                .set(api_data_1.credentials)
                .send({
                roomId: publicChannel._id,
                latest: '9999-12-31T23:59:59.000Z',
                oldest: '0001-01-01T00:00:00.000Z',
                limit: 2000,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count', 0);
            });
        }));
        (0, mocha_1.it)('should successfully delete an image and thumbnail from public channel', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${publicChannel._id}`))
                .set(api_data_1.credentials)
                .attach('file', interactions_1.imgURL)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                const message = res.body.message;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message._id', message._id);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.rid', publicChannel._id);
                chai_1.assert.isDefined(message.file);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.file._id', message.file._id);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.file.type', message.file.type);
            });
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.cleanHistory'))
                .set(api_data_1.credentials)
                .send({
                roomId: publicChannel._id,
                latest: '9999-12-31T23:59:59.000Z',
                oldest: '0001-01-01T00:00:00.000Z',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            void api_data_1.request
                .get((0, api_data_1.api)('channels.files'))
                .set(api_data_1.credentials)
                .query({
                roomId: publicChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('files').and.to.be.an('array');
                (0, chai_1.expect)(res.body.files).to.have.lengthOf(0);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return success when send a valid private channel', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.cleanHistory'))
                .set(api_data_1.credentials)
                .send({
                roomId: privateChannel._id,
                latest: '2016-12-09T13:42:25.304Z',
                oldest: '2016-08-30T13:42:25.304Z',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return success when send a valid Direct Message channel', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.cleanHistory'))
                .set(api_data_1.credentials)
                .send({
                roomId: directMessageChannelId,
                latest: '2016-12-09T13:42:25.304Z',
                oldest: '2016-08-30T13:42:25.304Z',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return not allowed error when try deleting messages with user without permission', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.cleanHistory'))
                .set(userCredentials)
                .send({
                roomId: directMessageChannelId,
                latest: '2016-12-09T13:42:25.304Z',
                oldest: '2016-08-30T13:42:25.304Z',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
            })
                .end(done);
        });
        (0, mocha_1.describe)('test user is not part of room', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, mocha_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updatePermission)('clean-channel-history', ['admin', 'user']);
            }));
            (0, mocha_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updatePermission)('clean-channel-history', ['admin']);
            }));
            (0, mocha_1.it)('should return an error when the user with right privileges is not part of the room', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('rooms.cleanHistory'))
                    .set(userCredentials)
                    .send({
                    roomId: privateChannel._id,
                    latest: '9999-12-31T23:59:59.000Z',
                    oldest: '0001-01-01T00:00:00.000Z',
                    limit: 2000,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have access to the room [error-not-allowed]');
                });
            }));
        }));
    });
    (0, mocha_1.describe)('[/rooms.info]', () => {
        let testChannel;
        let testGroup;
        let testDM;
        const expectedKeys = [
            '_id',
            'name',
            'fname',
            't',
            'msgs',
            'usersCount',
            'u',
            'customFields',
            'ts',
            'ro',
            'sysMes',
            'default',
            '_updatedAt',
        ];
        const testChannelName = `channel.test.${Date.now()}-${Math.random()}`;
        const testGroupName = `group.test.${Date.now()}-${Math.random()}`;
        let user;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: testChannelName })).body.channel;
            testGroup = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: testGroupName })).body.group;
            testDM = (yield (0, rooms_helper_1.createRoom)({ type: 'd', username: user.username })).body.room;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, rooms_helper_1.deleteRoom)({ type: 'd', roomId: testDM._id }),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testGroup._id }),
            (0, users_helper_1.deleteUser)(user),
        ]));
        (0, mocha_1.it)('should return the info about the created channel correctly searching by roomId', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.have.keys(expectedKeys);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the info about the created channel correctly searching by roomName', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.info'))
                .set(api_data_1.credentials)
                .query({
                roomName: testChannel.name,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.have.all.keys(expectedKeys);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the info about the created group correctly searching by roomId', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.have.all.keys(expectedKeys);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the info about the created group correctly searching by roomName', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.info'))
                .set(api_data_1.credentials)
                .query({
                roomName: testGroup.name,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.have.all.keys(expectedKeys);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the info about the created DM correctly searching by roomId', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testDM._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
            })
                .end(done);
        });
        (0, mocha_1.it)('should not return parent & team for room thats not on a team nor is a discussion', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('rooms.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.not.have.property('team');
                (0, chai_1.expect)(res.body.room).to.not.have.property('prid');
            });
        }));
        (0, mocha_1.describe)('with team and parent data', () => {
            const testChannelName = `channel.test.${Date.now()}-${Math.random()}`;
            const teamName = `test-team-${Date.now()}`;
            const discussionName = `test-discussion-${Date.now()}`;
            const testChannelOutsideTeamname = `channel.test.outside.${Date.now()}-${Math.random()}`;
            let testChannel;
            let testDiscussion;
            let testDiscussionMainRoom;
            let testTeam;
            let testChannelOutside;
            let testDiscussionOutsideTeam;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: testChannelName })).body.channel;
                const teamResponse = yield api_data_1.request.post((0, api_data_1.api)('teams.create')).set(api_data_1.credentials).send({ name: teamName, type: 1 }).expect(200);
                testTeam = teamResponse.body.team;
                const resDiscussion = yield api_data_1.request.post((0, api_data_1.api)('rooms.createDiscussion')).set(api_data_1.credentials).send({
                    prid: testChannel._id,
                    t_name: discussionName,
                });
                testDiscussion = resDiscussion.body.discussion;
                testDiscussionMainRoom = (yield api_data_1.request
                    .post((0, api_data_1.api)('rooms.createDiscussion'))
                    .set(api_data_1.credentials)
                    .send({
                    prid: testTeam.roomId,
                    t_name: `test-discussion-${Date.now()}-team`,
                })).body.discussion;
                yield api_data_1.request
                    .post((0, api_data_1.api)('teams.addRooms'))
                    .set(api_data_1.credentials)
                    .send({ rooms: [testChannel._id], teamId: testTeam._id });
            }));
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                testChannelOutside = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: testChannelOutsideTeamname })).body.channel;
                testDiscussionOutsideTeam = (yield api_data_1.request
                    .post((0, api_data_1.api)('rooms.createDiscussion'))
                    .set(api_data_1.credentials)
                    .send({
                    prid: testChannelOutside._id,
                    t_name: `test-discussion-${Date.now()}`,
                })).body.discussion;
            }));
            (0, mocha_1.after)(() => Promise.all([
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testDiscussion._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannelOutside._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testDiscussionOutsideTeam._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testDiscussionMainRoom._id }),
                (0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName),
            ]));
            (0, mocha_1.it)('should return the channel info, team and parent info', () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield api_data_1.request.get((0, api_data_1.api)('rooms.info')).set(api_data_1.credentials).query({ roomId: testChannel._id }).expect(200);
                (0, chai_1.expect)(result.body).to.have.property('success', true);
                (0, chai_1.expect)(result.body).to.have.property('team');
                (0, chai_1.expect)(result.body).to.have.property('parent');
                (0, chai_1.expect)(result.body.parent).to.have.property('_id').and.to.equal(testTeam.roomId);
            }));
            (0, mocha_1.it)('should return the dicsussion room info and parent info', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get((0, api_data_1.api)('rooms.info'))
                    .set(api_data_1.credentials)
                    .query({ roomId: testDiscussion._id })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('parent').and.to.be.an('object');
                    (0, chai_1.expect)(res.body.parent).to.have.property('_id').and.to.be.equal(testChannel._id);
                });
            }));
            (0, mocha_1.it)('should not return parent info for the main room of the team', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get((0, api_data_1.api)('rooms.info'))
                    .set(api_data_1.credentials)
                    .query({ roomId: testTeam.roomId })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.not.have.property('parent');
                    (0, chai_1.expect)(res.body).to.have.property('team');
                });
            }));
            (0, mocha_1.it)('should not return team for room outside team', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get((0, api_data_1.api)('rooms.info'))
                    .set(api_data_1.credentials)
                    .query({ roomId: testChannelOutside._id })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.not.have.property('team');
                    (0, chai_1.expect)(res.body).to.not.have.property('parent');
                });
            }));
            (0, mocha_1.it)('should return the parent for discussion outside team', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get((0, api_data_1.api)('rooms.info'))
                    .set(api_data_1.credentials)
                    .query({ roomId: testDiscussionOutsideTeam._id })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('parent').and.to.be.an('object');
                    (0, chai_1.expect)(res.body.parent).to.have.property('_id').and.to.be.equal(testChannelOutside._id);
                    (0, chai_1.expect)(res.body).to.not.have.property('team');
                });
            }));
            (0, mocha_1.it)('should return the parent for a discussion created from team main room', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get((0, api_data_1.api)('rooms.info'))
                    .set(api_data_1.credentials)
                    .query({ roomId: testDiscussionMainRoom._id })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('parent').and.to.be.an('object');
                    (0, chai_1.expect)(res.body.parent).to.have.property('_id').and.to.be.equal(testTeam.roomId);
                    (0, chai_1.expect)(res.body).to.not.have.property('team');
                });
            }));
        });
    });
    (0, mocha_1.describe)('[/rooms.leave]', () => {
        let testChannel;
        let testGroup;
        let testDM;
        let user2;
        let user2Credentials;
        const testChannelName = `channel.leave.${Date.now()}-${Math.random()}`;
        const testGroupName = `group.leave.${Date.now()}-${Math.random()}`;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user2 = yield (0, users_helper_1.createUser)();
            user2Credentials = yield (0, users_helper_1.login)(user2.username, user_1.password);
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: testChannelName })).body.channel;
            testGroup = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: testGroupName })).body.group;
            testDM = (yield (0, rooms_helper_1.createRoom)({ type: 'd', username: user2.username })).body.room;
            yield (0, permissions_helper_1.updateSetting)('API_User_Limit', 1000000);
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, rooms_helper_1.deleteRoom)({ type: 'd', roomId: testDM._id }),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testGroup._id }),
            (0, permissions_helper_1.updatePermission)('leave-c', ['admin', 'user', 'bot', 'anonymous', 'app']),
            (0, permissions_helper_1.updatePermission)('leave-p', ['admin', 'user', 'bot', 'anonymous', 'app']),
            (0, users_helper_1.deleteUser)(user2),
            (0, permissions_helper_1.updateSetting)('API_User_Limit', 10000),
        ]));
        (0, mocha_1.it)('should return an Error when trying leave a DM room', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.leave'))
                .set(api_data_1.credentials)
                .send({
                roomId: testDM._id,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an Error when trying to leave a public channel and you are the last owner', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.leave'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-you-are-last-owner');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an Error when trying to leave a private group and you are the last owner', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.leave'))
                .set(api_data_1.credentials)
                .send({
                roomId: testGroup._id,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-you-are-last-owner');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an Error when trying to leave a public channel and not have the necessary permission(leave-c)', (done) => {
            void (0, permissions_helper_1.updatePermission)('leave-c', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('rooms.leave'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testChannel._id,
                })
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an Error when trying to leave a private group and not have the necessary permission(leave-p)', (done) => {
            void (0, permissions_helper_1.updatePermission)('leave-p', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('rooms.leave'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testGroup._id,
                })
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should leave the public channel when the room has at least another owner and the user has the necessary permission(leave-c)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('leave-c', ['admin']);
            yield api_data_1.request.post((0, api_data_1.api)('channels.addAll')).set(api_data_1.credentials).send({
                roomId: testChannel._id,
            });
            yield api_data_1.request.post((0, api_data_1.api)('channels.addOwner')).set(api_data_1.credentials).send({
                roomId: testChannel._id,
                userId: user2._id,
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.leave'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            yield api_data_1.request.post((0, api_data_1.api)('channels.addOwner')).set(user2Credentials).send({
                roomId: testChannel._id,
                userId: api_data_1.credentials['X-User-Id'],
            });
        }));
        (0, mocha_1.it)('should leave the private group when the room has at least another owner and the user has the necessary permission(leave-p)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('leave-p', ['user']);
            yield api_data_1.request.post((0, api_data_1.api)('groups.addAll')).set(api_data_1.credentials).send({
                roomId: testGroup._id,
            });
            yield api_data_1.request.post((0, api_data_1.api)('groups.addOwner')).set(api_data_1.credentials).send({
                roomId: testGroup._id,
                userId: user2._id,
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.leave'))
                .set(user2Credentials)
                .send({
                roomId: testGroup._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
    });
    (0, mocha_1.describe)('/rooms.createDiscussion', () => {
        let testChannel;
        const testChannelName = `channel.test.${Date.now()}-${Math.random()}`;
        let messageSent;
        let privateTeam;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: testChannelName })).body.channel;
            messageSent = (yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
            })).body.message;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, permissions_helper_1.updateSetting)('Discussion_enabled', true),
            (0, permissions_helper_1.updatePermission)('start-discussion', ['admin', 'user', 'guest', 'app']),
            (0, permissions_helper_1.updatePermission)('start-discussion-other-user', ['admin', 'user', 'guest', 'app']),
            (0, teams_helper_1.deleteTeam)(api_data_1.credentials, privateTeam.name),
        ]));
        (0, mocha_1.it)('should throw an error when the user tries to create a discussion and the feature is disabled', (done) => {
            void (0, permissions_helper_1.updateSetting)('Discussion_enabled', false).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('rooms.createDiscussion'))
                    .set(api_data_1.credentials)
                    .send({
                    prid: testChannel._id,
                    t_name: 'valid name',
                })
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-action-not-allowed');
                })
                    .end(() => (0, permissions_helper_1.updateSetting)('Discussion_enabled', true).then(done));
            });
        });
        (0, mocha_1.it)('should throw an error when the user tries to create a discussion and does not have at least one of the required permissions', (done) => {
            void (0, permissions_helper_1.updatePermission)('start-discussion', []).then(() => {
                void (0, permissions_helper_1.updatePermission)('start-discussion-other-user', []).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('rooms.createDiscussion'))
                        .set(api_data_1.credentials)
                        .send({
                        prid: testChannel._id,
                        t_name: 'valid name',
                    })
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-action-not-allowed');
                    })
                        .end(() => {
                        void (0, permissions_helper_1.updatePermission)('start-discussion', ['admin', 'user', 'guest'])
                            .then(() => (0, permissions_helper_1.updatePermission)('start-discussion-other-user', ['admin', 'user', 'guest']))
                            .then(done);
                    });
                });
            });
        });
        (0, mocha_1.it)('should throw an error when the user tries to create a discussion without the required parameter "prid"', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({})
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Body parameter "prid" is required.');
            })
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when the user tries to create a discussion without the required parameter "t_name"', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testChannel._id,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Body parameter "t_name" is required.');
            })
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when the user tries to create a discussion with the required parameter invalid "users"(different from an array)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testChannel._id,
                t_name: 'valid name',
                users: 'invalid-type-of-users',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Body parameter "users" must be an array.');
            })
                .end(done);
        });
        (0, mocha_1.it)("should throw an error when the user tries to create a discussion with the channel's id invalid", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: 'invalid-id',
                t_name: 'valid name',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-room');
            })
                .end(done);
        });
        (0, mocha_1.it)("should throw an error when the user tries to create a discussion with the message's id invalid", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testChannel._id,
                t_name: 'valid name',
                pmid: 'invalid-message',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should create a discussion successfully when send only the required parameters', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testChannel._id,
                t_name: `discussion-create-from-tests-${testChannel.name}`,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('discussion').and.to.be.an('object');
                (0, chai_1.expect)(res.body.discussion).to.have.property('prid').and.to.be.equal(testChannel._id);
                (0, chai_1.expect)(res.body.discussion).to.have.property('fname').and.to.be.equal(`discussion-create-from-tests-${testChannel.name}`);
            })
                .end(done);
        });
        (0, mocha_1.it)('should create a discussion successfully when send the required parameters plus the optional parameter "reply"', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testChannel._id,
                t_name: `discussion-create-from-tests-${testChannel.name}`,
                reply: 'reply from discussion tests',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('discussion').and.to.be.an('object');
                (0, chai_1.expect)(res.body.discussion).to.have.property('prid').and.to.be.equal(testChannel._id);
                (0, chai_1.expect)(res.body.discussion).to.have.property('fname').and.to.be.equal(`discussion-create-from-tests-${testChannel.name}`);
            })
                .end(done);
        });
        (0, mocha_1.it)('should create a discussion successfully when send the required parameters plus the optional parameter "users"', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testChannel._id,
                t_name: `discussion-create-from-tests-${testChannel.name}`,
                reply: 'reply from discussion tests',
                users: ['rocket.cat'],
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('discussion').and.to.be.an('object');
                (0, chai_1.expect)(res.body.discussion).to.have.property('prid').and.to.be.equal(testChannel._id);
                (0, chai_1.expect)(res.body.discussion).to.have.property('fname').and.to.be.equal(`discussion-create-from-tests-${testChannel.name}`);
            })
                .end(done);
        });
        (0, mocha_1.it)('should create a discussion successfully when send the required parameters plus the optional parameter "pmid"', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testChannel._id,
                t_name: `discussion-create-from-tests-${testChannel.name}`,
                reply: 'reply from discussion tests',
                users: ['rocket.cat'],
                pmid: messageSent._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('discussion').and.to.be.an('object');
                (0, chai_1.expect)(res.body.discussion).to.have.property('prid').and.to.be.equal(testChannel._id);
                (0, chai_1.expect)(res.body.discussion).to.have.property('fname').and.to.be.equal(`discussion-create-from-tests-${testChannel.name}`);
            })
                .end(done);
        });
        (0, mocha_1.describe)('it should create a *private* discussion if the parent channel is public and inside a private team', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, mocha_1.it)('should create a team', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('teams.create'))
                    .set(api_data_1.credentials)
                    .send({
                    name: `test-team-${Date.now()}`,
                    type: 1,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('team');
                    (0, chai_1.expect)(res.body).to.have.nested.property('team._id');
                    privateTeam = res.body.team;
                })
                    .end(done);
            });
            (0, mocha_1.it)('should add the public channel to the team', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('teams.addRooms'))
                    .set(api_data_1.credentials)
                    .send({
                    rooms: [testChannel._id],
                    teamId: privateTeam._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should create a private discussion inside the public channel', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('rooms.createDiscussion'))
                    .set(api_data_1.credentials)
                    .send({
                    prid: testChannel._id,
                    t_name: `discussion-create-from-tests-${testChannel.name}-team`,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('discussion').and.to.be.an('object');
                    (0, chai_1.expect)(res.body.discussion).to.have.property('prid').and.to.be.equal(testChannel._id);
                    (0, chai_1.expect)(res.body.discussion).to.have.property('fname').and.to.be.equal(`discussion-create-from-tests-${testChannel.name}-team`);
                    (0, chai_1.expect)(res.body.discussion).to.have.property('t').and.to.be.equal('p');
                })
                    .end(done);
            });
        }));
    });
    (0, mocha_1.describe)('/rooms.getDiscussions', () => {
        let testChannel;
        const testChannelName = `channel.test.getDiscussions${Date.now()}-${Math.random()}`;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: testChannelName })).body.channel;
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testChannel._id,
                t_name: `discussion-create-from-tests-${testChannel.name}`,
            });
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']),
        ]));
        (0, mocha_1.it)('should throw an error when the user tries to gets a list of discussion without a required parameter "roomId"', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.getDiscussions'))
                .set(api_data_1.credentials)
                .query({})
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'The parameter "roomId" or "roomName" is required [error-roomid-param-not-provided]');
            })
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when the user tries to gets a list of discussion and he cannot access the room', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-c-room', []).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('rooms.getDiscussions'))
                    .set(api_data_1.credentials)
                    .query({})
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'Not Allowed');
                })
                    .end(() => (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'anonymous']).then(done));
            });
        });
        (0, mocha_1.it)('should return a list of discussions with ONE discussion', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.getDiscussions'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('discussions').and.to.be.an('array');
                (0, chai_1.expect)(res.body.discussions).to.have.lengthOf(1);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/rooms.autocomplete.channelAndPrivate]', () => {
        (0, mocha_1.it)('should return an error when the required parameter "selector" is not provided', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.autocomplete.channelAndPrivate'))
                .set(api_data_1.credentials)
                .query({})
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal("The 'selector' param is required");
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the rooms to fill auto complete', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.autocomplete.channelAndPrivate'))
                .query({ selector: '{}' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('items').and.to.be.an('array');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/rooms.autocomplete.channelAndPrivate.withPagination]', () => {
        (0, mocha_1.it)('should return an error when the required parameter "selector" is not provided', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.autocomplete.channelAndPrivate.withPagination'))
                .set(api_data_1.credentials)
                .query({})
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal("The 'selector' param is required");
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the rooms to fill auto complete', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.autocomplete.channelAndPrivate.withPagination'))
                .query({ selector: '{}' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('items').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('total');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the rooms to fill auto complete even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.autocomplete.channelAndPrivate.withPagination'))
                .query({ selector: '{}' })
                .set(api_data_1.credentials)
                .query({
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('items').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('total');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/rooms.autocomplete.availableForTeams]', () => {
        (0, mocha_1.it)('should return the rooms to fill auto complete', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.autocomplete.availableForTeams'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('items').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the filtered rooms to fill auto complete', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.autocomplete.availableForTeams'))
                .query({ name: 'group' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('items').and.to.be.an('array');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/rooms.autocomplete.adminRooms]', () => {
        let testGroup;
        const testGroupName = `channel.test.adminRoom${Date.now()}-${Math.random()}`;
        const name = {
            name: testGroupName,
        };
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testGroup = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: testGroupName })).body.group;
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testGroup._id,
                t_name: `${testGroupName}-discussion`,
            });
        }));
        (0, mocha_1.after)(() => Promise.all([(0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testGroup._id }), (0, permissions_helper_1.updateEEPermission)('can-audit', ['admin', 'auditor'])]));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return an error when the required parameter "selector" is not provided', (done) => {
            void (0, permissions_helper_1.updateEEPermission)('can-audit', ['admin']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('rooms.autocomplete.adminRooms'))
                    .set(api_data_1.credentials)
                    .query({})
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.error).to.be.equal("The 'selector' param is required");
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return the rooms to fill auto complete', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.autocomplete.adminRooms'))
                .query({ selector: '{}' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('items').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the rooms to fill auto complete', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.autocomplete.adminRooms'))
                .set(api_data_1.credentials)
                .query({
                selector: JSON.stringify(name),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('items').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('items').that.have.lengthOf(2);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/rooms.adminRooms', () => {
        const suffix = `test-${Date.now()}`;
        const fnameRoom = `Ελληνικά-${suffix}`;
        const nameRoom = `Ellinika-${suffix}`;
        const discussionRoomName = `${nameRoom}-discussion`;
        let testGroup;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('UI_Allow_room_names_with_special_chars', true);
            testGroup = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: fnameRoom })).body.group;
            yield api_data_1.request.post((0, api_data_1.api)('rooms.createDiscussion')).set(api_data_1.credentials).send({
                prid: testGroup._id,
                t_name: discussionRoomName,
            });
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, permissions_helper_1.updateSetting)('UI_Allow_room_names_with_special_chars', false),
            (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testGroup._id }),
            (0, permissions_helper_1.updatePermission)('view-room-administration', ['admin']),
        ]));
        (0, mocha_1.it)('should throw an error when the user tries to gets a list of discussion and he cannot access the room', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-room-administration', []).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('rooms.adminRooms'))
                    .set(api_data_1.credentials)
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('error-not-authorized');
                })
                    .end(() => (0, permissions_helper_1.updatePermission)('view-room-administration', ['admin']).then(done));
            });
        });
        (0, mocha_1.it)('should return a list of admin rooms', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.adminRooms'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return a list of admin rooms even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.adminRooms'))
                .set(api_data_1.credentials)
                .query({
                count: 5,
                offset: 0,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
        (0, mocha_1.it)('should search the list of admin rooms using non-latin characters when UI_Allow_room_names_with_special_chars setting is toggled', (done) => {
            void (0, permissions_helper_1.updateSetting)('UI_Allow_room_names_with_special_chars', true).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('rooms.adminRooms'))
                    .set(api_data_1.credentials)
                    .query({
                    filter: fnameRoom,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.rooms).to.have.lengthOf(1);
                    (0, chai_1.expect)(res.body.rooms[0].fname).to.be.equal(fnameRoom);
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should search the list of admin rooms using latin characters only when UI_Allow_room_names_with_special_chars setting is disabled', (done) => {
            void (0, permissions_helper_1.updateSetting)('UI_Allow_room_names_with_special_chars', false).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('rooms.adminRooms'))
                    .set(api_data_1.credentials)
                    .query({
                    filter: nameRoom,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.rooms).to.have.lengthOf(1);
                    (0, chai_1.expect)(res.body.rooms[0].name).to.be.equal(nameRoom);
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should filter by only rooms types', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.adminRooms'))
                .set(api_data_1.credentials)
                .query({
                types: ['p'],
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                (0, chai_1.expect)(res.body.rooms).to.have.lengthOf.at.least(1);
                (0, chai_1.expect)(res.body.rooms[0].t).to.be.equal('p');
                (0, chai_1.expect)(res.body.rooms.find((room) => room.name === nameRoom)).to.exist;
                (0, chai_1.expect)(res.body.rooms.find((room) => room.name === discussionRoomName)).to.not.exist;
            })
                .end(done);
        });
        (0, mocha_1.it)('should filter by only name', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.adminRooms'))
                .set(api_data_1.credentials)
                .query({
                filter: nameRoom,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                (0, chai_1.expect)(res.body.rooms).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.rooms[0].name).to.be.equal(nameRoom);
            })
                .end(done);
        });
        (0, mocha_1.it)('should filter by type and name at the same query', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.adminRooms'))
                .set(api_data_1.credentials)
                .query({
                filter: nameRoom,
                types: ['p'],
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                (0, chai_1.expect)(res.body.rooms).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.rooms[0].name).to.be.equal(nameRoom);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an empty array when filter by wrong type and correct room name', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.adminRooms'))
                .set(api_data_1.credentials)
                .query({
                filter: nameRoom,
                types: ['c'],
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                (0, chai_1.expect)(res.body.rooms).to.have.lengthOf(0);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an array sorted by "ts" property', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.adminRooms'))
                .set(api_data_1.credentials)
                .query({
                sort: JSON.stringify({
                    ts: -1,
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                (0, chai_1.expect)(res.body.rooms).to.have.lengthOf.at.least(1);
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('ts').that.is.a('string');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('update group dms name', () => {
        let testUser;
        let roomId;
        let testUser2;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            testUser2 = yield (0, users_helper_1.createUser)();
            const usernames = [testUser.username, testUser2.username].join(',');
            const result = yield api_data_1.request.post((0, api_data_1.api)('dm.create')).set(api_data_1.credentials).send({
                usernames,
            });
            roomId = result.body.room.rid;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            return Promise.all([
                (0, permissions_helper_1.updateSetting)('UI_Use_Real_Name', false),
                (0, rooms_helper_1.deleteRoom)({ type: 'd', roomId }),
                (0, users_helper_1.deleteUser)(testUser),
                (0, users_helper_1.deleteUser)(testUser2),
            ]);
        }));
        (0, mocha_1.it)('should update group name if user changes username', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('UI_Use_Real_Name', false);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: testUser._id,
                data: {
                    username: `changed.username.${testUser.username}`,
                },
            });
            // need to wait for the username update finish
            yield (0, sleep_1.sleep)(300);
            yield api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .set(api_data_1.credentials)
                .query({ roomId })
                .send()
                .expect((res) => {
                const { subscription } = res.body;
                (0, chai_1.expect)(subscription.name).to.equal(`changed.username.${testUser.username},${testUser2.username}`);
            });
        }));
        (0, mocha_1.it)('should update group name if user changes name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('UI_Use_Real_Name', true);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: testUser._id,
                data: {
                    name: `changed.name.${testUser.username}`,
                },
            });
            // need to wait for the name update finish
            yield (0, sleep_1.sleep)(300);
            yield api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .set(api_data_1.credentials)
                .query({ roomId })
                .send()
                .expect((res) => {
                const { subscription } = res.body;
                (0, chai_1.expect)(subscription.fname).to.equal(`changed.name.${testUser.username}, ${testUser2.name}`);
            });
        }));
    });
    (0, mocha_1.describe)('/rooms.delete', () => {
        let testChannel;
        (0, mocha_1.before)('create an channel', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.${Date.now()}-${Math.random()}` });
            testChannel = result.body.channel;
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
        (0, mocha_1.it)('should throw an error when roomId is not provided', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.delete'))
                .set(api_data_1.credentials)
                .send({})
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', "The 'roomId' param is required");
            })
                .end(done);
        });
        (0, mocha_1.it)('should delete a room when the request is correct', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.delete'))
                .set(api_data_1.credentials)
                .send({ roomId: testChannel._id })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when the room id doesn exist', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.delete'))
                .set(api_data_1.credentials)
                .send({ roomId: 'invalid' })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('rooms.saveRoomSettings', () => {
        let testChannel;
        const randomString = `randomString${Date.now()}`;
        const teamName = `team-${Date.now()}`;
        let discussion;
        let testTeam;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.${Date.now()}-${Math.random()}` });
            testChannel = result.body.channel;
            const resTeam = yield api_data_1.request.post((0, api_data_1.api)('teams.create')).set(api_data_1.credentials).send({ name: teamName, type: 0 });
            const resDiscussion = yield api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testChannel._id,
                t_name: `discussion-create-from-tests-${testChannel.name}`,
            });
            testTeam = resTeam.body.team;
            discussion = resDiscussion.body.discussion;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: discussion._id }),
            (0, teams_helper_1.deleteTeam)(api_data_1.credentials, testTeam.name),
            (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testChannel._id }),
        ]));
        (0, mocha_1.it)('should update the room settings', (done) => {
            const imageDataUri = `data:image/png;base64,${fs_1.default.readFileSync(path_1.default.join(process.cwd(), interactions_1.imgURL)).toString('base64')}`;
            void api_data_1.request
                .post((0, api_data_1.api)('rooms.saveRoomSettings'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                roomAvatar: imageDataUri,
                featured: true,
                roomName: randomString,
                roomTopic: randomString,
                roomAnnouncement: randomString,
                roomDescription: randomString,
                roomType: 'p',
                readOnly: true,
                reactWhenReadOnly: true,
                default: true,
                favorite: {
                    favorite: true,
                    defaultValue: true,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .end(done);
        });
        (0, mocha_1.it)('should have reflected on rooms.info', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('rooms.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.have.property('_id', testChannel._id);
                (0, chai_1.expect)(res.body.room).to.have.property('name', randomString);
                (0, chai_1.expect)(res.body.room).to.have.property('topic', randomString);
                (0, chai_1.expect)(res.body.room).to.have.property('announcement', randomString);
                (0, chai_1.expect)(res.body.room).to.have.property('description', randomString);
                (0, chai_1.expect)(res.body.room).to.have.property('t', 'p');
                (0, chai_1.expect)(res.body.room).to.have.property('featured', true);
                (0, chai_1.expect)(res.body.room).to.have.property('ro', true);
                (0, chai_1.expect)(res.body.room).to.have.property('default', true);
                (0, chai_1.expect)(res.body.room).to.have.property('favorite', true);
                (0, chai_1.expect)(res.body.room).to.have.property('reactWhenReadOnly', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should be able to update the discussion name with spaces', () => __awaiter(void 0, void 0, void 0, function* () {
            const newDiscussionName = `${randomString} with spaces`;
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.saveRoomSettings'))
                .set(api_data_1.credentials)
                .send({
                rid: discussion._id,
                roomName: newDiscussionName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            yield api_data_1.request
                .get((0, api_data_1.api)('rooms.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: discussion._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.have.property('_id', discussion._id);
                (0, chai_1.expect)(res.body.room).to.have.property('fname', newDiscussionName);
            });
        }));
        (0, mocha_1.it)('should mark a room as favorite', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.saveRoomSettings'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                favorite: {
                    favorite: true,
                    defaultValue: true,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            yield api_data_1.request
                .get((0, api_data_1.api)('rooms.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.have.property('_id', testChannel._id);
                (0, chai_1.expect)(res.body.room).to.have.property('favorite', true);
            });
        }));
        (0, mocha_1.it)('should not mark a room as favorite when room is not a default room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.saveRoomSettings'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                favorite: {
                    favorite: true,
                    defaultValue: false,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            yield api_data_1.request
                .get((0, api_data_1.api)('rooms.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.have.property('_id', testChannel._id);
                (0, chai_1.expect)(res.body.room).to.not.have.property('favorite');
            });
        }));
        (0, mocha_1.it)('should update the team sidepanel items to channels and discussions', () => __awaiter(void 0, void 0, void 0, function* () {
            const sidepanelItems = ['channels', 'discussions'];
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('rooms.saveRoomSettings'))
                .set(api_data_1.credentials)
                .send({
                rid: testTeam.roomId,
                sidepanel: { items: sidepanelItems },
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            const channelInfoResponse = yield api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({ roomId: response.body.rid })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(channelInfoResponse.body).to.have.property('success', true);
            (0, chai_1.expect)(channelInfoResponse.body.channel).to.have.property('sidepanel');
            (0, chai_1.expect)(channelInfoResponse.body.channel.sidepanel).to.have.property('items').that.is.an('array').to.have.deep.members(sidepanelItems);
        }));
        (0, mocha_1.it)('should throw error when updating team sidepanel with incorrect items', () => __awaiter(void 0, void 0, void 0, function* () {
            const sidepanelItems = ['wrong'];
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.saveRoomSettings'))
                .set(api_data_1.credentials)
                .send({
                rid: testTeam.roomId,
                sidepanel: { items: sidepanelItems },
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should throw error when updating team sidepanel with more than 2 items', () => __awaiter(void 0, void 0, void 0, function* () {
            const sidepanelItems = ['channels', 'discussions', 'extra'];
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.saveRoomSettings'))
                .set(api_data_1.credentials)
                .send({
                rid: testTeam.roomId,
                sidepanel: { items: sidepanelItems },
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should throw error when updating team sidepanel with duplicated items', () => __awaiter(void 0, void 0, void 0, function* () {
            const sidepanelItems = ['channels', 'channels'];
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.saveRoomSettings'))
                .set(api_data_1.credentials)
                .send({
                rid: testTeam.roomId,
                sidepanel: { items: sidepanelItems },
            })
                .expect(400);
        }));
    });
    (0, mocha_1.describe)('rooms.images', () => {
        let testUserCreds;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            testUserCreds = yield (0, users_helper_1.login)(user.username, user_1.password);
        }));
        const uploadFile = (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, file }) {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)(`rooms.upload/${roomId}`))
                .set(api_data_1.credentials)
                .attach('file', file)
                .expect('Content-Type', 'application/json')
                .expect(200);
            return body.message.attachments[0];
        });
        const getIdFromImgPath = (link) => {
            return link.split('/')[2];
        };
        (0, mocha_1.it)('should return an error when user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('rooms.images')).expect(401);
        }));
        (0, mocha_1.it)('should return an error when the required parameter "roomId" is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('rooms.images')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the required parameter "roomId" is not a valid room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('rooms.images')).set(api_data_1.credentials).query({ roomId: 'invalid' }).expect(403);
        }));
        (0, mocha_1.it)('should return an error when room is valid but user is not part of it', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `test-${Date.now()}` });
            const { group: { _id: roomId }, } = body;
            yield api_data_1.request.get((0, api_data_1.api)('rooms.images')).set(testUserCreds).query({ roomId }).expect(403);
            yield (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId });
        }));
        (0, mocha_1.it)('should return an empty array when room is valid and user is part of it but there are no images', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `test-${Date.now()}` });
            const { group: { _id: roomId }, } = body;
            yield api_data_1.request
                .get((0, api_data_1.api)('rooms.images'))
                .set(api_data_1.credentials)
                .query({ roomId })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('files').and.to.be.an('array').and.to.have.lengthOf(0);
            });
            yield (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId });
        }));
        (0, mocha_1.it)('should return an array of images when room is valid and user is part of it and there are images', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `test-${Date.now()}` });
            const { group: { _id: roomId }, } = body;
            const { title_link } = yield uploadFile({
                roomId,
                file: fs_1.default.createReadStream(path_1.default.join(process.cwd(), interactions_1.imgURL)),
            });
            const fileId = getIdFromImgPath(title_link);
            yield api_data_1.request
                .get((0, api_data_1.api)('rooms.images'))
                .set(api_data_1.credentials)
                .query({ roomId })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('files').and.to.be.an('array').and.to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.files[0]).to.have.property('_id', fileId);
            });
            yield (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId });
        }));
        (0, mocha_1.it)('should return multiple images when room is valid and user is part of it and there are multiple images', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `test-${Date.now()}` });
            const { group: { _id: roomId }, } = body;
            const { title_link: link1 } = yield uploadFile({
                roomId,
                file: fs_1.default.createReadStream(path_1.default.join(process.cwd(), interactions_1.imgURL)),
            });
            const { title_link: link2 } = yield uploadFile({
                roomId,
                file: fs_1.default.createReadStream(path_1.default.join(process.cwd(), interactions_1.imgURL)),
            });
            const fileId1 = getIdFromImgPath(link1);
            const fileId2 = getIdFromImgPath(link2);
            yield api_data_1.request
                .get((0, api_data_1.api)('rooms.images'))
                .set(api_data_1.credentials)
                .query({ roomId })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('files').and.to.be.an('array').and.to.have.lengthOf(2);
                (0, chai_1.expect)(res.body.files.find((file) => file._id === fileId1)).to.exist;
                (0, chai_1.expect)(res.body.files.find((file) => file._id === fileId2)).to.exist;
            });
            yield (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId });
        }));
        (0, mocha_1.it)('should allow to filter images passing the startingFromId parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `test-${Date.now()}` });
            const { group: { _id: roomId }, } = body;
            const { title_link } = yield uploadFile({
                roomId,
                file: fs_1.default.createReadStream(path_1.default.join(process.cwd(), interactions_1.imgURL)),
            });
            yield uploadFile({
                roomId,
                file: fs_1.default.createReadStream(path_1.default.join(process.cwd(), interactions_1.imgURL)),
            });
            const fileId2 = getIdFromImgPath(title_link);
            yield api_data_1.request
                .get((0, api_data_1.api)('rooms.images'))
                .set(api_data_1.credentials)
                .query({ roomId, startingFromId: fileId2 })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('files').and.to.be.an('array').and.to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.files[0]).to.have.property('_id', fileId2);
            });
            yield (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId });
        }));
    });
    (0, mocha_1.describe)('/rooms.muteUser', () => {
        let testChannel;
        (0, mocha_1.before)('create a channel', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.${Date.now()}-${Math.random()}` });
            testChannel = result.body.channel;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id });
        }));
        (0, mocha_1.it)('should invite rocket.cat user to room', () => {
            return api_data_1.request
                .post((0, api_data_1.api)('channels.invite'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                username: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', testChannel.name);
            });
        });
        (0, mocha_1.it)('should mute the rocket.cat user', () => {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.muteUser'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                username: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        });
        (0, mocha_1.it)('should contain rocket.cat user in mute list', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', testChannel.name);
                (0, chai_1.expect)(res.body.channel).to.have.property('muted').and.to.be.an('array');
                (0, chai_1.expect)(res.body.channel.muted).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.channel.muted[0]).to.be.equal('rocket.cat');
            });
        });
    });
    (0, mocha_1.describe)('/rooms.unmuteUser', () => {
        let testChannel;
        (0, mocha_1.before)('create a channel', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.${Date.now()}-${Math.random()}` });
            testChannel = result.body.channel;
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.saveRoomSettings'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                readOnly: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.invite'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                username: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', testChannel.name);
            });
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id });
        }));
        (0, mocha_1.it)('should unmute the rocket.cat user in read-only room', () => {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.unmuteUser'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                username: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        });
        (0, mocha_1.it)('should contain rocket.cat user in unmute list', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', testChannel.name);
                (0, chai_1.expect)(res.body.channel).to.have.property('unmuted').and.to.be.an('array');
                (0, chai_1.expect)(res.body.channel.unmuted).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.channel.unmuted[0]).to.be.equal('rocket.cat');
            });
        });
    });
    (0, mocha_1.describe)('/rooms.export', () => {
        let testChannel;
        let testMessageId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.export.test.${Date.now()}-${Math.random()}` });
            testChannel = result.body.channel;
            const { body: { message } = {} } = yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Message to create thread',
            });
            testMessageId = message._id;
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
        (0, mocha_1.it)('should fail exporting room as file if dates are incorrectly provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'file',
                dateFrom: 'test-date',
                dateTo: 'test-date',
                format: 'html',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should fail exporting room as file if no roomId is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                type: 'file',
                dateFrom: '2024-03-15',
                dateTo: '2024-03-22',
                format: 'html',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
                (0, chai_1.expect)(res.body).to.have.property('error').include("must have required property 'rid'");
            });
        }));
        (0, mocha_1.it)('should fail exporting room as file if no type is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                dateFrom: '2024-03-15',
                dateTo: '2024-03-22',
                format: 'html',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
                (0, chai_1.expect)(res.body).to.have.property('error').include("must have required property 'type'");
            });
        }));
        (0, mocha_1.it)('should fail exporting room as file if fromDate is after toDate (incorrect date interval)', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'file',
                dateFrom: '2024-03-22',
                dateTo: '2024-03-15',
                format: 'html',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-dates');
                (0, chai_1.expect)(res.body).to.have.property('error', 'From date cannot be after To date [error-invalid-dates]');
            });
        }));
        (0, mocha_1.it)('should fail exporting room as file if invalid roomId is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: 'invalid-rid',
                type: 'file',
                dateFrom: '2024-03-22',
                dateTo: '2024-03-15',
                format: 'html',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-room');
            });
        }));
        (0, mocha_1.it)('should fail exporting room as file if no format is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'file',
                dateFrom: '2024-03-15',
                dateTo: '2024-03-22',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should fail exporting room as file if an invalid format is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'file',
                dateFrom: '2024-03-15',
                dateTo: '2024-03-22',
                format: 'invalid-format',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should fail exporting room as file if an invalid type is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'invalid-type',
                dateFrom: '2024-03-15',
                dateTo: '2024-03-22',
                format: 'html',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should succesfully export room as file', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'file',
                dateFrom: '2024-03-15',
                dateTo: '2024-03-22',
                format: 'html',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should succesfully export room as file even if no dates are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'file',
                format: 'html',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should fail exporting room via email if target users AND target emails are NOT provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'email',
                toUsers: [],
                subject: 'Test Subject',
                messages: [testMessageId],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-recipient');
            });
        }));
        (0, mocha_1.it)('should fail exporting room via email if no target e-mails are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'email',
                toEmails: [],
                subject: 'Test Subject',
                messages: [testMessageId],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-recipient');
            });
        }));
        (0, mocha_1.it)('should fail exporting room via email if no target users or e-mails params are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'email',
                subject: 'Test Subject',
                messages: [testMessageId],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-recipient');
            });
        }));
        (0, mocha_1.it)('should fail exporting room via email if no messages are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'email',
                toUsers: [api_data_1.credentials['X-User-Id']],
                subject: 'Test Subject',
                messages: [],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should succesfully export room via email', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('rooms.export'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
                type: 'email',
                toUsers: [api_data_1.credentials['X-User-Id']],
                subject: 'Test Subject',
                messages: [testMessageId],
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('missing');
                (0, chai_1.expect)(res.body.missing).to.be.an('array').that.is.empty;
            });
        }));
    });
    (0, mocha_1.describe)('/rooms.isMember', () => {
        let testChannel;
        let testGroup;
        let testDM;
        const fakeRoomId = `room.test.${Date.now()}-${Math.random()}`;
        const fakeUserId = `user.test.${Date.now()}-${Math.random()}`;
        const testChannelName = `channel.test.${Date.now()}-${Math.random()}`;
        const testGroupName = `group.test.${Date.now()}-${Math.random()}`;
        let testUser1;
        let testUser2;
        let testUserNonMember;
        let testUser1Credentials;
        let testUserNonMemberCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser1 = yield (0, users_helper_1.createUser)();
            testUser1Credentials = yield (0, users_helper_1.login)(testUser1.username, user_1.password);
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser2 = yield (0, users_helper_1.createUser)();
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUserNonMember = yield (0, users_helper_1.createUser)();
            testUserNonMemberCredentials = yield (0, users_helper_1.login)(testUserNonMember.username, user_1.password);
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, rooms_helper_1.createRoom)({
                type: 'c',
                name: testChannelName,
                members: [testUser1.username, testUser2.username],
            });
            testChannel = response.body.channel;
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, rooms_helper_1.createRoom)({
                type: 'p',
                name: testGroupName,
                members: [testUser1.username, testUser2.username],
            });
            testGroup = response.body.group;
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, rooms_helper_1.createRoom)({
                type: 'd',
                username: testUser2.username,
                credentials: testUser1Credentials,
            });
            testDM = response.body.room;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testGroup._id }),
            (0, rooms_helper_1.deleteRoom)({ type: 'd', roomId: testDM._id }),
            (0, users_helper_1.deleteUser)(testUser1),
            (0, users_helper_1.deleteUser)(testUser2),
            (0, users_helper_1.deleteUser)(testUserNonMember),
        ]));
        (0, mocha_1.it)('should return error if room not found', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: fakeRoomId,
                userId: testUser1._id,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'The required "roomId" or "roomName" param provided does not match any channel [error-room-not-found]');
            });
        });
        (0, mocha_1.it)('should return error if user not found with the given userId', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: testChannel._id,
                userId: fakeUserId,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'error-user-not-found');
            });
        });
        (0, mocha_1.it)('should return error if user not found with the given username', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: testChannel._id,
                username: fakeUserId,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'error-user-not-found');
            });
        });
        (0, mocha_1.it)('should return success with isMember=true if given userId is a member of the channel', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: testChannel._id,
                userId: testUser2._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('isMember', true);
            });
        });
        (0, mocha_1.it)('should return success with isMember=true if given username is a member of the channel', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: testChannel._id,
                username: testUser2.username,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('isMember', true);
            });
        });
        (0, mocha_1.it)('should return success with isMember=false if user is not a member of the channel', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: testChannel._id,
                userId: testUserNonMember._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('isMember', false);
            });
        });
        (0, mocha_1.it)('should return success with isMember=true if given userId is a member of the group', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: testGroup._id,
                userId: testUser2._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('isMember', true);
            });
        });
        (0, mocha_1.it)('should return success with isMember=true if given username is a member of the group', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: testGroup._id,
                username: testUser2.username,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('isMember', true);
            });
        });
        (0, mocha_1.it)('should return success with isMember=false if user is not a member of the group', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: testGroup._id,
                userId: testUserNonMember._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('isMember', false);
            });
        });
        (0, mocha_1.it)('should return unauthorized if caller cannot access the group', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUserNonMemberCredentials)
                .query({
                roomId: testGroup._id,
                userId: testUser1._id,
            })
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'unauthorized');
            });
        });
        (0, mocha_1.it)('should return success with isMember=true if given userId is a member of the DM', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: testDM._id,
                userId: testUser2._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('isMember', true);
            });
        });
        (0, mocha_1.it)('should return success with isMember=true if given username is a member of the DM', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: testDM._id,
                username: testUser2.username,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('isMember', true);
            });
        });
        (0, mocha_1.it)('should return success with isMember=false if user is not a member of the DM', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUser1Credentials)
                .query({
                roomId: testDM._id,
                userId: testUserNonMember._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('isMember', false);
            });
        });
        (0, mocha_1.it)('should return unauthorized if caller cannot access the DM', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('rooms.isMember'))
                .set(testUserNonMemberCredentials)
                .query({
                roomId: testDM._id,
                userId: testUser1._id,
            })
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'unauthorized');
            });
        });
    });
});
