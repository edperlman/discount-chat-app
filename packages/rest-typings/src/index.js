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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./v1/permissions"), exports);
__exportStar(require("./v1/presence"), exports);
__exportStar(require("./v1/roles"), exports);
__exportStar(require("./v1/settings"), exports);
__exportStar(require("./v1/teams"), exports);
__exportStar(require("./v1/videoConference"), exports);
__exportStar(require("./v1/assets"), exports);
__exportStar(require("./v1/channels"), exports);
__exportStar(require("./v1/customUserStatus"), exports);
__exportStar(require("./v1/customSounds"), exports);
__exportStar(require("./v1/subscriptionsEndpoints"), exports);
__exportStar(require("./v1/mailer"), exports);
__exportStar(require("./v1/mailer/MailerParamsPOST"), exports);
__exportStar(require("./v1/mailer/MailerUnsubscribeParamsPOST"), exports);
__exportStar(require("./v1/misc"), exports);
__exportStar(require("./v1/invites"), exports);
__exportStar(require("./v1/dm"), exports);
__exportStar(require("./v1/dm/DmHistoryProps"), exports);
__exportStar(require("./v1/integrations"), exports);
__exportStar(require("./v1/licenses"), exports);
__exportStar(require("./v1/omnichannel"), exports);
__exportStar(require("./v1/oauthapps"), exports);
__exportStar(require("./v1/oauthapps/UpdateOAuthAppParamsPOST"), exports);
__exportStar(require("./v1/oauthapps/OAuthAppsGetParamsGET"), exports);
__exportStar(require("./v1/oauthapps/OAuthAppsAddParamsPOST"), exports);
__exportStar(require("./v1/oauthapps/DeleteOAuthAppParamsDELETE"), exports);
__exportStar(require("./helpers/PaginatedRequest"), exports);
__exportStar(require("./helpers/PaginatedResult"), exports);
__exportStar(require("./helpers/ReplacePlaceholders"), exports);
__exportStar(require("./helpers/WithItemCount"), exports);
__exportStar(require("./v1/emojiCustom"), exports);
__exportStar(require("./v1/instances"), exports);
__exportStar(require("./v1/users"), exports);
__exportStar(require("./v1/users/UsersSetAvatarParamsPOST"), exports);
__exportStar(require("./v1/users/UsersSetPreferenceParamsPOST"), exports);
__exportStar(require("./v1/users/UsersUpdateOwnBasicInfoParamsPOST"), exports);
__exportStar(require("./v1/users/UsersUpdateParamsPOST"), exports);
__exportStar(require("./v1/users/UsersCheckUsernameAvailabilityParamsGET"), exports);
__exportStar(require("./v1/users/UsersSendConfirmationEmailParamsPOST"), exports);
__exportStar(require("./v1/moderation"), exports);
__exportStar(require("./v1/autotranslate/AutotranslateGetSupportedLanguagesParamsGET"), exports);
__exportStar(require("./v1/autotranslate/AutotranslateSaveSettingsParamsPOST"), exports);
__exportStar(require("./v1/autotranslate/AutotranslateTranslateMessageParamsPOST"), exports);
__exportStar(require("./v1/e2e/e2eGetUsersOfRoomWithoutKeyParamsGET"), exports);
__exportStar(require("./v1/e2e/e2eSetRoomKeyIDParamsPOST"), exports);
__exportStar(require("./v1/e2e/e2eSetUserPublicAndPrivateKeysParamsPOST"), exports);
__exportStar(require("./v1/e2e/e2eUpdateGroupKeyParamsPOST"), exports);
__exportStar(require("./v1/e2e"), exports);
__exportStar(require("./v1/import"), exports);
__exportStar(require("./v1/voip"), exports);
__exportStar(require("./v1/voip-freeswitch"), exports);
__exportStar(require("./v1/email-inbox"), exports);
__exportStar(require("./v1/calendar"), exports);
__exportStar(require("./v1/federation"), exports);
__exportStar(require("./v1/rooms"), exports);
__exportStar(require("./v1/groups"), exports);
__exportStar(require("./v1/chat"), exports);
__exportStar(require("./v1/auth"), exports);
__exportStar(require("./v1/cloud"), exports);
__exportStar(require("./v1/banners"), exports);