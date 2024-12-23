"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBuilderAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/server/accessors");
const utilities_1 = require("../../test-data/utilities");
let MessageBuilderAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _basicMessageBuilder_decorators;
    let _settingOnMessageBuilder_decorators;
    return _a = class MessageBuilderAccessorTestFixture {
            basicMessageBuilder() {
                (0, alsatian_1.Expect)(() => new accessors_1.MessageBuilder()).not.toThrow();
                (0, alsatian_1.Expect)(() => new accessors_1.MessageBuilder(utilities_1.TestData.getMessage())).not.toThrow();
            }
            settingOnMessageBuilder() {
                const mbOnce = new accessors_1.MessageBuilder();
                // setData just replaces the passed in object, so let's treat it differently
                (0, alsatian_1.Expect)(mbOnce.setData({ text: 'hello' })).toBe(mbOnce);
                (0, alsatian_1.Expect)(mbOnce.msg.text).toBe('hello');
                const mbUpdate = new accessors_1.MessageBuilder();
                const editor = new accessors_1.UserBuilder();
                editor.setUsername('username');
                editor.setDisplayName('name');
                // setUpdateData keeps the ID passed in the message object, so let's treat it differently
                (0, alsatian_1.Expect)(mbUpdate.setUpdateData({ text: 'hello', id: 'messageID' }, editor.getUser())).toBe(mbUpdate);
                (0, alsatian_1.Expect)(mbUpdate.msg.text).toBe('hello');
                (0, alsatian_1.Expect)(mbUpdate.msg.id).toBe('messageID');
                const msg = {};
                const mb = new accessors_1.MessageBuilder(msg);
                (0, alsatian_1.Expect)(mb.setThreadId('a random thread id')).toBe(mb);
                (0, alsatian_1.Expect)(msg.threadId).toBe('a random thread id');
                (0, alsatian_1.Expect)(mb.getThreadId()).toBe('a random thread id');
                (0, alsatian_1.Expect)(mb.setRoom(utilities_1.TestData.getRoom())).toBe(mb);
                (0, alsatian_1.Expect)(msg.room).toEqual(utilities_1.TestData.getRoom());
                (0, alsatian_1.Expect)(mb.getRoom()).toEqual(utilities_1.TestData.getRoom());
                (0, alsatian_1.Expect)(mb.setSender(utilities_1.TestData.getUser())).toBe(mb);
                (0, alsatian_1.Expect)(msg.sender).toEqual(utilities_1.TestData.getUser());
                (0, alsatian_1.Expect)(mb.getSender()).toEqual(utilities_1.TestData.getUser());
                (0, alsatian_1.Expect)(mb.setText('testing, yo!')).toBe(mb);
                (0, alsatian_1.Expect)(msg.text).toEqual('testing, yo!');
                (0, alsatian_1.Expect)(mb.getText()).toEqual('testing, yo!');
                (0, alsatian_1.Expect)(mb.setEmojiAvatar(':ghost:')).toBe(mb);
                (0, alsatian_1.Expect)(msg.emoji).toEqual(':ghost:');
                (0, alsatian_1.Expect)(mb.getEmojiAvatar()).toEqual(':ghost:');
                (0, alsatian_1.Expect)(mb.setAvatarUrl('https://rocket.chat/')).toBe(mb);
                (0, alsatian_1.Expect)(msg.avatarUrl).toEqual('https://rocket.chat/');
                (0, alsatian_1.Expect)(mb.getAvatarUrl()).toEqual('https://rocket.chat/');
                (0, alsatian_1.Expect)(mb.setUsernameAlias('Some Bot')).toBe(mb);
                (0, alsatian_1.Expect)(msg.alias).toEqual('Some Bot');
                (0, alsatian_1.Expect)(mb.getUsernameAlias()).toEqual('Some Bot');
                (0, alsatian_1.Expect)(msg.attachments).not.toBeDefined();
                (0, alsatian_1.Expect)(mb.getAttachments()).not.toBeDefined();
                (0, alsatian_1.Expect)(mb.addAttachment({ color: '#0ff' })).toBe(mb);
                (0, alsatian_1.Expect)(msg.attachments).toBeDefined();
                (0, alsatian_1.Expect)(mb.getAttachments()).toBeDefined();
                (0, alsatian_1.Expect)(msg.attachments).not.toBeEmpty();
                (0, alsatian_1.Expect)(mb.getAttachments()).not.toBeEmpty();
                (0, alsatian_1.Expect)(msg.attachments[0].color).toEqual('#0ff');
                (0, alsatian_1.Expect)(mb.getAttachments()[0].color).toEqual('#0ff');
                (0, alsatian_1.Expect)(mb.setAttachments([])).toBe(mb);
                (0, alsatian_1.Expect)(msg.attachments).toBeEmpty();
                (0, alsatian_1.Expect)(mb.getAttachments()).toBeEmpty();
                delete msg.attachments;
                (0, alsatian_1.Expect)(() => mb.replaceAttachment(1, {})).toThrowError(Error, 'No attachment found at the index of "1" to replace.');
                (0, alsatian_1.Expect)(mb.addAttachment({})).toBe(mb);
                (0, alsatian_1.Expect)(mb.replaceAttachment(0, { color: '#f0f' })).toBe(mb);
                (0, alsatian_1.Expect)(msg.attachments[0].color).toEqual('#f0f');
                (0, alsatian_1.Expect)(mb.getAttachments()[0].color).toEqual('#f0f');
                (0, alsatian_1.Expect)(mb.removeAttachment(0)).toBe(mb);
                (0, alsatian_1.Expect)(msg.attachments).toBeEmpty();
                (0, alsatian_1.Expect)(mb.getAttachments()).toBeEmpty();
                delete msg.attachments;
                (0, alsatian_1.Expect)(() => mb.removeAttachment(4)).toThrowError(Error, 'No attachment found at the index of "4" to remove.');
                (0, alsatian_1.Expect)(mb.setEditor(utilities_1.TestData.getUser('msg-editor-id'))).toBe(mb);
                (0, alsatian_1.Expect)(msg.editor).toBeDefined();
                (0, alsatian_1.Expect)(mb.getEditor()).toBeDefined();
                (0, alsatian_1.Expect)(msg.editor.id).toEqual('msg-editor-id');
                (0, alsatian_1.Expect)(mb.getEditor().id).toEqual('msg-editor-id');
                (0, alsatian_1.Expect)(mb.getMessage()).toBe(msg);
                delete msg.room;
                (0, alsatian_1.Expect)(() => mb.getMessage()).toThrowError(Error, 'The "room" property is required.');
                (0, alsatian_1.Expect)(mb.setGroupable(true)).toBe(mb);
                (0, alsatian_1.Expect)(msg.groupable).toEqual(true);
                (0, alsatian_1.Expect)(mb.getGroupable()).toEqual(true);
                (0, alsatian_1.Expect)(mb.setGroupable(false)).toBe(mb);
                (0, alsatian_1.Expect)(msg.groupable).toEqual(false);
                (0, alsatian_1.Expect)(mb.getGroupable()).toEqual(false);
                (0, alsatian_1.Expect)(mb.setParseUrls(true)).toBe(mb);
                (0, alsatian_1.Expect)(msg.parseUrls).toEqual(true);
                (0, alsatian_1.Expect)(mb.getParseUrls()).toEqual(true);
                (0, alsatian_1.Expect)(mb.setParseUrls(false)).toBe(mb);
                (0, alsatian_1.Expect)(msg.parseUrls).toEqual(false);
                (0, alsatian_1.Expect)(mb.getParseUrls()).toEqual(false);
                (0, alsatian_1.Expect)(mb.addCustomField('thing', 'value')).toBe(mb);
                (0, alsatian_1.Expect)(msg.customFields).toBeDefined();
                (0, alsatian_1.Expect)(msg.customFields.thing).toBe('value');
                (0, alsatian_1.Expect)(() => mb.addCustomField('thing', 'second')).toThrowError(Error, 'The message already contains a custom field by the key: thing');
                (0, alsatian_1.Expect)(() => mb.addCustomField('thing.', 'second')).toThrowError(Error, 'The given key contains a period, which is not allowed. Key: thing.');
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _basicMessageBuilder_decorators = [(0, alsatian_1.Test)()];
            _settingOnMessageBuilder_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _basicMessageBuilder_decorators, { kind: "method", name: "basicMessageBuilder", static: false, private: false, access: { has: obj => "basicMessageBuilder" in obj, get: obj => obj.basicMessageBuilder }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _settingOnMessageBuilder_decorators, { kind: "method", name: "settingOnMessageBuilder", static: false, private: false, access: { has: obj => "settingOnMessageBuilder" in obj, get: obj => obj.settingOnMessageBuilder }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MessageBuilderAccessorTestFixture = MessageBuilderAccessorTestFixture;
