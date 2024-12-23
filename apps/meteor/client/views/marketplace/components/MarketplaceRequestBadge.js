"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const useAppRequestStats_1 = require("../hooks/useAppRequestStats");
const MarketplaceRequestBadge = () => {
    const requestStatsResult = (0, useAppRequestStats_1.useAppRequestStats)();
    if (requestStatsResult.isLoading)
        return requestStatsResult.fetchStatus !== 'idle' ? (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'circle', height: 'x16', width: 'x16' }) : null;
    if (requestStatsResult.isError)
        return null;
    if (!requestStatsResult.data.totalUnseen) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(fuselage_1.Badge, { variant: 'primary', children: requestStatsResult.data.totalUnseen });
};
exports.default = MarketplaceRequestBadge;
