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
const check_1 = require("meteor/check");
const EmailInbox_Outgoing_1 = require("../../../../server/features/EmailInbox/EmailInbox_Outgoing");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
const emailInbox_1 = require("../lib/emailInbox");
api_1.API.v1.addRoute('email-inbox.list', { authRequired: true, permissionsRequired: ['manage-email-inbox'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, query } = yield this.parseJsonQuery();
            const emailInboxes = yield (0, emailInbox_1.findEmailInboxes)({ query, pagination: { offset, count, sort } });
            return api_1.API.v1.success(emailInboxes);
        });
    },
});
api_1.API.v1.addRoute('email-inbox', { authRequired: true, permissionsRequired: ['manage-email-inbox'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                _id: check_1.Match.Maybe(String),
                active: Boolean,
                name: String,
                email: String,
                description: check_1.Match.Maybe(String),
                senderInfo: check_1.Match.Maybe(String),
                department: check_1.Match.Maybe(String),
                smtp: check_1.Match.ObjectIncluding({
                    server: String,
                    port: Number,
                    username: String,
                    password: String,
                    secure: Boolean,
                }),
                imap: check_1.Match.ObjectIncluding({
                    server: String,
                    port: Number,
                    username: String,
                    password: String,
                    secure: Boolean,
                    maxRetries: Number,
                }),
            });
            const emailInboxParams = this.bodyParams;
            let _id;
            if (!(emailInboxParams === null || emailInboxParams === void 0 ? void 0 : emailInboxParams._id)) {
                const { insertedId } = yield (0, emailInbox_1.insertOneEmailInbox)(this.userId, emailInboxParams);
                if (!insertedId) {
                    return api_1.API.v1.failure('Failed to create email inbox');
                }
                _id = insertedId;
            }
            else {
                const emailInbox = yield (0, emailInbox_1.updateEmailInbox)(Object.assign(Object.assign({}, emailInboxParams), { _id: emailInboxParams._id }));
                if (!(emailInbox === null || emailInbox === void 0 ? void 0 : emailInbox._id)) {
                    return api_1.API.v1.failure('Failed to update email inbox');
                }
                _id = emailInbox._id;
            }
            return api_1.API.v1.success({ _id });
        });
    },
});
api_1.API.v1.addRoute('email-inbox/:_id', { authRequired: true, permissionsRequired: ['manage-email-inbox'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.urlParams, {
                _id: String,
            });
            const { _id } = this.urlParams;
            if (!_id) {
                throw new Error('error-invalid-param');
            }
            const emailInbox = yield models_1.EmailInbox.findOneById(_id);
            if (!emailInbox) {
                return api_1.API.v1.notFound();
            }
            return api_1.API.v1.success(emailInbox);
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.urlParams, {
                _id: String,
            });
            const { _id } = this.urlParams;
            if (!_id) {
                throw new Error('error-invalid-param');
            }
            const { deletedCount } = yield (0, emailInbox_1.removeEmailInbox)(_id);
            if (!deletedCount) {
                return api_1.API.v1.notFound();
            }
            return api_1.API.v1.success({ _id });
        });
    },
});
api_1.API.v1.addRoute('email-inbox.search', { authRequired: true, permissionsRequired: ['manage-email-inbox'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, {
                email: String,
            });
            const { email } = this.queryParams;
            // TODO: Chapter day backend - check if user has permission to view this email inbox instead of null values
            // TODO: Chapter day: Remove this endpoint and move search to GET /email-inbox
            const emailInbox = yield models_1.EmailInbox.findByEmail(email);
            return api_1.API.v1.success({ emailInbox });
        });
    },
});
api_1.API.v1.addRoute('email-inbox.send-test/:_id', { authRequired: true, permissionsRequired: ['manage-email-inbox'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.urlParams, {
                _id: String,
            });
            const { _id } = this.urlParams;
            if (!_id) {
                throw new Error('error-invalid-param');
            }
            const emailInbox = yield models_1.EmailInbox.findOneById(_id);
            if (!emailInbox) {
                return api_1.API.v1.notFound();
            }
            const user = yield models_1.Users.findOneById(this.userId);
            if (!user) {
                return api_1.API.v1.notFound();
            }
            yield (0, EmailInbox_Outgoing_1.sendTestEmailToInbox)(emailInbox, user);
            return api_1.API.v1.success({ _id });
        });
    },
});
