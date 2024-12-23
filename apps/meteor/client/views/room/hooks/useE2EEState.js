"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useE2EEState = void 0;
const shim_1 = require("use-sync-external-store/shim");
const client_1 = require("../../../../app/e2e/client");
const subscribe = (callback) => client_1.e2e.on('E2E_STATE_CHANGED', callback);
const getSnapshot = () => client_1.e2e.getState();
const useE2EEState = () => (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
exports.useE2EEState = useE2EEState;
