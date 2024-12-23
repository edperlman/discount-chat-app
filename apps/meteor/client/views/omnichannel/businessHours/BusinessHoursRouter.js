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
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const BusinessHoursDisabledPage_1 = __importDefault(require("./BusinessHoursDisabledPage"));
const BusinessHoursMultiplePage_1 = __importDefault(require("./BusinessHoursMultiplePage"));
const EditBusinessHours_1 = __importDefault(require("./EditBusinessHours"));
const EditBusinessHoursWithData_1 = __importDefault(require("./EditBusinessHoursWithData"));
const useIsSingleBusinessHours_1 = require("./useIsSingleBusinessHours");
const BusinessHoursRouter = () => {
    const router = (0, ui_contexts_1.useRouter)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    const type = (0, ui_contexts_1.useRouteParameter)('type');
    const businessHoursEnabled = (0, ui_contexts_1.useSetting)('Livechat_enable_business_hours');
    const isSingleBH = (0, useIsSingleBusinessHours_1.useIsSingleBusinessHours)();
    (0, react_1.useEffect)(() => {
        if (isSingleBH) {
            router.navigate('/omnichannel/businessHours/edit/default');
        }
    }, [isSingleBH, router, context, type]);
    if (!businessHoursEnabled) {
        return (0, jsx_runtime_1.jsx)(BusinessHoursDisabledPage_1.default, {});
    }
    if (context === 'edit' || isSingleBH) {
        return type ? (0, jsx_runtime_1.jsx)(EditBusinessHoursWithData_1.default, { type: type, id: id }) : null;
    }
    if (context === 'new') {
        return (0, jsx_runtime_1.jsx)(EditBusinessHours_1.default, { type: core_typings_1.LivechatBusinessHourTypes.CUSTOM });
    }
    return (0, jsx_runtime_1.jsx)(BusinessHoursMultiplePage_1.default, {});
};
exports.default = BusinessHoursRouter;
