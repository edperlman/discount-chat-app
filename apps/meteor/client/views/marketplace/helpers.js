"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appMultiStatusProps = exports.appStatusSpanProps = exports.appIncompatibleStatusProps = exports.appButtonProps = exports.appEnabledStatuses = void 0;
const AppStatus_1 = require("@rocket.chat/apps-engine/definition/AppStatus");
const semver_1 = __importDefault(require("semver"));
// import { t } from '../../../app/utils/client';
const appErroredStatuses_1 = require("./helpers/appErroredStatuses");
const i18n_1 = require("../../../app/utils/lib/i18n");
exports.appEnabledStatuses = [AppStatus_1.AppStatus.AUTO_ENABLED, AppStatus_1.AppStatus.MANUALLY_ENABLED];
const appButtonProps = ({ installed, version, marketplaceVersion, isPurchased, price, purchaseType, subscriptionInfo, pricingPlans, isEnterpriseOnly, versionIncompatible, isAdminUser, 
// TODO: Unify this two variables
requestedEndUser, endUserRequested, }) => {
    if (!isAdminUser) {
        if (requestedEndUser || endUserRequested) {
            return {
                action: 'request',
                label: 'Requested',
            };
        }
        return {
            action: 'request',
            label: 'Request',
        };
    }
    const canUpdate = installed && version && marketplaceVersion && semver_1.default.lt(version, marketplaceVersion);
    if (canUpdate) {
        if (versionIncompatible) {
            return {
                action: 'update',
                icon: 'warning',
                label: 'Update',
            };
        }
        return {
            action: 'update',
            icon: 'reload',
            label: 'Update',
        };
    }
    if (installed) {
        return;
    }
    const canDownload = isPurchased;
    if (canDownload) {
        if (versionIncompatible) {
            return {
                action: 'install',
                icon: 'warning',
                label: 'Install',
            };
        }
        return {
            action: 'install',
            label: 'Install',
        };
    }
    const canSubscribe = purchaseType === 'subscription' && !subscriptionInfo.status;
    if (canSubscribe) {
        const cannotTry = pricingPlans.every((currentPricingPlan) => currentPricingPlan.trialDays === 0);
        const isTierBased = pricingPlans.every((currentPricingPlan) => currentPricingPlan.tiers && currentPricingPlan.tiers.length > 0);
        if (versionIncompatible) {
            return {
                action: 'purchase',
                label: 'Subscribe',
                icon: 'warning',
            };
        }
        if (cannotTry || isEnterpriseOnly) {
            return {
                action: 'purchase',
                label: 'Subscribe',
            };
        }
        if (isTierBased) {
            return {
                action: 'purchase',
                label: 'See Pricing',
            };
        }
        return {
            action: 'purchase',
            label: 'Try now',
        };
    }
    const canBuy = price > 0;
    if (canBuy) {
        if (versionIncompatible) {
            return {
                action: 'purchase',
                label: 'Buy',
                icon: 'warning',
            };
        }
        return {
            action: 'purchase',
            label: 'Buy',
        };
    }
    if (versionIncompatible) {
        return {
            action: 'purchase',
            label: 'Install',
            icon: 'warning',
        };
    }
    return {
        action: 'purchase',
        label: 'Install',
    };
};
exports.appButtonProps = appButtonProps;
const appIncompatibleStatusProps = () => ({
    icon: 'check',
    label: 'Incompatible',
    tooltipText: (0, i18n_1.t)('App_version_incompatible_tooltip'),
});
exports.appIncompatibleStatusProps = appIncompatibleStatusProps;
const appStatusSpanProps = ({ installed, status, subscriptionInfo, appRequestStats, migrated }, isEnterprise, context, isAppDetailsPage) => {
    const isEnabled = status && exports.appEnabledStatuses.includes(status);
    if (installed) {
        if (isEnabled) {
            return migrated && !isEnterprise
                ? {
                    label: 'Enabled*',
                    tooltipText: (0, i18n_1.t)('Grandfathered_app'),
                }
                : {
                    label: 'Enabled',
                };
        }
        return migrated && !isEnterprise
            ? {
                label: 'Disabled*',
                tooltipText: (0, i18n_1.t)('Grandfathered_app'),
            }
            : {
                type: 'warning',
                label: 'Disabled',
            };
    }
    const isFailed = status && appErroredStatuses_1.appErroredStatuses.includes(status);
    if (isFailed) {
        return {
            type: 'failed',
            icon: 'warning',
            label: status === AppStatus_1.AppStatus.INVALID_SETTINGS_DISABLED ? 'Config Needed' : 'Failed',
        };
    }
    const isOnTrialPeriod = subscriptionInfo && subscriptionInfo.status === 'trialing';
    if (isOnTrialPeriod) {
        return {
            icon: 'checkmark-circled',
            label: 'Trial period',
        };
    }
    if (context === 'requested' && appRequestStats) {
        if (isAppDetailsPage) {
            return {
                label: 'Requested',
            };
        }
        if (appRequestStats.totalUnseen) {
            return {
                label: appRequestStats.totalUnseen > 1 ? 'requests' : 'request',
            };
        }
        return {
            label: appRequestStats.totalSeen > 1 ? 'requests' : 'request',
        };
    }
};
exports.appStatusSpanProps = appStatusSpanProps;
const appMultiStatusProps = (app, isAppDetailsPage, context, isEnterprise) => {
    const status = (0, exports.appStatusSpanProps)(app, isEnterprise, context, isAppDetailsPage);
    const statuses = [];
    if ((app === null || app === void 0 ? void 0 : app.versionIncompatible) !== undefined && !isAppDetailsPage) {
        statuses.push((0, exports.appIncompatibleStatusProps)());
    }
    if (status) {
        statuses.push(status);
    }
    return statuses;
};
exports.appMultiStatusProps = appMultiStatusProps;
