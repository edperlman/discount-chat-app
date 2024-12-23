"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const UnitsPage_1 = __importDefault(require("./UnitsPage"));
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const NotAuthorizedPage_1 = __importDefault(require("../../views/notAuthorized/NotAuthorizedPage"));
const UnitsRoute = () => {
    const canViewUnits = (0, ui_contexts_1.usePermission)('manage-livechat-units');
    const isEnterprise = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    if (!(isEnterprise && canViewUnits)) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(UnitsPage_1.default, {});
};
exports.default = UnitsRoute;
