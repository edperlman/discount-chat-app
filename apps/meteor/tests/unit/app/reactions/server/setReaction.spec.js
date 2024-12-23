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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const meteorMethodsMock = sinon_1.default.stub();
const emojiList = {};
const modelsMock = {
    EmojiCustom: {
        countByNameOrAlias: sinon_1.default.stub(),
    },
    Users: {
        findOneById: sinon_1.default.stub(),
    },
    Messages: {
        findOneById: sinon_1.default.stub(),
        setReactions: sinon_1.default.stub(),
        unsetReactions: sinon_1.default.stub(),
    },
    Rooms: {
        findOneById: sinon_1.default.stub(),
        unsetReactionsInLastMessage: sinon_1.default.stub(),
        setReactionsInLastMessage: sinon_1.default.stub(),
    },
};
const canAccessRoomAsyncMock = sinon_1.default.stub();
const isTheLastMessageMock = sinon_1.default.stub();
const notifyOnMessageChangeMock = sinon_1.default.stub();
const hasPermissionAsyncMock = sinon_1.default.stub();
const i18nMock = { t: sinon_1.default.stub() };
const callbacksRunMock = sinon_1.default.stub();
const meteorErrorMock = class extends Error {
    constructor(message) {
        super(message);
    }
};
const { removeUserReaction, executeSetReaction, setReaction } = proxyquire_1.default.noCallThru().load('../../../../../app/reactions/server/setReaction.ts', {
    '@rocket.chat/models': modelsMock,
    '@rocket.chat/core-services': { Message: { beforeReacted: sinon_1.default.stub() } },
    'meteor/meteor': { Meteor: { methods: meteorMethodsMock, Error: meteorErrorMock } },
    '../../../lib/callbacks': { callbacks: { run: callbacksRunMock } },
    '../../../server/lib/i18n': { i18n: i18nMock },
    '../../authorization/server': { canAccessRoomAsync: canAccessRoomAsyncMock },
    '../../authorization/server/functions/hasPermission': { hasPermissionAsync: hasPermissionAsyncMock },
    '../../emoji/server': { emoji: { list: emojiList } },
    '../../lib/server/functions/isTheLastMessage': { isTheLastMessage: isTheLastMessageMock },
    '../../lib/server/lib/notifyListener': {
        notifyOnMessageChange: notifyOnMessageChangeMock,
    },
});
(0, mocha_1.describe)('Reactions', () => {
    (0, mocha_1.describe)('removeUserReaction', () => {
        (0, mocha_1.it)('should return the message unmodified when no reactions exist', () => {
            const message = {};
            const result = removeUserReaction(message, 'test', 'test');
            (0, chai_1.expect)(result).to.equal(message);
        });
        (0, mocha_1.it)('should remove the reaction from a message', () => {
            const message = {
                reactions: {
                    test: {
                        usernames: ['test', 'test2'],
                    },
                },
            };
            const result = removeUserReaction(message, 'test', 'test');
            (0, chai_1.expect)(result.reactions.test.usernames).to.not.include('test');
            (0, chai_1.expect)(result.reactions.test.usernames).to.include('test2');
        });
        (0, mocha_1.it)('should remove the reaction from a message when the user is the last one on the array', () => {
            const message = {
                reactions: {
                    test: {
                        usernames: ['test'],
                    },
                },
            };
            const result = removeUserReaction(message, 'test', 'test');
            (0, chai_1.expect)(result.reactions.test).to.be.undefined;
        });
        (0, mocha_1.it)('should remove username only from the reaction thats passed in', () => {
            const message = {
                reactions: {
                    test: {
                        usernames: ['test', 'test2'],
                    },
                    other: {
                        usernames: ['test', 'test2'],
                    },
                },
            };
            const result = removeUserReaction(message, 'test', 'test');
            (0, chai_1.expect)(result.reactions.test.usernames).to.not.include('test');
            (0, chai_1.expect)(result.reactions.test.usernames).to.include('test2');
            (0, chai_1.expect)(result.reactions.other.usernames).to.include('test');
            (0, chai_1.expect)(result.reactions.other.usernames).to.include('test2');
        });
        (0, mocha_1.it)('should do nothing if username is not in the reaction', () => {
            const message = {
                reactions: {
                    test: {
                        usernames: ['test', 'test2'],
                    },
                },
            };
            const result = removeUserReaction(message, 'test', 'test3');
            (0, chai_1.expect)(result.reactions.test.usernames).to.not.include('test3');
            (0, chai_1.expect)(result.reactions.test.usernames).to.include('test');
            (0, chai_1.expect)(result.reactions.test.usernames).to.include('test2');
        });
    });
    (0, mocha_1.describe)('executeSetReaction', () => {
        (0, mocha_1.beforeEach)(() => {
            modelsMock.EmojiCustom.countByNameOrAlias.reset();
        });
        (0, mocha_1.it)('should throw an error if reaction is not on emojione list', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.EmojiCustom.countByNameOrAlias.resolves(0);
            yield (0, chai_1.expect)(executeSetReaction('test', 'test', 'test')).to.be.rejectedWith('error-not-allowed');
        }));
        (0, mocha_1.it)('should fail if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.EmojiCustom.countByNameOrAlias.resolves(1);
            yield (0, chai_1.expect)(executeSetReaction('test', 'test', 'test')).to.be.rejectedWith('error-invalid-user');
        }));
        (0, mocha_1.it)('should fail if message does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.EmojiCustom.countByNameOrAlias.resolves(1);
            modelsMock.Users.findOneById.resolves({ username: 'test' });
            yield (0, chai_1.expect)(executeSetReaction('test', 'test', 'test')).to.be.rejectedWith('error-not-allowed');
        }));
        (0, mocha_1.it)('should return nothing if user already reacted and its trying to react again', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.EmojiCustom.countByNameOrAlias.resolves(1);
            modelsMock.Users.findOneById.resolves({ username: 'test' });
            modelsMock.Messages.findOneById.resolves({ reactions: { ':test:': { usernames: ['test'] } } });
            (0, chai_1.expect)(yield executeSetReaction('test', 'test', 'test', true)).to.be.undefined;
        }));
        (0, mocha_1.it)('should return nothing if user hasnt reacted and its trying to unreact', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.EmojiCustom.countByNameOrAlias.resolves(1);
            modelsMock.Users.findOneById.resolves({ username: 'test' });
            modelsMock.Messages.findOneById.resolves({ reactions: { ':test:': { usernames: ['testxxxx'] } } });
            (0, chai_1.expect)(yield executeSetReaction('test', 'test', 'test', false)).to.be.undefined;
        }));
        (0, mocha_1.it)('should fail if room does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.EmojiCustom.countByNameOrAlias.resolves(1);
            modelsMock.Users.findOneById.resolves({ username: 'test' });
            modelsMock.Messages.findOneById.resolves({ reactions: { ':test:': { usernames: ['test'] } } });
            modelsMock.Rooms.findOneById.resolves(undefined);
            yield (0, chai_1.expect)(executeSetReaction('test', 'test', 'test')).to.be.rejectedWith('error-not-allowed');
        }));
        (0, mocha_1.it)('should fail if user doesnt have acccess to the room', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.EmojiCustom.countByNameOrAlias.resolves(1);
            modelsMock.Users.findOneById.resolves({ username: 'test' });
            modelsMock.Messages.findOneById.resolves({ reactions: { ':test:': { usernames: ['test'] } } });
            modelsMock.Rooms.findOneById.resolves({ t: 'd' });
            canAccessRoomAsyncMock.resolves(false);
            yield (0, chai_1.expect)(executeSetReaction('test', 'test', 'test')).to.be.rejectedWith('not-authorized');
        }));
        (0, mocha_1.it)('should call setReaction with correct params', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.EmojiCustom.countByNameOrAlias.resolves(1);
            modelsMock.Users.findOneById.resolves({ username: 'test' });
            modelsMock.Messages.findOneById.resolves({ reactions: { ':test:': { usernames: ['test'] } } });
            modelsMock.Rooms.findOneById.resolves({ t: 'c' });
            canAccessRoomAsyncMock.resolves(true);
            const res = yield executeSetReaction('test', 'test', 'test');
            (0, chai_1.expect)(res).to.be.undefined;
        }));
        (0, mocha_1.it)('should use the message from param when the type is not an string', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.EmojiCustom.countByNameOrAlias.resolves(1);
            modelsMock.Users.findOneById.resolves({ username: 'test' });
            modelsMock.Rooms.findOneById.resolves({ t: 'c' });
            canAccessRoomAsyncMock.resolves(true);
            yield executeSetReaction('test', 'test', { reactions: { ':test:': { usernames: ['test'] } } });
            (0, chai_1.expect)(modelsMock.Messages.findOneById.calledOnce).to.be.false;
        }));
    });
    (0, mocha_1.describe)('setReaction', () => {
        (0, mocha_1.beforeEach)(() => {
            canAccessRoomAsyncMock.reset();
            hasPermissionAsyncMock.reset();
            isTheLastMessageMock.reset();
            modelsMock.Messages.setReactions.reset();
            modelsMock.Rooms.setReactionsInLastMessage.reset();
            modelsMock.Rooms.unsetReactionsInLastMessage.reset();
            modelsMock.Messages.unsetReactions.reset();
            callbacksRunMock.reset();
        });
        (0, mocha_1.it)('should throw an error if user is muted from the room', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                muted: ['test'],
            };
            const user = {
                username: 'test',
            };
            const message = {
                _id: 'test',
            };
            yield (0, chai_1.expect)(setReaction(room, user, message, ':test:')).to.be.rejectedWith('error-not-allowed');
        }));
        (0, mocha_1.it)('should throw an error if room is readonly and cannot be reacted when readonly and user trying doesnt have permissions and user is not unmuted from room', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                ro: true,
                reactWhenReadOnly: false,
            };
            const user = {
                username: 'test',
            };
            const message = {
                _id: 'test',
            };
            canAccessRoomAsyncMock.resolves(false);
            yield (0, chai_1.expect)(setReaction(room, user, message, ':test:')).to.be.rejectedWith("You can't send messages because the room is readonly.");
        }));
        (0, mocha_1.it)('should remove the user reaction if userAlreadyReacted is true and call unsetReaction if reaction is the last one on message', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                _id: 'test',
            };
            const user = {
                username: 'test',
            };
            const message = {
                _id: 'test',
                reactions: {
                    ':test:': {
                        usernames: ['test'],
                    },
                },
            };
            const reaction = ':test:';
            yield setReaction(room, user, message, reaction, true);
            (0, chai_1.expect)(modelsMock.Messages.unsetReactions.calledWith(message._id)).to.be.true;
        }));
        (0, mocha_1.it)('should call Rooms.unsetReactionsInLastMessage when userAlreadyReacted is true and reaction is the last one on message', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                _id: 'test',
                lastMessage: 'test',
            };
            const user = {
                username: 'test',
            };
            const message = {
                _id: 'test',
                reactions: {
                    ':test:': {
                        usernames: ['test'],
                    },
                },
            };
            const reaction = ':test:';
            isTheLastMessageMock.resolves(true);
            yield setReaction(room, user, message, reaction, true);
            (0, chai_1.expect)(modelsMock.Messages.unsetReactions.calledWith(message._id)).to.be.true;
            (0, chai_1.expect)(modelsMock.Rooms.unsetReactionsInLastMessage.calledWith(room._id)).to.be.true;
        }));
        (0, mocha_1.it)('should update the reactions object when userAlreadyReacted is true and there is more reactions on message', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                _id: 'test',
            };
            const user = {
                username: 'test',
            };
            const message = {
                _id: 'test',
                reactions: {
                    ':test:': {
                        usernames: ['test'],
                    },
                    ':test2:': {
                        usernames: ['test'],
                    },
                },
            };
            const reaction = ':test:';
            yield setReaction(room, user, message, reaction, true);
            (0, chai_1.expect)(modelsMock.Messages.setReactions.calledWith(message._id, sinon_1.default.match({ ':test2:': { usernames: ['test'] } }))).to.be.true;
        }));
        (0, mocha_1.it)('should call Rooms.setReactionsInLastMessage when userAlreadyReacted is true and reaction is not the last one on message', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                _id: 'test',
                lastMessage: 'test',
            };
            const user = {
                username: 'test',
            };
            const message = {
                _id: 'test',
                reactions: {
                    ':test:': {
                        usernames: ['test'],
                    },
                    ':test2:': {
                        usernames: ['test'],
                    },
                },
            };
            const reaction = ':test:';
            isTheLastMessageMock.resolves(true);
            yield setReaction(room, user, message, reaction, true);
            (0, chai_1.expect)(modelsMock.Messages.setReactions.calledWith(message._id, sinon_1.default.match({ ':test2:': { usernames: ['test'] } }))).to.be.true;
            (0, chai_1.expect)(modelsMock.Rooms.setReactionsInLastMessage.calledWith(room._id, sinon_1.default.match({ ':test2:': { usernames: ['test'] } }))).to.be
                .true;
        }));
        (0, mocha_1.it)('should call afterUnsetReaction callback when userAlreadyReacted is true', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                _id: 'test',
            };
            const user = {
                username: 'test',
            };
            const message = {
                _id: 'test',
                reactions: {
                    ':test:': {
                        usernames: ['test'],
                    },
                },
            };
            const reaction = ':test:';
            yield setReaction(room, user, message, reaction, true);
            (0, chai_1.expect)(callbacksRunMock.calledWith('afterUnsetReaction', sinon_1.default.match({ _id: 'test' }), sinon_1.default.match({ user, reaction, shouldReact: false, oldMessage: message }))).to.be.true;
        }));
        (0, mocha_1.it)('should set reactions when userAlreadyReacted is false', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                _id: 'test',
            };
            const user = {
                username: 'test',
            };
            const message = {
                _id: 'test',
            };
            const reaction = ':test:';
            yield setReaction(room, user, message, reaction, false);
            (0, chai_1.expect)(modelsMock.Messages.setReactions.calledWith(message._id, sinon_1.default.match({ ':test:': { usernames: ['test'] } }))).to.be.true;
        }));
        (0, mocha_1.it)('should properly add username to the list of reactions when userAlreadyReacted is false', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                _id: 'test',
            };
            const user = {
                username: 'test2',
            };
            const message = {
                _id: 'test',
                reactions: {
                    ':test:': {
                        usernames: ['test'],
                    },
                },
            };
            const reaction = ':test:';
            yield setReaction(room, user, message, reaction, false);
            (0, chai_1.expect)(modelsMock.Messages.setReactions.calledWith(message._id, sinon_1.default.match({ ':test:': { usernames: ['test', 'test2'] } }))).to.be
                .true;
        }));
        (0, mocha_1.it)('should call Rooms.setReactionInLastMessage when userAlreadyReacted is false', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                _id: 'x5',
                lastMessage: 'test',
            };
            const user = {
                username: 'test',
            };
            const message = {
                _id: 'test',
            };
            const reaction = ':test:';
            isTheLastMessageMock.resolves(true);
            yield setReaction(room, user, message, reaction, false);
            (0, chai_1.expect)(modelsMock.Messages.setReactions.calledWith(message._id, sinon_1.default.match({ ':test:': { usernames: ['test'] } }))).to.be.true;
            (0, chai_1.expect)(modelsMock.Rooms.setReactionsInLastMessage.calledWith(room._id, sinon_1.default.match({ ':test:': { usernames: ['test'] } }))).to.be
                .true;
        }));
        (0, mocha_1.it)('should call afterSetReaction callback when userAlreadyReacted is false', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                _id: 'test',
            };
            const user = {
                username: 'test',
            };
            const message = {
                _id: 'test',
            };
            const reaction = ':test:';
            yield setReaction(room, user, message, reaction, false);
            (0, chai_1.expect)(callbacksRunMock.calledWith('afterSetReaction', sinon_1.default.match({ _id: 'test' }), sinon_1.default.match({ user, reaction, shouldReact: true }))).to.be.true;
        }));
        (0, mocha_1.it)('should return undefined on a successful reaction', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = {
                _id: 'test',
            };
            const user = {
                username: 'test',
            };
            const message = {
                _id: 'test',
            };
            const reaction = ':test:';
            (0, chai_1.expect)(yield setReaction(room, user, message, reaction, false)).to.be.undefined;
        }));
    });
});
