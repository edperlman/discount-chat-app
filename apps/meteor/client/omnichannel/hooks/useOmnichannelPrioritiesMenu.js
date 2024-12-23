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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOmnichannelPrioritiesMenu = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useOmnichannelPriorities_1 = require("./useOmnichannelPriorities");
const toast_1 = require("../../lib/toast");
const PriorityIcon_1 = require("../priorities/PriorityIcon");
const useOmnichannelPrioritiesMenu = (rid) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const updateRoomPriority = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/room/:rid/priority', { rid });
    const removeRoomPriority = (0, ui_contexts_1.useEndpoint)('DELETE', '/v1/livechat/room/:rid/priority', { rid });
    const { data: priorities } = (0, useOmnichannelPriorities_1.useOmnichannelPriorities)();
    const handlePriorityChange = (0, fuselage_hooks_1.useMutableCallback)((priorityId) => () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            priorityId ? yield updateRoomPriority({ priorityId }) : yield removeRoomPriority();
            queryClient.invalidateQueries(['current-chats']);
            queryClient.invalidateQueries(['/v1/rooms.info', rid]);
        }
        catch (error) {
            (0, toast_1.dispatchToastMessage)({ type: 'error', message: error });
        }
    }));
    const renderOption = (0, react_1.useCallback)((label, weight) => {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(PriorityIcon_1.PriorityIcon, { level: weight || core_typings_1.LivechatPriorityWeight.NOT_SPECIFIED, showUnprioritized: true }), " ", label] }));
    }, []);
    return (0, react_1.useMemo)(() => {
        const menuHeading = {
            type: 'heading',
            label: t('Priorities'),
        };
        const unprioritizedOption = {
            type: 'option',
            action: handlePriorityChange(''),
            label: {
                label: renderOption(t('Unprioritized'), core_typings_1.LivechatPriorityWeight.NOT_SPECIFIED),
            },
        };
        const options = priorities.reduce((items, { _id: priorityId, name, i18n, dirty, sortItem }) => {
            const label = dirty && name ? name : i18n;
            items[label] = {
                action: handlePriorityChange(priorityId),
                label: {
                    label: renderOption(label, sortItem),
                },
            };
            return items;
        }, {});
        return priorities.length ? Object.assign({ menuHeading, Unprioritized: unprioritizedOption }, options) : {};
    }, [t, handlePriorityChange, priorities, renderOption]);
};
exports.useOmnichannelPrioritiesMenu = useOmnichannelPrioritiesMenu;
