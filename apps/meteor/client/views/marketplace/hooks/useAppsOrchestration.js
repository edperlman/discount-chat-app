"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppsOrchestration = void 0;
const react_1 = require("react");
const AppsContext_1 = require("../../../contexts/AppsContext");
const useAppsOrchestration = () => {
    const { orchestrator } = (0, react_1.useContext)(AppsContext_1.AppsContext);
    return orchestrator;
};
exports.useAppsOrchestration = useAppsOrchestration;
