"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const MonitorsPage_1 = __importDefault(require("./MonitorsPage"));
const PageSkeleton_1 = __importDefault(require("../../components/PageSkeleton"));
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const NotAuthorizedPage_1 = __importDefault(require("../../views/notAuthorized/NotAuthorizedPage"));
const MonitorsPageContainer = () => {
    const license = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    if (license === 'loading') {
        return (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {});
    }
    if (!license) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(MonitorsPage_1.default, {});
};
exports.default = MonitorsPageContainer;
