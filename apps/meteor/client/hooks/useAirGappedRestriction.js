"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAirGappedRestriction = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useAirGappedRestriction = () => {
    const airGappedRestrictionRemainingDays = (0, ui_contexts_1.useSetting)('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days');
    if (typeof airGappedRestrictionRemainingDays !== 'number') {
        return [false, false, -1];
    }
    // If this value is negative, the user has a license with valid module
    if (airGappedRestrictionRemainingDays < 0) {
        return [false, false, airGappedRestrictionRemainingDays];
    }
    const isRestrictionPhase = airGappedRestrictionRemainingDays === 0;
    const isWarningPhase = !isRestrictionPhase && airGappedRestrictionRemainingDays <= 7;
    return [isRestrictionPhase, isWarningPhase, airGappedRestrictionRemainingDays];
};
exports.useAirGappedRestriction = useAirGappedRestriction;
