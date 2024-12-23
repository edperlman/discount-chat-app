"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_1 = require("./accounts");
const analytics_1 = require("./analytics");
const assets_1 = require("./assets");
const bots_1 = require("./bots");
const call_center_1 = require("./call-center");
const cas_1 = require("./cas");
const crowd_1 = require("./crowd");
const custom_emoji_1 = require("./custom-emoji");
const custom_sounds_1 = require("./custom-sounds");
const discussions_1 = require("./discussions");
const e2e_1 = require("./e2e");
const email_1 = require("./email");
const federation_1 = require("./federation");
const file_upload_1 = require("./file-upload");
const general_1 = require("./general");
const irc_1 = require("./irc");
const layout_1 = require("./layout");
const ldap_1 = require("./ldap");
const logs_1 = require("./logs");
const message_1 = require("./message");
const meta_1 = require("./meta");
const misc_1 = require("./misc");
const mobile_1 = require("./mobile");
const oauth_1 = require("./oauth");
const omnichannel_1 = require("./omnichannel");
const otr_1 = require("./otr");
const push_1 = require("./push");
const rate_1 = require("./rate");
const retention_policy_1 = require("./retention-policy");
const setup_wizard_1 = require("./setup-wizard");
const slackbridge_1 = require("./slackbridge");
const smarsh_1 = require("./smarsh");
const threads_1 = require("./threads");
const troubleshoot_1 = require("./troubleshoot");
const userDataDownload_1 = require("./userDataDownload");
const video_conference_1 = require("./video-conference");
const webdav_1 = require("./webdav");
const webrtc_1 = require("./webrtc");
await Promise.all([
    (0, accounts_1.createAccountSettings)(),
    (0, analytics_1.createAnalyticsSettings)(),
    (0, assets_1.createAssetsSettings)(),
    (0, bots_1.createBotsSettings)(),
    (0, call_center_1.createCallCenterSettings)(),
    (0, cas_1.createCasSettings)(),
    (0, crowd_1.createCrowdSettings)(),
    (0, custom_emoji_1.createEmojiSettings)(),
    (0, custom_sounds_1.createSoundsSettings)(),
    (0, discussions_1.createDiscussionsSettings)(),
    (0, email_1.createEmailSettings)(),
    (0, e2e_1.createE2ESettings)(),
    (0, federation_1.createFederationSettings)(),
    (0, file_upload_1.createFileUploadSettings)(),
    (0, general_1.createGeneralSettings)(),
    (0, irc_1.createIRCSettings)(),
    (0, ldap_1.createLdapSettings)(),
    (0, logs_1.createLogSettings)(),
    (0, layout_1.createLayoutSettings)(),
    (0, message_1.createMessageSettings)(),
    (0, meta_1.createMetaSettings)(),
    (0, misc_1.createMiscSettings)(),
    (0, mobile_1.createMobileSettings)(),
    (0, oauth_1.createOauthSettings)(),
    (0, omnichannel_1.createOmniSettings)(),
    (0, otr_1.createOTRSettings)(),
    (0, push_1.createPushSettings)(),
    (0, rate_1.createRateLimitSettings)(),
    (0, retention_policy_1.createRetentionSettings)(),
    (0, setup_wizard_1.createSetupWSettings)(),
    (0, slackbridge_1.createSlackBridgeSettings)(),
    (0, smarsh_1.createSmarshSettings)(),
    (0, threads_1.createThreadSettings)(),
    (0, troubleshoot_1.createTroubleshootSettings)(),
    (0, video_conference_1.createVConfSettings)(),
    (0, userDataDownload_1.createUserDataSettings)(),
    (0, webdav_1.createWebDavSettings)(),
    (0, webrtc_1.createWebRTCSettings)(),
]);
