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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CannedResponseEdit_1 = __importDefault(require("./CannedResponseEdit"));
const Skeleton_1 = require("../../components/Skeleton");
const useAsyncState_1 = require("../../hooks/useAsyncState");
const useEndpointData_1 = require("../../hooks/useEndpointData");
const CannedResponseEditWithDepartmentData = ({ cannedResponseData }) => {
    const departmentId = (0, react_1.useMemo)(() => cannedResponseData === null || cannedResponseData === void 0 ? void 0 : cannedResponseData.departmentId, [cannedResponseData]);
    const { value: departmentData, phase: state, error } = (0, useEndpointData_1.useEndpointData)('/v1/livechat/department/:_id', { keys: { _id: departmentId } });
    const { t } = (0, react_i18next_1.useTranslation)();
    if (state === useAsyncState_1.AsyncStatePhase.LOADING) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {});
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { m: 16, type: 'danger', children: t('Not_Available') }));
    }
    return (0, jsx_runtime_1.jsx)(CannedResponseEdit_1.default, { cannedResponseData: cannedResponseData, departmentData: departmentData.department });
};
exports.default = CannedResponseEditWithDepartmentData;
