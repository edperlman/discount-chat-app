"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOnHoldChatQuickAction = void 0;
const react_1 = require("react");
const quickActions_1 = require("../../views/room/lib/quickActions");
const useHasLicenseModule_1 = require("../useHasLicenseModule");
const useOnHoldChatQuickAction = () => {
    const licensed = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise') === true;
    return (0, react_1.useMemo)(() => {
        if (!licensed) {
            return undefined;
        }
        return {
            groups: ['live'],
            id: quickActions_1.QuickActionsEnum.OnHoldChat,
            title: 'Omnichannel_onHold_Chat',
            icon: 'pause-unfilled',
            order: 4,
        };
    }, [licensed]);
};
exports.useOnHoldChatQuickAction = useOnHoldChatQuickAction;
