"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericResourceUsage_1 = require("../../../../components/GenericResourceUsage");
const SeatsCapUsage = ({ limit, members }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const percentage = Math.max(0, Math.min((100 / limit) * members, 100));
    const seatsLeft = Math.max(0, limit - members);
    return ((0, jsx_runtime_1.jsx)(GenericResourceUsage_1.GenericResourceUsage, { title: t('Seats_Available', { seatsLeft }), value: members, max: limit, percentage: percentage, "data-testid": 'seats-cap-progress-bar' }));
};
exports.default = SeatsCapUsage;
