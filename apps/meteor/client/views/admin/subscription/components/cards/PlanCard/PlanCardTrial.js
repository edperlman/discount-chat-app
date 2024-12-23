"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const differenceInDays_1 = __importDefault(require("date-fns/differenceInDays"));
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const PlanCardHeader_1 = __importDefault(require("./PlanCardHeader"));
const useLicense_1 = require("../../../../../../hooks/useLicense");
const links_1 = require("../../../utils/links");
const UpgradeButton_1 = __importDefault(require("../../UpgradeButton"));
const PlanCardTrial = ({ licenseInformation }) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const planName = (0, useLicense_1.useLicenseName)();
    const isSalesAssisted = ((_a = licenseInformation.grantedBy) === null || _a === void 0 ? void 0 : _a.method) !== 'self-service' || true;
    const { visualExpiration } = licenseInformation;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Card, { height: 'full', children: [(0, jsx_runtime_1.jsx)(PlanCardHeader_1.default, { name: (_b = planName.data) !== null && _b !== void 0 ? _b : '' }), (0, jsx_runtime_1.jsxs)(fuselage_1.CardBody, { flexDirection: 'column', children: [visualExpiration && ((0, jsx_runtime_1.jsxs)(fuselage_1.CardRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2b', mie: 8, children: t('Trial_active') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { children: t('n_days_left', { n: (0, differenceInDays_1.default)(new Date(visualExpiration), new Date()) }) })] })), (0, jsx_runtime_1.jsx)(fuselage_1.CardRow, { children: (0, jsx_runtime_1.jsx)("span", { children: isSalesAssisted ? ((0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Contact_sales_trial', children: ["Contact sales to finish your purchase and avoid", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: links_1.DOWNGRADE_LINK, children: "downgrade consequences." })] })) : ((0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Finish_your_purchase_trial', children: ["Finish your purchase to avoid ", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: links_1.DOWNGRADE_LINK, children: "downgrade consequences." })] })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.CardRow, { children: (0, jsx_runtime_1.jsx)(react_i18next_1.Trans, { i18nKey: 'Why_has_a_trial_been_applied_to_this_workspace', children: (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: links_1.TRIAL_LINK, children: "Why has a trial been applied to this workspace?" }) }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.CardControls, { children: (0, jsx_runtime_1.jsx)(UpgradeButton_1.default, { target: 'plan_card_trial', action: isSalesAssisted ? 'finish_purchase' : 'contact_sales', primary: true, mbs: 'auto', w: 'full', children: isSalesAssisted ? t('Finish_purchase') : t('Contact_sales') }) })] }));
};
exports.default = PlanCardTrial;
