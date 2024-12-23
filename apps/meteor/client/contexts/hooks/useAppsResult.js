"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppsResult = void 0;
const react_1 = require("react");
const AppsContext_1 = require("../AppsContext");
const useAppsResult = () => (0, react_1.useContext)(AppsContext_1.AppsContext);
exports.useAppsResult = useAppsResult;
