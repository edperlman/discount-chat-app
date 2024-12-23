"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const MapView_1 = __importDefault(require("./location/MapView"));
const Location = ({ location }) => {
    var _a;
    const [longitude, latitude] = (_a = location === null || location === void 0 ? void 0 : location.coordinates) !== null && _a !== void 0 ? _a : [];
    if (!latitude || !longitude) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(MapView_1.default, { latitude: latitude, longitude: longitude });
};
exports.default = Location;
