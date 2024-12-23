"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const license_1 = require("@rocket.chat/license");
const server_1 = require("../../../../../app/settings/server");
const BeforeSaveCannedResponse_1 = require("../../../../server/hooks/messages/BeforeSaveCannedResponse");
void license_1.License.onToggledFeature('canned-responses', {
    up: () => {
        // when the license is enabled, we need to check if the feature is enabled
        BeforeSaveCannedResponse_1.BeforeSaveCannedResponse.enabled = server_1.settings.get('Canned_Responses_Enable');
    },
    down: () => {
        // when the license is disabled, we can just disable the feature
        BeforeSaveCannedResponse_1.BeforeSaveCannedResponse.enabled = false;
    },
});
// we also need to check if the feature is enabled via setting, which is only possible when there is a license
server_1.settings.watch('Canned_Responses_Enable', (value) => {
    BeforeSaveCannedResponse_1.BeforeSaveCannedResponse.enabled = value;
});
