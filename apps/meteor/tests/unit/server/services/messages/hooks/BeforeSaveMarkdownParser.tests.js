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
const chai_1 = require("chai");
const BeforeSaveMarkdownParser_1 = require("../../../../../../server/services/messages/hooks/BeforeSaveMarkdownParser");
const createMessage = (msg, extra = {}) => (Object.assign({ _id: 'random', rid: 'GENERAL', ts: new Date(), u: {
        _id: 'userId',
        username: 'username',
    }, _updatedAt: new Date(), msg: msg }, extra));
describe('Markdown parser', () => {
    it('should do nothing if markdown parser is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
        const markdownParser = new BeforeSaveMarkdownParser_1.BeforeSaveMarkdownParser(false);
        const message = yield markdownParser.parseMarkdown({
            message: createMessage('hey'),
            config: {},
        });
        (0, chai_1.expect)(message).to.not.have.property('md');
    }));
    it('should do nothing for OTR messages', () => __awaiter(void 0, void 0, void 0, function* () {
        const markdownParser = new BeforeSaveMarkdownParser_1.BeforeSaveMarkdownParser(true);
        const message = yield markdownParser.parseMarkdown({
            message: createMessage('hey', { t: 'otr' }),
            config: {},
        });
        const messageAck = yield markdownParser.parseMarkdown({
            message: createMessage('hey', { t: 'otr-ack' }),
            config: {},
        });
        (0, chai_1.expect)(message).to.not.have.property('md');
        (0, chai_1.expect)(messageAck).to.not.have.property('md');
    }));
    it('should do nothing for E2E messages', () => __awaiter(void 0, void 0, void 0, function* () {
        const markdownParser = new BeforeSaveMarkdownParser_1.BeforeSaveMarkdownParser(true);
        const message = yield markdownParser.parseMarkdown({
            message: createMessage('hey', { t: 'e2e' }),
            config: {},
        });
        (0, chai_1.expect)(message).to.not.have.property('md');
    }));
    it('should parse markdown', () => __awaiter(void 0, void 0, void 0, function* () {
        const markdownParser = new BeforeSaveMarkdownParser_1.BeforeSaveMarkdownParser(true);
        const message = yield markdownParser.parseMarkdown({
            message: createMessage('hey'),
            config: {},
        });
        (0, chai_1.expect)(message).to.have.property('md');
    }));
    it('should parse markdown on the first attachment only', () => __awaiter(void 0, void 0, void 0, function* () {
        const markdownParser = new BeforeSaveMarkdownParser_1.BeforeSaveMarkdownParser(true);
        const message = yield markdownParser.parseMarkdown({
            message: createMessage('hey', {
                attachments: [
                    {
                        description: 'hey ho',
                    },
                    {
                        description: 'lets go',
                    },
                ],
            }),
            config: {},
        });
        (0, chai_1.expect)(message).to.have.property('md');
        const [attachment1, attachment2] = message.attachments || [];
        (0, chai_1.expect)(attachment1).to.have.property('descriptionMd');
        (0, chai_1.expect)(attachment2).to.not.have.property('descriptionMd');
    }));
});
