"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCronAdvancedTimerFromPrecisionSetting = getCronAdvancedTimerFromPrecisionSetting;
function getCronAdvancedTimerFromPrecisionSetting(precision) {
    switch (precision) {
        case '0':
            return '*/30 * * * *'; // 30 minutes
        case '1':
            return '0 * * * *'; // hour
        case '2':
            return '0 */6 * * *'; // 6 hours
        case '3':
            return '0 0 * * *'; // day
    }
}
