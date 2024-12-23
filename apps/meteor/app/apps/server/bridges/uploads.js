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
exports.AppUploadBridge = void 0;
const UploadBridge_1 = require("@rocket.chat/apps-engine/server/bridges/UploadBridge");
const determineFileType_1 = require("../../../../ee/lib/misc/determineFileType");
const server_1 = require("../../../file-upload/server");
const sendFileMessage_1 = require("../../../file-upload/server/methods/sendFileMessage");
const sendFileLivechatMessage_1 = require("../../../livechat/server/methods/sendFileLivechatMessage");
const getUploadDetails = (details) => {
    if (details.visitorToken) {
        const { userId } = details, result = __rest(details, ["userId"]);
        return result;
    }
    return details;
};
class AppUploadBridge extends UploadBridge_1.UploadBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    getById(id, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the upload: "${id}"`);
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const promise = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('uploads').convertById(id);
            return promise;
        });
    }
    getBuffer(upload, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the upload: "${upload.id}"`);
            const rocketChatUpload = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('uploads').convertToRocketChat(upload);
            const result = yield server_1.FileUpload.getBuffer(rocketChatUpload);
            if (!(result instanceof Buffer)) {
                throw new Error('Unknown error');
            }
            return result;
        });
    }
    createUpload(details, buffer, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is creating an upload "${details.name}"`);
            if (!details.userId && !details.visitorToken) {
                throw new Error('Missing user to perform the upload operation');
            }
            const fileStore = server_1.FileUpload.getStore('Uploads');
            details.type = (0, determineFileType_1.determineFileType)(buffer, details.name);
            const uploadedFile = yield fileStore.insert(getUploadDetails(details), buffer);
            this.orch.debugLog(`The App ${appId} has created an upload`, uploadedFile);
            if (details.visitorToken) {
                yield (0, sendFileLivechatMessage_1.sendFileLivechatMessage)({ roomId: details.rid, visitorToken: details.visitorToken, file: uploadedFile });
            }
            else {
                yield (0, sendFileMessage_1.sendFileMessage)(details.userId, { roomId: details.rid, file: uploadedFile });
            }
            return (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('uploads').convertToApp(uploadedFile);
        });
    }
}
exports.AppUploadBridge = AppUploadBridge;
