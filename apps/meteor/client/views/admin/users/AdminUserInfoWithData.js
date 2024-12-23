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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const AdminUserInfoActions_1 = __importDefault(require("./AdminUserInfoActions"));
const getUserEmailAddress_1 = require("../../../../lib/getUserEmailAddress");
const Contextualbar_1 = require("../../../components/Contextualbar");
const Skeleton_1 = require("../../../components/Skeleton");
const UserCard_1 = require("../../../components/UserCard");
const UserInfo_1 = require("../../../components/UserInfo");
const UserStatus_1 = require("../../../components/UserStatus");
const getUserEmailVerified_1 = require("../../../lib/utils/getUserEmailVerified");
const AdminUserInfoWithData = ({ uid, onReload, tab }) => {
    var _a;
    const t = (0, ui_contexts_1.useTranslation)();
    const getRoles = (0, ui_contexts_1.useRolesDescription)();
    const approveManuallyUsers = (0, ui_contexts_1.useSetting)('Accounts_ManuallyApproveNewUsers');
    const getUsersInfo = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.info');
    const query = (0, react_1.useMemo)(() => ({ userId: uid }), [uid]);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { data, isLoading, error, refetch } = (0, react_query_1.useQuery)(['users', query, 'admin'], () => __awaiter(void 0, void 0, void 0, function* () {
        const usersInfo = yield getUsersInfo(query);
        return usersInfo;
    }), {
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const onChange = (0, fuselage_hooks_1.useMutableCallback)(() => {
        onReload();
        refetch();
    });
    const user = (0, react_1.useMemo)(() => {
        if (!(data === null || data === void 0 ? void 0 : data.user)) {
            return;
        }
        const { avatarETag, name, username, phone, createdAt, roles = [], status, statusText, bio, utcOffset, lastLogin, nickname, canViewAllInfo, reason, } = data.user;
        return {
            avatarETag,
            name,
            username,
            lastLogin,
            roles: getRoles(roles).map((role, index) => (0, jsx_runtime_1.jsx)(UserCard_1.UserCardRole, { children: role }, index)),
            bio,
            canViewAllInfo,
            phone,
            utcOffset,
            customFields: Object.assign(Object.assign({}, data.user.customFields), (approveManuallyUsers && !data.user.active && data.user.reason ? { Reason: data.user.reason } : undefined)),
            verified: (0, getUserEmailVerified_1.getUserEmailVerified)(data.user),
            email: (0, getUserEmailAddress_1.getUserEmailAddress)(data.user),
            createdAt,
            status: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { status: status }),
            statusText,
            nickname,
            reason,
        };
    }, [approveManuallyUsers, data, getRoles]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { children: (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {}) }));
    }
    if (error || !user || !(data === null || data === void 0 ? void 0 : data.user)) {
        return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { pb: 16, children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: t('User_not_found') }) }));
    }
    return ((0, jsx_runtime_1.jsx)(UserInfo_1.UserInfo, Object.assign({}, user, { actions: (0, jsx_runtime_1.jsx)(AdminUserInfoActions_1.default, { isActive: data === null || data === void 0 ? void 0 : data.user.active, isAdmin: (_a = data === null || data === void 0 ? void 0 : data.user.roles) === null || _a === void 0 ? void 0 : _a.includes('admin'), userId: data === null || data === void 0 ? void 0 : data.user._id, username: user.username, isFederatedUser: !!data.user.federated, onChange: onChange, onReload: onReload, tab: tab }) })));
};
exports.default = AdminUserInfoWithData;
