"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const isSameChannel_1 = require("../../../../../app/livechat/lib/isSameChannel");
const useHasLicenseModule_1 = require("../../../../hooks/useHasLicenseModule");
const useBlockChannel_1 = require("../../../omnichannel/contactInfo/tabs/ContactInfoChannels/useBlockChannel");
const RoomContext_1 = require("../../contexts/RoomContext");
const ComposerOmnichannelCallout = () => {
    var _a, _b, _c;
    const { t } = (0, react_i18next_1.useTranslation)();
    const room = (0, RoomContext_1.useOmnichannelRoom)();
    const { navigate, buildRoutePath } = (0, ui_contexts_1.useRouter)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('contact-id-verification');
    const securityPrivacyRoute = buildRoutePath('/omnichannel/security-privacy');
    const shouldShowSecurityRoute = (0, ui_contexts_1.useSetting)('Livechat_Require_Contact_Verification') !== 'never' || !hasLicense;
    const canViewSecurityPrivacy = (0, ui_contexts_1.useAtLeastOnePermission)([
        'view-privileged-setting',
        'edit-privileged-setting',
        'manage-selected-settings',
    ]);
    const { _id, v: { _id: visitorId }, source, contactId, } = room;
    const getContactById = (0, ui_contexts_1.useEndpoint)('GET', '/v1/omnichannel/contacts.get');
    const { data } = (0, react_query_1.useQuery)(['getContactById', contactId], () => getContactById({ contactId }));
    const association = { visitorId, source };
    const currentChannel = (_b = (_a = data === null || data === void 0 ? void 0 : data.contact) === null || _a === void 0 ? void 0 : _a.channels) === null || _b === void 0 ? void 0 : _b.find((channel) => (0, isSameChannel_1.isSameChannel)(channel.visitor, association));
    const handleBlock = (0, useBlockChannel_1.useBlockChannel)({ blocked: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.blocked) || false, association });
    if (!((_c = data === null || data === void 0 ? void 0 : data.contact) === null || _c === void 0 ? void 0 : _c.unknown)) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { mbe: 16, title: t('Contact_unknown'), actions: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => navigate(`/live/${_id}/contact-profile/edit`), small: true, children: t('Add_contact') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, secondary: true, small: true, onClick: handleBlock, children: (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.blocked) ? t('Unblock') : t('Block') })] }), children: shouldShowSecurityRoute ? ((0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Add_to_contact_and_enable_verification_description', children: ["Add to contact list manually and", (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: canViewSecurityPrivacy ? 'a' : 'span', href: securityPrivacyRoute, children: "enable verification" }), "using multi-factor authentication."] })) : (t('Add_to_contact_list_manually')) }));
};
exports.default = ComposerOmnichannelCallout;
