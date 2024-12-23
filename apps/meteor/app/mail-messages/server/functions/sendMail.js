"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.sendMail = void 0;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ejson_1 = __importDefault(require("ejson"));
const meteor_1 = require("meteor/meteor");
const generatePath_1 = require("../../../../lib/utils/generatePath");
const system_1 = require("../../../../server/lib/logger/system");
const Mailer = __importStar(require("../../../mailer/server/api"));
const placeholders_1 = require("../../../utils/server/placeholders");
const sendMail = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ from, subject, body, dryrun, query, }) {
        var _b, e_1, _c, _d;
        var _e, _f, _g;
        Mailer.checkAddressFormatAndThrow(from, 'Mailer.sendMail');
        if (body.indexOf('[unsubscribe]') === -1) {
            throw new meteor_1.Meteor.Error('error-missing-unsubscribe-link', 'You must provide the [unsubscribe] link.', {
                function: 'Mailer.sendMail',
            });
        }
        let userQuery = { 'mailer.unsubscribed': { $exists: 0 } };
        if (query) {
            userQuery = { $and: [userQuery, ejson_1.default.parse(query)] };
        }
        if (dryrun) {
            const user = yield models_1.Users.findOneByEmailAddress(from);
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    function: 'Mailer.sendMail',
                });
            }
            const email = `${user.name} <${(_e = user.emails) === null || _e === void 0 ? void 0 : _e[0].address}>`;
            const html = placeholders_1.placeholders.replace(body, {
                unsubscribe: meteor_1.Meteor.absoluteUrl((0, generatePath_1.generatePath)('mailer/unsubscribe/:_id/:createdAt', {
                    _id: user._id,
                    createdAt: ((_f = user.createdAt) === null || _f === void 0 ? void 0 : _f.getTime().toString()) || '',
                })),
                name: user.name,
                email,
            });
            system_1.SystemLogger.debug(`Sending email to ${email}`);
            return Mailer.send({
                to: email,
                from,
                subject,
                html,
            });
        }
        const users = yield models_1.Users.find(userQuery).toArray();
        try {
            for (var _h = true, users_1 = __asyncValues(users), users_1_1; users_1_1 = yield users_1.next(), _b = users_1_1.done, !_b; _h = true) {
                _d = users_1_1.value;
                _h = false;
                const u = _d;
                const user = u;
                if ((user === null || user === void 0 ? void 0 : user.emails) && Array.isArray(user.emails) && user.emails.length) {
                    const email = `${user.name} <${user.emails[0].address}>`;
                    const html = placeholders_1.placeholders.replace(body, {
                        unsubscribe: meteor_1.Meteor.absoluteUrl((0, generatePath_1.generatePath)('mailer/unsubscribe/:_id/:createdAt', {
                            _id: user._id,
                            createdAt: ((_g = user.createdAt) === null || _g === void 0 ? void 0 : _g.getTime().toString()) || '',
                        })),
                        name: (0, string_helpers_1.escapeHTML)(user.name || ''),
                        email: (0, string_helpers_1.escapeHTML)(email),
                    });
                    system_1.SystemLogger.debug(`Sending email to ${email}`);
                    yield Mailer.send({
                        to: email,
                        from,
                        subject,
                        html,
                    });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_h && !_b && (_c = users_1.return)) yield _c.call(users_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
};
exports.sendMail = sendMail;
