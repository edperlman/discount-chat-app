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
exports.AppContactsConverter = void 0;
const models_1 = require("@rocket.chat/models");
const transformMappedData_1 = require("./transformMappedData");
class AppContactsConverter {
    convertById(contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield models_1.LivechatContacts.findOneById(contactId);
            if (!contact) {
                return;
            }
            return this.convertContact(contact);
        });
    }
    convertContact(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contact) {
                return;
            }
            return structuredClone(contact);
        });
    }
    convertAppContact(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contact) {
                return;
            }
            // Map every attribute individually to ensure there are no extra data coming from the app and leaking into anything else.
            const map = {
                _id: '_id',
                _updatedAt: '_updatedAt',
                name: 'name',
                phones: {
                    from: 'phones',
                    list: true,
                    map: {
                        phoneNumber: 'phoneNumber',
                    },
                },
                emails: {
                    from: 'emails',
                    list: true,
                    map: {
                        address: 'address',
                    },
                },
                contactManager: 'contactManager',
                unknown: 'unknown',
                conflictingFields: {
                    from: 'conflictingFields',
                    list: true,
                    map: {
                        field: 'field',
                        value: 'value',
                    },
                },
                customFields: 'customFields',
                channels: {
                    from: 'channels',
                    list: true,
                    map: {
                        name: 'name',
                        verified: 'verified',
                        visitor: {
                            from: 'visitor',
                            map: {
                                visitorId: 'visitorId',
                                source: {
                                    from: 'source',
                                    map: {
                                        type: 'type',
                                        id: 'id',
                                    },
                                },
                            },
                        },
                        blocked: 'blocked',
                        field: 'field',
                        value: 'value',
                        verifiedAt: 'verifiedAt',
                        details: {
                            from: 'details',
                            map: {
                                type: 'type',
                                id: 'id',
                                alias: 'alias',
                                label: 'label',
                                sidebarIcon: 'sidebarIcon',
                                defaultIcon: 'defaultIcon',
                                destination: 'destination',
                            },
                        },
                        lastChat: {
                            from: 'lastChat',
                            map: {
                                _id: '_id',
                                ts: 'ts',
                            },
                        },
                    },
                },
                createdAt: 'createdAt',
                lastChat: {
                    from: 'lastChat',
                    map: {
                        _id: '_id',
                        ts: 'ts',
                    },
                },
                importIds: 'importIds',
            };
            return (0, transformMappedData_1.transformMappedData)(contact, map);
        });
    }
}
exports.AppContactsConverter = AppContactsConverter;
