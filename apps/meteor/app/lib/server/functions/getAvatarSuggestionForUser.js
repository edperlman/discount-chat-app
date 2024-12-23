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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatarSuggestionForUser = getAvatarSuggestionForUser;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const gravatar_1 = __importDefault(require("gravatar"));
const check_1 = require("meteor/check");
const service_configuration_1 = require("meteor/service-configuration");
const server_1 = require("../../../settings/server");
const avatarProviders = {
    facebook(user) {
        var _a, _b;
        if (((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.facebook) === null || _b === void 0 ? void 0 : _b.id) && server_1.settings.get('Accounts_OAuth_Facebook')) {
            return {
                service: 'facebook',
                url: `https://graph.facebook.com/${user.services.facebook.id}/picture?type=large`,
            };
        }
    },
    google(user) {
        var _a, _b;
        if (((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.google) === null || _b === void 0 ? void 0 : _b.picture) &&
            user.services.google.picture !== 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg' &&
            server_1.settings.get('Accounts_OAuth_Google')) {
            return {
                service: 'google',
                url: user.services.google.picture,
            };
        }
    },
    github(user) {
        var _a, _b;
        if (((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.github) === null || _b === void 0 ? void 0 : _b.username) && server_1.settings.get('Accounts_OAuth_Github')) {
            return {
                service: 'github',
                url: `https://avatars.githubusercontent.com/${user.services.github.username}?s=200`,
            };
        }
    },
    linkedin(user) {
        var _a, _b, _c;
        if (((_c = (_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.linkedin) === null || _b === void 0 ? void 0 : _b.profilePicture) === null || _c === void 0 ? void 0 : _c.identifiersUrl) &&
            user.services.linkedin.profilePicture.identifiersUrl.length > 0 &&
            server_1.settings.get('Accounts_OAuth_Linkedin')) {
            const total = user.services.linkedin.profilePicture.identifiersUrl.length;
            return {
                service: 'linkedin',
                url: user.services.linkedin.profilePicture.identifiersUrl[total - 1],
            };
        }
    },
    twitter(user) {
        var _a, _b;
        if (((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.twitter) === null || _b === void 0 ? void 0 : _b.profile_image_url_https) && server_1.settings.get('Accounts_OAuth_Twitter')) {
            return {
                service: 'twitter',
                url: user.services.twitter.profile_image_url_https.replace(/_normal|_bigger/, ''),
            };
        }
    },
    gitlab(user) {
        var _a, _b;
        if (((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.gitlab) === null || _b === void 0 ? void 0 : _b.avatar_url) && server_1.settings.get('Accounts_OAuth_Gitlab')) {
            return {
                service: 'gitlab',
                url: user.services.gitlab.avatar_url,
            };
        }
    },
    customOAuth(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatars = [];
            if (!user.services) {
                return avatars;
            }
            yield Promise.all(Object.keys(user.services).map((service) => __awaiter(this, void 0, void 0, function* () {
                if (!user.services) {
                    return;
                }
                if (user.services[service]._OAuthCustom) {
                    const services = yield service_configuration_1.ServiceConfiguration.configurations.find({ service }, { fields: { secret: 0 } }).fetchAsync();
                    if (services.length > 0) {
                        if (user.services[service].avatarUrl) {
                            avatars.push({
                                service,
                                url: user.services[service].avatarUrl,
                            });
                        }
                    }
                }
            })));
            return avatars;
        });
    },
    emails(user) {
        const avatars = [];
        if (user.emails && user.emails.length > 0) {
            for (const email of user.emails) {
                if (email.verified === true) {
                    avatars.push({
                        service: 'gravatar',
                        url: gravatar_1.default.url(email.address, {
                            default: '404',
                            size: '200',
                            protocol: 'https',
                        }),
                    });
                }
                if (email.verified !== true) {
                    avatars.push({
                        service: 'gravatar',
                        url: gravatar_1.default.url(email.address, {
                            default: '404',
                            size: '200',
                            protocol: 'https',
                        }),
                    });
                }
            }
        }
        return avatars;
    },
};
/**
 * @return {Object}
 */
function getAvatarSuggestionForUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        (0, check_1.check)(user, Object);
        const avatars = [];
        try {
            for (var _g = true, _h = __asyncValues(Object.values(avatarProviders)), _j; _j = yield _h.next(), _a = _j.done, !_a; _g = true) {
                _c = _j.value;
                _g = false;
                const avatarProvider = _c;
                const avatar = yield avatarProvider(user);
                if (avatar) {
                    if (Array.isArray(avatar)) {
                        avatars.push(...avatar);
                    }
                    else {
                        avatars.push(avatar);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_g && !_a && (_b = _h.return)) yield _b.call(_h);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const validAvatars = {};
        try {
            for (var _k = true, avatars_1 = __asyncValues(avatars), avatars_1_1; avatars_1_1 = yield avatars_1.next(), _d = avatars_1_1.done, !_d; _k = true) {
                _f = avatars_1_1.value;
                _k = false;
                const avatar = _f;
                try {
                    const response = yield (0, server_fetch_1.serverFetch)(avatar.url);
                    const newAvatar = {
                        service: avatar.service,
                        url: avatar.url,
                        blob: '',
                        contentType: '',
                    };
                    if (response.status === 200) {
                        let blob = `data:${response.headers.get('content-type')};base64,`;
                        blob += Buffer.from(yield response.arrayBuffer()).toString('base64');
                        newAvatar.blob = blob;
                        newAvatar.contentType = response.headers.get('content-type');
                        validAvatars[avatar.service] = newAvatar;
                    }
                }
                catch (error) {
                    // error;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_k && !_d && (_e = avatars_1.return)) yield _e.call(avatars_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return validAvatars;
    });
}
