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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const CannedResponse_1 = __importDefault(require("./CannedResponse"));
const CreateCannedResponse_1 = __importDefault(require("../../modals/CreateCannedResponse"));
const WrapCannedResponse = ({ allowUse, cannedItem, onClickBack, onClickUse, reload }) => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const onClickEdit = () => {
        setModal((0, jsx_runtime_1.jsx)(CreateCannedResponse_1.default, { cannedResponseData: cannedItem, onClose: () => setModal(null), reloadCannedList: reload }));
    };
    const hasManagerPermission = (0, ui_contexts_1.usePermission)('view-all-canned-responses');
    const hasMonitorPermission = (0, ui_contexts_1.usePermission)('save-department-canned-responses');
    const allowEdit = hasManagerPermission || (hasMonitorPermission && cannedItem.scope !== 'global') || cannedItem.scope === 'user';
    return ((0, jsx_runtime_1.jsx)(CannedResponse_1.default, { allowEdit: allowEdit, allowUse: allowUse, data: cannedItem, onClickBack: onClickBack, onClickEdit: onClickEdit, onClickUse: (e) => {
            onClickUse(e, cannedItem === null || cannedItem === void 0 ? void 0 : cannedItem.text);
        } }));
};
exports.default = (0, react_1.memo)(WrapCannedResponse);
