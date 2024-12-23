"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDefaultDownload = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const formatAttachmentName_1 = require("../utils/formatAttachmentName");
const formatPeriodRange_1 = require("../utils/formatPeriodRange");
const useDefaultDownload = ({ columnName, title, period, data }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, react_1.useMemo)(() => {
        const { start, end } = (0, formatPeriodRange_1.formatPeriodRange)(period);
        return {
            attachmentName: (0, formatAttachmentName_1.formatAttachmentName)(title, start, end),
            headers: [t('From'), t('To'), columnName, t('Total')],
            dataAvailable: data.length > 0,
            dataExtractor() {
                return data === null || data === void 0 ? void 0 : data.map(({ label, rawLabel, value }) => [start, end, rawLabel || label, value]);
            },
        };
    }, [columnName, data, period, t, title]);
};
exports.useDefaultDownload = useDefaultDownload;
