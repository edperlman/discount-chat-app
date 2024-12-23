"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../app/authorization/client");
const client_2 = require("../../app/settings/client");
const RouterProvider_1 = require("../providers/RouterProvider");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const userId = meteor_1.Meteor.userId();
        const setupWizardState = client_2.settings.get('Show_Setup_Wizard');
        const isWizardInProgress = userId && (0, client_1.hasRole)(userId, 'admin') && setupWizardState === 'in_progress';
        const mustRedirect = (!userId && setupWizardState === 'pending') || isWizardInProgress;
        if (mustRedirect) {
            RouterProvider_1.router.navigate('/setup-wizard');
        }
    });
});
