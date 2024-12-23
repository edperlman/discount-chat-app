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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleClass = exports.TestData = exports.TestInfastructureSetup = void 0;
const appBridges_1 = require("./bridges/appBridges");
const TestSourceStorage_1 = require("./storage/TestSourceStorage");
const logStorage_1 = require("./storage/logStorage");
const storage_1 = require("./storage/storage");
const AppStatus_1 = require("../../src/definition/AppStatus");
const accessors_1 = require("../../src/definition/accessors");
const api_1 = require("../../src/definition/api");
const rooms_1 = require("../../src/definition/rooms");
const settings_1 = require("../../src/definition/settings");
const users_1 = require("../../src/definition/users");
const IVideoConference_1 = require("../../src/definition/videoConferences/IVideoConference");
const ProxiedApp_1 = require("../../src/server/ProxiedApp");
const compiler_1 = require("../../src/server/compiler");
class TestInfastructureSetup {
    constructor() {
        this.appStorage = new storage_1.TestsAppStorage();
        this.logStorage = new logStorage_1.TestsAppLogStorage();
        this.bridges = new appBridges_1.TestsAppBridges();
        this.sourceStorage = new TestSourceStorage_1.TestSourceStorage();
        this.runtimeManager = {
            startRuntimeForApp: () => __awaiter(this, void 0, void 0, function* () {
                return {};
            }),
            runInSandbox: () => __awaiter(this, void 0, void 0, function* () {
                return {};
            }),
            stopRuntime: () => { },
        };
        this.appManager = {
            getParser() {
                if (!this.parser) {
                    this.parser = new compiler_1.AppPackageParser();
                }
                return this.parser;
            },
            getBridges: () => {
                return this.bridges;
            },
            getCommandManager() {
                return {};
            },
            getExternalComponentManager() {
                return {};
            },
            getOneById(appId) {
                return appId === 'failMePlease' ? undefined : TestData.getMockApp(appId, 'testing');
            },
            getLogStorage() {
                return new logStorage_1.TestsAppLogStorage();
            },
            getSchedulerManager() {
                return {};
            },
            getUIActionButtonManager() {
                return {};
            },
            getVideoConfProviderManager() {
                return {};
            },
            getSettingsManager() {
                return {};
            },
            getRuntime: () => {
                return this.runtimeManager;
            },
        };
    }
    getAppStorage() {
        return this.appStorage;
    }
    getLogStorage() {
        return this.logStorage;
    }
    getAppBridges() {
        return this.bridges;
    }
    getSourceStorage() {
        return this.sourceStorage;
    }
    getMockManager() {
        return this.appManager;
    }
}
exports.TestInfastructureSetup = TestInfastructureSetup;
const date = new Date();
const DEFAULT_ATTACHMENT = {
    color: '#00b2b2',
    collapsed: false,
    text: 'Just an attachment that is used for testing',
    timestampLink: 'https://google.com/',
    thumbnailUrl: 'https://avatars0.githubusercontent.com/u/850391?s=88&v=4',
    author: {
        name: 'Author Name',
        link: 'https://github.com/graywolf336',
        icon: 'https://avatars0.githubusercontent.com/u/850391?s=88&v=4',
    },
    title: {
        value: 'Attachment Title',
        link: 'https://github.com/RocketChat',
        displayDownloadLink: false,
    },
    imageUrl: 'https://rocket.chat/images/default/logo.svg',
    audioUrl: 'http://www.w3schools.com/tags/horse.mp3',
    videoUrl: 'http://www.w3schools.com/tags/movie.mp4',
    fields: [
        {
            short: true,
            title: 'Test',
            value: 'Testing out something or other',
        },
        {
            short: true,
            title: 'Another Test',
            value: '[Link](https://google.com/) something and this and that.',
        },
    ],
};
class TestData {
    static getDate() {
        return date;
    }
    static getSetting(id) {
        return {
            id: id || 'testing',
            type: settings_1.SettingType.STRING,
            packageValue: 'The packageValue',
            required: false,
            public: false,
            i18nLabel: 'Testing',
        };
    }
    static getUser(id, username) {
        return {
            id: id || 'BBxwgCBzLeMC6esTb',
            username: username || 'testing-user',
            name: 'Testing User',
            emails: [],
            type: users_1.UserType.USER,
            isEnabled: true,
            roles: ['admin'],
            status: 'online',
            statusConnection: users_1.UserStatusConnection.ONLINE,
            utcOffset: -5,
            createdAt: date,
            updatedAt: new Date(),
            lastLoginAt: new Date(),
        };
    }
    static getRoom(id, slugifiedName) {
        return {
            id: id || 'bTse6CMeLzBCgwxBB',
            slugifiedName: slugifiedName || 'testing-room',
            displayName: 'Testing Room',
            type: rooms_1.RoomType.CHANNEL,
            creator: TestData.getUser(),
            usernames: [TestData.getUser().username],
            isDefault: true,
            isReadOnly: false,
            displaySystemMessages: true,
            messageCount: 145,
            createdAt: date,
            updatedAt: new Date(),
            lastModifiedAt: new Date(),
        };
    }
    static getMessage(id, text) {
        return {
            id: id || '4bShvoOXqB',
            room: TestData.getRoom(),
            sender: TestData.getUser(),
            text: 'This is just a test, do not be alarmed',
            createdAt: date,
            updatedAt: new Date(),
            editor: TestData.getUser(),
            editedAt: new Date(),
            emoji: ':see_no_evil:',
            avatarUrl: 'https://avatars0.githubusercontent.com/u/850391?s=88&v=4',
            alias: 'Testing Bot',
            attachments: [this.createAttachment()],
        };
    }
    static getMessageRaw(id, text) {
        const editorUser = TestData.getUser();
        const senderUser = TestData.getUser();
        return {
            id: id || '4bShvoOXqB',
            roomId: TestData.getRoom().id,
            sender: {
                _id: senderUser.id,
                username: senderUser.username,
                name: senderUser === null || senderUser === void 0 ? void 0 : senderUser.name,
            },
            text: text || 'This is just a test, do not be alarmed',
            createdAt: date,
            updatedAt: new Date(),
            editor: {
                _id: editorUser.id,
                username: editorUser.username,
            },
            editedAt: new Date(),
            emoji: ':see_no_evil:',
            avatarUrl: 'https://avatars0.githubusercontent.com/u/850391?s=88&v=4',
            alias: 'Testing Bot',
            attachments: [this.createAttachment()],
        };
    }
    static createAttachment(attachment) {
        attachment = attachment || DEFAULT_ATTACHMENT;
        return Object.assign({ timestamp: new Date() }, attachment);
    }
    static getSlashCommand(command) {
        return {
            command: command || 'testing-cmd',
            i18nParamsExample: 'justATest',
            i18nDescription: 'justATest_Description',
            permission: 'create-c',
            providesPreview: true,
            executor: (context, read, modify, http, persis) => {
                return Promise.resolve();
            },
            previewer: (context, read, modify, http, persis) => {
                return Promise.resolve({
                    i18nTitle: 'my i18nTitle',
                    items: [],
                });
            },
            executePreviewItem: (item, context, read, modify, http, persis) => {
                return Promise.resolve();
            },
        };
    }
    static getApi(path = 'testing-path', visibility = api_1.ApiVisibility.PUBLIC, security = api_1.ApiSecurity.UNSECURE) {
        return {
            visibility,
            security,
            endpoints: [
                {
                    path,
                    // The move to the Deno runtime now requires us to manually set what methods are available
                    _availableMethods: ['get'],
                    get(request, endpoint, read, modify, http, persis) {
                        return Promise.resolve({
                            status: accessors_1.HttpStatusCode.OK,
                        });
                    },
                },
            ],
        };
    }
    static getVideoConfProvider(name = 'test') {
        return {
            name,
            generateUrl(call) {
                return __awaiter(this, void 0, void 0, function* () {
                    return `${name}/${call._id}`;
                });
            },
            customizeUrl(call, user, options) {
                return __awaiter(this, void 0, void 0, function* () {
                    return `${name}/${call._id}#${user ? user.username : ''}`;
                });
            },
        };
    }
    static getInvalidConfProvider(name = 'invalid') {
        return {
            name,
            isFullyConfigured() {
                return __awaiter(this, void 0, void 0, function* () {
                    return false;
                });
            },
            generateUrl(call) {
                return __awaiter(this, void 0, void 0, function* () {
                    return ``;
                });
            },
            customizeUrl(call, user, options) {
                return __awaiter(this, void 0, void 0, function* () {
                    return ``;
                });
            },
        };
    }
    static getFullVideoConfProvider(name = 'test') {
        return {
            name,
            capabilities: {
                mic: true,
                cam: true,
                title: true,
            },
            isFullyConfigured() {
                return __awaiter(this, void 0, void 0, function* () {
                    return true;
                });
            },
            generateUrl(call) {
                return __awaiter(this, void 0, void 0, function* () {
                    return `${name}/${call._id}`;
                });
            },
            customizeUrl(call, user, options) {
                return __awaiter(this, void 0, void 0, function* () {
                    return `${name}/${call._id}#${user ? user.username : ''}`;
                });
            },
        };
    }
    static getVideoConferenceUser() {
        return {
            _id: 'callerId',
            username: 'caller',
            name: 'John Caller',
        };
    }
    static getVideoConfData() {
        return {
            _id: 'first-call',
            type: 'videoconference',
            rid: 'roomId',
            createdBy: this.getVideoConferenceUser(),
            title: 'Test Call',
        };
    }
    static getVideoConfDataExtended(providerName = 'test') {
        return Object.assign(Object.assign({}, this.getVideoConfData()), { url: '${providerName}/first-call' });
    }
    static getAppVideoConference() {
        return {
            rid: 'roomId',
            createdBy: 'userId',
            title: 'Video Conference',
            providerName: 'test',
        };
    }
    static getVideoConference() {
        return {
            _id: 'first-call',
            _updatedAt: new Date(),
            type: 'videoconference',
            rid: 'roomId',
            users: [
                {
                    _id: 'johnId',
                    name: 'John Doe',
                    username: 'mrdoe',
                    ts: new Date(),
                },
                {
                    _id: 'janeId',
                    name: 'Jane Doe',
                    username: 'msdoe',
                    ts: new Date(),
                },
            ],
            status: IVideoConference_1.VideoConferenceStatus.STARTED,
            messages: {
                started: 'messageId',
            },
            url: 'video-conf/first-call',
            createdBy: {
                _id: 'johnId',
                name: 'John Doe',
                username: 'mrdoe',
            },
            createdAt: new Date(),
            title: 'Video Conference',
            anonymousUsers: 0,
            providerName: 'test',
        };
    }
    static getOAuthApp(isToCreate) {
        const OAuthApp = {
            _id: '4526fcab-b068-4dcc-b208-4fff599165b0',
            name: 'name-test',
            active: true,
            clientId: 'clientId-test',
            clientSecret: 'clientSecret-test',
            redirectUri: 'redirectUri-test',
            appId: 'app-123',
            _createdAt: '2022-07-11T14:30:48.937Z',
            _createdBy: {
                _id: 'Em5TQwMD4P7AmTs73',
                username: 'testa.bot',
            },
            _updatedAt: '2022-07-11T14:30:48.937Z',
        };
        if (isToCreate) {
            delete OAuthApp._id;
            delete OAuthApp._createdAt;
            delete OAuthApp._createdBy;
            delete OAuthApp._updatedAt;
            delete OAuthApp.appId;
        }
        return OAuthApp;
    }
    static getMockApp(id, name) {
        return new ProxiedApp_1.ProxiedApp({}, { status: AppStatus_1.AppStatus.UNKNOWN, info: { id, name } }, {});
    }
}
exports.TestData = TestData;
class SimpleClass {
    constructor(world = 'Earith') {
        this.world = world;
    }
    getWorld() {
        return this.world;
    }
}
exports.SimpleClass = SimpleClass;
