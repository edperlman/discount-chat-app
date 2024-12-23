"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../app/authorization/client");
const client_2 = require("../../app/models/client");
const client_3 = require("../../app/settings/client");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const i18n_1 = require("../../app/utils/lib/i18n");
const FingerprintChangeModal_1 = __importDefault(require("../components/FingerprintChangeModal"));
const FingerprintChangeModalConfirmation_1 = __importDefault(require("../components/FingerprintChangeModalConfirmation"));
const UrlChangeModal_1 = __importDefault(require("../components/UrlChangeModal"));
const imperativeModal_1 = require("../lib/imperativeModal");
const toast_1 = require("../lib/toast");
const userData_1 = require("../lib/userData");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun((c) => {
        const userId = meteor_1.Meteor.userId();
        if (!userId) {
            return;
        }
        if (!client_2.Roles.ready.get() || !userData_1.isSyncReady.get()) {
            return;
        }
        if ((0, client_1.hasRole)(userId, 'admin') === false) {
            return c.stop();
        }
        const siteUrl = client_3.settings.get('Site_Url');
        if (!siteUrl) {
            return;
        }
        const currentUrl = location.origin + window.__meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
        if (window.__meteor_runtime_config__.ROOT_URL.replace(/\/$/, '') !== currentUrl) {
            const confirm = () => {
                imperativeModal_1.imperativeModal.close();
                void SDKClient_1.sdk.call('saveSetting', 'Site_Url', currentUrl).then(() => {
                    (0, toast_1.dispatchToastMessage)({ type: 'success', message: (0, i18n_1.t)('Saved') });
                });
            };
            imperativeModal_1.imperativeModal.open({
                component: UrlChangeModal_1.default,
                props: {
                    onConfirm: confirm,
                    siteUrl,
                    currentUrl,
                    onClose: imperativeModal_1.imperativeModal.close,
                },
            });
        }
        const documentDomain = client_3.settings.get('Document_Domain');
        if (documentDomain) {
            window.document.domain = documentDomain;
        }
        return c.stop();
    });
});
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun((c) => {
        const userId = meteor_1.Meteor.userId();
        if (!userId) {
            return;
        }
        if (!client_2.Roles.ready.get() || !userData_1.isSyncReady.get()) {
            return;
        }
        if ((0, client_1.hasRole)(userId, 'admin') === false) {
            return c.stop();
        }
        const deploymentFingerPrintVerified = client_3.settings.get('Deployment_FingerPrint_Verified');
        if (deploymentFingerPrintVerified == null || deploymentFingerPrintVerified === true) {
            return;
        }
        const updateWorkspace = () => {
            imperativeModal_1.imperativeModal.close();
            void SDKClient_1.sdk.rest.post('/v1/fingerprint', { setDeploymentAs: 'updated-configuration' }).then(() => {
                (0, toast_1.dispatchToastMessage)({ type: 'success', message: (0, i18n_1.t)('Configuration_update_confirmed') });
            });
        };
        const setNewWorkspace = () => {
            imperativeModal_1.imperativeModal.close();
            void SDKClient_1.sdk.rest.post('/v1/fingerprint', { setDeploymentAs: 'new-workspace' }).then(() => {
                (0, toast_1.dispatchToastMessage)({ type: 'success', message: (0, i18n_1.t)('New_workspace_confirmed') });
            });
        };
        const openModal = () => {
            imperativeModal_1.imperativeModal.open({
                component: FingerprintChangeModal_1.default,
                props: {
                    onConfirm: () => {
                        imperativeModal_1.imperativeModal.open({
                            component: FingerprintChangeModalConfirmation_1.default,
                            props: {
                                onConfirm: setNewWorkspace,
                                onCancel: openModal,
                                newWorkspace: true,
                            },
                        });
                    },
                    onCancel: () => {
                        imperativeModal_1.imperativeModal.open({
                            component: FingerprintChangeModalConfirmation_1.default,
                            props: {
                                onConfirm: updateWorkspace,
                                onCancel: openModal,
                                newWorkspace: false,
                            },
                        });
                    },
                    onClose: imperativeModal_1.imperativeModal.close,
                },
            });
        };
        openModal();
        return c.stop();
    });
});
