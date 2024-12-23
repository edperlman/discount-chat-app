"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericNoResults_1 = __importDefault(require("../../../components/GenericNoResults"));
const FederatedRoomListEmptyPlaceholder = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', height: 'full', backgroundColor: 'surface', children: (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { description: t('There_are_no_rooms_for_the_given_search_criteria') }) }));
};
exports.default = FederatedRoomListEmptyPlaceholder;
