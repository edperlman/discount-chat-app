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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CustomUserStatusForm_1 = __importDefault(require("./CustomUserStatusForm"));
const Skeleton_1 = require("../../../components/Skeleton");
const CustomUserStatusFormWithData = ({ _id, onReload, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const query = (0, react_1.useMemo)(() => ({ _id }), [_id]);
    const getCustomUserStatus = (0, ui_contexts_1.useEndpoint)('GET', '/v1/custom-user-status.list');
    const { data, isLoading, error, refetch } = (0, react_query_1.useQuery)(['custom-user-statuses', query], () => __awaiter(void 0, void 0, void 0, function* () {
        const customUserStatus = yield getCustomUserStatus(query);
        return customUserStatus;
    }));
    const handleReload = () => {
        onReload === null || onReload === void 0 ? void 0 : onReload();
        refetch === null || refetch === void 0 ? void 0 : refetch();
    };
    if (!_id) {
        return (0, jsx_runtime_1.jsx)(CustomUserStatusForm_1.default, { onReload: handleReload, onClose: onClose });
    }
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, { pi: 20 });
    }
    if (error || !data || data.count < 1) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { p: 20, children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: t('Custom_User_Status_Error_Invalid_User_Status') }) }));
    }
    return (0, jsx_runtime_1.jsx)(CustomUserStatusForm_1.default, { status: data.statuses[0], onReload: handleReload, onClose: onClose });
};
exports.default = CustomUserStatusFormWithData;
