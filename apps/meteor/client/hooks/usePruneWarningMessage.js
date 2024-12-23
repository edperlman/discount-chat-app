"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePruneWarningMessage = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const cron_1 = require("cron");
const intlFormat_1 = __importDefault(require("date-fns/intlFormat"));
const react_1 = require("react");
const useFormattedRelativeTime_1 = require("./useFormattedRelativeTime");
const getCronAdvancedTimerFromPrecisionSetting_1 = require("../../lib/getCronAdvancedTimerFromPrecisionSetting");
const useRetentionPolicy_1 = require("../views/room/hooks/useRetentionPolicy");
const getMessage = ({ filesOnly, excludePinned }) => {
    if (filesOnly) {
        return excludePinned
            ? 'RetentionPolicy_RoomWarning_UnpinnedFilesOnly_NextRunDate'
            : 'RetentionPolicy_RoomWarning_FilesOnly_NextRunDate';
    }
    return excludePinned ? 'RetentionPolicy_RoomWarning_Unpinned_NextRunDate' : 'RetentionPolicy_RoomWarning_NextRunDate';
};
const getNextRunDate = ({ enableAdvancedCronTimer, cronPrecision, advancedCronTimer, }) => {
    if (enableAdvancedCronTimer) {
        return (0, cron_1.sendAt)(advancedCronTimer);
    }
    return (0, cron_1.sendAt)((0, getCronAdvancedTimerFromPrecisionSetting_1.getCronAdvancedTimerFromPrecisionSetting)(cronPrecision));
};
const useNextRunDate = ({ enableAdvancedCronTimer, advancedCronTimer, cronPrecision, }) => {
    const [nextRunDate, setNextRunDate] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(getNextRunDate({ enableAdvancedCronTimer, advancedCronTimer, cronPrecision })));
    const lang = (0, ui_contexts_1.useLanguage)();
    (0, react_1.useEffect)(() => {
        const timeoutBetweenRunAndNow = nextRunDate.valueOf() - Date.now();
        const timeout = setTimeout(() => setNextRunDate(getNextRunDate({ enableAdvancedCronTimer, advancedCronTimer, cronPrecision })), timeoutBetweenRunAndNow);
        return () => clearTimeout(timeout);
    }, [advancedCronTimer, cronPrecision, enableAdvancedCronTimer, nextRunDate, setNextRunDate]);
    return (0, intlFormat_1.default)(new Date(nextRunDate.valueOf()), {
        localeMatcher: 'best fit',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }, {
        locale: lang,
    });
};
const usePruneWarningMessage = (room) => {
    const retention = (0, useRetentionPolicy_1.useRetentionPolicy)(room);
    if (!retention) {
        throw new Error('usePruneWarningMessage - No room provided');
    }
    const { maxAge, filesOnly, excludePinned } = retention;
    const cronPrecision = (0, ui_contexts_1.useSetting)('RetentionPolicy_Precision', '0');
    const t = (0, ui_contexts_1.useTranslation)();
    const enableAdvancedCronTimer = (0, ui_contexts_1.useSetting)('RetentionPolicy_Advanced_Precision', false);
    const advancedCronTimer = (0, ui_contexts_1.useSetting)('RetentionPolicy_Advanced_Precision_Cron', '*/30 * * * *');
    const message = getMessage({ filesOnly, excludePinned });
    const nextRunDate = useNextRunDate({
        enableAdvancedCronTimer,
        advancedCronTimer,
        cronPrecision,
    });
    const maxAgeFormatted = (0, useFormattedRelativeTime_1.useFormattedRelativeTime)(maxAge);
    return t(message, { maxAge: maxAgeFormatted, nextRunDate });
};
exports.usePruneWarningMessage = usePruneWarningMessage;
