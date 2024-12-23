"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const PlanCardPremium_1 = __importDefault(require("./PlanCard/PlanCardPremium"));
const PlanCardTrial_1 = __importDefault(require("./PlanCard/PlanCardTrial"));
const PlanCard = ({ licenseInformation, licenseLimits }) => {
    const isTrial = licenseInformation.trial;
    return isTrial ? ((0, jsx_runtime_1.jsx)(PlanCardTrial_1.default, { licenseInformation: licenseInformation })) : ((0, jsx_runtime_1.jsx)(PlanCardPremium_1.default, { licenseInformation: licenseInformation, licenseLimits: licenseLimits }));
};
exports.default = PlanCard;
