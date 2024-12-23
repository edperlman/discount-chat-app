"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatDuration = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useFormatDuration = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, react_1.useCallback)((duration) => {
        const days = Math.floor(duration / 86400);
        const hours = Math.floor((duration % 86400) / 3600);
        const minutes = Math.floor(((duration % 86400) % 3600) / 60);
        const seconds = Math.floor(((duration % 86400) % 3600) % 60);
        let out = '';
        if (days > 0) {
            out += `${days} ${t('days')}, `;
        }
        if (hours > 0) {
            out += `${hours} ${t('hours')}, `;
        }
        if (minutes > 0) {
            out += `${minutes} ${t('minutes')}, `;
        }
        if (seconds > 0) {
            out += `${seconds} ${t('seconds')}`;
        }
        return out;
    }, [t]);
};
exports.useFormatDuration = useFormatDuration;
