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
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const meteor_1 = require("meteor/meteor");
meteor_1.Meteor.methods({
    checkFederationConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'checkFederationConfiguration',
                });
            }
            if (!(yield core_services_1.Authorization.hasPermission(uid, 'view-privileged-setting'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Action not allowed', {
                    method: 'checkFederationConfiguration',
                });
            }
            const errors = [];
            const successes = [];
            const service = license_1.License.hasValidLicense() ? core_services_1.FederationEE : core_services_1.Federation;
            const status = yield service.configurationStatus();
            if (status.externalReachability.ok) {
                successes.push('homeserver configuration looks good');
            }
            else {
                let err = 'external reachability could not be verified';
                const { error } = status.externalReachability;
                if (error) {
                    err += `, error: ${error}`;
                }
                errors.push(err);
            }
            const { roundTrip: { durationMs: duration }, } = status.appservice;
            if (status.appservice.ok) {
                successes.push(`appservice configuration looks good, total round trip time to homeserver ${duration}ms`);
            }
            else {
                errors.push(`failed to verify appservice configuration: ${status.appservice.error}`);
            }
            if (errors.length) {
                void service.markConfigurationInvalid();
                if (successes.length) {
                    const message = ['Configuration could only be partially verified'].concat(successes).concat(errors).join(', ');
                    throw new meteor_1.Meteor.Error('error-invalid-configuration', message, { method: 'checkFederationConfiguration' });
                }
                throw new meteor_1.Meteor.Error('error-invalid-configuration', ['Invalid configuration'].concat(errors).join(', '), {
                    method: 'checkFederationConfiguration',
                });
            }
            void service.markConfigurationValid();
            return {
                message: ['All configuration looks good'].concat(successes).join(', '),
            };
        });
    },
});
