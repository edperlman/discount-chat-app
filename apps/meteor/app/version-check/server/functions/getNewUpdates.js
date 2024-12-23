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
exports.getNewUpdates = void 0;
const os_1 = __importDefault(require("os"));
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const check_1 = require("meteor/check");
const server_1 = require("../../../cloud/server");
const rocketchat_info_1 = require("../../../utils/rocketchat.info");
/** @deprecated */
const getNewUpdates = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uniqueID = yield models_1.Settings.findOne('uniqueID');
        if (!uniqueID) {
            throw new Error('uniqueID not found');
        }
        const params = {
            uniqueId: String(uniqueID.value),
            installedAt: uniqueID.createdAt.toJSON(),
            version: rocketchat_info_1.Info.version,
            osType: os_1.default.type(),
            osPlatform: os_1.default.platform(),
            osArch: os_1.default.arch(),
            osRelease: os_1.default.release(),
            nodeVersion: process.version,
            deployMethod: process.env.DEPLOY_METHOD || 'tar',
            deployPlatform: process.env.DEPLOY_PLATFORM || 'selfinstall',
        };
        const token = yield (0, server_1.getWorkspaceAccessToken)();
        const headers = Object.assign({}, (token && { Authorization: `Bearer ${token}` }));
        const url = 'https://releases.rocket.chat/updates/check';
        const response = yield (0, server_fetch_1.serverFetch)(url, {
            headers,
            params,
        });
        const data = yield response.json();
        (0, check_1.check)(data, check_1.Match.ObjectIncluding({
            versions: [
                check_1.Match.ObjectIncluding({
                    version: String,
                    security: check_1.Match.Optional(Boolean),
                    infoUrl: String,
                }),
            ],
            alerts: check_1.Match.Optional([
                check_1.Match.ObjectIncluding({
                    id: String,
                    title: String,
                    text: String,
                    textArguments: [check_1.Match.Any],
                    modifiers: [String],
                    infoUrl: String,
                }),
            ]),
        }));
        return data;
    }
    catch (error) {
        // There's no need to log this error
        // as it's pointless and the user
        // can't do anything about it anyways
        return {
            versions: [],
            alerts: [],
        };
    }
});
exports.getNewUpdates = getNewUpdates;
