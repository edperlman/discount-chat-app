"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UiKitParserBanner_1 = require("./UiKitParserBanner");
const uiKitBanner_1 = require("./uiKitBanner");
const BlockContext_1 = require("../../rendering/BlockContext");
class TestParser extends UiKitParserBanner_1.UiKitParserBanner {
    constructor() {
        super(...arguments);
        this.plain_text = (element, context, index) => ({
            component: 'text',
            props: {
                key: index,
                children: element.text,
                emoji: element.emoji,
                block: context === BlockContext_1.BlockContext.BLOCK,
            },
        });
        this.mrkdwn = (element, context, index) => ({
            component: 'markdown',
            props: {
                key: index,
                children: element.text,
                verbatim: Boolean(element.verbatim),
                block: context === BlockContext_1.BlockContext.BLOCK,
            },
        });
        this.divider = (_element, context, index) => ({
            component: 'divider',
            props: {
                key: index,
                block: context === BlockContext_1.BlockContext.BLOCK,
            },
        });
        this.section = (element, context, index) => {
            var _a, _b;
            let key = 0;
            return {
                component: 'section',
                props: {
                    key: index,
                    children: [
                        ...(element.text ? [this.text(element.text, BlockContext_1.BlockContext.SECTION, key++)] : []),
                        ...((_b = (_a = element.fields) === null || _a === void 0 ? void 0 : _a.map((field) => this.text(field, BlockContext_1.BlockContext.SECTION, key++))) !== null && _b !== void 0 ? _b : []),
                        ...(element.accessory ? [this.renderAccessories(element.accessory, BlockContext_1.BlockContext.SECTION, undefined, key++)] : []),
                    ],
                    block: context === BlockContext_1.BlockContext.BLOCK,
                },
            };
        };
        this.actions = (element, context, index) => ({
            component: 'actions',
            props: {
                key: index,
                children: element.elements.map((element, key) => this.renderActions(element, BlockContext_1.BlockContext.ACTION, undefined, key)),
                block: context === BlockContext_1.BlockContext.BLOCK,
            },
        });
        this.context = (element, context, index) => ({
            component: 'context',
            props: {
                key: index,
                children: element.elements.map((element, key) => this.renderContext(element, BlockContext_1.BlockContext.CONTEXT, undefined, key)),
                block: context === BlockContext_1.BlockContext.BLOCK,
            },
        });
        this.input = (element, context, index) => ({
            component: 'input-group',
            props: {
                key: index,
                children: [
                    this.plainText(element.label, BlockContext_1.BlockContext.FORM, 0),
                    this.renderInputs(element.element, BlockContext_1.BlockContext.FORM, undefined, 1),
                    ...(element.hint ? [this.plainText(element.hint, BlockContext_1.BlockContext.FORM, 2)] : []),
                ],
                block: context === BlockContext_1.BlockContext.BLOCK,
            },
        });
        this.button = (element, context, index) => {
            var _a;
            return ({
                component: 'button',
                props: Object.assign(Object.assign(Object.assign({ key: index, children: element.text ? [this.text(element.text, BlockContext_1.BlockContext.SECTION, 0)] : [] }, (element.url && { href: element.url })), (element.value && { value: element.value })), { variant: (_a = element.style) !== null && _a !== void 0 ? _a : 'normal', block: context === BlockContext_1.BlockContext.BLOCK }),
            });
        };
        this.image = (element, context, index) => {
            if (context === BlockContext_1.BlockContext.BLOCK) {
                let key = 0;
                return {
                    component: 'image-container',
                    props: {
                        key: index,
                        children: [
                            {
                                component: 'image',
                                props: {
                                    key: key++,
                                    src: element.imageUrl,
                                    alt: element.altText,
                                    block: false,
                                },
                            },
                            ...(element.title ? [this.plainText(element.title, -1, key++)] : []),
                        ],
                        block: true,
                    },
                };
            }
            return {
                component: 'image',
                props: {
                    key: index,
                    src: element.imageUrl,
                    alt: element.altText,
                    block: false,
                },
            };
        };
        this.overflow = (element, _context, index) => ({
            component: 'menu',
            props: {
                key: index,
                children: element.options.map((option, key) => ({
                    component: 'menu-item',
                    props: Object.assign({ key, children: [this.text(option.text, -1, 0), ...(option.description ? [this.plainText(option.description, -1, 1)] : [])], value: option.value }, (option.url && { url: option.url })),
                })),
            },
        });
        this.datePicker = (element, _context, index) => ({
            component: 'input',
            props: Object.assign(Object.assign({ key: index, type: 'date' }, (element.placeholder && {
                placeholder: this.text(element.placeholder, -1, 0),
            })), (element.initialDate && { defaultValue: element.initialDate })),
        });
        this.staticSelect = (element, _context, index) => {
            var _a;
            return ({
                component: 'select',
                props: Object.assign(Object.assign(Object.assign({ key: index }, (element.placeholder && {
                    placeholder: this.text(element.placeholder, -1, 0),
                })), { children: element.options.map((option, key) => ({
                        component: 'option',
                        props: Object.assign({ key, children: this.text(option.text, -1, 0), value: option.value }, (option.description && {
                            description: this.text(option.description, -1, 0),
                        })),
                    })) }), (element.initialOption && {
                    defaultValue: (_a = element.options.find((option) => option.value === element.initialOption.value)) === null || _a === void 0 ? void 0 : _a.value,
                })),
            });
        };
        this.multiStaticSelect = (element, _context, index) => ({
            component: 'select',
            props: Object.assign(Object.assign(Object.assign({ key: index }, (element.placeholder && {
                placeholder: this.text(element.placeholder, -1, 0),
            })), { multiple: true, children: element.options.map((option, key) => ({
                    component: 'option',
                    props: Object.assign({ key, children: this.text(option.text, -1, 0), value: option.value }, (option.description && {
                        description: this.text(option.description, -1, 0),
                    })),
                })) }), (element.initialOptions && {
                defaultValue: element.options
                    .filter((option) => element.initialOptions.some((initialOption) => option.value === initialOption.value))
                    .map((option) => option.value),
            })),
        });
        this.plainInput = (element, _context, index) => {
            var _a;
            return ({
                component: 'input',
                props: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ key: index, type: 'text' }, (element.placeholder && {
                    placeholder: this.plainText(element.placeholder, -1, 0),
                })), (element.initialValue && { defaultValue: element.initialValue })), { multiline: (_a = element.multiline) !== null && _a !== void 0 ? _a : false }), (typeof element.minLength !== 'undefined' && {
                    minLength: element.minLength,
                })), (typeof element.maxLength !== 'undefined' && {
                    maxLength: element.maxLength,
                })),
            });
        };
        this.linearScale = ({ minValue = 0, maxValue = 10 }, _context, index) => ({
            component: 'linear-scale',
            props: {
                key: index,
                children: Array.from({ length: maxValue - minValue + 1 }).map((_, key) => ({
                    component: 'linear-scale-point',
                    props: {
                        key,
                        children: [
                            this.text({
                                type: 'plain_text',
                                text: String(minValue + key),
                                emoji: true,
                            }, -1, 0),
                        ],
                    },
                })),
            },
        });
    }
}
const parser = new TestParser();
const parse = (0, uiKitBanner_1.uiKitBanner)(parser);
const conditionalParse = (0, uiKitBanner_1.uiKitBanner)(parser, {
    engine: 'rocket.chat',
});
describe('divider', () => {
    it('renders', () => {
        const payload = [
            {
                type: 'divider',
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'divider',
                props: {
                    key: 0,
                    block: true,
                },
            },
        ]);
    });
});
describe('section', () => {
    it('renders text as plain_text', () => {
        const payload = [
            {
                type: 'section',
                text: {
                    type: 'plain_text',
                    text: 'This is a plain text section block.',
                    emoji: true,
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'section',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'text',
                            props: {
                                key: 0,
                                children: 'This is a plain text section block.',
                                emoji: true,
                                block: false,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('render text as mrkdwn', () => {
        const payload = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'This is a mrkdwn section block :ghost: *this is bold*, and ~this is crossed out~, and <https://google.com|this is a link>',
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'section',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'markdown',
                            props: {
                                key: 0,
                                children: 'This is a mrkdwn section block :ghost: *this is bold*, and ~this is crossed out~, and <https://google.com|this is a link>',
                                verbatim: false,
                                block: false,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders text fields', () => {
        const payload = [
            {
                type: 'section',
                fields: [
                    {
                        type: 'plain_text',
                        text: '*this is plain_text text*',
                        emoji: true,
                    },
                    {
                        type: 'plain_text',
                        text: '*this is plain_text text*',
                        emoji: true,
                    },
                    {
                        type: 'plain_text',
                        text: '*this is plain_text text*',
                        emoji: true,
                    },
                    {
                        type: 'plain_text',
                        text: '*this is plain_text text*',
                        emoji: true,
                    },
                    {
                        type: 'plain_text',
                        text: '*this is plain_text text*',
                        emoji: true,
                    },
                ],
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'section',
                props: {
                    key: 0,
                    block: true,
                    children: [
                        {
                            component: 'text',
                            props: {
                                key: 0,
                                children: '*this is plain_text text*',
                                emoji: true,
                                block: false,
                            },
                        },
                        {
                            component: 'text',
                            props: {
                                key: 1,
                                children: '*this is plain_text text*',
                                emoji: true,
                                block: false,
                            },
                        },
                        {
                            component: 'text',
                            props: {
                                key: 2,
                                children: '*this is plain_text text*',
                                emoji: true,
                                block: false,
                            },
                        },
                        {
                            component: 'text',
                            props: {
                                key: 3,
                                children: '*this is plain_text text*',
                                emoji: true,
                                block: false,
                            },
                        },
                        {
                            component: 'text',
                            props: {
                                key: 4,
                                children: '*this is plain_text text*',
                                emoji: true,
                                block: false,
                            },
                        },
                    ],
                },
            },
        ]);
    });
    it('renders accessory as button', () => {
        const payload = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'This is a section block with a button.',
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Click Me',
                        emoji: true,
                    },
                    value: 'click_me_123',
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'section',
                props: {
                    key: 0,
                    block: true,
                    children: [
                        {
                            component: 'markdown',
                            props: {
                                key: 0,
                                children: 'This is a section block with a button.',
                                verbatim: false,
                                block: false,
                            },
                        },
                        {
                            component: 'button',
                            props: {
                                key: 1,
                                children: [
                                    {
                                        component: 'text',
                                        props: {
                                            key: 0,
                                            children: 'Click Me',
                                            emoji: true,
                                            block: false,
                                        },
                                    },
                                ],
                                value: 'click_me_123',
                                variant: 'normal',
                                block: false,
                            },
                        },
                    ],
                },
            },
        ]);
    });
    it('renders accessory as image', () => {
        const payload = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'This is a section block with an accessory image.',
                },
                accessory: {
                    type: 'image',
                    imageUrl: 'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
                    altText: 'cute cat',
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'section',
                props: {
                    key: 0,
                    block: true,
                    children: [
                        {
                            component: 'markdown',
                            props: {
                                key: 0,
                                children: 'This is a section block with an accessory image.',
                                verbatim: false,
                                block: false,
                            },
                        },
                        {
                            component: 'image',
                            props: {
                                key: 1,
                                src: 'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
                                alt: 'cute cat',
                                block: false,
                            },
                        },
                    ],
                },
            },
        ]);
    });
    it('renders accessory as overflow menu', () => {
        const payload = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'This is a section block with an overflow menu.',
                },
                accessory: {
                    type: 'overflow',
                    options: [
                        {
                            text: {
                                type: 'plain_text',
                                text: '*this is plain_text text*',
                                emoji: true,
                            },
                            value: 'value-0',
                        },
                        {
                            text: {
                                type: 'plain_text',
                                text: '*this is plain_text text*',
                                emoji: true,
                            },
                            value: 'value-1',
                        },
                        {
                            text: {
                                type: 'plain_text',
                                text: '*this is plain_text text*',
                                emoji: true,
                            },
                            value: 'value-2',
                        },
                        {
                            text: {
                                type: 'plain_text',
                                text: '*this is plain_text text*',
                                emoji: true,
                            },
                            value: 'value-3',
                        },
                        {
                            text: {
                                type: 'plain_text',
                                text: '*this is plain_text text*',
                                emoji: true,
                            },
                            value: 'value-4',
                        },
                    ],
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'section',
                props: {
                    key: 0,
                    block: true,
                    children: [
                        {
                            component: 'markdown',
                            props: {
                                key: 0,
                                children: 'This is a section block with an overflow menu.',
                                verbatim: false,
                                block: false,
                            },
                        },
                        {
                            component: 'menu',
                            props: {
                                key: 1,
                                children: [
                                    {
                                        component: 'menu-item',
                                        props: {
                                            key: 0,
                                            children: [
                                                {
                                                    component: 'text',
                                                    props: {
                                                        key: 0,
                                                        children: '*this is plain_text text*',
                                                        emoji: true,
                                                        block: false,
                                                    },
                                                },
                                            ],
                                            value: 'value-0',
                                        },
                                    },
                                    {
                                        component: 'menu-item',
                                        props: {
                                            key: 1,
                                            children: [
                                                {
                                                    component: 'text',
                                                    props: {
                                                        key: 0,
                                                        children: '*this is plain_text text*',
                                                        emoji: true,
                                                        block: false,
                                                    },
                                                },
                                            ],
                                            value: 'value-1',
                                        },
                                    },
                                    {
                                        component: 'menu-item',
                                        props: {
                                            key: 2,
                                            children: [
                                                {
                                                    component: 'text',
                                                    props: {
                                                        key: 0,
                                                        children: '*this is plain_text text*',
                                                        emoji: true,
                                                        block: false,
                                                    },
                                                },
                                            ],
                                            value: 'value-2',
                                        },
                                    },
                                    {
                                        component: 'menu-item',
                                        props: {
                                            key: 3,
                                            children: [
                                                {
                                                    component: 'text',
                                                    props: {
                                                        key: 0,
                                                        children: '*this is plain_text text*',
                                                        emoji: true,
                                                        block: false,
                                                    },
                                                },
                                            ],
                                            value: 'value-3',
                                        },
                                    },
                                    {
                                        component: 'menu-item',
                                        props: {
                                            key: 4,
                                            children: [
                                                {
                                                    component: 'text',
                                                    props: {
                                                        key: 0,
                                                        children: '*this is plain_text text*',
                                                        emoji: true,
                                                        block: false,
                                                    },
                                                },
                                            ],
                                            value: 'value-4',
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        ]);
    });
    it('renders accessory as datepicker', () => {
        const payload = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'Pick a date for the deadline.',
                },
                accessory: {
                    type: 'datepicker',
                    initial_date: '1990-04-28',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Select a date',
                        emoji: true,
                    },
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'section',
                props: {
                    key: 0,
                    block: true,
                    children: [
                        {
                            component: 'markdown',
                            props: {
                                key: 0,
                                children: 'Pick a date for the deadline.',
                                verbatim: false,
                                block: false,
                            },
                        },
                        {
                            component: 'input',
                            props: {
                                key: 1,
                                type: 'date',
                                placeholder: {
                                    component: 'text',
                                    props: {
                                        key: 0,
                                        children: 'Select a date',
                                        emoji: true,
                                        block: false,
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        ]);
    });
});
describe('image', () => {
    it('renders with title', () => {
        const payload = [
            {
                type: 'image',
                title: {
                    type: 'plain_text',
                    text: 'I Need a Marg',
                    emoji: true,
                },
                imageUrl: 'https://assets3.thrillist.com/v1/image/1682388/size/tl-horizontal_main.jpg',
                altText: 'marg',
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'image-container',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'image',
                            props: {
                                key: 0,
                                src: 'https://assets3.thrillist.com/v1/image/1682388/size/tl-horizontal_main.jpg',
                                alt: 'marg',
                                block: false,
                            },
                        },
                        {
                            component: 'text',
                            props: {
                                key: 1,
                                children: 'I Need a Marg',
                                emoji: true,
                                block: false,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders with no title', () => {
        const payload = [
            {
                type: 'image',
                imageUrl: 'https://i1.wp.com/thetempest.co/wp-content/uploads/2017/08/The-wise-words-of-Michael-Scott-Imgur-2.jpg?w=1024&ssl=1',
                altText: 'inspiration',
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'image-container',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'image',
                            props: {
                                key: 0,
                                src: 'https://i1.wp.com/thetempest.co/wp-content/uploads/2017/08/The-wise-words-of-Michael-Scott-Imgur-2.jpg?w=1024&ssl=1',
                                alt: 'inspiration',
                                block: false,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
});
describe('actions', () => {
    it('renders all selects', () => {
        const payload = [
            {
                type: 'actions',
                elements: [
                    {
                        type: 'conversations_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select a conversation',
                            emoji: true,
                        },
                    },
                    {
                        type: 'channels_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select a channel',
                            emoji: true,
                        },
                    },
                    {
                        type: 'users_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select a user',
                            emoji: true,
                        },
                    },
                    {
                        type: 'static_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select an item',
                            emoji: true,
                        },
                        options: [
                            {
                                text: {
                                    type: 'plain_text',
                                    text: '*this is plain_text text*',
                                    emoji: true,
                                },
                                value: 'value-0',
                            },
                            {
                                text: {
                                    type: 'plain_text',
                                    text: '*this is plain_text text*',
                                    emoji: true,
                                },
                                value: 'value-1',
                            },
                            {
                                text: {
                                    type: 'plain_text',
                                    text: '*this is plain_text text*',
                                    emoji: true,
                                },
                                value: 'value-2',
                            },
                        ],
                    },
                ],
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'actions',
                props: {
                    key: 0,
                    children: [
                        null,
                        null,
                        null,
                        {
                            component: 'select',
                            props: {
                                key: 3,
                                children: [
                                    {
                                        component: 'option',
                                        props: {
                                            key: 0,
                                            children: {
                                                component: 'text',
                                                props: {
                                                    key: 0,
                                                    children: '*this is plain_text text*',
                                                    emoji: true,
                                                    block: false,
                                                },
                                            },
                                            value: 'value-0',
                                        },
                                    },
                                    {
                                        component: 'option',
                                        props: {
                                            key: 1,
                                            children: {
                                                component: 'text',
                                                props: {
                                                    key: 0,
                                                    children: '*this is plain_text text*',
                                                    emoji: true,
                                                    block: false,
                                                },
                                            },
                                            value: 'value-1',
                                        },
                                    },
                                    {
                                        component: 'option',
                                        props: {
                                            key: 2,
                                            children: {
                                                component: 'text',
                                                props: {
                                                    key: 0,
                                                    children: '*this is plain_text text*',
                                                    emoji: true,
                                                    block: false,
                                                },
                                            },
                                            value: 'value-2',
                                        },
                                    },
                                ],
                                placeholder: {
                                    component: 'text',
                                    props: {
                                        key: 0,
                                        children: 'Select an item',
                                        emoji: true,
                                        block: false,
                                    },
                                },
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders filtered conversations select', () => {
        const payload = [
            {
                type: 'actions',
                elements: [
                    {
                        type: 'conversations_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select private conversation',
                            emoji: true,
                        },
                        filter: {
                            include: ['private'],
                        },
                    },
                ],
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'actions',
                props: {
                    key: 0,
                    children: [null],
                    block: true,
                },
            },
        ]);
    });
    it('renders selects with initial options', () => {
        const payload = [
            {
                type: 'actions',
                elements: [
                    {
                        type: 'conversations_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select a conversation',
                            emoji: true,
                        },
                        initialConversation: 'D123',
                    },
                    {
                        type: 'users_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select a user',
                            emoji: true,
                        },
                        initialUser: 'U123',
                    },
                    {
                        type: 'channels_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select a channel',
                            emoji: true,
                        },
                        initialChannel: 'C123',
                    },
                ],
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'actions',
                props: {
                    key: 0,
                    children: [null, null, null],
                    block: true,
                },
            },
        ]);
    });
    it('renders button', () => {
        const payload = [
            {
                type: 'actions',
                elements: [
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Click Me',
                            emoji: true,
                        },
                        value: 'click_me_123',
                    },
                ],
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'actions',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'button',
                            props: {
                                key: 0,
                                children: [
                                    {
                                        component: 'text',
                                        props: {
                                            key: 0,
                                            children: 'Click Me',
                                            emoji: true,
                                            block: false,
                                        },
                                    },
                                ],
                                value: 'click_me_123',
                                variant: 'normal',
                                block: false,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders datepicker', () => {
        const payload = [
            {
                type: 'actions',
                elements: [
                    {
                        type: 'datepicker',
                        initialDate: '1990-04-28',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select a date',
                            emoji: true,
                        },
                    },
                    {
                        type: 'datepicker',
                        initialDate: '1990-04-28',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select a date',
                            emoji: true,
                        },
                    },
                ],
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'actions',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'input',
                            props: {
                                key: 0,
                                type: 'date',
                                defaultValue: '1990-04-28',
                                placeholder: {
                                    component: 'text',
                                    props: {
                                        key: 0,
                                        children: 'Select a date',
                                        emoji: true,
                                        block: false,
                                    },
                                },
                            },
                        },
                        {
                            component: 'input',
                            props: {
                                key: 1,
                                type: 'date',
                                defaultValue: '1990-04-28',
                                placeholder: {
                                    component: 'text',
                                    props: {
                                        key: 0,
                                        children: 'Select a date',
                                        emoji: true,
                                        block: false,
                                    },
                                },
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
});
describe('context', () => {
    it('renders plain text', () => {
        const payload = [
            {
                type: 'context',
                elements: [
                    {
                        type: 'plain_text',
                        text: 'Author: K A Applegate',
                        emoji: true,
                    },
                ],
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'context',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'text',
                            props: {
                                key: 0,
                                children: 'Author: K A Applegate',
                                emoji: true,
                                block: false,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders mrkdwn', () => {
        const payload = [
            {
                type: 'context',
                elements: [
                    {
                        type: 'image',
                        imageUrl: 'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
                        altText: 'cute cat',
                    },
                    {
                        type: 'mrkdwn',
                        text: '*Cat* has approved this message.',
                    },
                ],
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'context',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'image',
                            props: {
                                key: 0,
                                src: 'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
                                alt: 'cute cat',
                                block: false,
                            },
                        },
                        {
                            component: 'markdown',
                            props: {
                                key: 1,
                                children: '*Cat* has approved this message.',
                                verbatim: false,
                                block: false,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders text and images', () => {
        const payload = [
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: '*This* is :smile: markdown',
                    },
                    {
                        type: 'image',
                        imageUrl: 'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
                        altText: 'cute cat',
                    },
                    {
                        type: 'image',
                        imageUrl: 'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
                        altText: 'cute cat',
                    },
                    {
                        type: 'image',
                        imageUrl: 'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
                        altText: 'cute cat',
                    },
                    {
                        type: 'plain_text',
                        text: 'Author: K A Applegate',
                        emoji: true,
                    },
                ],
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'context',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'markdown',
                            props: {
                                key: 0,
                                children: '*This* is :smile: markdown',
                                verbatim: false,
                                block: false,
                            },
                        },
                        {
                            component: 'image',
                            props: {
                                key: 1,
                                src: 'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
                                alt: 'cute cat',
                                block: false,
                            },
                        },
                        {
                            component: 'image',
                            props: {
                                key: 2,
                                src: 'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
                                alt: 'cute cat',
                                block: false,
                            },
                        },
                        {
                            component: 'image',
                            props: {
                                key: 3,
                                src: 'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
                                alt: 'cute cat',
                                block: false,
                            },
                        },
                        {
                            component: 'text',
                            props: {
                                key: 4,
                                children: 'Author: K A Applegate',
                                emoji: true,
                                block: false,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
});
describe('input', () => {
    it('renders multiline plain text input', () => {
        const payload = [
            {
                type: 'input',
                element: {
                    type: 'plain_text_input',
                    multiline: true,
                },
                label: {
                    type: 'plain_text',
                    text: 'Label',
                    emoji: true,
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'input-group',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'text',
                            props: {
                                key: 0,
                                children: 'Label',
                                emoji: true,
                                block: false,
                            },
                        },
                        {
                            component: 'input',
                            props: {
                                key: 1,
                                type: 'text',
                                multiline: true,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders plain text input', () => {
        const payload = [
            {
                type: 'input',
                element: {
                    type: 'plain_text_input',
                },
                label: {
                    type: 'plain_text',
                    text: 'Label',
                    emoji: true,
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'input-group',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'text',
                            props: {
                                key: 0,
                                children: 'Label',
                                emoji: true,
                                block: false,
                            },
                        },
                        {
                            component: 'input',
                            props: {
                                key: 1,
                                type: 'text',
                                multiline: false,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders multi users select', () => {
        const payload = [
            {
                type: 'input',
                element: {
                    type: 'multi_users_select',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Select users',
                        emoji: true,
                    },
                },
                label: {
                    type: 'plain_text',
                    text: 'Label',
                    emoji: true,
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'input-group',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'text',
                            props: {
                                key: 0,
                                children: 'Label',
                                emoji: true,
                                block: false,
                            },
                        },
                        null,
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders static select', () => {
        const payload = [
            {
                type: 'input',
                element: {
                    type: 'static_select',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Select an item',
                        emoji: true,
                    },
                    options: [
                        {
                            text: {
                                type: 'plain_text',
                                text: '*this is plain_text text*',
                                emoji: true,
                            },
                            value: 'value-0',
                        },
                        {
                            text: {
                                type: 'plain_text',
                                text: '*this is plain_text text*',
                                emoji: true,
                            },
                            value: 'value-1',
                        },
                        {
                            text: {
                                type: 'plain_text',
                                text: '*this is plain_text text*',
                                emoji: true,
                            },
                            value: 'value-2',
                        },
                    ],
                },
                label: {
                    type: 'plain_text',
                    text: 'Label',
                    emoji: true,
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'input-group',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'text',
                            props: {
                                key: 0,
                                children: 'Label',
                                emoji: true,
                                block: false,
                            },
                        },
                        {
                            component: 'select',
                            props: {
                                key: 1,
                                children: [
                                    {
                                        component: 'option',
                                        props: {
                                            key: 0,
                                            children: {
                                                component: 'text',
                                                props: {
                                                    key: 0,
                                                    children: '*this is plain_text text*',
                                                    emoji: true,
                                                    block: false,
                                                },
                                            },
                                            value: 'value-0',
                                        },
                                    },
                                    {
                                        component: 'option',
                                        props: {
                                            key: 1,
                                            children: {
                                                component: 'text',
                                                props: {
                                                    key: 0,
                                                    children: '*this is plain_text text*',
                                                    emoji: true,
                                                    block: false,
                                                },
                                            },
                                            value: 'value-1',
                                        },
                                    },
                                    {
                                        component: 'option',
                                        props: {
                                            key: 2,
                                            children: {
                                                component: 'text',
                                                props: {
                                                    key: 0,
                                                    children: '*this is plain_text text*',
                                                    emoji: true,
                                                    block: false,
                                                },
                                            },
                                            value: 'value-2',
                                        },
                                    },
                                ],
                                placeholder: {
                                    component: 'text',
                                    props: {
                                        key: 0,
                                        children: 'Select an item',
                                        emoji: true,
                                        block: false,
                                    },
                                },
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders datepicker', () => {
        const payload = [
            {
                type: 'input',
                element: {
                    type: 'datepicker',
                    initialDate: '1990-04-28',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Select a date',
                        emoji: true,
                    },
                },
                label: {
                    type: 'plain_text',
                    text: 'Label',
                    emoji: true,
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'input-group',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'text',
                            props: {
                                key: 0,
                                children: 'Label',
                                emoji: true,
                                block: false,
                            },
                        },
                        {
                            component: 'input',
                            props: {
                                key: 1,
                                type: 'date',
                                defaultValue: '1990-04-28',
                                placeholder: {
                                    component: 'text',
                                    props: {
                                        key: 0,
                                        children: 'Select a date',
                                        emoji: true,
                                        block: false,
                                    },
                                },
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders linear scale', () => {
        const payload = [
            {
                type: 'input',
                element: {
                    type: 'linear_scale',
                    maxValue: 2,
                },
                label: {
                    type: 'plain_text',
                    text: 'Label',
                    emoji: true,
                },
            },
        ];
        expect(parse(payload)).toStrictEqual([
            {
                component: 'input-group',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'text',
                            props: {
                                key: 0,
                                children: 'Label',
                                emoji: true,
                                block: false,
                            },
                        },
                        {
                            component: 'linear-scale',
                            props: {
                                key: 1,
                                children: [
                                    {
                                        component: 'linear-scale-point',
                                        props: {
                                            key: 0,
                                            children: [
                                                {
                                                    component: 'text',
                                                    props: {
                                                        key: 0,
                                                        children: '0',
                                                        emoji: true,
                                                        block: false,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        component: 'linear-scale-point',
                                        props: {
                                            key: 1,
                                            children: [
                                                {
                                                    component: 'text',
                                                    props: {
                                                        key: 0,
                                                        children: '1',
                                                        emoji: true,
                                                        block: false,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        component: 'linear-scale-point',
                                        props: {
                                            key: 2,
                                            children: [
                                                {
                                                    component: 'text',
                                                    props: {
                                                        key: 0,
                                                        children: '2',
                                                        emoji: true,
                                                        block: false,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
});
describe('conditional', () => {
    it('renders when conditions match', () => {
        const blocks = [
            {
                type: 'conditional',
                when: {
                    engine: ['rocket.chat'],
                },
                render: [
                    {
                        type: 'section',
                        text: {
                            type: 'plain_text',
                            text: 'This is a plain text section block.',
                            emoji: true,
                        },
                    },
                ],
            },
        ];
        expect(conditionalParse(blocks)).toStrictEqual([
            {
                component: 'section',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'text',
                            props: {
                                key: 0,
                                children: 'This is a plain text section block.',
                                emoji: true,
                                block: false,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('renders when no conditions are set', () => {
        const blocks = [
            {
                type: 'conditional',
                when: {
                    engine: ['rocket.chat'],
                },
                render: [
                    {
                        type: 'section',
                        text: {
                            type: 'plain_text',
                            text: 'This is a plain text section block.',
                            emoji: true,
                        },
                    },
                ],
            },
        ];
        expect(parse(blocks)).toStrictEqual([
            {
                component: 'section',
                props: {
                    key: 0,
                    children: [
                        {
                            component: 'text',
                            props: {
                                key: 0,
                                children: 'This is a plain text section block.',
                                emoji: true,
                                block: false,
                            },
                        },
                    ],
                    block: true,
                },
            },
        ]);
    });
    it('does not render when conditions match', () => {
        const blocks = [
            {
                type: 'conditional',
                when: {
                    engine: ['livechat'],
                },
                render: [
                    {
                        type: 'section',
                        text: {
                            type: 'plain_text',
                            text: 'This is a plain text section block.',
                            emoji: true,
                        },
                    },
                ],
            },
        ];
        expect(conditionalParse(blocks)).toStrictEqual([]);
    });
});
