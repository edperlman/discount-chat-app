"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppsContext = void 0;
const react_1 = require("react");
const asyncState_1 = require("../lib/asyncState");
exports.AppsContext = (0, react_1.createContext)({
    installedApps: {
        phase: asyncState_1.AsyncStatePhase.LOADING,
        value: undefined,
        error: undefined,
    },
    marketplaceApps: {
        phase: asyncState_1.AsyncStatePhase.LOADING,
        value: undefined,
        error: undefined,
    },
    privateApps: {
        phase: asyncState_1.AsyncStatePhase.LOADING,
        value: undefined,
        error: undefined,
    },
    reload: () => Promise.resolve(),
    orchestrator: undefined,
    privateAppsEnabled: false,
});
