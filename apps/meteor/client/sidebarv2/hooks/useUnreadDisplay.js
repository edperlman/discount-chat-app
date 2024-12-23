"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUnreadDisplay = void 0;
const react_i18next_1 = require("react-i18next");
const getSubscriptionUnreadData_1 = require("../../../lib/getSubscriptionUnreadData");
const useUnreadDisplay = (unreadData) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, getSubscriptionUnreadData_1.getSubscriptionUnreadData)(unreadData, t);
};
exports.useUnreadDisplay = useUnreadDisplay;
