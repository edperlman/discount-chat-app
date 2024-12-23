"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoomsCleanHistoryProps = exports.isRoomsImagesProps = exports.isRoomsMuteUnmuteUserProps = exports.isRoomsIsMemberProps = exports.isGETRoomsNameExists = exports.isRoomsSaveRoomSettingsProps = exports.isRoomsChangeArchivationStateProps = exports.isRoomsAdminRoomsGetRoomProps = exports.isRoomsAdminRoomsProps = exports.isRoomsExportProps = exports.isRoomsCreateDiscussionProps = exports.isRoomsInfoProps = exports.isRoomsAutocompleteAdminRoomsPayload = exports.isRoomsAutocompleteAvailableForTeamsProps = exports.isRoomsAutocompleteChannelAndPrivateWithPaginationProps = exports.isRoomsAutoCompleteChannelAndPrivateProps = void 0;
const Ajv_1 = require("./Ajv");
const RoomsAutoCompleteChannelAndPrivateSchema = {
    type: 'object',
    properties: {
        selector: {
            type: 'string',
        },
    },
    required: ['selector'],
    additionalProperties: false,
};
exports.isRoomsAutoCompleteChannelAndPrivateProps = Ajv_1.ajv.compile(RoomsAutoCompleteChannelAndPrivateSchema);
const RoomsAutocompleteChannelAndPrivateWithPaginationSchema = {
    type: 'object',
    properties: {
        selector: {
            type: 'string',
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['selector'],
    additionalProperties: false,
};
exports.isRoomsAutocompleteChannelAndPrivateWithPaginationProps = Ajv_1.ajv.compile(RoomsAutocompleteChannelAndPrivateWithPaginationSchema);
const RoomsAutocompleteAvailableForTeamsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
    },
    required: ['name'],
    additionalProperties: false,
};
exports.isRoomsAutocompleteAvailableForTeamsProps = Ajv_1.ajv.compile(RoomsAutocompleteAvailableForTeamsSchema);
const RoomsAutocompleteAdminRoomsPayloadSchema = {
    type: 'object',
    properties: {
        selector: {
            type: 'string',
        },
    },
    required: ['selector'],
    additionalProperties: false,
};
exports.isRoomsAutocompleteAdminRoomsPayload = Ajv_1.ajv.compile(RoomsAutocompleteAdminRoomsPayloadSchema);
const RoomsInfoSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
            },
            required: ['roomId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomName: {
                    type: 'string',
                },
            },
            required: ['roomName'],
            additionalProperties: false,
        },
    ],
};
exports.isRoomsInfoProps = Ajv_1.ajv.compile(RoomsInfoSchema);
const RoomsCreateDiscussionSchema = {
    type: 'object',
    properties: {
        prid: {
            type: 'string',
        },
        pmid: {
            type: 'string',
            nullable: true,
        },
        t_name: {
            type: 'string',
            nullable: true,
        },
        users: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
        encrypted: {
            type: 'boolean',
            nullable: true,
        },
        reply: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['prid', 't_name'],
    additionalProperties: false,
};
exports.isRoomsCreateDiscussionProps = Ajv_1.ajv.compile(RoomsCreateDiscussionSchema);
const RoomsExportSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                rid: {
                    type: 'string',
                },
                type: {
                    type: 'string',
                    enum: ['file'],
                },
                format: {
                    type: 'string',
                    enum: ['html', 'json'],
                },
                dateFrom: {
                    type: 'string',
                    nullable: true,
                    format: 'date',
                },
                dateTo: {
                    type: 'string',
                    nullable: true,
                    format: 'date',
                },
            },
            required: ['rid', 'type', 'format'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                rid: {
                    type: 'string',
                },
                type: {
                    type: 'string',
                    enum: ['email'],
                },
                toUsers: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    nullable: true,
                },
                toEmails: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    nullable: true,
                },
                additionalEmails: {
                    type: 'string',
                    nullable: true,
                },
                subject: {
                    type: 'string',
                    nullable: true,
                },
                messages: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    minItems: 1,
                },
            },
            required: ['rid', 'type', 'messages'],
            additionalProperties: false,
        },
    ],
};
exports.isRoomsExportProps = Ajv_1.ajv.compile(RoomsExportSchema);
const RoomsAdminRoomsSchema = {
    type: 'object',
    properties: {
        filter: {
            type: 'string',
            nullable: true,
        },
        types: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isRoomsAdminRoomsProps = Ajv_1.ajv.compile(RoomsAdminRoomsSchema);
const RoomsAdminRoomsGetRoomSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isRoomsAdminRoomsGetRoomProps = Ajv_1.ajv.compile(RoomsAdminRoomsGetRoomSchema);
const RoomsChangeArchivationStateSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        action: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['rid'],
    additionalProperties: false,
};
exports.isRoomsChangeArchivationStateProps = Ajv_1.ajv.compile(RoomsChangeArchivationStateSchema);
const RoomsSaveRoomSettingsSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        roomAvatar: {
            type: 'string',
            nullable: true,
        },
        featured: {
            type: 'boolean',
            nullable: true,
        },
        roomName: {
            type: 'string',
            nullable: true,
        },
        roomTopic: {
            type: 'string',
            nullable: true,
        },
        roomAnnouncement: {
            type: 'string',
            nullable: true,
        },
        roomDescription: {
            type: 'string',
            nullable: true,
        },
        roomType: {
            type: 'string',
            nullable: true,
        },
        readOnly: {
            type: 'boolean',
            nullable: true,
        },
        reactWhenReadOnly: {
            type: 'boolean',
            nullable: true,
        },
        default: {
            type: 'boolean',
            nullable: true,
        },
        encrypted: {
            type: 'boolean',
            nullable: true,
        },
        favorite: {
            type: 'object',
            properties: {
                defaultValue: {
                    type: 'boolean',
                    nullable: true,
                },
                favorite: {
                    type: 'boolean',
                    nullable: true,
                },
            },
            nullable: true,
        },
    },
    required: ['rid'],
    additionalProperties: false,
};
exports.isRoomsSaveRoomSettingsProps = Ajv_1.ajv.compile(RoomsSaveRoomSettingsSchema);
const GETRoomsNameExistsSchema = {
    type: 'object',
    properties: {
        roomName: {
            type: 'string',
        },
    },
    required: ['roomName'],
    additionalProperties: false,
};
exports.isGETRoomsNameExists = Ajv_1.ajv.compile(GETRoomsNameExistsSchema);
const RoomsIsMemberPropsSchema = {
    type: 'object',
    properties: {
        roomId: { type: 'string', minLength: 1 },
        userId: { type: 'string', minLength: 1 },
        username: { type: 'string', minLength: 1 },
    },
    oneOf: [{ required: ['roomId', 'userId'] }, { required: ['roomId', 'username'] }],
    additionalProperties: false,
};
exports.isRoomsIsMemberProps = Ajv_1.ajv.compile(RoomsIsMemberPropsSchema);
const RoomsMuteUnmuteUserSchema = {
    type: 'object',
    oneOf: [
        {
            properties: {
                userId: {
                    type: 'string',
                    minLength: 1,
                },
                roomId: {
                    type: 'string',
                    minLength: 1,
                },
            },
            required: ['userId', 'roomId'],
            additionalProperties: false,
        },
        {
            properties: {
                username: {
                    type: 'string',
                    minLength: 1,
                },
                roomId: {
                    type: 'string',
                    minLength: 1,
                },
            },
            required: ['username', 'roomId'],
            additionalProperties: false,
        },
    ],
};
exports.isRoomsMuteUnmuteUserProps = Ajv_1.ajv.compile(RoomsMuteUnmuteUserSchema);
const roomsImagesPropsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        startingFromId: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isRoomsImagesProps = Ajv_1.ajv.compile(roomsImagesPropsSchema);
const roomsCleanHistorySchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        latest: {
            type: 'string',
        },
        oldest: {
            type: 'string',
        },
        inclusive: {
            type: 'boolean',
        },
        excludePinned: {
            type: 'boolean',
        },
        filesOnly: {
            type: 'boolean',
        },
        users: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        limit: {
            type: 'number',
        },
        ignoreDiscussion: {
            type: 'boolean',
        },
        ignoreThreads: {
            type: 'boolean',
        },
    },
    required: ['roomId', 'latest', 'oldest'],
    additionalProperties: false,
};
exports.isRoomsCleanHistoryProps = Ajv_1.ajv.compile(roomsCleanHistorySchema);
