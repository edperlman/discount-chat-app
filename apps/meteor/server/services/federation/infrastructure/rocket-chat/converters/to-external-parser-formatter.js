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
exports.toInternalQuoteMessageFormat = exports.toInternalMessageFormat = void 0;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const FederatedUser_1 = require("../../../domain/FederatedUser");
const DEFAULT_LINK_FOR_MATRIX_MENTIONS = 'https://matrix.to/#/';
const DEFAULT_TAGS_FOR_MATRIX_QUOTES = ['mx-reply', 'blockquote'];
const getAllMentionsWithTheirRealNames = (message, homeServerDomain, senderExternalId) => {
    const mentions = [];
    (0, sanitize_html_1.default)(message, {
        allowedTags: ['a'],
        exclusiveFilter: (frame) => {
            const { attribs: { href = '' }, tag, text, } = frame;
            const validATag = tag === 'a' && href && text;
            if (!validATag) {
                return false;
            }
            const isUsernameMention = href.includes(DEFAULT_LINK_FOR_MATRIX_MENTIONS) && href.includes('@');
            if (isUsernameMention) {
                const [, username] = href.split('@');
                const [, serverDomain] = username.split(':');
                const withoutServerIdentification = `@${username.split(':').shift()}`;
                const fullUsername = `@${username}`;
                const isMentioningHimself = senderExternalId === text;
                mentions.push({
                    mention: FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(serverDomain, homeServerDomain) ? withoutServerIdentification : fullUsername,
                    realName: isMentioningHimself ? withoutServerIdentification : text,
                });
            }
            const isMentioningAll = href.includes(DEFAULT_LINK_FOR_MATRIX_MENTIONS) && !href.includes('@');
            if (isMentioningAll) {
                mentions.push({
                    mention: '@all',
                    realName: text,
                });
            }
            return false;
        },
    });
    return mentions;
};
const toInternalMessageFormat = ({ rawMessage, formattedMessage, homeServerDomain, senderExternalId, }) => replaceAllMentionsOneByOneSequentially(rawMessage, getAllMentionsWithTheirRealNames(formattedMessage, homeServerDomain, senderExternalId));
exports.toInternalMessageFormat = toInternalMessageFormat;
const MATCH_ANYTHING = 'w';
const replaceAllMentionsOneByOneSequentially = (message, allMentionsWithRealNames) => {
    let parsedMessage = '';
    let toCompareAgain = message;
    if (allMentionsWithRealNames.length === 0) {
        return message;
    }
    allMentionsWithRealNames.forEach(({ mention, realName }, mentionsIndex) => {
        const negativeLookAhead = `(?!${MATCH_ANYTHING})`;
        const realNameRegex = new RegExp(`(?<!w)${realName}${negativeLookAhead}`);
        let realNamePosition = toCompareAgain.search(realNameRegex);
        const realNamePresentInMessage = realNamePosition !== -1;
        let messageReplacedWithMention = realNamePresentInMessage ? toCompareAgain.replace(realNameRegex, mention) : '';
        let positionRemovingLastMention = realNamePresentInMessage ? realNamePosition + realName.length + 1 : -1;
        const mentionForRoom = realName.charAt(0) === '!';
        if (!realNamePresentInMessage && mentionForRoom) {
            const allMention = '@all';
            const defaultRegexForRooms = new RegExp(`(?<!w)${allMention}${negativeLookAhead}`);
            realNamePosition = toCompareAgain.search(defaultRegexForRooms);
            messageReplacedWithMention = toCompareAgain.replace(defaultRegexForRooms, mention);
            positionRemovingLastMention = realNamePosition + allMention.length + 1;
        }
        const lastItem = allMentionsWithRealNames.length - 1;
        const lastMentionToProcess = mentionsIndex === lastItem;
        const lastMentionPosition = realNamePosition + mention.length + 1;
        toCompareAgain = toCompareAgain.slice(positionRemovingLastMention);
        parsedMessage += messageReplacedWithMention.slice(0, lastMentionToProcess ? undefined : lastMentionPosition);
    });
    return parsedMessage.trim();
};
function stripReplyQuote(message) {
    const splitLines = message.split(/\r?\n/);
    // Find which line the quote ends on
    let splitLineIndex = 0;
    for (const line of splitLines) {
        if (line[0] !== '>') {
            break;
        }
        splitLineIndex += 1;
    }
    return splitLines.splice(splitLineIndex).join('\n').trim();
}
const toInternalQuoteMessageFormat = (_a) => __awaiter(void 0, [_a], void 0, function* ({ homeServerDomain, formattedMessage, rawMessage, messageToReplyToUrl, senderExternalId, }) {
    const withMentionsOnly = (0, sanitize_html_1.default)(formattedMessage, {
        allowedTags: ['a'],
        allowedAttributes: {
            a: ['href'],
        },
        nonTextTags: DEFAULT_TAGS_FOR_MATRIX_QUOTES,
    });
    const rawMessageWithoutMatrixQuotingFormatting = stripReplyQuote(rawMessage);
    return `[ ](${messageToReplyToUrl}) ${replaceAllMentionsOneByOneSequentially(rawMessageWithoutMatrixQuotingFormatting, getAllMentionsWithTheirRealNames(withMentionsOnly, homeServerDomain, senderExternalId))}`;
});
exports.toInternalQuoteMessageFormat = toInternalQuoteMessageFormat;
