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
const faker_1 = require("@faker-js/faker");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const messages_data_1 = require("../../../app/apps/server/mocks/data/messages.data");
// Create stubs for dependencies
const stubs = {
    findPaginatedMessages: sinon_1.default.stub(),
    mkdir: sinon_1.default.stub(),
    writeFile: sinon_1.default.stub(),
    findPaginatedMessagesCursor: sinon_1.default.stub(),
    findPaginatedMessagesTotal: sinon_1.default.stub(),
    translateKey: sinon_1.default.stub(),
    settings: sinon_1.default.stub(),
};
const { getMessageData, exportRoomMessages, exportMessageObject } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../server/lib/dataExport/exportRoomMessagesToFile.ts', {
    '@rocket.chat/models': {
        Messages: {
            findPaginated: stubs.findPaginatedMessages,
        },
    },
    'fs/promises': {
        mkdir: stubs.mkdir,
        writeFile: stubs.writeFile,
    },
    '../i18n': {
        i18n: {
            t: stubs.translateKey,
        },
    },
    '../../../app/settings/server': {
        settings: stubs.settings,
    },
});
(0, mocha_1.describe)('Export - exportMessageObject', () => {
    let messagesData;
    const translationPlaceholder = 'translation-placeholder';
    (0, mocha_1.before)(() => {
        stubs.translateKey.returns(translationPlaceholder);
        messagesData = messages_data_1.exportMessagesMock.map((message) => getMessageData(message, false));
    });
    (0, mocha_1.it)('should only stringify message object when exporting message as json', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield exportMessageObject('json', messagesData[3]);
        (0, chai_1.expect)(result).to.be.a.string;
        (0, chai_1.expect)(result).to.equal(JSON.stringify(messagesData[3]));
    }));
    (0, mocha_1.it)('should correctly add tags when exporting plain text message object as html', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield exportMessageObject('html', messagesData[3]);
        (0, chai_1.expect)(result).to.be.a.string;
        (0, chai_1.expect)(result).to.equal(`<p><strong>${messagesData[3].username}</strong> (${new Date(messagesData[3].ts).toUTCString()}):<br/>\n${messagesData[3].msg}\n</p>`);
    }));
    (0, mocha_1.it)('should correctly format system messages when exporting message object as html', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield exportMessageObject('html', messagesData[0]);
        (0, chai_1.expect)(messagesData[0].msg).to.equal(translationPlaceholder);
        (0, chai_1.expect)(result).to.be.a.string;
        (0, chai_1.expect)(result).to.equal(`<p><strong>${messagesData[0].username}</strong> (${new Date(messagesData[0].ts).toUTCString()}):<br/>\n<i>${messagesData[0].msg}</i>\n</p>`);
    }));
    (0, mocha_1.it)('should correctly format non italic system messages when exporting message object as html', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield exportMessageObject('html', messagesData[4]);
        (0, chai_1.expect)(messagesData[4].msg).to.equal(translationPlaceholder);
        (0, chai_1.expect)(result).to.be.a.string;
        (0, chai_1.expect)(result).to.equal(`<p><strong>${messagesData[4].username}</strong> (${new Date(messagesData[4].ts).toUTCString()}):<br/>\n${messagesData[4].msg}\n</p>`);
    }));
    (0, mocha_1.it)('should correctly reference file when exporting a message object with an attachment as html', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const result = yield exportMessageObject('html', messagesData[1], messages_data_1.exportMessagesMock[1].file);
        (0, chai_1.expect)(result).to.be.a.string;
        (0, chai_1.expect)(result).to.equal(`<p><strong>${messagesData[1].username}</strong> (${new Date(messagesData[1].ts).toUTCString()}):<br/>\n${messagesData[1].msg}\n<br/><a href="./assets/${(_a = messages_data_1.exportMessagesMock[1].file) === null || _a === void 0 ? void 0 : _a._id}-${(_b = messages_data_1.exportMessagesMock[1].file) === null || _b === void 0 ? void 0 : _b.name}">${(_c = messagesData[1].attachments) === null || _c === void 0 ? void 0 : _c[0].title}</a>\n</p>`);
    }));
    (0, mocha_1.it)('should use fallback attachment description when no title is provided on message object export as html', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const result = yield exportMessageObject('html', messagesData[2], messages_data_1.exportMessagesMock[2].file);
        (0, chai_1.expect)(stubs.translateKey.calledWith('Message_Attachments')).to.be.true;
        (0, chai_1.expect)(result).to.be.a.string;
        (0, chai_1.expect)(result).to.equal(`<p><strong>${messagesData[2].username}</strong> (${new Date(messagesData[2].ts).toUTCString()}):<br/>\n${messages_data_1.exportMessagesMock[1].msg}\n<br/><a href="./assets/${(_a = messages_data_1.exportMessagesMock[2].file) === null || _a === void 0 ? void 0 : _a._id}-${(_b = messages_data_1.exportMessagesMock[2].file) === null || _b === void 0 ? void 0 : _b.name}">${translationPlaceholder}</a>\n</p>`);
    }));
});
(0, mocha_1.describe)('Export - exportRoomMessages', () => {
    const totalMessages = 10;
    const userData = {
        _id: faker_1.faker.database.mongodbObjectId(),
        name: faker_1.faker.person.fullName(),
        username: faker_1.faker.internet.userName(),
    };
    (0, mocha_1.before)(() => {
        stubs.findPaginatedMessagesCursor.resolves(messages_data_1.exportMessagesMock);
        stubs.findPaginatedMessagesTotal.resolves(totalMessages);
        stubs.findPaginatedMessages.returns({
            cursor: { toArray: stubs.findPaginatedMessagesCursor },
            totalCount: stubs.findPaginatedMessagesTotal(),
        });
        stubs.translateKey.returns('translated-placeholder-uj');
    });
    (0, mocha_1.it)('should correctly export multiple messages to result when exporting room as json', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield exportRoomMessages('test-rid', 'json', 0, 100, userData);
        (0, chai_1.expect)(stubs.translateKey.calledWith('User_joined_the_channel')).to.be.true;
        (0, chai_1.expect)(result).to.be.an('object');
        (0, chai_1.expect)(result).to.have.property('total', totalMessages);
        (0, chai_1.expect)(result).to.have.property('exported', messages_data_1.exportMessagesMock.length);
        (0, chai_1.expect)(result).to.have.property('messages').that.is.an('array').of.length(messages_data_1.exportMessagesMock.length);
        const messagesWithFiles = messages_data_1.exportMessagesMock.filter((message) => message.file);
        (0, chai_1.expect)(result).to.have.property('uploads').that.is.an('array').of.length(messagesWithFiles.length);
    }));
    (0, mocha_1.it)('should correctly export multiple messages to result when exporting room as html', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield exportRoomMessages('test-rid', 'html', 0, 100, userData);
        (0, chai_1.expect)(stubs.translateKey.calledWith('User_joined_the_channel')).to.be.true;
        (0, chai_1.expect)(result).to.be.an('object');
        (0, chai_1.expect)(result).to.have.property('total', totalMessages);
        (0, chai_1.expect)(result).to.have.property('exported', messages_data_1.exportMessagesMock.length);
        (0, chai_1.expect)(result).to.have.property('messages').that.is.an('array').of.length(messages_data_1.exportMessagesMock.length);
        const messagesWithFiles = messages_data_1.exportMessagesMock.filter((message) => message.file);
        (0, chai_1.expect)(result).to.have.property('uploads').that.is.an('array').of.length(messagesWithFiles.length);
    }));
});
