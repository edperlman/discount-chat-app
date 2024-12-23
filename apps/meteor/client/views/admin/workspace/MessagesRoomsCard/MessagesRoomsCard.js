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
const WorkspaceCardSection_1 = __importDefault(require("../components/WorkspaceCardSection"));
const WorkspaceCardTextSeparator_1 = __importDefault(require("../components/WorkspaceCardTextSeparator"));
const MessagesRoomsCard = ({ statistics }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Card, { height: 'full', children: [(0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Total_rooms'), body: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Channels'), icon: 'hash', value: statistics.totalChannels }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Private_Groups'), icon: 'lock', value: statistics.totalPrivateGroups }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Direct_Messages'), icon: 'balloon', value: statistics.totalDirect }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Discussions'), icon: 'discussion', value: statistics.totalDiscussions }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Omnichannel'), icon: 'headset', value: statistics.totalLivechat }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Total'), value: statistics.totalRooms })] }) }), (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Messages'), body: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Stats_Total_Messages_Channel'), icon: 'hash', value: statistics.totalChannelMessages }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Stats_Total_Messages_PrivateGroup'), icon: 'lock', value: statistics.totalPrivateGroupMessages }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Stats_Total_Messages_Direct'), icon: 'balloon', value: statistics.totalDirectMessages }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Stats_Total_Messages_Discussions'), icon: 'discussion', value: statistics.totalDiscussionsMessages }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Stats_Total_Messages_Livechat'), icon: 'headset', value: statistics.totalLivechatMessages }), (0, jsx_runtime_1.jsx)(WorkspaceCardTextSeparator_1.default, { label: t('Total'), value: statistics.totalMessages })] }) })] }));
};
exports.default = (0, react_1.memo)(MessagesRoomsCard);
