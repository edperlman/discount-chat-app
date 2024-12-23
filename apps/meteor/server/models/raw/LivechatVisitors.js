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
exports.LivechatVisitorsRaw = void 0;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const mongodb_1 = require("mongodb");
const BaseRaw_1 = require("./BaseRaw");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
class LivechatVisitorsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'livechat_visitor', trash);
    }
    modelIndexes() {
        return [
            { key: { token: 1 } },
            { key: { 'phone.phoneNumber': 1 }, sparse: true },
            { key: { 'visitorEmails.address': 1 }, sparse: true },
            { key: { name: 1 }, sparse: true },
            { key: { username: 1 } },
            { key: { 'contactMananger.username': 1 }, sparse: true },
            { key: { 'livechatData.$**': 1 } },
            { key: { activity: 1 }, partialFilterExpression: { activity: { $exists: true } } },
            { key: { disabled: 1 }, partialFilterExpression: { disabled: { $exists: true } } },
        ];
    }
    findOneVisitorByPhone(phone) {
        const query = {
            'phone.phoneNumber': phone,
        };
        return this.findOne(query);
    }
    findOneGuestByEmailAddress(emailAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!emailAddress) {
                return null;
            }
            const query = {
                'visitorEmails.address': String(emailAddress).toLowerCase(),
            };
            return this.findOne(query);
        });
    }
    /**
     * Find visitors by _id
     * @param {string} token - Visitor token
     */
    findById(_id, options) {
        const query = {
            _id,
        };
        return this.find(query, options);
    }
    findEnabled(query, options) {
        return this.find(Object.assign(Object.assign({}, query), { disabled: { $ne: true } }), options);
    }
    findOneEnabledById(_id, options) {
        const query = {
            _id,
            disabled: { $ne: true },
        };
        return this.findOne(query, options);
    }
    findVisitorByToken(token) {
        const query = {
            token,
            disabled: { $ne: true },
        };
        return this.find(query);
    }
    getVisitorByToken(token, options) {
        const query = {
            token,
        };
        return this.findOne(query, options);
    }
    countVisitorsBetweenDate({ start, end, department }) {
        const query = Object.assign({ disabled: { $ne: true }, _updatedAt: {
                $gte: new Date(start),
                $lt: new Date(end),
            } }, (department && department !== 'undefined' && { department }));
        return this.countDocuments(query);
    }
    getNextVisitorUsername() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO remove dependency from another model - this logic should be inside a service/function
            const livechatCount = yield models_1.Settings.incrementValueById('Livechat_guest_count', 1, { returnDocument: 'after' });
            if (!livechatCount.value) {
                throw new Error("Can't find Livechat_guest_count setting");
            }
            void (0, notifyListener_1.notifyOnSettingChanged)(livechatCount.value);
            return `guest-${livechatCount.value.value}`;
        });
    }
    findByNameRegexWithExceptionsAndConditions(searchTerm, exceptions = [], conditions = {}, options = {}) {
        if (!Array.isArray(exceptions)) {
            exceptions = [exceptions];
        }
        const nameRegex = new RegExp(`^${(0, string_helpers_1.escapeRegExp)(searchTerm).trim()}`, 'i');
        const match = {
            $match: Object.assign({ name: nameRegex, _id: {
                    $nin: exceptions,
                } }, conditions),
        };
        const { projection, sort, skip, limit } = options;
        const project = {
            $project: Object.assign({ 
                // TODO: move this logic to client
                custom_name: { $concat: ['$username', ' - ', '$name'] } }, projection),
        };
        const order = { $sort: sort || { name: 1 } };
        const params = [match, order, skip && { $skip: skip }, limit && { $limit: limit }, project].filter(Boolean);
        return this.col.aggregate(params);
    }
    /**
     * Find visitors by their email or phone or username or name
     */
    findPaginatedVisitorsByEmailOrPhoneOrNameOrUsernameOrCustomField(emailOrPhone_1, nameOrUsername_1) {
        return __awaiter(this, arguments, void 0, function* (emailOrPhone, nameOrUsername, allowedCustomFields = [], options) {
            if (!emailOrPhone && !nameOrUsername && allowedCustomFields.length === 0) {
                return this.findPaginated({ disabled: { $ne: true } }, options);
            }
            const query = {
                $or: [
                    ...(emailOrPhone
                        ? [
                            {
                                'visitorEmails.address': emailOrPhone,
                            },
                            {
                                'phone.phoneNumber': emailOrPhone,
                            },
                        ]
                        : []),
                    ...(nameOrUsername
                        ? [
                            {
                                name: nameOrUsername,
                            },
                            {
                                username: nameOrUsername,
                            },
                        ]
                        : []),
                    ...allowedCustomFields.map((c) => ({ [`livechatData.${c}`]: nameOrUsername })),
                ],
                disabled: { $ne: true },
            };
            return this.findPaginated(query, options);
        });
    }
    findOneByEmailAndPhoneAndCustomField(email, phone, customFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = Object.assign({
                disabled: { $ne: true },
            }, Object.assign(Object.assign(Object.assign({}, (email && { visitorEmails: { address: email } })), (phone && { phone: { phoneNumber: phone } })), customFields));
            if (Object.keys(query).length === 1) {
                return null;
            }
            return this.findOne(query);
        });
    }
    updateLivechatDataByToken(token_1, key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (token, key, value, overwrite = true) {
            const query = {
                token,
            };
            if (!overwrite) {
                const user = yield this.getVisitorByToken(token, { projection: { livechatData: 1 } });
                if ((user === null || user === void 0 ? void 0 : user.livechatData) && typeof user.livechatData[key] !== 'undefined') {
                    return true;
                }
            }
            const update = {
                $set: {
                    [`livechatData.${key}`]: value,
                },
            }; // TODO: Remove this cast when TypeScript is updated
            // TypeScript is not smart enough to infer that `messages.${string}` matches keys of `ILivechatVisitor`;
            return this.updateOne(query, update);
        });
    }
    updateLastAgentByToken(token, lastAgent) {
        const query = {
            token,
        };
        const update = {
            $set: {
                lastAgent,
            },
        };
        return this.updateOne(query, update);
    }
    updateById(_id, update) {
        return this.updateOne({ _id }, update);
    }
    updateOneByIdOrToken(update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {};
            if (update._id) {
                query = { _id: update._id };
            }
            else if (update.token) {
                query = { token: update.token };
                update._id = new mongodb_1.ObjectId().toHexString();
            }
            return this.findOneAndUpdate(query, { $set: update }, options);
        });
    }
    saveGuestById(_id, data) {
        var _a, _b, _c;
        const setData = {};
        const unsetData = {};
        if (data.name) {
            if ((_a = data.name) === null || _a === void 0 ? void 0 : _a.trim()) {
                setData.name = data.name.trim();
            }
            else {
                unsetData.name = 1;
            }
        }
        if (data.email) {
            if ((_b = data.email) === null || _b === void 0 ? void 0 : _b.trim()) {
                setData.visitorEmails = [{ address: data.email.trim() }];
            }
            else {
                unsetData.visitorEmails = 1;
            }
        }
        if (data.phone) {
            if ((_c = data.phone) === null || _c === void 0 ? void 0 : _c.trim()) {
                setData.phone = [{ phoneNumber: data.phone.trim() }];
            }
            else {
                unsetData.phone = 1;
            }
        }
        if (data.livechatData) {
            Object.keys(data.livechatData).forEach((key) => {
                var _a;
                const value = (_a = data.livechatData[key]) === null || _a === void 0 ? void 0 : _a.trim();
                if (value) {
                    setData[`livechatData.${key}`] = value;
                }
                else {
                    unsetData[`livechatData.${key}`] = 1;
                }
            });
        }
        const update = Object.assign(Object.assign({}, (Object.keys(setData).length && { $set: setData })), (Object.keys(unsetData).length && { $unset: unsetData }));
        if (!Object.keys(update).length) {
            return Promise.resolve(true);
        }
        return this.updateOne({ _id }, update);
    }
    removeDepartmentById(_id) {
        return this.updateOne({ _id }, { $unset: { department: 1 } });
    }
    removeById(_id) {
        return this.deleteOne({ _id });
    }
    saveGuestEmailPhoneById(_id, emails, phones) {
        const saveEmail = []
            .concat(emails)
            .filter((email) => email === null || email === void 0 ? void 0 : email.trim())
            .map((email) => ({ address: email }));
        const savePhone = []
            .concat(phones)
            .filter((phone) => phone === null || phone === void 0 ? void 0 : phone.trim().replace(/[^\d]/g, ''))
            .map((phone) => ({ phoneNumber: phone }));
        const update = {
            $addToSet: Object.assign(Object.assign({}, (saveEmail.length && { visitorEmails: { $each: saveEmail } })), (savePhone.length && { phone: { $each: savePhone } })),
        };
        if (!Object.keys(update.$addToSet).length) {
            return Promise.resolve();
        }
        return this.updateOne({ _id }, update);
    }
    removeContactManagerByUsername(manager) {
        return this.updateMany({
            contactManager: {
                username: manager,
            },
        }, {
            $unset: {
                contactManager: true,
            },
        });
    }
    isVisitorActiveOnPeriod(visitorId, period) {
        const query = {
            _id: visitorId,
            activity: period,
        };
        return this.findOne(query, { projection: { _id: 1 } }).then(Boolean);
    }
    markVisitorActiveForPeriod(visitorId, period) {
        const query = {
            _id: visitorId,
        };
        const update = {
            $push: {
                activity: {
                    $each: [period],
                    $slice: -12,
                },
            },
        };
        return this.updateOne(query, update);
    }
    disableById(_id) {
        return this.updateOne({ _id }, {
            $set: { disabled: true },
            $unset: {
                department: 1,
                contactManager: 1,
                token: 1,
                visitorEmails: 1,
                phone: 1,
                name: 1,
                livechatData: 1,
                lastChat: 1,
                ip: 1,
                host: 1,
                userAgent: 1,
                username: 1,
                ts: 1,
                status: 1,
            },
        });
    }
    countVisitorsOnPeriod(period) {
        return this.countDocuments({
            activity: period,
        });
    }
    setLastChatById(_id, lastChat) {
        return this.updateOne({ _id }, {
            $set: {
                lastChat,
            },
        });
    }
}
exports.LivechatVisitorsRaw = LivechatVisitorsRaw;
