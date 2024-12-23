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
const random_1 = require("@rocket.chat/random");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
const chat_helper_1 = require("../../data/chat.helper");
const interactions_1 = require("../../data/interactions");
const permissions_helper_1 = require("../../data/permissions.helper");
const rooms_helper_1 = require("../../data/rooms.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
const pinMessage = ({ msgId }) => {
    if (!msgId) {
        throw new Error('"msgId" is required in "pinMessage" test helper');
    }
    return api_data_1.request.post((0, api_data_1.api)('chat.pinMessage')).set(api_data_1.credentials).send({
        messageId: msgId,
    });
};
(0, mocha_1.describe)('[Chat]', () => {
    let testChannel;
    let message;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `chat.api-test-${Date.now()}` })).body.channel;
    }));
    (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
    (0, mocha_1.describe)('/chat.postMessage', () => {
        (0, mocha_1.it)('should throw an error when at least one of required parameters(channel, roomId) is not sent', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                text: 'Sample message',
                alias: 'Gruggy',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', '[invalid-channel]');
            })
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when it has some properties with the wrong type(attachments.title_link_download, attachments.fields, message_link)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                alias: 'Gruggy',
                text: 'Sample message',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        thumb_url: 'http://res.guggy.com/logo_128.png',
                        message_link: 12,
                        collapsed: false,
                        author_name: 'Bradley Hilton',
                        author_link: 'https://rocket.chat/',
                        author_icon: 'https://avatars.githubusercontent.com/u/850391?v=3',
                        title: 'Attachment Example',
                        title_link: 'https://youtube.com',
                        title_link_download: 'https://youtube.com',
                        image_url: 'http://res.guggy.com/logo_128.png',
                        audio_url: 'http://www.w3schools.com/tags/horse.mp3',
                        video_url: 'http://www.w3schools.com/tags/movie.mp4',
                        fields: '',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
        (0, mocha_1.describe)('should throw an error when the sensitive properties contain malicious XSS values', () => {
            (0, mocha_1.it)('attachment.message_link', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                alias: 'Gruggy',
                text: 'Sample message',
                avatar: 'http://res.guggy.com/logo_128.png',
                emoji: ':smirk:',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        thumb_url: 'http://res.guggy.com/logo_128.png',
                        message_link: 'javascript:alert("xss")',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.author_link', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                alias: 'Gruggy',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        thumb_url: 'http://res.guggy.com/logo_128.png',
                        author_link: 'javascript:alert("xss")',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.title_link', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                alias: 'Gruggy',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        title: 'Attachment Example',
                        title_link: 'javascript:alert("xss")',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.action.url', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                alias: 'Gruggy',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        title: 'Attachment Example',
                        title_link: 'https://youtube.com',
                        actions: [
                            {
                                type: 'button',
                                text: 'Text',
                                url: 'javascript:alert("xss")',
                            },
                        ],
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('message.avatar', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                emoji: ':smirk:',
                avatar: 'javascript:alert("xss")',
                alias: 'Gruggy',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        title: 'Attachment Example',
                        title_link: 'https://youtube.com',
                        actions: [
                            {
                                type: 'button',
                                text: 'Text',
                                url: 'https://youtube.com',
                            },
                        ],
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.action.image_url', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                alias: 'Gruggy',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        title: 'Attachment Example',
                        title_link: 'https://youtube.com',
                        actions: [
                            {
                                type: 'button',
                                text: 'Text',
                                url: 'http://res.guggy.com/logo_128.png',
                                image_url: 'javascript:alert("xss")',
                            },
                        ],
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.thumb_url', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                emoji: ':smirk:',
                alias: 'Gruggy',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        title: 'Attachment Example',
                        thumb_url: 'javascript:alert("xss")',
                        title_link: 'http://res.guggy.com/logo_128.png',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.author_icon', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                emoji: ':smirk:',
                alias: 'Gruggy',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        title: 'Attachment Example',
                        author_icon: 'javascript:alert("xss")',
                        title_link: 'http://res.guggy.com/logo_128.png',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.image_url', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                alias: 'Gruggy',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        title: 'Attachment Example',
                        image_url: 'javascript:alert("xss")',
                        title_link: 'http://res.guggy.com/logo_128.png',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.audio_url', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                alias: 'Gruggy',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        title: 'Attachment Example',
                        audio_url: 'javascript:alert("xss")',
                        title_link: 'http://res.guggy.com/logo_128.png',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.video_url', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                alias: 'Gruggy',
                text: 'Sample message',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        title: 'Attachment Example',
                        video_url: 'javascript:alert("xss")',
                        title_link: 'http://res.guggy.com/logo_128.png',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
        });
        (0, mocha_1.it)('should throw an error when the properties (attachments.fields.title, attachments.fields.value) are with the wrong type', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                emoji: ':smirk:',
                alias: 'Gruggy',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        thumb_url: 'http://res.guggy.com/logo_128.png',
                        message_link: 'https://google.com',
                        collapsed: false,
                        author_name: 'Bradley Hilton',
                        author_link: 'https://rocket.chat/',
                        author_icon: 'https://avatars.githubusercontent.com/u/850391?v=3',
                        title: 'Attachment Example',
                        title_link: 'https://youtube.com',
                        title_link_download: true,
                        image_url: 'http://res.guggy.com/logo_128.png',
                        audio_url: 'http://www.w3schools.com/tags/horse.mp3',
                        video_url: 'http://www.w3schools.com/tags/movie.mp4',
                        fields: [
                            {
                                short: true,
                                title: 12,
                                value: false,
                            },
                        ],
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return statusCode 200 when postMessage successfully', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                emoji: ':smirk:',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        thumb_url: 'http://res.guggy.com/logo_128.png',
                        message_link: 'https://google.com',
                        collapsed: false,
                        author_name: 'Bradley Hilton',
                        author_link: 'https://rocket.chat/',
                        author_icon: 'https://avatars.githubusercontent.com/u/850391?v=3',
                        title: 'Attachment Example',
                        title_link: 'https://youtube.com',
                        title_link_download: true,
                        image_url: 'http://res.guggy.com/logo_128.png',
                        audio_url: 'http://www.w3schools.com/tags/horse.mp3',
                        video_url: 'http://www.w3schools.com/tags/movie.mp4',
                        fields: [
                            {
                                short: true,
                                title: 'Test',
                                value: 'Testing out something or other',
                            },
                            {
                                short: true,
                                title: 'Another Test',
                                value: '[Link](https://google.com/) something and this and that.',
                            },
                        ],
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', 'Sample message');
                message = { _id: res.body.message._id };
            })
                .end(done);
        });
        (0, mocha_1.describe)('text message allowed size', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Message_MaxAllowedSize', 10);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Message_MaxAllowedSize', 5000);
            }));
            (0, mocha_1.it)('should return an error if text parameter surpasses the maximum allowed size', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.postMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    channel: '#general',
                    text: 'Text to test max limit allowed',
                    alias: 'Gruggy',
                    emoji: ':smirk:',
                    avatar: 'http://res.guggy.com/logo_128.png',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'error-message-size-exceeded');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return an error if text parameter in the first attachment surpasses the maximum allowed size', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.postMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    channel: testChannel.name,
                    text: 'Yay!',
                    emoji: ':smirk:',
                    attachments: [
                        {
                            color: '#ff0000',
                            text: 'Text to test max limit allowed',
                            ts: '2016-12-09T16:53:06.761Z',
                            thumb_url: 'http://res.guggy.com/logo_128.png',
                            message_link: 'https://google.com',
                            collapsed: false,
                            author_name: 'Bradley Hilton',
                            author_link: 'https://rocket.chat/',
                            author_icon: 'https://avatars.githubusercontent.com/u/850391?v=3',
                            title: 'Attachment Example',
                            title_link: 'https://youtube.com',
                            title_link_download: true,
                            image_url: 'http://res.guggy.com/logo_128.png',
                            audio_url: 'http://www.w3schools.com/tags/horse.mp3',
                            video_url: 'http://www.w3schools.com/tags/movie.mp4',
                            fields: [],
                        },
                    ],
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'error-message-size-exceeded');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return an error if text parameter in any of the attachments surpasses the maximum allowed size', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.postMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    channel: testChannel.name,
                    text: 'Yay!',
                    emoji: ':smirk:',
                    attachments: [
                        {
                            color: '#ff0000',
                            text: 'Yay!',
                            ts: '2016-12-09T16:53:06.761Z',
                            thumb_url: 'http://res.guggy.com/logo_128.png',
                            message_link: 'https://google.com',
                            collapsed: false,
                            author_name: 'Bradley Hilton',
                            author_link: 'https://rocket.chat/',
                            author_icon: 'https://avatars.githubusercontent.com/u/850391?v=3',
                            title: 'Attachment Example',
                            title_link: 'https://youtube.com',
                            title_link_download: true,
                            image_url: 'http://res.guggy.com/logo_128.png',
                            audio_url: 'http://www.w3schools.com/tags/horse.mp3',
                            video_url: 'http://www.w3schools.com/tags/movie.mp4',
                            fields: [],
                        },
                        {
                            color: '#ff0000',
                            text: 'Text to large to test max limit allowed',
                            ts: '2016-12-09T16:53:06.761Z',
                            thumb_url: 'http://res.guggy.com/logo_128.png',
                            message_link: 'https://google.com',
                            collapsed: false,
                            author_name: 'Bradley Hilton',
                            author_link: 'https://rocket.chat/',
                            author_icon: 'https://avatars.githubusercontent.com/u/850391?v=3',
                            title: 'Attachment Example',
                            title_link: 'https://youtube.com',
                            title_link_download: true,
                            image_url: 'http://res.guggy.com/logo_128.png',
                            audio_url: 'http://www.w3schools.com/tags/horse.mp3',
                            video_url: 'http://www.w3schools.com/tags/movie.mp4',
                            fields: [],
                        },
                    ],
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'error-message-size-exceeded');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should pass if any text parameter length does not surpasses the maximum allowed size', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.postMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    channel: testChannel.name,
                    text: 'Sample',
                    emoji: ':smirk:',
                    attachments: [
                        {
                            color: '#ff0000',
                            text: 'Sample',
                            ts: '2016-12-09T16:53:06.761Z',
                            thumb_url: 'http://res.guggy.com/logo_128.png',
                            message_link: 'https://google.com',
                            collapsed: false,
                            author_name: 'Bradley Hilton',
                            author_link: 'https://rocket.chat/',
                            author_icon: 'https://avatars.githubusercontent.com/u/850391?v=3',
                            title: 'Attachment Example',
                            title_link: 'https://youtube.com',
                            title_link_download: true,
                            image_url: 'http://res.guggy.com/logo_128.png',
                            audio_url: 'http://www.w3schools.com/tags/horse.mp3',
                            video_url: 'http://www.w3schools.com/tags/movie.mp4',
                            fields: [
                                {
                                    short: true,
                                    title: 'Test',
                                    value: 'Testing out something or other',
                                },
                                {
                                    short: true,
                                    title: 'Another Test',
                                    value: '[Link](https://google.com/) something and this and that.',
                                },
                            ],
                        },
                    ],
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', 'Sample');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('/chat.getMessage', () => {
        (0, mocha_1.it)('should retrieve the message successfully', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.getMessage'))
                .set(api_data_1.credentials)
                .query({
                msgId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message._id', message._id);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/chat.sendMessage', () => {
        (0, mocha_1.it)("should throw an error when the required param 'rid' is not sent", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    alias: 'Gruggy',
                    emoji: ':smirk:',
                    avatar: 'http://res.guggy.com/logo_128.png',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', "The 'rid' property on the message object is missing.");
            })
                .end(done);
        });
        (0, mocha_1.describe)('should throw an error when the sensitive properties contain malicious XSS values', () => {
            (0, mocha_1.it)('attachment.message_link', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                alias: 'Gruggy',
                text: 'Sample message',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        thumb_url: 'http://res.guggy.com/logo_128.png',
                        message_link: 'javascript:alert("xss")',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.author_link', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                alias: 'Gruggy',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        thumb_url: 'http://res.guggy.com/logo_128.png',
                        author_link: 'javascript:alert("xss")',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.title_link', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                alias: 'Gruggy',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        title: 'Attachment Example',
                        title_link: 'javascript:alert("xss")',
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
            (0, mocha_1.it)('attachment.action.url', () => void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: testChannel.name,
                text: 'Sample message',
                alias: 'Gruggy',
                emoji: ':smirk:',
                avatar: 'http://res.guggy.com/logo_128.png',
                attachments: [
                    {
                        color: '#ff0000',
                        text: 'Yay for gruggy!',
                        ts: '2016-12-09T16:53:06.761Z',
                        title: 'Attachment Example',
                        title_link: 'https://youtube.com',
                        actions: [
                            {
                                type: 'button',
                                text: 'Text',
                                url: 'javascript:alert("xss")',
                            },
                        ],
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            }));
        });
        (0, mocha_1.it)('should throw an error when it has some properties with the wrong type(attachments.title_link_download, attachments.fields, message_link)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    channel: testChannel.name,
                    text: 'Sample message',
                    alias: 'Gruggy',
                    emoji: ':smirk:',
                    avatar: 'http://res.guggy.com/logo_128.png',
                    attachments: [
                        {
                            color: '#ff0000',
                            text: 'Yay for gruggy!',
                            ts: '2016-12-09T16:53:06.761Z',
                            thumb_url: 'http://res.guggy.com/logo_128.png',
                            message_link: 12,
                            collapsed: false,
                            author_name: 'Bradley Hilton',
                            author_link: 'https://rocket.chat/',
                            author_icon: 'https://avatars.githubusercontent.com/u/850391?v=3',
                            title: 'Attachment Example',
                            title_link: 'https://youtube.com',
                            title_link_download: 'https://youtube.com',
                            image_url: 'http://res.guggy.com/logo_128.png',
                            audio_url: 'http://www.w3schools.com/tags/horse.mp3',
                            video_url: 'http://www.w3schools.com/tags/movie.mp4',
                            fields: '',
                        },
                    ],
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
        (0, mocha_1.it)('should send a message successfully', (done) => {
            message._id = `id-${Date.now()}`;
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    _id: message._id,
                    rid: testChannel._id,
                    msg: 'Sample message',
                    emoji: ':smirk:',
                    attachments: [
                        {
                            color: '#ff0000',
                            text: 'Yay for gruggy!',
                            ts: '2016-12-09T16:53:06.761Z',
                            thumb_url: 'http://res.guggy.com/logo_128.png',
                            message_link: 'https://google.com',
                            collapsed: false,
                            author_name: 'Bradley Hilton',
                            author_link: 'https://rocket.chat/',
                            author_icon: 'https://avatars.githubusercontent.com/u/850391?v=3',
                            title: 'Attachment Example',
                            title_link: 'https://youtube.com',
                            title_link_download: true,
                            image_url: 'http://res.guggy.com/logo_128.png',
                            audio_url: 'http://www.w3schools.com/tags/horse.mp3',
                            video_url: 'http://www.w3schools.com/tags/movie.mp4',
                            fields: [
                                {
                                    short: true,
                                    title: 'Test',
                                    value: 'Testing out something or other',
                                },
                                {
                                    short: true,
                                    title: 'Another Test',
                                    value: '[Link](https://google.com/) something and this and that.',
                                },
                            ],
                        },
                    ],
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', 'Sample message');
            })
                .end(done);
        });
        (0, mocha_1.describe)('Bad words filter', () => {
            (0, mocha_1.before)(() => Promise.all([(0, permissions_helper_1.updateSetting)('Message_AllowBadWordsFilter', true), (0, permissions_helper_1.updateSetting)('Message_BadWordsFilterList', 'badword,badword2')]));
            (0, mocha_1.after)(() => Promise.all([(0, permissions_helper_1.updateSetting)('Message_AllowBadWordsFilter', false), (0, permissions_helper_1.updateSetting)('Message_BadWordsFilterList', '')]));
            (0, mocha_1.it)('should censor bad words on send', () => __awaiter(void 0, void 0, void 0, function* () {
                const badMessage = {
                    _id: random_1.Random.id(),
                    rid: testChannel._id,
                    msg: 'This message has badword badword2',
                };
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(api_data_1.credentials)
                    .send({ message: badMessage })
                    .expect(200)
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('message');
                    const { message } = res.body;
                    (0, chai_1.expect)(message).to.have.property('msg', 'This message has ******* ********');
                    (0, chai_1.expect)(message).to.have.property('md').to.be.an('array').that.has.lengthOf(1);
                    const para = message.md[0];
                    (0, chai_1.expect)(para).to.have.property('value').to.be.an('array').that.has.lengthOf(1);
                    const text = para.value[0];
                    (0, chai_1.expect)(text).to.have.property('value', 'This message has ******* ********');
                });
            }));
        });
        (0, mocha_1.describe)('oembed', () => {
            let ytEmbedMsgId;
            let imgUrlMsgId;
            (0, mocha_1.before)(() => Promise.all([(0, permissions_helper_1.updateSetting)('API_EmbedIgnoredHosts', ''), (0, permissions_helper_1.updateSetting)('API_EmbedSafePorts', '80, 443, 3000')]));
            (0, mocha_1.after)(() => Promise.all([
                (0, permissions_helper_1.updateSetting)('API_EmbedIgnoredHosts', 'localhost, 127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16'),
                (0, permissions_helper_1.updateSetting)('API_EmbedSafePorts', '80, 443'),
            ]));
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                const ytEmbedMsgPayload = {
                    _id: `id-${Date.now()}`,
                    rid: testChannel._id,
                    msg: 'https://www.youtube.com/watch?v=T2v29gK8fP4',
                    emoji: ':smirk:',
                };
                const ytPostResponse = yield api_data_1.request.post((0, api_data_1.api)('chat.sendMessage')).set(api_data_1.credentials).send({ message: ytEmbedMsgPayload });
                ytEmbedMsgId = ytPostResponse.body.message._id;
            }));
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                const imgUrlMsgPayload = {
                    _id: `id-${Date.now()}1`,
                    rid: testChannel._id,
                    msg: 'http://localhost:3000/images/logo/logo.png',
                    emoji: ':smirk:',
                };
                const imgUrlResponse = yield api_data_1.request.post((0, api_data_1.api)('chat.sendMessage')).set(api_data_1.credentials).send({ message: imgUrlMsgPayload });
                imgUrlMsgId = imgUrlResponse.body.message._id;
            }));
            (0, mocha_1.it)('should have an iframe oembed with style max-width', (done) => {
                setTimeout(() => {
                    void api_data_1.request
                        .get((0, api_data_1.api)('chat.getMessage'))
                        .set(api_data_1.credentials)
                        .query({
                        msgId: ytEmbedMsgId,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('message').to.have.property('urls').to.be.an('array').that.is.not.empty;
                        (0, chai_1.expect)(res.body.message.urls[0])
                            .to.have.property('meta')
                            .to.have.property('oembedHtml')
                            .to.have.string('<iframe style="max-width: 100%;width:400px;height:225px"');
                    })
                        .end(done);
                }, 1000);
            });
            (0, mocha_1.it)('should embed an image preview if message has an image url', (done) => {
                setTimeout(() => {
                    void api_data_1.request
                        .get((0, api_data_1.api)('chat.getMessage'))
                        .set(api_data_1.credentials)
                        .query({
                        msgId: imgUrlMsgId,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('message').to.have.property('urls').to.be.an('array').that.is.not.empty;
                        (0, chai_1.expect)(res.body.message.urls[0]).to.have.property('headers').to.have.property('contentType', 'image/png');
                    })
                        .end(done);
                }, 200);
            });
            (0, mocha_1.it)('should not generate previews if an empty array of URL to preview is provided', () => __awaiter(void 0, void 0, void 0, function* () {
                let msgId;
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    message: {
                        rid: testChannel._id,
                        msg: 'https://www.youtube.com/watch?v=T2v29gK8fP4',
                    },
                    previewUrls: [],
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('message').to.have.property('urls').to.be.an('array').that.is.not.empty;
                    (0, chai_1.expect)(res.body.message.urls[0]).to.have.property('ignoreParse', true);
                    msgId = res.body.message._id;
                });
                yield api_data_1.request
                    .get((0, api_data_1.api)('chat.getMessage'))
                    .set(api_data_1.credentials)
                    .query({
                    msgId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('message').to.have.property('urls').to.be.an('array').that.has.lengthOf(1);
                    (0, chai_1.expect)(res.body.message.urls[0]).to.have.property('meta').to.deep.equals({});
                });
            }));
            (0, mocha_1.it)('should generate previews of chosen URL when the previewUrls array is provided', () => __awaiter(void 0, void 0, void 0, function* () {
                let msgId;
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    message: {
                        rid: testChannel._id,
                        msg: 'https://www.youtube.com/watch?v=T2v29gK8fP4 https://www.rocket.chat/',
                    },
                    previewUrls: ['https://www.rocket.chat/'],
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('message').to.have.property('urls').to.be.an('array').that.has.lengthOf(2);
                    (0, chai_1.expect)(res.body.message.urls[0]).to.have.property('ignoreParse', true);
                    (0, chai_1.expect)(res.body.message.urls[1]).to.not.have.property('ignoreParse');
                    msgId = res.body.message._id;
                });
                yield api_data_1.request
                    .get((0, api_data_1.api)('chat.getMessage'))
                    .set(api_data_1.credentials)
                    .query({
                    msgId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('message').to.have.property('urls').to.be.an('array').that.has.lengthOf(2);
                    (0, chai_1.expect)(res.body.message.urls[0]).to.have.property('meta').that.is.an('object').that.is.empty;
                    (0, chai_1.expect)(res.body.message.urls[1]).to.have.property('meta').that.is.an('object').that.is.not.empty;
                });
            }));
            (0, mocha_1.it)('should not generate previews if the message contains more than five external URL', () => __awaiter(void 0, void 0, void 0, function* () {
                let msgId;
                const urls = [
                    'https://www.youtube.com/watch?v=no050HN4ojo',
                    'https://www.youtube.com/watch?v=9iaSd13mqXA',
                    'https://www.youtube.com/watch?v=MW_qsbgt1KQ',
                    'https://www.youtube.com/watch?v=hLF1XwH5rd4',
                    'https://www.youtube.com/watch?v=Eo-F9hRBbTk',
                    'https://www.youtube.com/watch?v=08ms3W7adFI',
                ];
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    message: {
                        rid: testChannel._id,
                        msg: urls.join(' '),
                    },
                    previewUrls: urls,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('message').to.have.property('urls').to.be.an('array').that.has.lengthOf(urls.length);
                    msgId = res.body.message._id;
                });
                yield api_data_1.request
                    .get((0, api_data_1.api)('chat.getMessage'))
                    .set(api_data_1.credentials)
                    .query({
                    msgId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    var _a;
                    (0, chai_1.expect)(res.body).to.have.property('message').to.have.property('urls').to.be.an('array').that.has.lengthOf(urls.length);
                    (_a = res.body.message.urls) === null || _a === void 0 ? void 0 : _a.forEach((url) => {
                        (0, chai_1.expect)(url).to.not.have.property('ignoreParse');
                        (0, chai_1.expect)(url).to.have.property('meta').that.is.an('object').that.is.empty;
                    });
                });
            }));
        });
        (0, mocha_1.describe)('Read only channel', () => {
            let readOnlyChannel;
            let userCredentials;
            let user;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                user = yield (0, users_helper_1.createUser)();
                userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                return Promise.all([
                    (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: readOnlyChannel._id }),
                    (0, users_helper_1.deleteUser)(user),
                    (0, permissions_helper_1.updatePermission)('post-readonly', ['admin', 'owner', 'moderator']),
                ]);
            }));
            (0, mocha_1.it)('Creating a read-only channel', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('channels.create'))
                    .set(api_data_1.credentials)
                    .send({
                    name: `readonlychannel${+new Date()}`,
                    readOnly: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    readOnlyChannel = res.body.channel;
                })
                    .end(done);
            });
            (0, mocha_1.it)('should send a message when the user is the owner of a readonly channel', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    message: {
                        rid: readOnlyChannel._id,
                        msg: 'Sample message',
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('message').and.to.be.an('object');
                })
                    .end(done);
            });
            (0, mocha_1.it)('Inviting regular user to read-only channel', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('channels.invite'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: readOnlyChannel._id,
                    userId: user._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(() => {
                    done();
                });
            });
            (0, mocha_1.it)('should fail to send message when the user lacks permission', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(userCredentials)
                    .send({
                    message: {
                        rid: readOnlyChannel._id,
                        msg: 'Sample blocked message',
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should send a message when the user has permission to send messages on readonly channels', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updatePermission)('post-readonly', ['user']);
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(userCredentials)
                    .send({
                    message: {
                        rid: readOnlyChannel._id,
                        msg: 'Sample message overwriting readonly status',
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('message').and.to.be.an('object');
                });
            }));
        });
        (0, mocha_1.it)('should fail if user does not have the message-impersonate permission and tries to send message with alias param', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    rid: testChannel._id,
                    msg: 'Sample message',
                    alias: 'Gruggy',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Not enough permission');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if user does not have the message-impersonate permission and tries to send message with avatar param', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    rid: testChannel._id,
                    msg: 'Sample message',
                    avatar: 'http://site.com/logo.png',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Not enough permission');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if message is a system message', () => {
            const msgId = random_1.Random.id();
            return api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    _id: msgId,
                    rid: 'GENERAL',
                    msg: 'xss',
                    t: 'subscription-role-added',
                    role: '<h1>XSS<iframe srcdoc=\'<script src="/file-upload/664b3f90c4d3e60470c5e34a/js.js"></script>\'></iframe>',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        });
        (0, mocha_1.describe)('customFields', () => {
            function testMessageSending(_a) {
                return __awaiter(this, arguments, void 0, function* ({ customFields, testCb, statusCode, }) {
                    yield api_data_1.request
                        .post((0, api_data_1.api)('chat.sendMessage'))
                        .set(api_data_1.credentials)
                        .send({
                        message: {
                            rid: testChannel._id,
                            msg: 'Sample message',
                            customFields,
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(statusCode)
                        .expect(testCb);
                    yield (customFields
                        ? api_data_1.request.post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`)).field('customFields', JSON.stringify(customFields))
                        : api_data_1.request.post((0, api_data_1.api)(`rooms.upload/${testChannel._id}`)))
                        .set(api_data_1.credentials)
                        .attach('file', interactions_1.imgURL)
                        .expect('Content-Type', 'application/json')
                        .expect(statusCode)
                        .expect(testCb);
                    yield api_data_1.request
                        .post((0, api_data_1.api)('chat.postMessage'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId: testChannel._id,
                        msg: 'Sample message',
                        customFields,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(statusCode)
                        .expect(testCb);
                });
            }
            (0, mocha_1.describe)('when disabled', () => {
                (0, mocha_1.it)('should not allow sending custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield testMessageSending({
                        customFields: {
                            field1: 'value1',
                        },
                        statusCode: 400,
                        testCb: (res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', false);
                            (0, chai_1.expect)(res.body).to.have.property('error', 'Custom fields not enabled');
                        },
                    });
                }));
                (0, mocha_1.it)('should not allow update custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
                    const res = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: testChannel._id });
                    const msgId = res.body.message._id;
                    yield api_data_1.request
                        .post((0, api_data_1.api)('chat.update'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId: testChannel._id,
                        msgId,
                        text: 'Sample message Updated',
                        customFields: {
                            field1: 'value1',
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body).to.have.property('error', 'Custom fields not enabled');
                    });
                }));
            });
            (0, mocha_1.describe)('when enabled', () => {
                (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, permissions_helper_1.updateSetting)('Message_CustomFields_Enabled', true);
                    yield (0, permissions_helper_1.updateSetting)('Message_CustomFields', JSON.stringify({
                        properties: {
                            priority: {
                                type: 'string',
                                nullable: false,
                                enum: ['low', 'medium', 'high'],
                            },
                        },
                        required: ['priority'],
                    }));
                }));
                (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, permissions_helper_1.updateSetting)('Message_CustomFields_Enabled', false);
                }));
                (0, mocha_1.it)('should allow not sending custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield testMessageSending({
                        statusCode: 200,
                        testCb: (res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', true);
                        },
                    });
                }));
                (0, mocha_1.it)('should not allow sending empty custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield testMessageSending({
                        customFields: {},
                        statusCode: 400,
                        testCb: (res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', false);
                        },
                    });
                }));
                (0, mocha_1.it)('should not allow sending wrong custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield testMessageSending({
                        customFields: {
                            field1: 'value1',
                        },
                        statusCode: 400,
                        testCb: (res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', false);
                        },
                    });
                }));
                (0, mocha_1.it)('should allow sending correct custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield testMessageSending({
                        customFields: {
                            priority: 'low',
                        },
                        statusCode: 200,
                        testCb: (res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', true);
                            (0, chai_1.expect)(res.body.message).to.have.property('customFields').to.deep.equal({ priority: 'low' });
                        },
                    });
                }));
                (0, mocha_1.it)('should allow not sending custom fields on update', () => __awaiter(void 0, void 0, void 0, function* () {
                    const res = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: testChannel._id });
                    const msgId = res.body.message._id;
                    yield api_data_1.request
                        .post((0, api_data_1.api)('chat.update'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId: testChannel._id,
                        msgId,
                        text: 'Sample message Updated',
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                    });
                }));
                (0, mocha_1.it)('should not allow update empty custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
                    const res = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: testChannel._id });
                    const msgId = res.body.message._id;
                    yield api_data_1.request
                        .post((0, api_data_1.api)('chat.update'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId: testChannel._id,
                        msgId,
                        text: 'Sample message Updated',
                        customFields: {},
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    });
                }));
                (0, mocha_1.it)('should not allow update wrong custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
                    const res = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: testChannel._id });
                    const msgId = res.body.message._id;
                    yield api_data_1.request
                        .post((0, api_data_1.api)('chat.update'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId: testChannel._id,
                        msgId,
                        text: 'Sample message Updated',
                        customFields: {
                            field1: 'value1',
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    });
                }));
                (0, mocha_1.it)('should allow update correct custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
                    const res = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: testChannel._id });
                    const msgId = res.body.message._id;
                    yield api_data_1.request
                        .post((0, api_data_1.api)('chat.update'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId: testChannel._id,
                        msgId,
                        text: 'Sample message Updated',
                        customFields: {
                            priority: 'low',
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        (0, chai_1.expect)(res.body.message).to.have.property('customFields').to.deep.equal({ priority: 'low' });
                    });
                }));
            });
        });
    });
    (0, mocha_1.describe)('/chat.update', () => {
        const siteUrl = process.env.SITE_URL || process.env.TEST_API_URL || 'http://localhost:3000';
        let simpleMessageId;
        (0, mocha_1.before)('should send simple message in room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Message_CustomFields_Enabled', true);
            yield (0, permissions_helper_1.updateSetting)('Message_CustomFields', JSON.stringify({ properties: { test: { type: 'string' } } }));
            const res = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: 'GENERAL' });
            simpleMessageId = res.body.message._id;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Message_CustomFields_Enabled', false);
            yield (0, permissions_helper_1.updateSetting)('Message_CustomFields', '');
        }));
        (0, mocha_1.it)('should fail updating a message if no room id is provided', () => {
            return api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                msgId: message._id,
                text: 'This message was edited via API',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        });
        (0, mocha_1.it)('should fail updating a message if no message id is provided', () => {
            return api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                text: 'This message was edited via API',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        });
        (0, mocha_1.it)('should fail updating a message if no  text is provided', () => {
            return api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        });
        (0, mocha_1.it)('should fail updating a message if an invalid message id is provided', () => {
            return api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId: 'invalid-id',
                text: 'This message was edited via API',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'No message found with the id of "invalid-id".');
            });
        });
        (0, mocha_1.it)('should fail updating a message if it is not in the provided room', () => {
            return api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'invalid-room',
                msgId: message._id,
                text: 'This message was edited via API',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'The room id provided does not match where the message is from.');
            });
        });
        (0, mocha_1.it)('should update a message successfully', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId: message._id,
                text: 'This message was edited via API',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', 'This message was edited via API');
            })
                .end(done);
        });
        (0, mocha_1.it)('should add quote attachments to a message', () => __awaiter(void 0, void 0, void 0, function* () {
            const quotedMsgLink = `${siteUrl}/channel/general?msg=${message._id}`;
            void api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId: message._id,
                text: `Testing quotes ${quotedMsgLink}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', `Testing quotes ${quotedMsgLink}`);
                (0, chai_1.expect)(res.body.message).to.have.property('attachments').that.is.an('array').that.has.lengthOf(1);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('message_link', quotedMsgLink);
            });
        }));
        (0, mocha_1.it)('should replace a quote attachment in a message', () => __awaiter(void 0, void 0, void 0, function* () {
            const quotedMsgLink = `${siteUrl}/channel/general?msg=${simpleMessageId}`;
            void api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId: message._id,
                text: `Testing quotes ${quotedMsgLink}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', `Testing quotes ${quotedMsgLink}`);
                (0, chai_1.expect)(res.body.message).to.have.property('attachments').that.is.an('array').that.has.lengthOf(1);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('message_link', quotedMsgLink);
            });
        }));
        (0, mocha_1.it)('should add multiple quote attachments in a single message', () => __awaiter(void 0, void 0, void 0, function* () {
            const quotedMsgLink = `${siteUrl}/channel/general?msg=${simpleMessageId}`;
            const newQuotedMsgLink = `${siteUrl}/channel/general?msg=${message._id}`;
            void api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId: message._id,
                text: `${newQuotedMsgLink} Testing quotes ${quotedMsgLink}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', `Testing quotes ${quotedMsgLink}`);
                (0, chai_1.expect)(res.body.message).to.have.property('attachments').that.is.an('array').that.has.lengthOf(2);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('message_link', newQuotedMsgLink);
                (0, chai_1.expect)(res.body.message.attachments[1]).to.have.property('message_link', quotedMsgLink);
            });
        }));
        (0, mocha_1.it)('should erase old quote attachments when updating a message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId: message._id,
                text: 'This message was edited via API',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', 'This message was edited via API');
                (0, chai_1.expect)(res.body.message).to.have.property('attachments').that.is.an('array').that.has.lengthOf(0);
            });
        }));
        (0, mocha_1.it)('should do nothing if the message text hasnt changed and theres no custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId: message._id,
                text: 'This message was edited via API',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', 'This message was edited via API');
                (0, chai_1.expect)(res.body).to.not.have.nested.property('message.customFields');
            });
        }));
        (0, mocha_1.it)('should update message custom fields along with msg', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId: message._id,
                text: 'This message was edited via API 2',
                customFields: { test: 'test' },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', 'This message was edited via API 2');
                (0, chai_1.expect)(res.body.message).to.have.property('customFields').that.is.an('object').that.deep.equals({ test: 'test' });
            });
        }));
        (0, mocha_1.it)('should update message custom fields without changes to msg', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.update'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId: message._id,
                text: 'This message was edited via API 2',
                customFields: { test: 'test 2' },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', 'This message was edited via API 2');
                (0, chai_1.expect)(res.body.message).to.have.property('customFields').that.is.an('object').that.deep.equals({ test: 'test 2' });
            });
        }));
        (0, mocha_1.describe)('Bad words filter', () => {
            (0, mocha_1.before)(() => Promise.all([(0, permissions_helper_1.updateSetting)('Message_AllowBadWordsFilter', true), (0, permissions_helper_1.updateSetting)('Message_BadWordsFilterList', 'badword,badword2')]));
            (0, mocha_1.after)(() => Promise.all([(0, permissions_helper_1.updateSetting)('Message_AllowBadWordsFilter', false), (0, permissions_helper_1.updateSetting)('Message_BadWordsFilterList', '')]));
            (0, mocha_1.it)('should censor bad words on update', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.update'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testChannel._id,
                    msgId: message._id,
                    text: 'This message has badword badword2',
                })
                    .expect(200)
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('message');
                    const { message } = res.body;
                    (0, chai_1.expect)(message).to.have.property('msg', 'This message has ******* ********');
                    (0, chai_1.expect)(message).to.have.property('md').to.be.an('array').that.has.lengthOf(1);
                    const para = message.md[0];
                    (0, chai_1.expect)(para).to.have.property('value').to.be.an('array').that.has.lengthOf(1);
                    const text = para.value[0];
                    (0, chai_1.expect)(text).to.have.property('value', 'This message has ******* ********');
                });
            }));
        });
    });
    (0, mocha_1.describe)('[/chat.delete]', () => {
        let msgId;
        let user;
        let userCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        }));
        (0, mocha_1.after)(() => (0, users_helper_1.deleteUser)(user));
        (0, mocha_1.beforeEach)((done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    rid: testChannel._id,
                    msg: 'Sample message',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                msgId = res.body.message._id;
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail deleting a message if no message id is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('chat.delete'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should fail deleting a message if no room id is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('chat.delete'))
                .set(api_data_1.credentials)
                .send({
                msgId,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should fail deleting a message if it is not in the provided room', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('chat.delete'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'invalid-room',
                msgId,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'The room id provided does not match where the message is from.');
            });
        }));
        (0, mocha_1.it)('should fail deleting a message if an invalid id is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('chat.delete'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId: 'invalid-id',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', `No message found with the id of "invalid-id".`);
            });
        }));
        (0, mocha_1.it)('should delete a message successfully', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.delete'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('sending message as another user...', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(userCredentials)
                .send({
                message: {
                    rid: testChannel._id,
                    msg: 'Sample message',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                msgId = res.body.message._id;
            })
                .end(done);
        });
        (0, mocha_1.it)('should delete a message successfully when the user deletes a message send by another user', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.delete'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                msgId,
                asUser: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/chat.search', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const sendMessage = (text) => api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    rid: testChannel._id,
                    msg: text,
                },
            });
            yield sendMessage('msg1');
            yield sendMessage('msg1');
            yield sendMessage('msg1');
            yield sendMessage('msg1');
            yield sendMessage('msg1');
        }));
        (0, mocha_1.it)('should return a list of messages when execute successfully', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.search'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                searchText: 'msg1',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return a list of messages(length=1) when is provided "count" query parameter execute successfully', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.search'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                searchText: 'msg1',
                count: 1,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages');
                (0, chai_1.expect)(res.body.messages.length).to.equal(1);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return a list of messages(length=3) when is provided "count" and "offset" query parameters are executed successfully', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.search'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                searchText: 'msg1',
                offset: 1,
                count: 3,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages');
                (0, chai_1.expect)(res.body.messages.length).to.equal(3);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return a empty list of messages when is provided a huge offset value', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.search'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                searchText: 'msg1',
                offset: 9999,
                count: 3,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages');
                (0, chai_1.expect)(res.body.messages.length).to.equal(0);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/chat.react]', () => {
        (0, mocha_1.it)("should return statusCode: 200 and success when try unreact a message that's no reacted yet", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.react'))
                .set(api_data_1.credentials)
                .send({
                emoji: ':squid:',
                messageId: message._id,
                shouldReact: false,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should react a message successfully', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.react'))
                .set(api_data_1.credentials)
                .send({
                emoji: 'smile',
                messageId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return statusCode: 200 when the emoji is valid', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.react'))
                .set(api_data_1.credentials)
                .send({
                emoji: ':squid:',
                messageId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)("should return statusCode: 200 and success when try react a message that's already reacted", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.react'))
                .set(api_data_1.credentials)
                .send({
                emoji: ':squid:',
                messageId: message._id,
                shouldReact: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return statusCode: 200 when unreact a message with flag, shouldReact: false', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.react'))
                .set(api_data_1.credentials)
                .send({
                emoji: ':squid:',
                messageId: message._id,
                shouldReact: false,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return statusCode: 200 when react a message with flag, shouldReact: true', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.react'))
                .set(api_data_1.credentials)
                .send({
                emoji: ':squid:',
                messageId: message._id,
                shouldReact: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return statusCode: 200 when the emoji is valid and has no colons', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.react'))
                .set(api_data_1.credentials)
                .send({
                emoji: 'bee',
                messageId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return statusCode: 200 for reaction property when the emoji is valid', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.react'))
                .set(api_data_1.credentials)
                .send({
                reaction: 'ant',
                messageId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/chat.getMessageReadReceipts]', () => {
        const isEnterprise = typeof process.env.IS_EE === 'string' ? process.env.IS_EE === 'true' : !!process.env.IS_EE;
        (0, mocha_1.describe)('when execute successfully', () => {
            (0, mocha_1.it)('should return statusCode: 200 and an array of receipts when running EE', function (done) {
                if (!isEnterprise) {
                    this.skip();
                }
                void api_data_1.request
                    .get((0, api_data_1.api)(`chat.getMessageReadReceipts`))
                    .set(api_data_1.credentials)
                    .query({
                    messageId: message._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('receipts').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
        });
        (0, mocha_1.describe)('when an error occurs', () => {
            (0, mocha_1.it)('should throw error-action-not-allowed error when not running EE', function (done) {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (isEnterprise) {
                    this.skip();
                }
                void api_data_1.request
                    .get((0, api_data_1.api)(`chat.getMessageReadReceipts`))
                    .set(api_data_1.credentials)
                    .query({
                    messageId: message._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'This is an enterprise feature [error-action-not-allowed]');
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-action-not-allowed');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return statusCode: 400 and an error when no messageId is provided', function (done) {
                if (!isEnterprise) {
                    this.skip();
                }
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getMessageReadReceipts'))
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).not.have.property('receipts');
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.reportMessage]', () => {
        (0, mocha_1.describe)('when execute successfully', () => {
            (0, mocha_1.it)('should return the statusCode 200', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.reportMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: message._id,
                    description: 'test',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
        });
        (0, mocha_1.describe)('when an error occurs', () => {
            (0, mocha_1.it)('should return statusCode 400 and an error', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.reportMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: message._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.getDeletedMessages]', () => {
        let roomId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            roomId = (yield (0, rooms_helper_1.createRoom)({
                type: 'c',
                name: `channel.test.${Date.now()}`,
            })).body.channel._id;
            const msgId = (yield (0, chat_helper_1.sendSimpleMessage)({ roomId })).body.message._id;
            yield (0, chat_helper_1.deleteMessage)({ roomId, msgId });
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId }));
        (0, mocha_1.describe)('when execute successfully', () => {
            (0, mocha_1.it)('should return a list of deleted messages', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getDeletedMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId,
                    since: new Date('20 December 2018 17:51 UTC').toISOString(),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.messages.length).to.be.equal(1);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return a list of deleted messages when the user sets count query parameter', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getDeletedMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId,
                    since: new Date('20 December 2018 17:51 UTC').toISOString(),
                    count: 1,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.messages.length).to.be.equal(1);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return a list of deleted messages when the user sets count and offset query parameters', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getDeletedMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId,
                    since: new Date('20 December 2018 17:51 UTC').toISOString(),
                    count: 1,
                    offset: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.messages.length).to.be.equal(1);
                })
                    .end(done);
            });
        });
        (0, mocha_1.describe)('when an error occurs', () => {
            (0, mocha_1.it)('should return statusCode 400 and an error when "roomId" is not provided', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getDeletedMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    since: new Date('20 December 2018 17:51 UTC').toISOString(),
                    count: 1,
                    offset: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('The required "roomId" query param is missing.');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return statusCode 400 and an error when "since" is not provided', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getDeletedMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId,
                    count: 1,
                    offset: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('The required "since" query param is missing.');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return statusCode 400 and an error when "since" is provided but it is invalid ISODate', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getDeletedMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId,
                    since: 'InvalidaDate',
                    count: 1,
                    offset: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('The "since" query parameter must be a valid date.');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.pinMessage]', () => {
        (0, mocha_1.after)(() => Promise.all([(0, permissions_helper_1.updateSetting)('Message_AllowPinning', true), (0, permissions_helper_1.updatePermission)('pin-message', ['owner', 'moderator', 'admin'])]));
        (0, mocha_1.it)('should return an error when pinMessage is not allowed in this server', (done) => {
            void (0, permissions_helper_1.updateSetting)('Message_AllowPinning', false).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.pinMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: message._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when pinMessage is allowed in server but user dont have permission', (done) => {
            void (0, permissions_helper_1.updateSetting)('Message_AllowPinning', true).then(() => {
                void (0, permissions_helper_1.updatePermission)('pin-message', []).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('chat.pinMessage'))
                        .set(api_data_1.credentials)
                        .send({
                        messageId: message._id,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body).to.have.property('error');
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should return an error when messageId does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.pinMessage'))
                .set(api_data_1.credentials)
                .send({
                messageId: 'test',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
        }));
        (0, mocha_1.it)('should pin Message successfully', (done) => {
            void (0, permissions_helper_1.updatePermission)('pin-message', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.pinMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: message._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.not.have.property('error');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return message when its already pinned', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.pinMessage'))
                .set(api_data_1.credentials)
                .send({
                messageId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.not.have.property('error');
            });
        }));
    });
    (0, mocha_1.describe)('[/chat.unPinMessage]', () => {
        (0, mocha_1.after)(() => Promise.all([(0, permissions_helper_1.updateSetting)('Message_AllowPinning', true), (0, permissions_helper_1.updatePermission)('pin-message', ['owner', 'moderator', 'admin'])]));
        (0, mocha_1.it)('should return an error when pinMessage is not allowed in this server', (done) => {
            void (0, permissions_helper_1.updateSetting)('Message_AllowPinning', false).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.unPinMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: message._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when pinMessage is allowed in server but users dont have permission', (done) => {
            void (0, permissions_helper_1.updateSetting)('Message_AllowPinning', true).then(() => {
                void (0, permissions_helper_1.updatePermission)('pin-message', []).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('chat.unPinMessage'))
                        .set(api_data_1.credentials)
                        .send({
                        messageId: message._id,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body).to.have.property('error');
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should unpin Message successfully', (done) => {
            void (0, permissions_helper_1.updatePermission)('pin-message', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.unPinMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: message._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.not.have.property('error');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.unStarMessage]', () => {
        (0, mocha_1.after)(() => (0, permissions_helper_1.updateSetting)('Message_AllowStarring', true));
        (0, mocha_1.it)('should return an error when starMessage is not allowed in this server', (done) => {
            void (0, permissions_helper_1.updateSetting)('Message_AllowStarring', false).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.unStarMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: message._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should unstar Message successfully', (done) => {
            void (0, permissions_helper_1.updateSetting)('Message_AllowStarring', true).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.unStarMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: message._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.not.have.property('error');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.starMessage]', () => {
        (0, mocha_1.after)(() => (0, permissions_helper_1.updateSetting)('Message_AllowStarring', true));
        (0, mocha_1.it)('should return an error when starMessage is not allowed in this server', (done) => {
            void (0, permissions_helper_1.updateSetting)('Message_AllowStarring', false).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.starMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: message._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should star Message successfully', (done) => {
            void (0, permissions_helper_1.updateSetting)('Message_AllowStarring', true).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.starMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: message._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.not.have.property('error');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.ignoreUser]', () => {
        let user;
        let testDM;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            yield api_data_1.request
                .post((0, api_data_1.api)('im.create'))
                .set(api_data_1.credentials)
                .send({
                username: user.username,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                testDM = res.body.room;
            });
        }));
        (0, mocha_1.after)(() => Promise.all([(0, rooms_helper_1.deleteRoom)({ type: 'd', roomId: testDM.rid }), (0, users_helper_1.deleteUser)(user)]));
        (0, mocha_1.it)('should fail if invalid roomId', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.ignoreUser'))
                .set(api_data_1.credentials)
                .query({
                rid: 'invalid',
                userId: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-subscription');
            })
                .end(() => {
                done();
            });
        });
        (0, mocha_1.it)('should fail if invalid userId', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.ignoreUser'))
                .set(api_data_1.credentials)
                .query({
                rid: testDM.rid,
                userId: 'invalid',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-subscription');
            })
                .end(() => {
                done();
            });
        });
        (0, mocha_1.it)('should successfully ignore user', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.ignoreUser'))
                .set(api_data_1.credentials)
                .query({
                rid: testDM.rid,
                userId: user._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(() => {
                done();
            });
        });
        (0, mocha_1.it)('should successfully unignore user', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.ignoreUser'))
                .set(api_data_1.credentials)
                .query({
                rid: testDM.rid,
                userId: user._id,
                ignore: false,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(() => {
                done();
            });
        });
    });
    (0, mocha_1.describe)('[/chat.getPinnedMessages]', () => {
        let roomId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            roomId = (yield (0, rooms_helper_1.createRoom)({
                type: 'c',
                name: `channel.test.${Date.now()}`,
            })).body.channel._id;
            const msgId = (yield (0, chat_helper_1.sendSimpleMessage)({ roomId })).body.message._id;
            yield pinMessage({ msgId });
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId }));
        (0, mocha_1.describe)('when execute successfully', () => {
            (0, mocha_1.it)('should return a list of pinned messages', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getPinnedMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.messages.length).to.be.equal(1);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return a list of pinned messages when the user sets count query parameter', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getPinnedMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId,
                    count: 1,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.messages.length).to.be.equal(1);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return a list of pinned messages when the user sets count and offset query parameters', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getPinnedMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId,
                    count: 1,
                    offset: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.messages.length).to.be.equal(1);
                })
                    .end(done);
            });
        });
        (0, mocha_1.describe)('when an error occurs', () => {
            (0, mocha_1.it)('should return statusCode 400 and an error when "roomId" is not provided', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getPinnedMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    count: 1,
                    offset: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-roomId-param-not-provided');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.getMentionedMessages]', () => {
        let testChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({
                type: 'c',
                name: `channel.test.${Date.now()}`,
            })).body.channel;
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
        (0, mocha_1.it)('should return an error when the required "roomId" parameter is not sent', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.getMentionedMessages'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-invalid-params');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the roomId is invalid', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.getMentionedMessages'))
                .query({ roomId: 'invalid-room' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('error-not-allowed');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the mentioned messages', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.getMentionedMessages'))
                .query({ roomId: testChannel._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.messages).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/chat.getStarredMessages]', () => {
        let testChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({
                type: 'c',
                name: `channel.test.${Date.now()}`,
            })).body.channel;
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
        (0, mocha_1.it)('should return an error when the required "roomId" parameter is not sent', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.getStarredMessages'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-invalid-params');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the roomId is invalid', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.getStarredMessages'))
                .query({ roomId: 'invalid-room' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('error-not-allowed');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the starred messages', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.getStarredMessages'))
                .query({ roomId: testChannel._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.messages).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/chat.getDiscussions]', () => {
        const messageText = 'Message to create discussion';
        let testChannel;
        let discussionRoom;
        const messageWords = [
            ...messageText.split(' '),
            ...messageText.toUpperCase().split(' '),
            ...messageText.toLowerCase().split(' '),
            messageText,
            messageText.charAt(0),
            ' ',
        ];
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.getDiscussions.${Date.now()}` })).body.channel;
            discussionRoom = (yield api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testChannel._id,
                t_name: 'Message to create discussion',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)).body.discussion;
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
        (0, mocha_1.it)('should return an error when the required "roomId" parameter is not sent', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.getDiscussions'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-invalid-params');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the roomId is invalid', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.getDiscussions'))
                .query({ roomId: 'invalid-room' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('error-not-allowed');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the discussions of a room', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.getDiscussions'))
                .query({ roomId: testChannel._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.messages).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the discussions of a room even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.getDiscussions'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.messages).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
        function filterDiscussionsByText(text) {
            (0, mocha_1.it)(`should return the room's discussion list filtered by the text '${text}'`, (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getDiscussions'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId: testChannel._id,
                    text,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                    (0, chai_1.expect)(res.body.messages).to.have.lengthOf(1);
                    (0, chai_1.expect)(res.body.messages[0].drid).to.be.equal(discussionRoom.rid);
                })
                    .end(done);
            });
            (0, mocha_1.it)(`should return the room's discussion list filtered by the text '${text}' even requested with count and offset params`, (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getDiscussions'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId: testChannel._id,
                    text,
                    count: 5,
                    offset: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                    (0, chai_1.expect)(res.body.messages).to.have.lengthOf(1);
                    (0, chai_1.expect)(res.body.messages[0].drid).to.be.equal(discussionRoom.rid);
                })
                    .end(done);
            });
        }
        messageWords.forEach((text) => {
            filterDiscussionsByText(text);
        });
    });
    (0, mocha_1.describe)('[/chat.syncMessages]', () => {
        let testChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.syncMessages.${Date.now()}` })).body.channel;
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
        (0, mocha_1.it)('should return an error when the required "roomId" parameter is not sent', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
                (0, chai_1.expect)(res.body.error).to.include(`must have required property 'roomId'`);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the neither "lastUpdate" or "type" parameter is sent', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: testChannel._id })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-param-required');
                (0, chai_1.expect)(res.body.error).to.include('The "type" or "lastUpdate" parameters must be provided');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the "lastUpdate" parameter is invalid', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: 'invalid-room', lastUpdate: 'invalid-date' })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-lastUpdate-param-invalid');
                (0, chai_1.expect)(res.body.error).to.include('The "lastUpdate" query parameter must be a valid date');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when user provides an invalid roomId', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: 'invalid-room', lastUpdate: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-not-allowed');
                (0, chai_1.expect)(res.body.error).to.include('Not allowed');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the "type" parameter is not supported', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: testChannel._id, type: 'invalid-type', next: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
                (0, chai_1.expect)(res.body.error).to.include('must be equal to one of the allowed values');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the "next" or "previous" parameter is sent without the "type" parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            const nextResponse = yield api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: testChannel._id, next: new Date().toISOString() });
            const previousResponse = yield api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: testChannel._id, previous: new Date().toISOString() });
            (0, chai_1.expect)(nextResponse.statusCode).to.equal(400);
            (0, chai_1.expect)(nextResponse.body).to.have.property('success', false);
            (0, chai_1.expect)(nextResponse.body.errorType).to.be.equal('error-param-required');
            (0, chai_1.expect)(nextResponse.body.error).to.include('The "type" or "lastUpdate" parameters must be provided');
            (0, chai_1.expect)(previousResponse.statusCode).to.equal(400);
            (0, chai_1.expect)(previousResponse.body).to.have.property('success', false);
            (0, chai_1.expect)(previousResponse.body.errorType).to.be.equal('error-param-required');
            (0, chai_1.expect)(previousResponse.body.error).to.include('The "type" or "lastUpdate" parameters must be provided');
        }));
        (0, mocha_1.it)('should return an error when both "next" and "previous" are sent', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: testChannel._id, type: 'UPDATED', next: new Date().toISOString(), previous: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-cursor-conflict');
                (0, chai_1.expect)(res.body.error).to.include('You cannot provide both "next" and "previous" parameters');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when both "next" or "previous" and "lastUpdate" are sent', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: testChannel._id, type: 'UPDATED', next: new Date().toISOString(), lastUpdate: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-cursor-and-lastUpdate-conflict');
                (0, chai_1.expect)(res.body.error).to.include('The attributes "next", "previous" and "lastUpdate" cannot be used together');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when neither "type" or "lastUpdate" are sent', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: testChannel._id })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-param-required');
                (0, chai_1.expect)(res.body.error).to.include('The "type" or "lastUpdate" parameters must be provided');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an empty response when there are no messages to sync', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: testChannel._id, lastUpdate: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.result).to.have.property('updated').and.to.be.an('array');
                (0, chai_1.expect)(res.body.result).to.have.property('deleted').and.to.be.an('array');
                (0, chai_1.expect)(res.body.result.updated).to.have.lengthOf(0);
                (0, chai_1.expect)(res.body.result.deleted).to.have.lengthOf(0);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return all updated and deleted messages since "lastUpdate" parameter date', () => __awaiter(void 0, void 0, void 0, function* () {
            const lastUpdate = new Date().toISOString();
            // Create two messages isolated to avoid ts conflict
            const firstMessage = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: testChannel._id, text: 'First Message' });
            const secondMessage = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: testChannel._id, text: 'Second Message' });
            const response = yield api_data_1.request.get((0, api_data_1.api)('chat.syncMessages')).set(api_data_1.credentials).query({ roomId: testChannel._id, lastUpdate });
            (0, chai_1.expect)(response.body.result.updated).to.have.lengthOf(2);
            (0, chai_1.expect)(response.body.result.updated[0]._id).to.be.equal(secondMessage.body.message._id);
            (0, chai_1.expect)(response.body.result.updated[1]._id).to.be.equal(firstMessage.body.message._id);
            (0, chai_1.expect)(response.body.result.deleted).to.have.lengthOf(0);
            yield (0, chat_helper_1.deleteMessage)({ roomId: testChannel._id, msgId: firstMessage.body.message._id });
            const responseAfterDelete = yield api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: testChannel._id, lastUpdate });
            (0, chai_1.expect)(responseAfterDelete.body.result.updated).to.have.lengthOf(1);
            (0, chai_1.expect)(responseAfterDelete.body.result.updated[0]._id).to.be.equal(secondMessage.body.message._id);
            (0, chai_1.expect)(responseAfterDelete.body.result.deleted).to.have.lengthOf(1);
            (0, chai_1.expect)(responseAfterDelete.body.result.deleted[0]._id).to.be.equal(firstMessage.body.message._id);
            yield (0, chat_helper_1.deleteMessage)({ roomId: testChannel._id, msgId: secondMessage.body.message._id });
        }));
        (0, mocha_1.it)('should return all updated messages with a cursor when "type" parameter is "UPDATED"', () => __awaiter(void 0, void 0, void 0, function* () {
            const lastUpdate = new Date();
            const firstMessage = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: testChannel._id, text: 'First Message' });
            const secondMessage = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: testChannel._id, text: 'Second Message' });
            const thirdMessage = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: testChannel._id, text: 'Third Message' });
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                next: new Date(lastUpdate).getTime().toString(),
                type: 'UPDATED',
                count: 2,
            });
            (0, chai_1.expect)(response.body.result.updated).to.have.lengthOf(2);
            (0, chai_1.expect)(response.body.result.updated[0]._id).to.be.equal(firstMessage.body.message._id);
            (0, chai_1.expect)(response.body.result.updated[1]._id).to.be.equal(secondMessage.body.message._id);
            (0, chai_1.expect)(response.body.result.cursor)
                .to.have.property('next')
                .and.to.equal(new Date(response.body.result.updated[response.body.result.updated.length - 1]._updatedAt).getTime().toString());
            (0, chai_1.expect)(response.body.result.cursor)
                .to.have.property('previous')
                .and.to.equal(new Date(response.body.result.updated[0]._updatedAt).getTime().toString());
            (0, chai_1.expect)(response.body.result.cursor)
                .to.have.property('previous')
                .and.to.equal(new Date(firstMessage.body.message._updatedAt).getTime().toString());
            const responseWithNext = yield api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: testChannel._id, next: response.body.result.cursor.next, type: 'UPDATED', count: 2 });
            (0, chai_1.expect)(responseWithNext.body.result.updated).to.have.lengthOf(1);
            (0, chai_1.expect)(responseWithNext.body.result.updated[0]._id).to.be.equal(thirdMessage.body.message._id);
            (0, chai_1.expect)(responseWithNext.body.result.cursor).to.have.property('next').and.to.be.null;
            (0, chai_1.expect)(responseWithNext.body.result.cursor)
                .to.have.property('previous')
                .and.to.equal(new Date(thirdMessage.body.message._updatedAt).getTime().toString());
            yield Promise.all([
                (0, chat_helper_1.deleteMessage)({ roomId: testChannel._id, msgId: firstMessage.body.message._id }),
                (0, chat_helper_1.deleteMessage)({ roomId: testChannel._id, msgId: secondMessage.body.message._id }),
                (0, chat_helper_1.deleteMessage)({ roomId: testChannel._id, msgId: thirdMessage.body.message._id }),
            ]);
        }));
        (0, mocha_1.it)('should return all deleted messages with a cursor when "type" parameter is "DELETED"', () => __awaiter(void 0, void 0, void 0, function* () {
            const newChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.syncMessages.${Date.now()}` })).body.channel;
            const lastUpdate = new Date();
            const firstMessage = (yield (0, chat_helper_1.sendSimpleMessage)({ roomId: newChannel._id, text: 'First Message' })).body.message;
            const secondMessage = (yield (0, chat_helper_1.sendSimpleMessage)({ roomId: newChannel._id, text: 'Second Message' })).body.message;
            const thirdMessage = (yield (0, chat_helper_1.sendSimpleMessage)({ roomId: newChannel._id, text: 'Third Message' })).body.message;
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: newChannel._id, next: lastUpdate.getTime().toString(), type: 'DELETED', count: 2 });
            (0, chai_1.expect)(response.body.result.deleted).to.have.lengthOf(0);
            (0, chai_1.expect)(response.body.result.cursor).to.have.property('next').and.to.be.null;
            (0, chai_1.expect)(response.body.result.cursor).to.have.property('previous').and.to.be.null;
            const firstDeletedMessage = (yield (0, chat_helper_1.deleteMessage)({ roomId: newChannel._id, msgId: firstMessage._id })).body.message;
            const secondDeletedMessage = (yield (0, chat_helper_1.deleteMessage)({ roomId: newChannel._id, msgId: secondMessage._id })).body.message;
            const thirdDeletedMessage = (yield (0, chat_helper_1.deleteMessage)({ roomId: newChannel._id, msgId: thirdMessage._id })).body.message;
            const responseAfterDelete = yield api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: newChannel._id, next: lastUpdate.getTime().toString(), type: 'DELETED', count: 2 });
            (0, chai_1.expect)(responseAfterDelete.body.result.deleted).to.have.lengthOf(2);
            (0, chai_1.expect)(responseAfterDelete.body.result.deleted[0]._id).to.be.equal(firstDeletedMessage._id);
            (0, chai_1.expect)(responseAfterDelete.body.result.deleted[1]._id).to.be.equal(secondDeletedMessage._id);
            (0, chai_1.expect)(responseAfterDelete.body.result.cursor)
                .to.have.property('next')
                .and.to.equal(new Date(responseAfterDelete.body.result.deleted[responseAfterDelete.body.result.deleted.length - 1]._deletedAt)
                .getTime()
                .toString());
            (0, chai_1.expect)(responseAfterDelete.body.result.cursor)
                .to.have.property('previous')
                .and.to.equal(new Date(responseAfterDelete.body.result.deleted[0]._deletedAt).getTime().toString());
            const responseAfterDeleteWithPrevious = yield api_data_1.request
                .get((0, api_data_1.api)('chat.syncMessages'))
                .set(api_data_1.credentials)
                .query({ roomId: newChannel._id, next: responseAfterDelete.body.result.cursor.next, type: 'DELETED', count: 2 });
            (0, chai_1.expect)(responseAfterDeleteWithPrevious.body.result.deleted).to.have.lengthOf(1);
            (0, chai_1.expect)(responseAfterDeleteWithPrevious.body.result.deleted[0]._id).to.be.equal(thirdDeletedMessage._id);
            (0, chai_1.expect)(responseAfterDeleteWithPrevious.body.result.cursor).to.have.property('next').and.to.be.null;
            (0, chai_1.expect)(responseAfterDeleteWithPrevious.body.result.cursor)
                .to.have.property('previous')
                .and.to.equal(new Date(responseAfterDeleteWithPrevious.body.result.deleted[0]._deletedAt).getTime().toString());
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: newChannel._id });
        }));
    });
});
(0, mocha_1.describe)('Threads', () => {
    let testThreadChannel;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testThreadChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `chat.api-test-${Date.now()}` })).body.channel;
        yield (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']);
    }));
    (0, mocha_1.after)(() => Promise.all([
        (0, permissions_helper_1.updateSetting)('Threads_enabled', true),
        (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']),
        (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testThreadChannel._id }),
    ]));
    (0, mocha_1.describe)('[/chat.getThreadsList]', () => {
        const messageText = 'Message to create thread';
        let testChannel;
        let threadMessage;
        let user;
        const messageWords = [
            ...messageText.split(' '),
            ...messageText.toUpperCase().split(' '),
            ...messageText.toLowerCase().split(' '),
            messageText,
            messageText.charAt(0),
            ' ',
        ];
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.threads.${Date.now()}` })).body.channel;
            const { message } = (yield api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    rid: testChannel._id,
                    msg: 'Message to create thread',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)).body;
            threadMessage = (yield api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    rid: testChannel._id,
                    msg: 'Thread message',
                    tmid: message._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)).body.message;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, permissions_helper_1.updateSetting)('Threads_enabled', true),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']),
            (0, users_helper_1.deleteUser)(user),
        ]));
        (0, mocha_1.it)('should return an error for chat.getThreadsList when threads are not allowed in this server', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', false).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getThreadsList'))
                    .set(api_data_1.credentials)
                    .query({
                    rid: testChannel._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'Threads Disabled [error-not-allowed]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user is not allowed access the room', (done) => {
            void (0, users_helper_1.createUser)().then((createdUser) => {
                user = createdUser;
                void (0, users_helper_1.login)(createdUser.username, user_1.password).then((userCredentials) => {
                    void (0, permissions_helper_1.updateSetting)('Threads_enabled', true).then(() => {
                        void (0, permissions_helper_1.updatePermission)('view-c-room', []).then(() => {
                            void api_data_1.request
                                .get((0, api_data_1.api)('chat.getThreadsList'))
                                .set(userCredentials)
                                .query({
                                rid: testChannel._id,
                            })
                                .expect('Content-Type', 'application/json')
                                .expect(400)
                                .expect((res) => {
                                (0, chai_1.expect)(res.body).to.have.property('success', false);
                                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                                (0, chai_1.expect)(res.body).to.have.property('error', 'Not Allowed [error-not-allowed]');
                            })
                                .end(done);
                        });
                    });
                });
            });
        });
        (0, mocha_1.it)("should return the room's thread list", (done) => {
            void (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getThreadsList'))
                    .set(api_data_1.credentials)
                    .query({
                    rid: testChannel._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('threads').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                    (0, chai_1.expect)(res.body.threads).to.have.lengthOf(1);
                    (0, chai_1.expect)(res.body.threads[0]._id).to.be.equal(threadMessage.tmid);
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)("should fail returning a room's thread list if no roomId is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user']);
            return api_data_1.request
                .get((0, api_data_1.api)('chat.getThreadsList'))
                .set(api_data_1.credentials)
                .query({})
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)("should fail returning a room's thread list if an invalid type is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('chat.getThreadsList'))
                .set(api_data_1.credentials)
                .query({
                rid: testChannel._id,
                type: 'invalid-type',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)("should return the room's thread list", () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('chat.getThreadsList'))
                .set(api_data_1.credentials)
                .query({
                rid: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('threads').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.threads).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.threads[0]._id).to.be.equal(threadMessage.tmid);
            });
        }));
        (0, mocha_1.it)("should return the room's thread list even requested with count and offset params", (done) => {
            void (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getThreadsList'))
                    .set(api_data_1.credentials)
                    .query({
                    rid: testChannel._id,
                    count: 5,
                    offset: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('threads').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                    (0, chai_1.expect)(res.body.threads).to.have.lengthOf(1);
                    (0, chai_1.expect)(res.body.threads[0]._id).to.be.equal(threadMessage.tmid);
                })
                    .end(done);
            });
        });
        function filterThreadsByText(text) {
            (0, mocha_1.it)(`should return the room's thread list filtered by the text '${text}'`, (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getThreadsList'))
                    .set(api_data_1.credentials)
                    .query({
                    rid: testChannel._id,
                    text,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('threads').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                    (0, chai_1.expect)(res.body.threads).to.have.lengthOf(1);
                    (0, chai_1.expect)(res.body.threads[0]._id).to.be.equal(threadMessage.tmid);
                })
                    .end(done);
            });
            (0, mocha_1.it)(`should return the room's thread list filtered by the text '${text}' even requested with count and offset params`, (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getThreadsList'))
                    .set(api_data_1.credentials)
                    .query({
                    rid: testChannel._id,
                    text,
                    count: 5,
                    offset: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('threads').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                    (0, chai_1.expect)(res.body.threads).to.have.lengthOf(1);
                    (0, chai_1.expect)(res.body.threads[0]._id).to.be.equal(threadMessage.tmid);
                })
                    .end(done);
            });
        }
        messageWords.forEach((text) => {
            filterThreadsByText(text);
        });
        (0, mocha_1.it)('should return an empty thread list', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getThreadsList'))
                    .set(api_data_1.credentials)
                    .query({
                    rid: testChannel._id,
                    text: 'missing',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('threads').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                    (0, chai_1.expect)(res.body.threads).to.have.lengthOf(0);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.syncThreadsList]', () => {
        let testChannel;
        let threadMessage;
        let user;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `.threads.sync.${Date.now()}` })).body.channel;
            const { body: { message } = {} } = yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Message to create thread',
            });
            threadMessage = (yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Thread Message',
                tmid: message._id,
            })).body.message;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, permissions_helper_1.updateSetting)('Threads_enabled', true),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']),
            (0, users_helper_1.deleteUser)(user),
        ]));
        (0, mocha_1.it)('should return an error for chat.getThreadsList when threads are not allowed in this server', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', false).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getThreadsList'))
                    .set(api_data_1.credentials)
                    .query({
                    rid: testChannel._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'Threads Disabled [error-not-allowed]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the required param "rid" is missing', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', true).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.syncThreadsList'))
                    .set(api_data_1.credentials)
                    .query({})
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-room-id-param-not-provided');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'The required "rid" query param is missing. [error-room-id-param-not-provided]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the required param "updatedSince" is missing', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', true).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.syncThreadsList'))
                    .set(api_data_1.credentials)
                    .query({
                    rid: testChannel._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-updatedSince-param-invalid');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'The required param "updatedSince" is missing. [error-updatedSince-param-invalid]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the param "updatedSince" is an invalid date', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', true).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.syncThreadsList'))
                    .set(api_data_1.credentials)
                    .query({
                    rid: testChannel._id,
                    updatedSince: 'invalid-date',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-updatedSince-param-invalid');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'The "updatedSince" query parameter must be a valid date. [error-updatedSince-param-invalid]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user is not allowed access the room', (done) => {
            void (0, users_helper_1.createUser)().then((createdUser) => {
                user = createdUser;
                void (0, users_helper_1.login)(createdUser.username, user_1.password).then((userCredentials) => {
                    void (0, permissions_helper_1.updatePermission)('view-c-room', []).then(() => {
                        void api_data_1.request
                            .get((0, api_data_1.api)('chat.syncThreadsList'))
                            .set(userCredentials)
                            .query({
                            rid: testChannel._id,
                            updatedSince: new Date().toISOString(),
                        })
                            .expect('Content-Type', 'application/json')
                            .expect(400)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', false);
                            (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                            (0, chai_1.expect)(res.body).to.have.property('error', 'Not Allowed [error-not-allowed]');
                        })
                            .end(done);
                    });
                });
            });
        });
        (0, mocha_1.it)("should return the room's thread synced list", (done) => {
            void (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.syncThreadsList'))
                    .set(api_data_1.credentials)
                    .query({
                    rid: testChannel._id,
                    updatedSince: new Date('2019-04-01').toISOString(),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('threads').and.to.be.an('object');
                    (0, chai_1.expect)(res.body.threads).to.have.property('update').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.threads).to.have.property('remove').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.threads.update).to.have.lengthOf(1);
                    (0, chai_1.expect)(res.body.threads.remove).to.have.lengthOf(0);
                    (0, chai_1.expect)(res.body.threads.update[0]._id).to.be.equal(threadMessage.tmid);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.getThreadMessages]', () => {
        let testChannel;
        let threadMessage;
        let createdThreadMessage;
        let user;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.threads.${Date.now()}` })).body.channel;
            createdThreadMessage = (yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Message to create thread',
            })).body.message;
            threadMessage = (yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Thread Message',
                tmid: createdThreadMessage._id,
            })).body.message;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, permissions_helper_1.updateSetting)('Threads_enabled', true),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']),
            (0, users_helper_1.deleteUser)(user),
        ]));
        (0, mocha_1.it)('should return an error for chat.getThreadMessages when threads are not allowed in this server', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', false).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getThreadMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    tmid: threadMessage.tmid,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'Threads Disabled [error-not-allowed]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user is not allowed access the room', (done) => {
            void (0, users_helper_1.createUser)().then((createdUser) => {
                user = createdUser;
                void (0, users_helper_1.login)(createdUser.username, user_1.password).then((userCredentials) => {
                    void (0, permissions_helper_1.updateSetting)('Threads_enabled', true).then(() => {
                        void (0, permissions_helper_1.updatePermission)('view-c-room', []).then(() => {
                            void api_data_1.request
                                .get((0, api_data_1.api)('chat.getThreadMessages'))
                                .set(userCredentials)
                                .query({
                                tmid: threadMessage.tmid,
                            })
                                .expect('Content-Type', 'application/json')
                                .expect(400)
                                .expect((res) => {
                                (0, chai_1.expect)(res.body).to.have.property('success', false);
                                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                                (0, chai_1.expect)(res.body).to.have.property('error', 'Not Allowed [error-not-allowed]');
                            })
                                .end(done);
                        });
                    });
                });
            });
        });
        (0, mocha_1.it)("should return the thread's message list", (done) => {
            void (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getThreadMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    tmid: threadMessage.tmid,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('total').and.to.be.equal(1);
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                    (0, chai_1.expect)(res.body.messages).to.have.lengthOf(1);
                    (0, chai_1.expect)(res.body.messages[0].tmid).to.be.equal(createdThreadMessage._id);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.syncThreadMessages]', () => {
        let testChannel;
        let threadMessage;
        let createdThreadMessage;
        let user;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `message.threads.${Date.now()}` })).body.channel;
            createdThreadMessage = (yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Message to create thread',
            })).body.message;
            threadMessage = (yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Thread Message',
                tmid: createdThreadMessage._id,
            })).body.message;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, permissions_helper_1.updateSetting)('Threads_enabled', true),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']),
            (0, users_helper_1.deleteUser)(user),
        ]));
        (0, mocha_1.it)('should return an error for chat.syncThreadMessages when threads are not allowed in this server', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', false).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.syncThreadMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    tmid: threadMessage.tmid,
                    updatedSince: 'updatedSince',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'Threads Disabled [error-not-allowed]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the required param "tmid" is missing', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', true).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.syncThreadMessages'))
                    .set(api_data_1.credentials)
                    .query({})
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-params');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'The required "tmid" query param is missing. [error-invalid-params]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the required param "updatedSince" is missing', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', true).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.syncThreadMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    tmid: threadMessage.tmid,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-updatedSince-param-invalid');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'The required param "updatedSince" is missing. [error-updatedSince-param-invalid]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the param "updatedSince" is an invalid date', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', true).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.syncThreadMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    tmid: threadMessage.tmid,
                    updatedSince: 'invalid-date',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-updatedSince-param-invalid');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'The "updatedSince" query parameter must be a valid date. [error-updatedSince-param-invalid]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user is not allowed access the room', (done) => {
            void (0, users_helper_1.createUser)().then((createdUser) => {
                user = createdUser;
                void (0, users_helper_1.login)(createdUser.username, user_1.password).then((userCredentials) => {
                    void (0, permissions_helper_1.updatePermission)('view-c-room', []).then(() => {
                        void api_data_1.request
                            .get((0, api_data_1.api)('chat.syncThreadMessages'))
                            .set(userCredentials)
                            .query({
                            tmid: threadMessage.tmid,
                            updatedSince: new Date().toISOString(),
                        })
                            .expect('Content-Type', 'application/json')
                            .expect(400)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', false);
                            (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                            (0, chai_1.expect)(res.body).to.have.property('error', 'Not Allowed [error-not-allowed]');
                        })
                            .end(done);
                    });
                });
            });
        });
        (0, mocha_1.it)("should return the thread's message list", (done) => {
            void (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.syncThreadMessages'))
                    .set(api_data_1.credentials)
                    .query({
                    tmid: threadMessage.tmid,
                    updatedSince: new Date('2019-04-01').toISOString(),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('object');
                    (0, chai_1.expect)(res.body.messages).to.have.property('update').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.messages).to.have.property('remove').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.messages.update).to.have.lengthOf(1);
                    (0, chai_1.expect)(res.body.messages.remove).to.have.lengthOf(0);
                    (0, chai_1.expect)(res.body.messages.update[0].id).to.be.equal(createdThreadMessage.tmid);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.followMessage]', () => {
        let testChannel;
        let threadMessage;
        let user;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.threads.follow${Date.now()}` })).body.channel;
            const { body: { message } = {} } = yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Message to create thread',
            });
            threadMessage = (yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Thread Message',
                tmid: message._id,
            })).body.message;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, permissions_helper_1.updateSetting)('Threads_enabled', true),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']),
            (0, users_helper_1.deleteUser)(user),
        ]));
        (0, mocha_1.it)('should return an error for chat.followMessage when threads are not allowed in this server', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', false).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.followMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    mid: threadMessage.tmid,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'not-allowed [error-not-allowed]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the message does not exist', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', true).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.followMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    mid: 'invalid-message-id',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-message');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'Invalid message [error-invalid-message]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user is not allowed access the room', (done) => {
            void (0, users_helper_1.createUser)().then((createdUser) => {
                user = createdUser;
                void (0, users_helper_1.login)(createdUser.username, user_1.password).then((userCredentials) => {
                    void (0, permissions_helper_1.updatePermission)('view-c-room', []).then(() => {
                        void api_data_1.request
                            .post((0, api_data_1.api)('chat.followMessage'))
                            .set(userCredentials)
                            .send({
                            mid: threadMessage.tmid,
                        })
                            .expect('Content-Type', 'application/json')
                            .expect(400)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', false);
                            (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                            (0, chai_1.expect)(res.body).to.have.property('error', 'not-allowed [error-not-allowed]');
                        })
                            .end(done);
                    });
                });
            });
        });
        (0, mocha_1.it)('should return success: true when it execute successfully', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.followMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    mid: threadMessage.tmid,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.unfollowMessage]', () => {
        let testChannel;
        let threadMessage;
        let user;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.threads.unfollow.${Date.now()}` })).body.channel;
            const { body: { message } = {} } = yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Message to create thread',
            });
            threadMessage = (yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Thread Message',
                tmid: message._id,
            })).body.message;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, permissions_helper_1.updateSetting)('Threads_enabled', true),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']),
            (0, users_helper_1.deleteUser)(user),
        ]));
        (0, mocha_1.it)('should return an error for chat.unfollowMessage when threads are not allowed in this server', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', false).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.unfollowMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    mid: threadMessage.tmid,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'not-allowed [error-not-allowed]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the message does not exist', (done) => {
            void (0, permissions_helper_1.updateSetting)('Threads_enabled', true).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.unfollowMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    mid: 'invalid-message-id',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-message');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'Invalid message [error-invalid-message]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user is not allowed access the room', (done) => {
            void (0, users_helper_1.createUser)().then((createdUser) => {
                user = createdUser;
                void (0, users_helper_1.login)(createdUser.username, user_1.password).then((userCredentials) => {
                    void (0, permissions_helper_1.updatePermission)('view-c-room', []).then(() => {
                        void api_data_1.request
                            .post((0, api_data_1.api)('chat.unfollowMessage'))
                            .set(userCredentials)
                            .send({
                            mid: threadMessage.tmid,
                        })
                            .expect('Content-Type', 'application/json')
                            .expect(400)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', false);
                            (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
                            (0, chai_1.expect)(res.body).to.have.property('error', 'not-allowed [error-not-allowed]');
                        })
                            .end(done);
                    });
                });
            });
        });
        (0, mocha_1.it)('should return success: true when it execute successfully', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('chat.unfollowMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    mid: threadMessage.tmid,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/chat.getURLPreview]', () => {
        const url = 'https://www.youtube.com/watch?v=no050HN4ojo';
        (0, mocha_1.it)('should return the URL preview with metadata and headers', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('chat.getURLPreview'))
                .set(api_data_1.credentials)
                .query({
                roomId: testThreadChannel._id,
                url,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('urlPreview').and.to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(res.body.urlPreview).to.have.property('url', url);
                (0, chai_1.expect)(res.body.urlPreview).to.have.property('headers').and.to.be.an('object').that.is.not.empty;
            });
        }));
        (0, mocha_1.describe)('when an error occurs', () => {
            (0, mocha_1.it)('should return statusCode 400 and an error when "roomId" is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get((0, api_data_1.api)('chat.getURLPreview'))
                    .set(api_data_1.credentials)
                    .query({
                    url,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
                });
            }));
            (0, mocha_1.it)('should return statusCode 400 and an error when "url" is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get((0, api_data_1.api)('chat.getURLPreview'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId: testThreadChannel._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
                });
            }));
            (0, mocha_1.it)('should return statusCode 400 and an error when "roomId" is provided but user is not in the room', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get((0, api_data_1.api)('chat.getURLPreview'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId: 'undefined',
                    url,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-not-allowed');
                });
            }));
        });
    });
});
