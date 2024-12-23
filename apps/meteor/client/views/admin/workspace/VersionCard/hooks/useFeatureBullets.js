"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useFeatureBullets = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const featureBullets = (0, react_1.useMemo)(() => [
        {
            key: 1,
            title: t('RegisterWorkspace_Features_MobileNotifications_Title'),
            description: t('RegisterWorkspace_Features_MobileNotifications_Description'),
            disconnect: t('RegisterWorkspace_Features_MobileNotifications_Disconnect'),
        },
        {
            key: 2,
            title: t('RegisterWorkspace_Features_Marketplace_Title'),
            description: t('RegisterWorkspace_Features_Marketplace_Description'),
            disconnect: t('RegisterWorkspace_Features_Marketplace_Disconnect'),
        },
        {
            key: 3,
            title: t('RegisterWorkspace_Features_Omnichannel_Title'),
            description: t('RegisterWorkspace_Features_Omnichannel_Description'),
            disconnect: t('RegisterWorkspace_Features_Omnichannel_Disconnect'),
        },
    ], [t]);
    return featureBullets;
};
exports.default = useFeatureBullets;
