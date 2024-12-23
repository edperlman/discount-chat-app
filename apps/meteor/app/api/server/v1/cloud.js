"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const CloudWorkspaceRegistrationError_1 = require("../../../../lib/errors/CloudWorkspaceRegistrationError");
const system_1 = require("../../../../server/lib/logger/system");
const hasRole_1 = require("../../../authorization/server/functions/hasRole");
const getCheckoutUrl_1 = require("../../../cloud/server/functions/getCheckoutUrl");
const getConfirmationPoll_1 = require("../../../cloud/server/functions/getConfirmationPoll");
const getWorkspaceAccessToken_1 = require("../../../cloud/server/functions/getWorkspaceAccessToken");
const registerPreIntentWorkspaceWizard_1 = require("../../../cloud/server/functions/registerPreIntentWorkspaceWizard");
const removeLicense_1 = require("../../../cloud/server/functions/removeLicense");
const retrieveRegistrationStatus_1 = require("../../../cloud/server/functions/retrieveRegistrationStatus");
const saveRegistrationData_1 = require("../../../cloud/server/functions/saveRegistrationData");
const startRegisterWorkspaceSetupWizard_1 = require("../../../cloud/server/functions/startRegisterWorkspaceSetupWizard");
const syncWorkspace_1 = require("../../../cloud/server/functions/syncWorkspace");
const api_1 = require("../api");
api_1.API.v1.addRoute('cloud.manualRegister', { authRequired: true, permissionsRequired: ['register-on-cloud'], validateParams: rest_typings_1.isCloudManualRegisterProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const registrationInfo = yield (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
            if (registrationInfo.workspaceRegistered) {
                return api_1.API.v1.failure('Workspace is already registered');
            }
            const settingsData = JSON.parse(Buffer.from(this.bodyParams.cloudBlob, 'base64').toString());
            yield (0, saveRegistrationData_1.saveRegistrationDataManual)(settingsData);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('cloud.createRegistrationIntent', { authRequired: true, permissionsRequired: ['manage-cloud'], validateParams: rest_typings_1.isCloudCreateRegistrationIntentProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const intentData = yield (0, startRegisterWorkspaceSetupWizard_1.startRegisterWorkspaceSetupWizard)(this.bodyParams.resend, this.bodyParams.email);
            if (intentData) {
                return api_1.API.v1.success({ intentData });
            }
            return api_1.API.v1.failure('Invalid query');
        });
    },
});
api_1.API.v1.addRoute('cloud.registerPreIntent', { authRequired: true, permissionsRequired: ['manage-cloud'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            return api_1.API.v1.success({ offline: !(yield (0, registerPreIntentWorkspaceWizard_1.registerPreIntentWorkspaceWizard)()) });
        });
    },
});
api_1.API.v1.addRoute('cloud.confirmationPoll', { authRequired: true, permissionsRequired: ['manage-cloud'], validateParams: rest_typings_1.isCloudConfirmationPollProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { deviceCode } = this.queryParams;
            const pollData = yield (0, getConfirmationPoll_1.getConfirmationPoll)(deviceCode);
            if (pollData) {
                if ('successful' in pollData && pollData.successful) {
                    yield (0, saveRegistrationData_1.saveRegistrationData)(pollData.payload);
                }
                return api_1.API.v1.success({ pollData });
            }
            return api_1.API.v1.failure('Invalid query');
        });
    },
});
api_1.API.v1.addRoute('cloud.registrationStatus', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield (0, hasRole_1.hasRoleAsync)(this.userId, 'admin'))) {
                return api_1.API.v1.unauthorized();
            }
            const registrationStatus = yield (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
            return api_1.API.v1.success({ registrationStatus });
        });
    },
});
api_1.API.v1.addRoute('cloud.syncWorkspace', {
    authRequired: true,
    permissionsRequired: ['manage-cloud'],
    rateLimiterOptions: { numRequestsAllowed: 2, intervalTimeInMS: 60000 },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, syncWorkspace_1.syncWorkspace)();
                return api_1.API.v1.success({ success: true });
            }
            catch (error) {
                return api_1.API.v1.failure('Error during workspace sync');
            }
        });
    },
});
api_1.API.v1.addRoute('cloud.removeLicense', {
    authRequired: true,
    permissionsRequired: ['manage-cloud'],
    rateLimiterOptions: { numRequestsAllowed: 2, intervalTimeInMS: 60000 },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, removeLicense_1.removeLicense)();
                return api_1.API.v1.success({ success: true });
            }
            catch (error) {
                switch (true) {
                    case error instanceof CloudWorkspaceRegistrationError_1.CloudWorkspaceRegistrationError:
                    case error instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenEmptyError:
                    case error instanceof getWorkspaceAccessToken_1.CloudWorkspaceAccessTokenError: {
                        system_1.SystemLogger.info({
                            msg: 'Manual license removal failed',
                            endpoint: 'cloud.removeLicense',
                            error,
                        });
                        break;
                    }
                    default: {
                        system_1.SystemLogger.error({
                            msg: 'Manual license removal failed',
                            endpoint: 'cloud.removeLicense',
                            error,
                        });
                        break;
                    }
                }
            }
            return api_1.API.v1.failure('License removal failed');
        });
    },
});
api_1.API.v1.addRoute('cloud.checkoutUrl', { authRequired: true, permissionsRequired: ['manage-cloud'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const checkoutUrl = yield (0, getCheckoutUrl_1.getCheckoutUrl)();
            if (!checkoutUrl.url) {
                return api_1.API.v1.failure();
            }
            return api_1.API.v1.success({ url: checkoutUrl.url });
        });
    },
});
