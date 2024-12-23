"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const overrideLoginMethod_1 = require("../../lib/2fa/overrideLoginMethod");
const loginWithPasswordAndTOTP = (userDescriptor, password, code, callback) => {
    if (typeof userDescriptor === 'string') {
        if (userDescriptor.indexOf('@') === -1) {
            userDescriptor = { username: userDescriptor };
        }
        else {
            userDescriptor = { email: userDescriptor };
        }
    }
    accounts_base_1.Accounts.callLoginMethod({
        methodArguments: [
            {
                totp: {
                    login: {
                        user: userDescriptor,
                        password: accounts_base_1.Accounts._hashPassword(password),
                    },
                    code,
                },
            },
        ],
        userCallback(error) {
            if (!error) {
                callback === null || callback === void 0 ? void 0 : callback(undefined);
                return;
            }
            if (callback) {
                callback(error);
                return;
            }
            throw error;
        },
    });
};
const { loginWithPassword } = meteor_1.Meteor;
meteor_1.Meteor.loginWithPassword = (userDescriptor, password, callback) => {
    (0, overrideLoginMethod_1.overrideLoginMethod)(loginWithPassword, [userDescriptor, password], callback, loginWithPasswordAndTOTP);
};
