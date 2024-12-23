"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePrivateAppsEnabled = void 0;
const react_1 = require("react");
const AppsContext_1 = require("../../../contexts/AppsContext");
const usePrivateAppsEnabled = () => {
    const { privateAppsEnabled } = (0, react_1.useContext)(AppsContext_1.AppsContext);
    return privateAppsEnabled;
};
exports.usePrivateAppsEnabled = usePrivateAppsEnabled;
