"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const ParentRoom_1 = __importDefault(require("./ParentRoom"));
const Header_1 = require("../../../components/Header");
const useRoomInfoEndpoint_1 = require("../../../hooks/useRoomInfoEndpoint");
const ParentRoomWithEndpointData = ({ rid }) => {
    const { data, isLoading, isError } = (0, useRoomInfoEndpoint_1.useRoomInfoEndpoint)(rid);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Header_1.HeaderTagSkeleton, {});
    }
    if (isError || !(data === null || data === void 0 ? void 0 : data.room)) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(ParentRoom_1.default, { room: data.room });
};
exports.default = ParentRoomWithEndpointData;
