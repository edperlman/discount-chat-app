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
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const accounts_base_1 = require("meteor/accounts-base");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const logger_1 = require("./logger");
const push_1 = require("./push");
meteor_1.Meteor.methods({
    'raix:push-update'(options) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug('Got push token from app:', options);
            (0, check_1.check)(options, {
                id: check_1.Match.Optional(String),
                token: push_1._matchToken,
                authToken: String,
                appName: String,
                userId: check_1.Match.OneOf(String, null),
                metadata: check_1.Match.Optional(Object),
            });
            // The if user id is set then user id should match on client and connection
            if (options.userId && options.userId !== this.userId) {
                throw new meteor_1.Meteor.Error(403, 'Forbidden access');
            }
            // we always store the hashed token to protect users
            const hashedToken = accounts_base_1.Accounts._hashLoginToken(options.authToken);
            let doc;
            // lookup app by id if one was included
            if (options.id) {
                doc = yield models_1.AppsTokens.findOne({ _id: options.id });
            }
            else if (options.userId) {
                doc = yield models_1.AppsTokens.findOne({ userId: options.userId });
            }
            // No doc was found - we check the database to see if
            // we can find a match for the app via token and appName
            if (!doc) {
                doc = yield models_1.AppsTokens.findOne({
                    $and: [
                        { token: options.token }, // Match token
                        { appName: options.appName }, // Match appName
                        { token: { $exists: true } }, // Make sure token exists
                    ],
                });
            }
            // if we could not find the id or token then create it
            if (!doc) {
                // Rig default doc
                doc = {
                    token: options.token,
                    authToken: hashedToken,
                    appName: options.appName,
                    userId: options.userId,
                    enabled: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    metadata: options.metadata || {},
                    // XXX: We might want to check the id - Why isnt there a match for id
                    // in the Meteor check... Normal length 17 (could be larger), and
                    // numbers+letters are used in Random.id() with exception of 0 and 1
                    _id: options.id || random_1.Random.id(),
                    // The user wanted us to use a specific id, we didn't find this while
                    // searching. The client could depend on the id eg. as reference so
                    // we respect this and try to create a document with the selected id;
                };
                yield models_1.AppsTokens.insertOne(doc);
            }
            else {
                // We found the app so update the updatedAt and set the token
                yield models_1.AppsTokens.updateOne({ _id: doc._id }, {
                    $set: {
                        updatedAt: new Date(),
                        token: options.token,
                        authToken: hashedToken,
                    },
                });
            }
            if (doc.token) {
                const removed = (yield models_1.AppsTokens.deleteMany({
                    $and: [
                        { _id: { $ne: doc._id } },
                        { token: doc.token }, // Match token
                        { appName: doc.appName }, // Match appName
                        { token: { $exists: true } }, // Make sure token exists
                    ],
                })).deletedCount;
                if (removed) {
                    logger_1.logger.debug(`Removed ${removed} existing app items`);
                }
            }
            logger_1.logger.debug('updated', doc);
            // Return the doc we want to use
            return doc;
        });
    },
    // Deprecated
    'raix:push-setuser'(id) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(id, String);
            if (!this.userId) {
                throw new meteor_1.Meteor.Error(403, 'Forbidden access');
            }
            logger_1.logger.debug(`Settings userId "${this.userId}" for app:`, id);
            const found = yield models_1.AppsTokens.updateOne({ _id: id }, { $set: { userId: this.userId } });
            return !!found;
        });
    },
});
