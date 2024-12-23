"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppsReload = void 0;
const react_1 = require("react");
const AppsContext_1 = require("../AppsContext");
const useAppsReload = () => {
    const { reload } = (0, react_1.useContext)(AppsContext_1.AppsContext);
    return reload;
};
exports.useAppsReload = useAppsReload;
