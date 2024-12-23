"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseMessageTextToAstMarkdown_1 = require("./parseMessageTextToAstMarkdown");
describe('parseMessageTextToAstMarkdown', () => {
    const date = new Date('2021-10-27T00:00:00.000Z');
    const parseOptions = {
        colors: true,
        emoticons: true,
        katex: {
            dollarSyntax: true,
            parenthesisSyntax: true,
        },
    };
    const messageParserTokenMessageWithWrongData = [
        {
            type: 'PARAGRAPH',
            value: [
                {
                    type: 'PLAIN_TEXT',
                    value: 'message',
                },
                {
                    type: 'BOLD',
                    value: [
                        {
                            type: 'PLAIN_TEXT',
                            value: 'bold',
                        },
                    ],
                },
                {
                    type: 'PLAIN_TEXT',
                    value: ' ',
                },
                {
                    type: 'ITALIC',
                    value: [
                        {
                            type: 'PLAIN_TEXT',
                            value: 'italic',
                        },
                    ],
                },
                {
                    type: 'PLAIN_TEXT',
                    value: ' and ',
                },
                {
                    type: 'STRIKE',
                    value: [
                        {
                            type: 'PLAIN_TEXT',
                            value: 'strike',
                        },
                    ],
                },
            ],
        },
    ];
    const messageParserTokenMessage = [
        {
            type: 'PARAGRAPH',
            value: [
                {
                    type: 'PLAIN_TEXT',
                    value: 'message ',
                },
                {
                    type: 'BOLD',
                    value: [
                        {
                            type: 'PLAIN_TEXT',
                            value: 'bold',
                        },
                    ],
                },
                {
                    type: 'PLAIN_TEXT',
                    value: ' ',
                },
                {
                    type: 'ITALIC',
                    value: [
                        {
                            type: 'PLAIN_TEXT',
                            value: 'italic',
                        },
                    ],
                },
                {
                    type: 'PLAIN_TEXT',
                    value: ' and ',
                },
                {
                    type: 'STRIKE',
                    value: [
                        {
                            type: 'PLAIN_TEXT',
                            value: 'strike',
                        },
                    ],
                },
            ],
        },
    ];
    const baseMessage = {
        ts: date,
        u: {
            _id: 'userId',
            name: 'userName',
            username: 'userName',
        },
        msg: 'message **bold** _italic_ and ~strike~',
        rid: 'roomId',
        _id: 'messageId',
        _updatedAt: date,
        urls: [],
    };
    const autoTranslateOptions = {
        autoTranslateEnabled: false,
        showAutoTranslate: () => false,
    };
    const quoteMessage = {
        author_name: 'authorName',
        author_link: 'link',
        author_icon: 'icon',
        md: [],
    };
    it('should return md property populated if the message is parsed', () => {
        expect((0, parseMessageTextToAstMarkdown_1.parseMessageTextToAstMarkdown)(baseMessage, parseOptions, autoTranslateOptions).md).toStrictEqual(messageParserTokenMessage);
    });
    it('should return correct parsed md property populated and fail in comparison with different Root element', () => {
        expect((0, parseMessageTextToAstMarkdown_1.parseMessageTextToAstMarkdown)(baseMessage, parseOptions, autoTranslateOptions).md).not.toStrictEqual(messageParserTokenMessageWithWrongData);
    });
    describe('translated', () => {
        const translatedMessage = Object.assign(Object.assign({}, baseMessage), { msg: 'message not translated', translationProvider: 'provider', translations: {
                en: 'message translated',
            } });
        const translatedMessageParsed = [
            {
                type: 'PARAGRAPH',
                value: [
                    {
                        type: 'PLAIN_TEXT',
                        value: 'message translated',
                    },
                ],
            },
        ];
        const enabledAutoTranslatedOptions = {
            autoTranslateEnabled: true,
            autoTranslateLanguage: 'en',
            showAutoTranslate: () => true,
        };
        it('should return correct translated parsed md when translate is active', () => {
            expect((0, parseMessageTextToAstMarkdown_1.parseMessageTextToAstMarkdown)(translatedMessage, parseOptions, enabledAutoTranslatedOptions).md).toStrictEqual(translatedMessageParsed);
        });
        it('should return correct attachment translated parsed md when translate is active', () => {
            const attachmentTranslatedMessage = Object.assign(Object.assign({}, translatedMessage), { attachments: [
                    {
                        description: 'description',
                        translations: {
                            en: 'description translated',
                        },
                    },
                ] });
            const attachmentTranslatedMessageParsed = Object.assign(Object.assign({}, translatedMessage), { md: translatedMessageParsed, attachments: [
                    {
                        description: 'description',
                        translations: {
                            en: 'description translated',
                        },
                        md: [
                            {
                                type: 'PARAGRAPH',
                                value: [
                                    {
                                        type: 'PLAIN_TEXT',
                                        value: 'description translated',
                                    },
                                ],
                            },
                        ],
                    },
                ] });
            expect((0, parseMessageTextToAstMarkdown_1.parseMessageTextToAstMarkdown)(attachmentTranslatedMessage, parseOptions, enabledAutoTranslatedOptions)).toStrictEqual(attachmentTranslatedMessageParsed);
        });
        it('should return correct attachment quote translated parsed md when translate is active', () => {
            const attachmentTranslatedMessage = Object.assign(Object.assign({}, translatedMessage), { attachments: [
                    {
                        text: 'text',
                        translations: {
                            en: 'text translated',
                        },
                    },
                ] });
            const attachmentTranslatedMessageParsed = Object.assign(Object.assign({}, translatedMessage), { md: translatedMessageParsed, attachments: [
                    {
                        text: 'text',
                        translations: {
                            en: 'text translated',
                        },
                        md: [
                            {
                                type: 'PARAGRAPH',
                                value: [
                                    {
                                        type: 'PLAIN_TEXT',
                                        value: 'text translated',
                                    },
                                ],
                            },
                        ],
                    },
                ] });
            expect((0, parseMessageTextToAstMarkdown_1.parseMessageTextToAstMarkdown)(attachmentTranslatedMessage, parseOptions, enabledAutoTranslatedOptions)).toStrictEqual(attachmentTranslatedMessageParsed);
        });
        it('should return correct multiple attachment quote translated parsed md when translate is active', () => {
            const attachmentTranslatedMessage = Object.assign(Object.assign({}, translatedMessage), { attachments: [
                    {
                        text: 'text',
                        translations: {
                            en: 'text translated',
                        },
                        attachments: [Object.assign(Object.assign({}, quoteMessage), { text: 'text level 2', translations: { en: 'text level 2 translated' } })],
                    },
                ] });
            const attachmentTranslatedMessageParsed = Object.assign(Object.assign({}, translatedMessage), { md: translatedMessageParsed, attachments: [
                    {
                        text: 'text',
                        translations: {
                            en: 'text translated',
                        },
                        md: [
                            {
                                type: 'PARAGRAPH',
                                value: [
                                    {
                                        type: 'PLAIN_TEXT',
                                        value: 'text translated',
                                    },
                                ],
                            },
                        ],
                        attachments: [
                            Object.assign(Object.assign({}, quoteMessage), { text: 'text level 2', translations: {
                                    en: 'text level 2 translated',
                                } }),
                        ],
                    },
                ] });
            expect((0, parseMessageTextToAstMarkdown_1.parseMessageTextToAstMarkdown)(attachmentTranslatedMessage, parseOptions, enabledAutoTranslatedOptions)).toStrictEqual(attachmentTranslatedMessageParsed);
        });
    });
    // TODO: Add more tests for each type of message and for each type of token
});
describe('parseMessageAttachments', () => {
    const parseOptions = {
        colors: true,
        emoticons: true,
        katex: {
            dollarSyntax: true,
            parenthesisSyntax: true,
        },
    };
    const messageParserTokenMessage = [
        {
            type: 'PARAGRAPH',
            value: [
                {
                    type: 'PLAIN_TEXT',
                    value: 'message ',
                },
                {
                    type: 'BOLD',
                    value: [
                        {
                            type: 'PLAIN_TEXT',
                            value: 'bold',
                        },
                    ],
                },
                {
                    type: 'PLAIN_TEXT',
                    value: ' ',
                },
                {
                    type: 'ITALIC',
                    value: [
                        {
                            type: 'PLAIN_TEXT',
                            value: 'italic',
                        },
                    ],
                },
                {
                    type: 'PLAIN_TEXT',
                    value: ' and ',
                },
                {
                    type: 'STRIKE',
                    value: [
                        {
                            type: 'PLAIN_TEXT',
                            value: 'strike',
                        },
                    ],
                },
            ],
        },
    ];
    const autoTranslateOptions = {
        autoTranslateEnabled: false,
        translated: false,
    };
    const attachmentMessage = [
        {
            description: 'message **bold** _italic_ and ~strike~',
            md: messageParserTokenMessage,
        },
    ];
    describe('parseMessageAttachments', () => {
        it('should return md property populated if the message is parsed', () => {
            expect((0, parseMessageTextToAstMarkdown_1.parseMessageAttachments)(attachmentMessage, parseOptions, autoTranslateOptions)[0].md).toStrictEqual(messageParserTokenMessage);
        });
        it('should return md property populated if the attachment is not parsed', () => {
            expect((0, parseMessageTextToAstMarkdown_1.parseMessageAttachments)([Object.assign(Object.assign({}, attachmentMessage[0]), { md: undefined })], parseOptions, autoTranslateOptions)[0].md).toStrictEqual(messageParserTokenMessage);
        });
        describe('translated', () => {
            const enabledAutoTranslatedOptions = {
                translated: true,
                autoTranslateLanguage: 'en',
            };
            it('should return correct attachment description translated parsed md when translate is active', () => {
                const descriptionAttachment = [
                    Object.assign(Object.assign({}, attachmentMessage[0]), { description: 'attachment not translated', translationProvider: 'provider', translations: {
                            en: 'attachment translated',
                        } }),
                ];
                const descriptionAttachmentParsed = [
                    {
                        type: 'PARAGRAPH',
                        value: [
                            {
                                type: 'PLAIN_TEXT',
                                value: 'attachment translated',
                            },
                        ],
                    },
                ];
                expect((0, parseMessageTextToAstMarkdown_1.parseMessageAttachments)(descriptionAttachment, parseOptions, enabledAutoTranslatedOptions)[0].md).toStrictEqual(descriptionAttachmentParsed);
            });
            it('should return correct attachment description parsed md when translate is active and auto translate language is undefined', () => {
                const descriptionAttachment = [
                    Object.assign(Object.assign({}, attachmentMessage[0]), { description: 'attachment not translated', translationProvider: 'provider', translations: {
                            en: 'attachment translated',
                        } }),
                ];
                const descriptionAttachmentParsed = [
                    {
                        type: 'PARAGRAPH',
                        value: [
                            {
                                type: 'PLAIN_TEXT',
                                value: 'attachment not translated',
                            },
                        ],
                    },
                ];
                expect((0, parseMessageTextToAstMarkdown_1.parseMessageAttachments)(descriptionAttachment, parseOptions, Object.assign(Object.assign({}, enabledAutoTranslatedOptions), { autoTranslateLanguage: undefined }))[0].md).toStrictEqual(descriptionAttachmentParsed);
            });
            it('should return correct attachment text translated parsed md when translate is active', () => {
                const textAttachment = [
                    Object.assign(Object.assign({}, attachmentMessage[0]), { text: 'attachment not translated', translationProvider: 'provider', translations: {
                            en: 'attachment translated',
                        } }),
                ];
                const textAttachmentParsed = [
                    {
                        type: 'PARAGRAPH',
                        value: [
                            {
                                type: 'PLAIN_TEXT',
                                value: 'attachment translated',
                            },
                        ],
                    },
                ];
                expect((0, parseMessageTextToAstMarkdown_1.parseMessageAttachments)(textAttachment, parseOptions, enabledAutoTranslatedOptions)[0].md).toStrictEqual(textAttachmentParsed);
            });
            it('should return correct attachment text translated parsed md when translate is active and has multiple texts', () => {
                const quote = {
                    author_name: 'authorName',
                    author_link: 'link',
                    author_icon: 'icon',
                    message_link: 'messageLink',
                    md: [],
                    text: 'text level 2',
                    translations: { en: 'text level 2 translated' },
                };
                const textAttachment = [
                    Object.assign(Object.assign({}, quote), { text: 'attachment not translated', translationProvider: 'provider', translations: {
                            en: 'attachment translated',
                        }, attachments: [quote] }),
                ];
                const textAttachmentParsed = Object.assign(Object.assign({}, textAttachment[0]), { md: [
                        {
                            type: 'PARAGRAPH',
                            value: [
                                {
                                    type: 'PLAIN_TEXT',
                                    value: 'attachment translated',
                                },
                            ],
                        },
                    ], attachments: [
                        Object.assign(Object.assign({}, quote), { text: 'text level 2', translations: {
                                en: 'text level 2 translated',
                            }, md: [
                                {
                                    type: 'PARAGRAPH',
                                    value: [
                                        {
                                            type: 'PLAIN_TEXT',
                                            value: 'text level 2 translated',
                                        },
                                    ],
                                },
                            ] }),
                    ] });
                expect((0, parseMessageTextToAstMarkdown_1.parseMessageAttachments)(textAttachment, parseOptions, enabledAutoTranslatedOptions)[0]).toStrictEqual(textAttachmentParsed);
            });
        });
    });
});
