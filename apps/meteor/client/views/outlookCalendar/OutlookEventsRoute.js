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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const OutlookEventsList_1 = __importDefault(require("./OutlookEventsList"));
const OutlookSettingsList_1 = __importDefault(require("./OutlookSettingsList"));
const RoomToolboxContext_1 = require("../room/contexts/RoomToolboxContext");
const CALENDAR_ROUTES = {
    LIST: 'list',
    SETTINGS: 'settings',
};
const OutlookEventsRoute = () => {
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const [calendarRoute, setCalendarRoute] = (0, react_1.useState)('list');
    if (calendarRoute === CALENDAR_ROUTES.SETTINGS) {
        return (0, jsx_runtime_1.jsx)(OutlookSettingsList_1.default, { onClose: closeTab, changeRoute: () => setCalendarRoute(CALENDAR_ROUTES.LIST) });
    }
    return (0, jsx_runtime_1.jsx)(OutlookEventsList_1.default, { onClose: closeTab, changeRoute: () => setCalendarRoute(CALENDAR_ROUTES.SETTINGS) });
};
exports.default = OutlookEventsRoute;
