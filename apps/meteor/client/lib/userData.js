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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLocalUserData = exports.synchronizeUserData = exports.isSyncReady = void 0;
const reactive_var_1 = require("meteor/reactive-var");
const client_1 = require("../../app/models/client");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
exports.isSyncReady = new reactive_var_1.ReactiveVar(false);
const updateUser = (userData) => {
    const user = client_1.Users.findOne({ _id: userData._id });
    if (!(user === null || user === void 0 ? void 0 : user._updatedAt) || user._updatedAt.getTime() < userData._updatedAt.getTime()) {
        client_1.Users.upsert({ _id: userData._id }, userData);
        return;
    }
    // delete data already on user's collection as those are newer
    Object.keys(user).forEach((key) => {
        delete userData[key];
    });
    client_1.Users.update({ _id: user._id }, { $set: Object.assign({}, userData) });
};
let cancel;
const synchronizeUserData = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    if (!uid) {
        return;
    }
    // Remove data from any other user that we may have retained
    client_1.Users.remove({ _id: { $ne: uid } });
    cancel === null || cancel === void 0 ? void 0 : cancel();
    const result = SDKClient_1.sdk.stream('notify-user', [`${uid}/userData`], (data) => {
        switch (data.type) {
            case 'inserted':
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { type, id } = data, user = __rest(data, ["type", "id"]);
                client_1.Users.insert(user);
                break;
            case 'updated':
                client_1.Users.upsert({ _id: uid }, { $set: data.diff, $unset: data.unset });
                break;
            case 'removed':
                client_1.Users.remove({ _id: uid });
                break;
        }
    });
    cancel = result.stop;
    yield result.ready();
    const _a = yield SDKClient_1.sdk.rest.get('/v1/me'), { ldap, lastLogin, services: rawServices } = _a, userData = __rest(_a, ["ldap", "lastLogin", "services"]);
    // email?: {
    // 	verificationTokens?: IUserEmailVerificationToken[];
    // };
    // export interface IUserEmailVerificationToken {
    // 	token: string;
    // 	address: string;
    // 	when: Date;
    // }
    if (userData) {
        const _b = rawServices || {}, { email, cloud, resume, email2fa, emailCode } = _b, services = __rest(_b, ["email", "cloud", "resume", "email2fa", "emailCode"]);
        updateUser(Object.assign(Object.assign(Object.assign(Object.assign({}, userData), (rawServices && {
            services: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (services ? Object.assign({}, services) : {})), (resume
                ? {
                    resume: Object.assign({}, (resume.loginTokens && {
                        loginTokens: resume.loginTokens.map((token) => (Object.assign(Object.assign({}, token), { when: new Date('when' in token ? token.when : ''), createdAt: ('createdAt' in token ? new Date(token.createdAt) : undefined), twoFactorAuthorizedUntil: token.twoFactorAuthorizedUntil ? new Date(token.twoFactorAuthorizedUntil) : undefined }))),
                    })),
                }
                : {})), (cloud
                ? {
                    cloud: Object.assign(Object.assign({}, cloud), { expiresAt: new Date(cloud.expiresAt) }),
                }
                : {})), (emailCode ? Object.assign(Object.assign({}, emailCode), { expire: new Date(emailCode.expire) }) : {})), (email2fa ? { email2fa: Object.assign(Object.assign({}, email2fa), { changedAt: new Date(email2fa.changedAt) }) } : {})), ((email === null || email === void 0 ? void 0 : email.verificationTokens) && {
                email: {
                    verificationTokens: email.verificationTokens.map((token) => (Object.assign(Object.assign({}, token), { when: new Date(token.when) }))),
                },
            })),
        })), (lastLogin && {
            lastLogin: new Date(lastLogin),
        })), { ldap: Boolean(ldap), createdAt: new Date(userData.createdAt), _updatedAt: new Date(userData._updatedAt) }));
    }
    exports.isSyncReady.set(true);
    return userData;
});
exports.synchronizeUserData = synchronizeUserData;
const removeLocalUserData = () => client_1.Users.remove({});
exports.removeLocalUserData = removeLocalUserData;
