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
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const CloudAnnouncementHandler_1 = __importDefault(require("./CloudAnnouncementHandler"));
const CloudAnnouncementsRegion = () => {
    const uid = (0, ui_contexts_1.useUserId)();
    const getAnnouncements = (0, ui_contexts_1.useEndpoint)('GET', '/v1/banners');
    const { isSuccess, data: announcements } = (0, react_query_1.useQuery)({
        queryKey: ['cloud', 'announcements'],
        queryFn: () => getAnnouncements({ platform: core_typings_1.BannerPlatform.Web }),
        select: (data) => data.banners,
        enabled: !!uid,
        staleTime: 0,
        refetchInterval: 1000 * 60 * 60 * 24,
    });
    const subscribeToNotifyLoggedIn = (0, ui_contexts_1.useStream)('notify-logged');
    const subscribeToNotifyUser = (0, ui_contexts_1.useStream)('notify-user');
    const queryClient = (0, react_query_1.useQueryClient)();
    (0, react_1.useEffect)(() => {
        if (!uid) {
            return;
        }
        const unsubscribeFromBannerChanged = subscribeToNotifyLoggedIn('banner-changed', () => __awaiter(void 0, void 0, void 0, function* () {
            queryClient.invalidateQueries(['cloud', 'announcements']);
        }));
        const unsubscribeBanners = subscribeToNotifyUser(`${uid}/banners`, () => __awaiter(void 0, void 0, void 0, function* () {
            queryClient.invalidateQueries(['cloud', 'announcements']);
        }));
        return () => {
            unsubscribeFromBannerChanged();
            unsubscribeBanners();
        };
    }, [subscribeToNotifyLoggedIn, uid, subscribeToNotifyUser, queryClient]);
    if (!isSuccess) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: announcements.map((announcement) => ((0, jsx_runtime_1.jsx)(CloudAnnouncementHandler_1.default, Object.assign({}, announcement), announcement._id))) }));
};
exports.default = CloudAnnouncementsRegion;
