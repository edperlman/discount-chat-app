"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLDAPAndCrowdCollisionWarning = useLDAPAndCrowdCollisionWarning;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const meteor_1 = require("meteor/meteor");
const react_1 = require("react");
function useLDAPAndCrowdCollisionWarning() {
    const isLdapEnabled = (0, ui_contexts_1.useSetting)('LDAP_Enable', false);
    const isCrowdEnabled = (0, ui_contexts_1.useSetting)('CROWD_Enable', false);
    const loginMethod = (isLdapEnabled && 'loginWithLDAP') || (isCrowdEnabled && 'loginWithCrowd') || 'loginWithPassword';
    (0, react_1.useEffect)(() => {
        if (isLdapEnabled && isCrowdEnabled) {
            if (process.env.NODE_ENV === 'development') {
                throw new Error('You can not use both LDAP and Crowd at the same time');
            }
            console.log('Both LDAP and Crowd are enabled. Please disable one of them.');
        }
        if (!meteor_1.Meteor[loginMethod]) {
            if (process.env.NODE_ENV === 'development') {
                throw new Error(`Meteor.${loginMethod} is not defined`);
            }
            console.log(`Meteor.${loginMethod} is not defined`);
        }
    }, [isLdapEnabled, isCrowdEnabled, loginMethod]);
}
