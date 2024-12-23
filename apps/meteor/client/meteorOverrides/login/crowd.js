"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const overrideLoginMethod_1 = require("../../lib/2fa/overrideLoginMethod");
const loginWithCrowd = (userDescriptor, password) => {
    const loginRequest = {
        crowd: true,
        username: userDescriptor,
        crowdPassword: password,
    };
    return (0, overrideLoginMethod_1.callLoginMethod)({ methodArguments: [loginRequest] });
};
const loginWithCrowdAndTOTP = (userDescriptor, password, code) => {
    const loginRequest = {
        crowd: true,
        username: userDescriptor,
        crowdPassword: password,
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
meteor_1.Meteor.loginWithCrowd = (0, overrideLoginMethod_1.handleLogin)(loginWithCrowd, loginWithCrowdAndTOTP);
