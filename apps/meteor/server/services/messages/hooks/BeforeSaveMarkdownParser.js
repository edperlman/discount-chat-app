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
exports.BeforeSaveMarkdownParser = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const message_parser_1 = require("@rocket.chat/message-parser");
class BeforeSaveMarkdownParser {
    constructor(enabled = true) {
        this.enabled = enabled;
        // no op
    }
    parseMarkdown(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message, config }) {
            var _b, _c;
            if (!this.enabled) {
                return message;
            }
            if ((0, core_typings_1.isE2EEMessage)(message) || (0, core_typings_1.isOTRMessage)(message) || (0, core_typings_1.isOTRAckMessage)(message)) {
                return message;
            }
            try {
                if (message.msg) {
                    message.md = (0, message_parser_1.parse)(message.msg, config);
                }
                if ((_c = (_b = message.attachments) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.description) {
                    message.attachments[0].descriptionMd = (0, message_parser_1.parse)(message.attachments[0].description, config);
                }
            }
            catch (e) {
                console.error(e); // errors logged while the parser is at experimental stage
            }
            return message;
        });
    }
}
exports.BeforeSaveMarkdownParser = BeforeSaveMarkdownParser;
