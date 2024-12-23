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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../../api/server");
const getPaginationItems_1 = require("../../../../api/server/helpers/getPaginationItems");
const createContact_1 = require("../../lib/contacts/createContact");
const getContactByChannel_1 = require("../../lib/contacts/getContactByChannel");
const getContactChannelsGrouped_1 = require("../../lib/contacts/getContactChannelsGrouped");
const getContactHistory_1 = require("../../lib/contacts/getContactHistory");
const getContacts_1 = require("../../lib/contacts/getContacts");
const registerContact_1 = require("../../lib/contacts/registerContact");
const updateContact_1 = require("../../lib/contacts/updateContact");
server_1.API.v1.addRoute('omnichannel/contact', {
    authRequired: true,
    permissionsRequired: ['view-l-room'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                _id: check_1.Match.Maybe(String),
                token: String,
                name: String,
                email: check_1.Match.Maybe(String),
                phone: check_1.Match.Maybe(String),
                username: check_1.Match.Maybe(String),
                customFields: check_1.Match.Maybe(Object),
                contactManager: check_1.Match.Maybe({
                    username: String,
                }),
            });
            const contact = yield (0, registerContact_1.registerContact)(this.bodyParams);
            return server_1.API.v1.success({ contact });
        });
    },
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, {
                contactId: String,
            });
            const contact = yield models_1.LivechatVisitors.findOneEnabledById(this.queryParams.contactId);
            return server_1.API.v1.success({ contact });
        });
    },
});
server_1.API.v1.addRoute('omnichannel/contact.search', {
    authRequired: true,
    permissionsRequired: ['view-l-room'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, {
                email: check_1.Match.Maybe(String),
                phone: check_1.Match.Maybe(String),
                custom: check_1.Match.Maybe(String),
            });
            const { email, phone, custom } = this.queryParams;
            let customCF = {};
            try {
                customCF = custom && JSON.parse(custom);
            }
            catch (e) {
                throw new meteor_1.Meteor.Error('error-invalid-params-custom');
            }
            if (!email && !phone && !Object.keys(customCF).length) {
                throw new meteor_1.Meteor.Error('error-invalid-params');
            }
            const foundCF = yield (() => __awaiter(this, void 0, void 0, function* () {
                if (!custom) {
                    return {};
                }
                const cfIds = Object.keys(customCF);
                const customFields = yield models_1.LivechatCustomField.findMatchingCustomFieldsByIds(cfIds, 'visitor', true, {
                    projection: { _id: 1 },
                }).toArray();
                return Object.fromEntries(customFields.map(({ _id }) => [`livechatData.${_id}`, new RegExp((0, string_helpers_1.escapeRegExp)(customCF[_id]), 'i')]));
            }))();
            const contact = yield models_1.LivechatVisitors.findOneByEmailAndPhoneAndCustomField(email, phone, foundCF);
            return server_1.API.v1.success({ contact });
        });
    },
});
server_1.API.v1.addRoute('omnichannel/contacts', { authRequired: true, permissionsRequired: ['create-livechat-contact'], validateParams: rest_typings_1.isPOSTOmnichannelContactsProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const contactId = yield (0, createContact_1.createContact)(Object.assign(Object.assign({}, this.bodyParams), { unknown: false }));
            return server_1.API.v1.success({ contactId });
        });
    },
});
server_1.API.v1.addRoute('omnichannel/contacts.update', { authRequired: true, permissionsRequired: ['update-livechat-contact'], validateParams: rest_typings_1.isPOSTUpdateOmnichannelContactsProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield (0, updateContact_1.updateContact)(Object.assign({}, this.bodyParams));
            return server_1.API.v1.success({ contact });
        });
    },
});
server_1.API.v1.addRoute('omnichannel/contacts.get', { authRequired: true, permissionsRequired: ['view-livechat-contact'], validateParams: rest_typings_1.isGETOmnichannelContactsProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { contactId, visitor } = this.queryParams;
            if (!contactId && !visitor) {
                return server_1.API.v1.notFound();
            }
            const contact = yield (contactId ? models_1.LivechatContacts.findOneById(contactId) : (0, getContactByChannel_1.getContactByChannel)(visitor));
            if (!contact) {
                return server_1.API.v1.notFound();
            }
            return server_1.API.v1.success({ contact });
        });
    },
});
server_1.API.v1.addRoute('omnichannel/contacts.search', { authRequired: true, permissionsRequired: ['view-livechat-contact'], validateParams: rest_typings_1.isGETOmnichannelContactsSearchProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const result = yield (0, getContacts_1.getContacts)(Object.assign(Object.assign({}, query), { offset, count, sort }));
            return server_1.API.v1.success(result);
        });
    },
});
server_1.API.v1.addRoute('omnichannel/contacts.history', { authRequired: true, permissionsRequired: ['view-livechat-contact-history'], validateParams: rest_typings_1.isGETOmnichannelContactHistoryProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { contactId, source } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const history = yield (0, getContactHistory_1.getContactHistory)({ contactId, source, count, offset, sort });
            return server_1.API.v1.success(history);
        });
    },
});
server_1.API.v1.addRoute('omnichannel/contacts.channels', { authRequired: true, permissionsRequired: ['view-livechat-contact'], validateParams: rest_typings_1.isGETOmnichannelContactsChannelsProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { contactId } = this.queryParams;
            const channels = yield (0, getContactChannelsGrouped_1.getContactChannelsGrouped)(contactId);
            return server_1.API.v1.success({ channels });
        });
    },
});
