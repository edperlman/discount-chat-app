"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupWizardRoute = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const layout_1 = require("@rocket.chat/layout");
const react_1 = __importDefault(require("react"));
const SetupWizardPage_1 = __importDefault(require("./SetupWizardPage"));
const ModalRegion_1 = __importDefault(require("../modal/ModalRegion"));
const useBodyPosition_1 = require("./hooks/useBodyPosition");
const useRouteLock_1 = require("./hooks/useRouteLock");
const SetupWizardProvider_1 = __importDefault(require("./providers/SetupWizardProvider"));
const SetupWizardRoute = () => {
    const locked = (0, useRouteLock_1.useRouteLock)();
    const breakpoints = (0, fuselage_hooks_1.useBreakpoints)();
    const isMobile = !breakpoints.includes('md');
    (0, useBodyPosition_1.useBodyPosition)('relative', isMobile);
    if (locked) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(SetupWizardProvider_1.default, { children: (0, jsx_runtime_1.jsxs)(layout_1.DarkModeProvider.default, { children: [(0, jsx_runtime_1.jsx)(SetupWizardPage_1.default, {}), (0, jsx_runtime_1.jsx)(ModalRegion_1.default, {})] }) }));
};
exports.SetupWizardRoute = SetupWizardRoute;
exports.default = exports.SetupWizardRoute;
