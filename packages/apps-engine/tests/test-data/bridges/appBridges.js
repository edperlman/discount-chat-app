"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsAppBridges = void 0;
const OAuthAppsBridge_1 = require("./OAuthAppsBridge");
const activationBridge_1 = require("./activationBridge");
const apiBridge_1 = require("./apiBridge");
const appDetailChanges_1 = require("./appDetailChanges");
const cloudBridge_1 = require("./cloudBridge");
const commandBridge_1 = require("./commandBridge");
const contactBridge_1 = require("./contactBridge");
const emailBridge_1 = require("./emailBridge");
const environmentalVariableBridge_1 = require("./environmentalVariableBridge");
const httpBridge_1 = require("./httpBridge");
const internalBridge_1 = require("./internalBridge");
const internalFederationBridge_1 = require("./internalFederationBridge");
const livechatBridge_1 = require("./livechatBridge");
const messageBridge_1 = require("./messageBridge");
const moderationBridge_1 = require("./moderationBridge");
const persisBridge_1 = require("./persisBridge");
const roleBridge_1 = require("./roleBridge");
const roomBridge_1 = require("./roomBridge");
const schedulerBridge_1 = require("./schedulerBridge");
const serverSettingBridge_1 = require("./serverSettingBridge");
const threadBridge_1 = require("./threadBridge");
const uiIntegrationBridge_1 = require("./uiIntegrationBridge");
const uploadBridge_1 = require("./uploadBridge");
const userBridge_1 = require("./userBridge");
const videoConferenceBridge_1 = require("./videoConferenceBridge");
const bridges_1 = require("../../../src/server/bridges");
class TestsAppBridges extends bridges_1.AppBridges {
    constructor() {
        super();
        this.appDetails = new appDetailChanges_1.TestsAppDetailChangesBridge();
        this.cmdBridge = new commandBridge_1.TestsCommandBridge();
        this.apiBridge = new apiBridge_1.TestsApiBridge();
        this.setsBridge = new serverSettingBridge_1.TestsServerSettingBridge();
        this.envBridge = new environmentalVariableBridge_1.TestsEnvironmentalVariableBridge();
        this.rlActBridge = new activationBridge_1.TestsActivationBridge();
        this.msgBridge = new messageBridge_1.TestsMessageBridge();
        this.moderationBridge = new moderationBridge_1.TestsModerationBridge();
        this.persisBridge = new persisBridge_1.TestsPersisBridge();
        this.roleBridge = new roleBridge_1.TestsRoleBridge();
        this.roomBridge = new roomBridge_1.TestsRoomBridge();
        this.internalBridge = new internalBridge_1.TestsInternalBridge();
        this.userBridge = new userBridge_1.TestsUserBridge();
        this.httpBridge = new httpBridge_1.TestsHttpBridge();
        this.livechatBridge = new livechatBridge_1.TestLivechatBridge();
        this.uploadBridge = new uploadBridge_1.TestUploadBridge();
        this.uiIntegrationBridge = new uiIntegrationBridge_1.TestsUiIntegrationBridge();
        this.schedulerBridge = new schedulerBridge_1.TestSchedulerBridge();
        this.cloudWorkspaceBridge = new cloudBridge_1.TestAppCloudWorkspaceBridge();
        this.videoConfBridge = new videoConferenceBridge_1.TestsVideoConferenceBridge();
        this.oauthBridge = new OAuthAppsBridge_1.TestOAuthAppsBridge();
        this.internalFederationBridge = new internalFederationBridge_1.TestsInternalFederationBridge();
        this.threadBridge = new threadBridge_1.TestsThreadBridge();
        this.emailBridge = new emailBridge_1.TestsEmailBridge();
        this.contactBridge = new contactBridge_1.TestContactBridge();
    }
    getCommandBridge() {
        return this.cmdBridge;
    }
    getApiBridge() {
        return this.apiBridge;
    }
    getServerSettingBridge() {
        return this.setsBridge;
    }
    getEnvironmentalVariableBridge() {
        return this.envBridge;
    }
    getAppDetailChangesBridge() {
        return this.appDetails;
    }
    getHttpBridge() {
        return this.httpBridge;
    }
    getListenerBridge() {
        throw new Error('Method not implemented.');
    }
    getMessageBridge() {
        return this.msgBridge;
    }
    getModerationBridge() {
        return this.moderationBridge;
    }
    getPersistenceBridge() {
        return this.persisBridge;
    }
    getAppActivationBridge() {
        return this.rlActBridge;
    }
    getThreadBridge() {
        return this.threadBridge;
    }
    getRoleBridge() {
        return this.roleBridge;
    }
    getRoomBridge() {
        return this.roomBridge;
    }
    getInternalBridge() {
        return this.internalBridge;
    }
    getUserBridge() {
        return this.userBridge;
    }
    getLivechatBridge() {
        return this.livechatBridge;
    }
    getEmailBridge() {
        return this.emailBridge;
    }
    getUploadBridge() {
        return this.uploadBridge;
    }
    getUiInteractionBridge() {
        return this.uiIntegrationBridge;
    }
    getSchedulerBridge() {
        return this.schedulerBridge;
    }
    getCloudWorkspaceBridge() {
        return this.cloudWorkspaceBridge;
    }
    getVideoConferenceBridge() {
        return this.videoConfBridge;
    }
    getOAuthAppsBridge() {
        return this.oauthBridge;
    }
    getInternalFederationBridge() {
        return this.internalFederationBridge;
    }
    getContactBridge() {
        return this.contactBridge;
    }
}
exports.TestsAppBridges = TestsAppBridges;
