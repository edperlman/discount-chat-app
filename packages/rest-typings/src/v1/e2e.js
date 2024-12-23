"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isE2EResetRoomKeyProps = exports.isE2EFetchUsersWaitingForGroupKeyProps = exports.isE2EProvideUsersGroupKeyProps = exports.isE2eSetRoomKeyIdProps = exports.isE2eUpdateGroupKeyProps = exports.isE2eGetUsersOfRoomWithoutKeyProps = exports.isE2eSetUserPublicAndPrivateKeysProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const E2eSetUserPublicAndPrivateKeysSchema = {
    type: 'object',
    properties: {
        public_key: {
            type: 'string',
        },
        private_key: {
            type: 'string',
        },
    },
    required: ['public_key', 'private_key'],
    additionalProperties: false,
};
exports.isE2eSetUserPublicAndPrivateKeysProps = ajv.compile(E2eSetUserPublicAndPrivateKeysSchema);
const E2eGetUsersOfRoomWithoutKeySchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
    },
    required: ['rid'],
    additionalProperties: false,
};
exports.isE2eGetUsersOfRoomWithoutKeyProps = ajv.compile(E2eGetUsersOfRoomWithoutKeySchema);
const E2eUpdateGroupKeySchema = {
    type: 'object',
    properties: {
        uid: {
            type: 'string',
        },
        rid: {
            type: 'string',
        },
        key: {
            type: 'string',
        },
    },
    required: ['uid', 'rid', 'key'],
    additionalProperties: false,
};
exports.isE2eUpdateGroupKeyProps = ajv.compile(E2eUpdateGroupKeySchema);
const E2eSetRoomKeyIdSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        keyID: {
            type: 'string',
        },
    },
    required: ['rid', 'keyID'],
    additionalProperties: false,
};
exports.isE2eSetRoomKeyIdProps = ajv.compile(E2eSetRoomKeyIdSchema);
const E2EProvideUsersGroupKeySchema = {
    type: 'object',
    properties: {
        usersSuggestedGroupKeys: {
            type: 'object',
            additionalProperties: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        key: { type: 'string' },
                        oldKeys: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: { e2eKeyId: { type: 'string' }, ts: { type: 'string' }, E2EKey: { type: 'string' } },
                            },
                        },
                    },
                    required: ['_id', 'key'],
                    additionalProperties: false,
                },
            },
        },
    },
    required: ['usersSuggestedGroupKeys'],
    additionalProperties: false,
};
exports.isE2EProvideUsersGroupKeyProps = ajv.compile(E2EProvideUsersGroupKeySchema);
const E2EFetchUsersWaitingForGroupKeySchema = {
    type: 'object',
    properties: {
        roomIds: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
    required: ['roomIds'],
    additionalProperties: false,
};
exports.isE2EFetchUsersWaitingForGroupKeyProps = ajv.compile(E2EFetchUsersWaitingForGroupKeySchema);
const E2EResetRoomKeySchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        e2eKey: {
            type: 'string',
        },
        e2eKeyId: {
            type: 'string',
        },
    },
    required: ['rid', 'e2eKey', 'e2eKeyId'],
    additionalProperties: false,
};
exports.isE2EResetRoomKeyProps = ajv.compile(E2EResetRoomKeySchema);
