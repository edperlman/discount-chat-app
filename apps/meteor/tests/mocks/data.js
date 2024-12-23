"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeLicenseInfo = exports.createFakeExternalComponentRoomInfo = exports.createFakeExternalComponentUserInfo = exports.createFakeSubscription = exports.createFakeRoom = void 0;
exports.createFakeUser = createFakeUser;
exports.createFakeMessage = createFakeMessage;
exports.createFakeMessageWithMd = createFakeMessageWithMd;
exports.createFakeApp = createFakeApp;
exports.createFakeMessageWithAttachment = createFakeMessageWithAttachment;
exports.createFakeVisitor = createFakeVisitor;
const faker_1 = require("@faker-js/faker");
const core_typings_1 = require("@rocket.chat/core-typings");
const message_parser_1 = require("@rocket.chat/message-parser");
function createFakeUser(overrides) {
    return Object.assign({ _id: faker_1.faker.database.mongodbObjectId(), _updatedAt: faker_1.faker.date.recent(), username: faker_1.faker.internet.userName(), name: faker_1.faker.person.fullName(), createdAt: faker_1.faker.date.recent(), roles: ['user'], active: faker_1.faker.datatype.boolean(), type: 'user' }, overrides);
}
const createFakeRoom = (overrides) => (Object.assign({ _id: faker_1.faker.database.mongodbObjectId(), _updatedAt: faker_1.faker.date.recent(), t: faker_1.faker.helpers.arrayElement(['c', 'p', 'd']), msgs: faker_1.faker.number.int({ min: 0 }), u: Object.assign({ _id: faker_1.faker.database.mongodbObjectId(), username: faker_1.faker.internet.userName(), name: faker_1.faker.person.fullName() }, overrides === null || overrides === void 0 ? void 0 : overrides.u), usersCount: faker_1.faker.number.int({ min: 0 }), autoTranslateLanguage: faker_1.faker.helpers.arrayElement(['en', 'es', 'pt', 'ar', 'it', 'ru', 'fr']) }, overrides));
exports.createFakeRoom = createFakeRoom;
const createFakeSubscription = (overrides) => (Object.assign({ _id: faker_1.faker.database.mongodbObjectId(), _updatedAt: faker_1.faker.date.recent(), u: Object.assign({ _id: faker_1.faker.database.mongodbObjectId(), username: faker_1.faker.internet.userName(), name: faker_1.faker.person.fullName() }, overrides === null || overrides === void 0 ? void 0 : overrides.u), rid: faker_1.faker.database.mongodbObjectId(), open: faker_1.faker.datatype.boolean(), ts: faker_1.faker.date.recent(), name: faker_1.faker.person.fullName(), unread: faker_1.faker.number.int({ min: 0 }), t: faker_1.faker.helpers.arrayElement(['c', 'p', 'd']), ls: faker_1.faker.date.recent(), lr: faker_1.faker.date.recent(), userMentions: faker_1.faker.number.int({ min: 0 }), groupMentions: faker_1.faker.number.int({ min: 0 }), lowerCaseName: faker_1.faker.person.fullName().toLowerCase(), lowerCaseFName: faker_1.faker.person.fullName().toLowerCase() }, overrides));
exports.createFakeSubscription = createFakeSubscription;
function createFakeMessage(overrides) {
    return Object.assign({ _id: faker_1.faker.database.mongodbObjectId(), _updatedAt: faker_1.faker.date.recent(), rid: faker_1.faker.database.mongodbObjectId(), msg: faker_1.faker.lorem.sentence(), ts: faker_1.faker.date.recent(), u: Object.assign({ _id: faker_1.faker.database.mongodbObjectId(), username: faker_1.faker.internet.userName(), name: faker_1.faker.person.fullName() }, overrides === null || overrides === void 0 ? void 0 : overrides.u) }, overrides);
}
function createFakeMessageWithMd(overrides) {
    const fakeMessage = createFakeMessage(overrides);
    return Object.assign(Object.assign(Object.assign({}, fakeMessage), { md: (0, message_parser_1.parse)(fakeMessage.msg) }), overrides);
}
function createFakeApp(partialApp = {}) {
    var _a;
    const appId = faker_1.faker.database.mongodbObjectId();
    const app = Object.assign({ id: appId, iconFileData: faker_1.faker.image.dataUri(), name: faker_1.faker.commerce.productName(), appRequestStats: {
            appId: (_a = partialApp.id) !== null && _a !== void 0 ? _a : appId,
            totalSeen: faker_1.faker.number.int({ min: 0, max: 100 }),
            totalUnseen: faker_1.faker.number.int({ min: 0, max: 100 }),
        }, author: {
            name: faker_1.faker.company.name(),
            homepage: faker_1.faker.internet.url(),
            support: faker_1.faker.internet.email(),
        }, description: faker_1.faker.lorem.paragraph(), shortDescription: faker_1.faker.lorem.sentence(), privacyPolicySummary: faker_1.faker.lorem.sentence(), detailedDescription: {
            raw: faker_1.faker.lorem.paragraph(),
            rendered: faker_1.faker.lorem.paragraph(),
        }, detailedChangelog: {
            raw: faker_1.faker.lorem.paragraph(),
            rendered: faker_1.faker.lorem.paragraph(),
        }, categories: [], version: faker_1.faker.system.semver(), versionIncompatible: faker_1.faker.datatype.boolean(), price: faker_1.faker.number.float({ min: 0, max: 1000 }), purchaseType: faker_1.faker.helpers.arrayElement(['buy', 'subscription']), pricingPlans: [], iconFileContent: faker_1.faker.image.dataUri(), isSubscribed: faker_1.faker.datatype.boolean(), bundledIn: [], marketplaceVersion: faker_1.faker.system.semver(), get latest() {
            return app;
        }, subscriptionInfo: {
            typeOf: faker_1.faker.lorem.word(),
            status: faker_1.faker.helpers.enumValue(core_typings_1.AppSubscriptionStatus),
            statusFromBilling: faker_1.faker.datatype.boolean(),
            isSeatBased: faker_1.faker.datatype.boolean(),
            seats: faker_1.faker.number.int({ min: 0, max: 50 }),
            maxSeats: faker_1.faker.number.int({ min: 50, max: 100 }),
            license: {
                license: faker_1.faker.lorem.word(),
                version: faker_1.faker.number.int({ min: 0, max: 3 }),
                expireDate: faker_1.faker.date.future().toISOString(),
            },
            startDate: faker_1.faker.date.past().toISOString(),
            periodEnd: faker_1.faker.date.future().toISOString(),
            endDate: faker_1.faker.date.future().toISOString(),
            isSubscribedViaBundle: faker_1.faker.datatype.boolean(),
        }, tosLink: faker_1.faker.internet.url(), privacyLink: faker_1.faker.internet.url(), modifiedAt: faker_1.faker.date.recent().toISOString(), permissions: faker_1.faker.helpers.multiple(() => ({
            name: faker_1.faker.hacker.verb(),
            required: faker_1.faker.datatype.boolean(),
        })), languages: faker_1.faker.helpers.multiple(() => faker_1.faker.location.countryCode()), createdDate: faker_1.faker.date.past().toISOString(), private: faker_1.faker.datatype.boolean(), documentationUrl: faker_1.faker.internet.url(), migrated: faker_1.faker.datatype.boolean() }, partialApp);
    return app;
}
const createFakeExternalComponentUserInfo = (partial = {}) => (Object.assign({ id: faker_1.faker.database.mongodbObjectId(), username: faker_1.faker.internet.userName(), avatarUrl: faker_1.faker.image.avatar() }, partial));
exports.createFakeExternalComponentUserInfo = createFakeExternalComponentUserInfo;
const createFakeExternalComponentRoomInfo = (partial = {}) => (Object.assign({ id: faker_1.faker.database.mongodbObjectId(), members: faker_1.faker.helpers.multiple(exports.createFakeExternalComponentUserInfo), slugifiedName: faker_1.faker.lorem.slug() }, partial));
exports.createFakeExternalComponentRoomInfo = createFakeExternalComponentRoomInfo;
const createFakeLicenseInfo = (partial = {}) => (Object.assign({ activeModules: faker_1.faker.helpers.arrayElements([
        'auditing',
        'canned-responses',
        'ldap-enterprise',
        'livechat-enterprise',
        'voip-enterprise',
        'omnichannel-mobile-enterprise',
        'engagement-dashboard',
        'push-privacy',
        'scalability',
        'teams-mention',
        'saml-enterprise',
        'oauth-enterprise',
        'device-management',
        'federation',
        'videoconference-enterprise',
        'message-read-receipt',
        'outlook-calendar',
        'hide-watermark',
        'custom-roles',
        'accessibility-certification',
    ]), externalModules: [], preventedActions: {
        activeUsers: faker_1.faker.datatype.boolean(),
        guestUsers: faker_1.faker.datatype.boolean(),
        roomsPerGuest: faker_1.faker.datatype.boolean(),
        privateApps: faker_1.faker.datatype.boolean(),
        marketplaceApps: faker_1.faker.datatype.boolean(),
        monthlyActiveContacts: faker_1.faker.datatype.boolean(),
    }, limits: {
        activeUsers: { value: faker_1.faker.number.int({ min: 0 }), max: faker_1.faker.number.int({ min: 0 }) },
        guestUsers: { value: faker_1.faker.number.int({ min: 0 }), max: faker_1.faker.number.int({ min: 0 }) },
        roomsPerGuest: { value: faker_1.faker.number.int({ min: 0 }), max: faker_1.faker.number.int({ min: 0 }) },
        privateApps: { value: faker_1.faker.number.int({ min: 0 }), max: faker_1.faker.number.int({ min: 0 }) },
        marketplaceApps: { value: faker_1.faker.number.int({ min: 0 }), max: faker_1.faker.number.int({ min: 0 }) },
        monthlyActiveContacts: { value: faker_1.faker.number.int({ min: 0 }), max: faker_1.faker.number.int({ min: 0 }) },
    }, tags: faker_1.faker.helpers.multiple(() => ({
        name: faker_1.faker.commerce.productAdjective(),
        color: faker_1.faker.internet.color(),
    })), trial: faker_1.faker.datatype.boolean() }, partial));
exports.createFakeLicenseInfo = createFakeLicenseInfo;
function createFakeMessageWithAttachment(overrides) {
    const fakeMessage = createFakeMessage(overrides);
    const fileId = faker_1.faker.database.mongodbObjectId();
    const fileName = faker_1.faker.system.commonFileName('txt');
    return Object.assign(Object.assign(Object.assign({}, fakeMessage), { msg: '', file: {
            _id: fileId,
            name: fileName,
            type: 'text/plain',
            size: faker_1.faker.number.int(),
            format: faker_1.faker.string.alpha(),
        }, attachments: [
            {
                type: 'file',
                title: fileName,
                title_link: `/file-upload/${fileId}/${fileName}`,
            },
        ] }), overrides);
}
const guestNames = faker_1.faker.helpers.uniqueArray(faker_1.faker.person.firstName, 1000);
function pullNextVisitorName() {
    const guestName = guestNames.pop();
    if (!guestName) {
        throw new Error('exhausted guest names');
    }
    return guestName;
}
function createFakeVisitor() {
    return {
        name: pullNextVisitorName(),
        email: faker_1.faker.internet.email(),
    };
}
