"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const overrideLoginMethod_1 = require("../../lib/2fa/overrideLoginMethod");
const loginWithLDAP = (username, ldapPass) => (0, overrideLoginMethod_1.callLoginMethod)({
    methodArguments: [
        {
            ldap: true,
            username,
            ldapPass,
            ldapOptions: {},
        },
    ],
});
const loginWithLDAPAndTOTP = (username, ldapPass, code) => {
    const loginRequest = {
        ldap: true,
        username,
        ldapPass,
        ldapOptions: {},
    };
    return (0, overrideLoginMethod_1.callLoginMethod)({
        methodArguments: [
            {
                totp: {
                    login: loginRequest,
                    code,
                },
            },
        ],
    });
};
meteor_1.Meteor.loginWithLDAP = (0, overrideLoginMethod_1.handleLogin)(loginWithLDAP, loginWithLDAPAndTOTP);
