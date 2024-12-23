"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOmnichannelSource = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useOmnichannelSource = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getSourceName = (0, react_1.useCallback)((source, allowAlias = true) => {
        const roomSource = source.alias || source.id || source.type;
        const defaultTypesLabels = {
            widget: t('Livechat'),
            email: t('Email'),
            sms: t('SMS'),
            app: (allowAlias && source.alias) || t('Custom_APP'),
            api: (allowAlias && source.alias) || t('Custom_API'),
            other: t('Custom_Integration'),
        };
        return defaultTypesLabels[source.type] || roomSource;
    }, [t]);
    const getSourceLabel = (0, react_1.useCallback)((source) => {
        return (source === null || source === void 0 ? void 0 : source.destination) || (source === null || source === void 0 ? void 0 : source.label) || t('No_app_label_provided');
    }, [t]);
    return { getSourceName, getSourceLabel };
};
exports.useOmnichannelSource = useOmnichannelSource;
