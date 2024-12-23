"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShortTimeAgo = exports.useTimeAgo = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const moment_1 = __importDefault(require("moment"));
const react_1 = require("react");
const i18n_1 = require("../../app/utils/lib/i18n");
const dayFormat = ['h:mm A', 'H:mm'];
const useTimeAgo = () => {
    const clockMode = (0, ui_contexts_1.useUserPreference)('clockMode');
    const timeFormat = (0, ui_contexts_1.useSetting)('Message_TimeFormat', 'LT');
    const format = clockMode !== undefined ? dayFormat[clockMode - 1] : timeFormat;
    return (0, react_1.useCallback)((time) => {
        return (0, moment_1.default)(time).calendar(null, {
            sameDay: format,
            lastDay: (0, moment_1.default)(time).calendar('lastDay').replace('LT', format),
            lastWeek: `dddd ${format}`,
            sameElse: 'LL',
        });
    }, [format]);
};
exports.useTimeAgo = useTimeAgo;
const useShortTimeAgo = () => {
    const clockMode = (0, ui_contexts_1.useUserPreference)('clockMode');
    const timeFormat = (0, ui_contexts_1.useSetting)('Message_TimeFormat', 'LT');
    const format = clockMode !== undefined ? dayFormat[clockMode - 1] : timeFormat;
    return (0, react_1.useCallback)((time) => (0, moment_1.default)(time).calendar(null, {
        sameDay: format,
        lastDay: `[${(0, i18n_1.t)('Yesterday')}]`,
        lastWeek: 'dddd',
        sameElse(now) {
            /*
            Using only this.isBefore():

            ERRORS:
                Cannot invoke an object which is possibly 'undefined'.
                This expression is not callable.
                Not all constituents of type 'CalendarSpecVal' are callable.
                Type 'string' has no call signatures.
            */
            if (this.isBefore(now, 'year')) {
                return 'LL';
            }
            return 'MMM Do';
        },
    }), [format]);
};
exports.useShortTimeAgo = useShortTimeAgo;
