"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChatGetURLPreviewProps = exports.isChatPostMessageProps = exports.isChatGetDeletedMessagesProps = exports.isChatGetThreadMessagesProps = exports.isChatSyncThreadMessagesProps = exports.isChatSyncMessagesProps = exports.isChatGetMentionedMessagesProps = exports.isChatGetPinnedMessagesProps = exports.isChatGetStarredMessagesProps = exports.isChatGetMessageReadReceiptsProps = exports.isChatUpdateProps = exports.isChatSearchProps = exports.isChatIgnoreUserProps = exports.isChatReactProps = exports.isChatDeleteProps = exports.isChatSyncThreadsListProps = exports.isChatGetThreadsListProps = exports.isChatReportMessageProps = exports.isChatGetDiscussionsProps = exports.isChatUnpinMessageProps = exports.isChatPinMessageProps = exports.isChatUnstarMessageProps = exports.isChatStarMessageProps = exports.isChatGetMessageProps = exports.isChatUnfollowMessageProps = exports.isChatFollowMessageProps = exports.isChatSendMessageProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const chatSendMessageSchema = {
    type: 'object',
    properties: {
        message: {
            type: 'object',
            properties: {
                _id: {
                    type: 'string',
                    nullable: true,
                },
                rid: {
                    type: 'string',
                },
                tmid: {
                    type: 'string',
                    nullable: true,
                },
                msg: {
                    type: 'string',
                    nullable: true,
                },
                alias: {
                    type: 'string',
                    nullable: true,
                },
                emoji: {
                    type: 'string',
                    nullable: true,
                },
                tshow: {
                    type: 'boolean',
                    nullable: true,
                },
                avatar: {
                    type: 'string',
                    nullable: true,
                },
                attachments: {
                    type: 'array',
                    items: {
                        type: 'object',
                    },
                    nullable: true,
                },
                blocks: {
                    type: 'array',
                    items: {
                        type: 'object',
                    },
                    nullable: true,
                },
                customFields: {
                    type: 'object',
                    nullable: true,
                },
            },
        },
        previewUrls: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
    },
    required: ['message'],
    additionalProperties: false,
};
exports.isChatSendMessageProps = ajv.compile(chatSendMessageSchema);
const chatFollowMessageSchema = {
    type: 'object',
    properties: {
        mid: {
            type: 'string',
        },
    },
    required: ['mid'],
    additionalProperties: false,
};
exports.isChatFollowMessageProps = ajv.compile(chatFollowMessageSchema);
const chatUnfollowMessageSchema = {
    type: 'object',
    properties: {
        mid: {
            type: 'string',
        },
    },
    required: ['mid'],
    additionalProperties: false,
};
exports.isChatUnfollowMessageProps = ajv.compile(chatUnfollowMessageSchema);
const ChatGetMessageSchema = {
    type: 'object',
    properties: {
        msgId: {
            type: 'string',
        },
    },
    required: ['msgId'],
    additionalProperties: false,
};
exports.isChatGetMessageProps = ajv.compile(ChatGetMessageSchema);
const ChatStarMessageSchema = {
    type: 'object',
    properties: {
        messageId: {
            type: 'string',
        },
    },
    required: ['messageId'],
    additionalProperties: false,
};
exports.isChatStarMessageProps = ajv.compile(ChatStarMessageSchema);
const ChatUnstarMessageSchema = {
    type: 'object',
    properties: {
        messageId: {
            type: 'string',
        },
    },
    required: ['messageId'],
    additionalProperties: false,
};
exports.isChatUnstarMessageProps = ajv.compile(ChatUnstarMessageSchema);
const ChatPinMessageSchema = {
    type: 'object',
    properties: {
        messageId: {
            type: 'string',
        },
    },
    required: ['messageId'],
    additionalProperties: false,
};
exports.isChatPinMessageProps = ajv.compile(ChatPinMessageSchema);
const ChatUnpinMessageSchema = {
    type: 'object',
    properties: {
        messageId: {
            type: 'string',
        },
    },
    required: ['messageId'],
    additionalProperties: false,
};
exports.isChatUnpinMessageProps = ajv.compile(ChatUnpinMessageSchema);
const ChatGetDiscussionsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        text: {
            type: 'string',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isChatGetDiscussionsProps = ajv.compile(ChatGetDiscussionsSchema);
const ChatReportMessageSchema = {
    type: 'object',
    properties: {
        messageId: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
    },
    required: ['messageId', 'description'],
    additionalProperties: false,
};
exports.isChatReportMessageProps = ajv.compile(ChatReportMessageSchema);
const ChatGetThreadsListSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        type: {
            type: 'string',
            enum: ['following', 'unread'],
            nullable: true,
        },
        text: {
            type: 'string',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        count: {
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
        fields: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['rid'],
    additionalProperties: false,
};
exports.isChatGetThreadsListProps = ajv.compile(ChatGetThreadsListSchema);
const ChatSyncThreadsListSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        updatedSince: {
            type: 'string',
        },
    },
    required: ['rid', 'updatedSince'],
    additionalProperties: false,
};
exports.isChatSyncThreadsListProps = ajv.compile(ChatSyncThreadsListSchema);
const ChatDeleteSchema = {
    type: 'object',
    properties: {
        msgId: {
            type: 'string',
        },
        roomId: {
            type: 'string',
        },
        asUser: {
            type: 'boolean',
            nullable: true,
        },
    },
    required: ['msgId', 'roomId'],
    additionalProperties: false,
};
exports.isChatDeleteProps = ajv.compile(ChatDeleteSchema);
const ChatReactSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                emoji: {
                    type: 'string',
                },
                messageId: {
                    type: 'string',
                },
                shouldReact: {
                    type: 'boolean',
                    nullable: true,
                },
            },
            required: ['emoji', 'messageId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                reaction: {
                    type: 'string',
                },
                messageId: {
                    type: 'string',
                },
                shouldReact: {
                    type: 'boolean',
                    nullable: true,
                },
            },
            required: ['reaction', 'messageId'],
            additionalProperties: false,
        },
    ],
};
exports.isChatReactProps = ajv.compile(ChatReactSchema);
const ChatIgnoreUserSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        userId: {
            type: 'string',
        },
        ignore: {
            type: 'string',
        },
    },
    required: ['rid', 'userId', 'ignore'],
    additionalProperties: false,
};
exports.isChatIgnoreUserProps = ajv.compile(ChatIgnoreUserSchema);
const ChatSearchSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        searchText: {
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
    },
    required: ['roomId', 'searchText'],
    additionalProperties: false,
};
exports.isChatSearchProps = ajv.compile(ChatSearchSchema);
const ChatUpdateSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        msgId: {
            type: 'string',
        },
        text: {
            type: 'string',
        },
        previewUrls: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
        customFields: {
            type: 'object',
            nullable: true,
        },
    },
    required: ['roomId', 'msgId', 'text'],
    additionalProperties: false,
};
exports.isChatUpdateProps = ajv.compile(ChatUpdateSchema);
const ChatGetMessageReadReceiptsSchema = {
    type: 'object',
    properties: {
        messageId: {
            type: 'string',
        },
    },
    required: ['messageId'],
    additionalProperties: false,
};
exports.isChatGetMessageReadReceiptsProps = ajv.compile(ChatGetMessageReadReceiptsSchema);
const GetStarredMessagesSchema = {
    type: 'object',
    properties: {
        roomId: {
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
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isChatGetStarredMessagesProps = ajv.compile(GetStarredMessagesSchema);
const GetPinnedMessagesSchema = {
    type: 'object',
    properties: {
        roomId: {
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
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isChatGetPinnedMessagesProps = ajv.compile(GetPinnedMessagesSchema);
const GetMentionedMessagesSchema = {
    type: 'object',
    properties: {
        roomId: {
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
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isChatGetMentionedMessagesProps = ajv.compile(GetMentionedMessagesSchema);
const ChatSyncMessagesSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        lastUpdate: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        next: {
            type: 'string',
            nullable: true,
        },
        previous: {
            type: 'string',
            nullable: true,
        },
        type: {
            type: 'string',
            enum: ['UPDATED', 'DELETED'],
            nullable: true,
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isChatSyncMessagesProps = ajv.compile(ChatSyncMessagesSchema);
const ChatSyncThreadMessagesSchema = {
    type: 'object',
    properties: {
        tmid: {
            type: 'string',
        },
        updatedSince: {
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
    },
    required: ['tmid', 'updatedSince'],
    additionalProperties: false,
};
exports.isChatSyncThreadMessagesProps = ajv.compile(ChatSyncThreadMessagesSchema);
const ChatGetThreadMessagesSchema = {
    type: 'object',
    properties: {
        tmid: {
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
    },
    required: ['tmid'],
    additionalProperties: false,
};
exports.isChatGetThreadMessagesProps = ajv.compile(ChatGetThreadMessagesSchema);
const ChatGetDeletedMessagesSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        since: {
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
    },
    required: ['roomId', 'since'],
    additionalProperties: false,
};
exports.isChatGetDeletedMessagesProps = ajv.compile(ChatGetDeletedMessagesSchema);
const ChatPostMessageSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    oneOf: [
                        { type: 'string' },
                        {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                    ],
                },
                text: {
                    type: 'string',
                    nullable: true,
                },
                alias: {
                    type: 'string',
                    nullable: true,
                },
                emoji: {
                    type: 'string',
                    nullable: true,
                },
                avatar: {
                    type: 'string',
                    nullable: true,
                },
                attachments: {
                    type: 'array',
                    items: {
                        type: 'object',
                    },
                    nullable: true,
                },
                customFields: {
                    type: 'object',
                    nullable: true,
                },
            },
            required: ['roomId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                channel: {
                    oneOf: [
                        { type: 'string' },
                        {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                    ],
                },
                text: {
                    type: 'string',
                    nullable: true,
                },
                alias: {
                    type: 'string',
                    nullable: true,
                },
                emoji: {
                    type: 'string',
                    nullable: true,
                },
                avatar: {
                    type: 'string',
                    nullable: true,
                },
                attachments: {
                    type: 'array',
                    items: {
                        type: 'object',
                    },
                    nullable: true,
                },
                customFields: {
                    type: 'object',
                    nullable: true,
                },
            },
            required: ['channel'],
            additionalProperties: false,
        },
    ],
};
exports.isChatPostMessageProps = ajv.compile(ChatPostMessageSchema);
const ChatGetURLPreviewSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        url: {
            type: 'string',
        },
    },
    required: ['roomId', 'url'],
    additionalProperties: false,
};
exports.isChatGetURLPreviewProps = ajv.compile(ChatGetURLPreviewSchema);
