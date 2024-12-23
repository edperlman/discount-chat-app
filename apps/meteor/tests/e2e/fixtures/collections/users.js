"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserFixture = createUserFixture;
const faker_1 = require("@faker-js/faker");
const constants_1 = require("../../config/constants");
function createUserFixture(user) {
    const { username, hashedToken, loginExpire, e2e } = user.data;
    return {
        _id: `${username}`,
        type: 'user',
        active: true,
        emails: [{ address: `${username}@email.com`, verified: false }],
        roles: ['user'],
        name: username,
        lastLogin: new Date(),
        statusConnection: 'offline',
        utcOffset: -3,
        username,
        services: {
            password: { bcrypt: constants_1.DEFAULT_USER_CREDENTIALS.bcrypt },
            email2fa: { enabled: true, changedAt: new Date() },
            email: {
                verificationTokens: [
                    {
                        token: faker_1.faker.string.uuid(),
                        address: `${username}@email.com`,
                        when: new Date(),
                    },
                ],
            },
            resume: {
                loginTokens: [
                    {
                        when: loginExpire,
                        hashedToken,
                    },
                ],
            },
            emailCode: { code: '', attempts: 0, expire: new Date() },
        },
        createdAt: new Date(),
        _updatedAt: new Date(),
        __rooms: ['GENERAL'],
        e2e,
    };
}
