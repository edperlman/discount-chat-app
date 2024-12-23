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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_typings_1 = require("@rocket.chat/core-typings");
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const getContactManagerIdByUsername = sinon_1.default.stub();
const getAllowedCustomFields = sinon_1.default.stub();
const { mapVisitorToContact } = proxyquire_1.default.noCallThru().load('./mapVisitorToContact', {
    './getContactManagerIdByUsername': {
        getContactManagerIdByUsername,
    },
    './getAllowedCustomFields': { getAllowedCustomFields },
});
const testDate = new Date();
const dataMap = [
    [
        {
            _id: 'visitor1',
            username: 'Username',
            name: 'Name',
            visitorEmails: [{ address: 'email1@domain.com' }, { address: 'email2@domain.com' }],
            phone: [{ phoneNumber: '10' }, { phoneNumber: '20' }],
            contactManager: {
                username: 'user1',
            },
        },
        {
            type: core_typings_1.OmnichannelSourceType.WIDGET,
        },
        {
            name: 'Name',
            emails: ['email1@domain.com', 'email2@domain.com'],
            phones: ['10', '20'],
            unknown: true,
            channels: [
                {
                    name: 'widget',
                    visitor: {
                        visitorId: 'visitor1',
                        source: {
                            type: core_typings_1.OmnichannelSourceType.WIDGET,
                        },
                    },
                    blocked: false,
                    verified: false,
                    details: {
                        type: core_typings_1.OmnichannelSourceType.WIDGET,
                    },
                },
            ],
            customFields: undefined,
            shouldValidateCustomFields: false,
            contactManager: 'manager1',
        },
    ],
    [
        {
            _id: 'visitor1',
            username: 'Username',
        },
        {
            type: core_typings_1.OmnichannelSourceType.SMS,
        },
        {
            name: 'Username',
            emails: undefined,
            phones: undefined,
            unknown: true,
            channels: [
                {
                    name: 'sms',
                    visitor: {
                        visitorId: 'visitor1',
                        source: {
                            type: core_typings_1.OmnichannelSourceType.SMS,
                        },
                    },
                    blocked: false,
                    verified: false,
                    details: {
                        type: core_typings_1.OmnichannelSourceType.SMS,
                    },
                },
            ],
            customFields: undefined,
            shouldValidateCustomFields: false,
            contactManager: undefined,
        },
    ],
    [
        {
            _id: 'visitor1',
            username: 'Username',
            activity: ['2024-11'],
            lastChat: {
                _id: 'last-chat-id',
                ts: testDate,
            },
        },
        {
            type: core_typings_1.OmnichannelSourceType.WIDGET,
        },
        {
            name: 'Username',
            emails: undefined,
            phones: undefined,
            unknown: false,
            channels: [
                {
                    name: 'sms',
                    visitor: {
                        visitorId: 'visitor1',
                        source: {
                            type: core_typings_1.OmnichannelSourceType.WIDGET,
                        },
                    },
                    blocked: false,
                    verified: false,
                    details: {
                        type: core_typings_1.OmnichannelSourceType.WIDGET,
                    },
                    lastChat: {
                        _id: 'last-chat-id',
                        ts: testDate,
                    },
                },
            ],
            customFields: undefined,
            shouldValidateCustomFields: false,
            lastChat: {
                _id: 'last-chat-id',
                ts: testDate,
            },
            contactManager: undefined,
        },
    ],
    [
        {
            _id: 'visitor1',
            username: 'Username',
            livechatData: {
                customFieldId: 'customFieldValue',
                invalidCustomFieldId: 'invalidCustomFieldValue',
            },
            activity: [],
        },
        {
            type: core_typings_1.OmnichannelSourceType.WIDGET,
        },
        {
            name: 'Username',
            emails: undefined,
            phones: undefined,
            unknown: true,
            channels: [
                {
                    name: 'sms',
                    visitor: {
                        visitorId: 'visitor1',
                        source: {
                            type: core_typings_1.OmnichannelSourceType.WIDGET,
                        },
                    },
                    blocked: false,
                    verified: false,
                    details: {
                        type: core_typings_1.OmnichannelSourceType.WIDGET,
                    },
                },
            ],
            customFields: {
                customFieldId: 'customFieldValue',
            },
            shouldValidateCustomFields: false,
            contactManager: undefined,
        },
    ],
];
describe('mapVisitorToContact', () => {
    beforeEach(() => {
        getContactManagerIdByUsername.reset();
        getContactManagerIdByUsername.callsFake((username) => {
            if (username === 'user1') {
                return 'manager1';
            }
            return undefined;
        });
        getAllowedCustomFields.resolves([{ _id: 'customFieldId', label: 'custom-field-label' }]);
    });
    const index = 0;
    for (const [visitor, source, contact] of dataMap) {
        it(`should map an ILivechatVisitor + IOmnichannelSource to an ILivechatContact [${index}]`, () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield mapVisitorToContact(visitor, source)).to.be.deep.equal(contact);
        }));
    }
});
