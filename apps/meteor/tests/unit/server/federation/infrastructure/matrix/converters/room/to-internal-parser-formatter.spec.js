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
const to_internal_parser_formatter_1 = require("../../../../../../../../server/services/federation/infrastructure/matrix/converters/room/to-internal-parser-formatter");
describe('Federation - Infrastructure - Matrix - MatrixTextParser', () => {
    describe('#toExternalMessageFormat ()', () => {
        it('should parse the user external mention correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: 'hey @user:server.com',
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain',
            })).to.be.equal('<p>hey <a href="https://matrix.to/#/@user:server.com">@user:server.com</a></p>');
        }));
        it('should parse the mentions correctly when using the RC format', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: '@user:server.com @user',
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p><a href="https://matrix.to/#/@user:server.com">@user:server.com</a> <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a></p>');
        }));
        it('should parse the multiple mentions correctly when using the RC format', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: '@user @user:server.com @user @user:server.com',
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p><a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a> <a href="https://matrix.to/#/@user:server.com">@user:server.com</a> <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a> <a href="https://matrix.to/#/@user:server.com">@user:server.com</a></p>');
        }));
        it('should parse the @all mention correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: 'hey @all',
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain',
            })).to.be.equal('<p>hey <a href="https://matrix.to/#/externalRoomId">externalRoomId</a></p>');
        }));
        it('should parse the @here mention correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: 'hey @here',
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain',
            })).to.be.equal('<p>hey <a href="https://matrix.to/#/externalRoomId">externalRoomId</a></p>');
        }));
        it('should parse the user local mentions appending the local domain server in the mention', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: 'hey @user',
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a></p>');
        }));
        it('should parse multiple and different mentions in the same message correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: 'hey @user:server.com, hey @all, hey @here @user',
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p>hey <a href="https://matrix.to/#/@user:server.com">@user:server.com</a>, hey <a href="https://matrix.to/#/externalRoomId">externalRoomId</a>, hey <a href="https://matrix.to/#/externalRoomId">externalRoomId</a> <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a></p>');
        }));
        it('should return the message as-is when it does not have any mention', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: 'hey people, how are you?',
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p>hey people, how are you?</p>');
        }));
        it('should parse correctly a message containing both local mentions + some markdown', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: `hey @user, how are you? Hope **you** __are__ doing well, please see the list:
					# List 1:
					**Ordered List** 

					1. List Item 
					2. List Item 
					3. List Item 
					4. List Item`,
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see the list: # List 1: <strong>Ordered List</strong> </p> <pre><code> 1. List Item 2. List Item 3. List Item 4. List Item </code></pre>');
        }));
        it('should parse correctly a message containing both external mentions + some markdown', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: `hey, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see the list:
					# List 1:
					**Ordered List** 

					1. List Item 
					2. List Item 
					3. List Item 
					4. List Item`,
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p>hey, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see the list: # List 1: <strong>Ordered List</strong> </p> <pre><code> 1. List Item 2. List Item 3. List Item 4. List Item </code></pre>');
        }));
        it('should parse correctly a message containing both local mentions + external mentions + some markdown', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: `hey @user, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see the list:
					# List 1:
					**Ordered List** 

					1. List Item 
					2. List Item 
					3. List Item 
					4. List Item`,
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see the list: # List 1: <strong>Ordered List</strong> </p> <pre><code> 1. List Item 2. List Item 3. List Item 4. List Item </code></pre>');
        }));
        it('should parse correctly a message containing both mentions + some quoting inside the message', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: `hey @user, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see the list:
					# List 1:
					**Ordered List** 

					1. List Item 
					2. List Item 
					3. List Item 
					4. List Item
					
					> Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet 
					`,
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see the list: # List 1: <strong>Ordered List</strong> </p> <pre><code> 1. List Item 2. List Item 3. List Item 4. List Item &gt; Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet </code></pre>');
        }));
        it('should parse correctly a message containing both mentions + some quoting inside the message + an email inside the message', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: `hey @user, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see the list:
					# List 1:
					**Ordered List** 

					1. List Item 
					2. List Item 
					3. List Item 
					4. List Item
					
					> Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet 

					marcos.defendi@email.com
					`,
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see the list: # List 1: <strong>Ordered List</strong> </p> <pre><code> 1. List Item 2. List Item 3. List Item 4. List Item &gt; Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet marcos.defendi@email.com </code></pre>');
        }));
        it('should parse correctly a message containing a mention in the beginning of the string + an email', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: `@user, hello @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see the list:
					# List 1:
					**Ordered List** 

					1. List Item 
					2. List Item 
					3. List Item 
					4. List Item
					
					> Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet 

					marcos.defendi@email.com
					`,
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p><a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, hello <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see the list: # List 1: <strong>Ordered List</strong> </p> <pre><code> 1. List Item 2. List Item 3. List Item 4. List Item &gt; Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet marcos.defendi@email.com </code></pre>');
        }));
        it('should parse correctly a message containing a message with mentions + the whole markdown spec', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: `hey @user, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see:
					# Heading 1 

					**Paragraph text**: **Bold** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. 

					## Heading 2

					_Italict Text_: _Italict_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.

					### Heading 3 

					- Lists, Links and elements

					**Unordered List** 
					- List Item 1 
					- List Item 2 
					- List Item 3 
					- List Item 4

					**Ordered List** 

					1. List Item 
					2. List Item 
					3. List Item 
					4. List Item 

					> Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. 

					**Links:** 

					[Google](google.com)
					[Rocket.Chat](rocket.chat)
					[Rocket.Chat Link Test](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
					[**Rocket.Chat Link Test**](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
					[~~Rocket.Chat Link Test~~](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
					[__Rocket.Chat Link Test__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
					[__**~~Rocket.Chat Link Test~~**__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
					marcos.defendi@rocket.chat 
					+55991999999 
					\`Inline code\`
					\`\`\`typescript 
					const applyMarkdownIfRequires = ( list: MessageAttachmentDefault['mrkdwn_in'] = ['text', 'pretext'], key: MarkdownFields, text: string, variant: 'inline' | 'inlineWithoutBreaks' | 'document' = 'inline', ): ReactNode => (list?.includes(key) ? <MarkdownText parseEmoji variant={variant} content={text} /> : text); 
					\`\`\`

				`,
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see: # Heading 1 </p> <pre><code> **Paragraph text**: **Bold** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. ## Heading 2 _Italict Text_: _Italict_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. ### Heading 3 - Lists, Links and elements **Unordered List** - List Item 1 - List Item 2 - List Item 3 - List Item 4 **Ordered List** 1. List Item 2. List Item 3. List Item 4. List Item &gt; Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. **Links:** [Google](google.com) [Rocket.Chat](rocket.chat) [Rocket.Chat Link Test](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [**Rocket.Chat Link Test**](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [~~Rocket.Chat Link Test~~](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [__Rocket.Chat Link Test__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [__**~~Rocket.Chat Link Test~~**__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) marcos.defendi@rocket.chat +55991999999 `Inline code` ```typescript const applyMarkdownIfRequires = ( list: MessageAttachmentDefault[&#39;mrkdwn_in&#39;] = [&#39;text&#39;, &#39;pretext&#39;], key: MarkdownFields, text: string, variant: &#39;inline&#39; | &#39;inlineWithoutBreaks&#39; | &#39;document&#39; = &#39;inline&#39;, ): ReactNode =&gt; (list?.includes(key) ? &lt;MarkdownText parseEmoji variant={variant} content={text} /&gt; : text); ``` </code></pre>');
        }));
        it('should parse correctly a message containing a message with mentions + the whole markdown spec + emojis', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalMessageFormat)({
                message: `hey @user, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see:
					# Heading 1 

					**Paragraph text**: **Bold** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. 

					## Heading 2

					_Italict Text_: _Italict_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.

					### Heading 3 

					- Lists, Links and elements

					**Unordered List** 
					- List Item 1 
					- List Item 2 
					- List Item 3 
					- List Item 4

					**Ordered List** 

					1. List Item 
					2. List Item 
					3. List Item 
					4. List Item 

					> Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. 

					**Links:** 

					[Google](google.com)
					[Rocket.Chat](rocket.chat)
					[Rocket.Chat Link Test](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
					[**Rocket.Chat Link Test**](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
					[~~Rocket.Chat Link Test~~](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
					[__Rocket.Chat Link Test__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
					[__**~~Rocket.Chat Link Test~~**__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
					marcos.defendi@rocket.chat 
					+55991999999 
					\`Inline code\`
					\`\`\`typescript 
					const applyMarkdownIfRequires = ( list: MessageAttachmentDefault['mrkdwn_in'] = ['text', 'pretext'], key: MarkdownFields, text: string, variant: 'inline' | 'inlineWithoutBreaks' | 'document' = 'inline', ): ReactNode => (list?.includes(key) ? <MarkdownText parseEmoji variant={variant} content={text} /> : text); 
					\`\`\`
					😀
					😀
					😀
					😀
				`,
                externalRoomId: 'externalRoomId',
                homeServerDomain: 'localDomain.com',
            })).to.be.equal('<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see: # Heading 1 </p> <pre><code> **Paragraph text**: **Bold** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. ## Heading 2 _Italict Text_: _Italict_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. ### Heading 3 - Lists, Links and elements **Unordered List** - List Item 1 - List Item 2 - List Item 3 - List Item 4 **Ordered List** 1. List Item 2. List Item 3. List Item 4. List Item &gt; Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. **Links:** [Google](google.com) [Rocket.Chat](rocket.chat) [Rocket.Chat Link Test](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [**Rocket.Chat Link Test**](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [~~Rocket.Chat Link Test~~](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [__Rocket.Chat Link Test__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [__**~~Rocket.Chat Link Test~~**__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) marcos.defendi@rocket.chat +55991999999 `Inline code` ```typescript const applyMarkdownIfRequires = ( list: MessageAttachmentDefault[&#39;mrkdwn_in&#39;] = [&#39;text&#39;, &#39;pretext&#39;], key: MarkdownFields, text: string, variant: &#39;inline&#39; | &#39;inlineWithoutBreaks&#39; | &#39;document&#39; = &#39;inline&#39;, ): ReactNode =&gt; (list?.includes(key) ? &lt;MarkdownText parseEmoji variant={variant} content={text} /&gt; : text); ``` 😀 😀 😀 😀 </code></pre>');
        }));
    });
    describe('#toExternalQuoteMessageFormat ()', () => {
        const eventToReplyTo = 'eventToReplyTo';
        const externalRoomId = 'externalRoomId';
        const originalEventSender = 'originalEventSenderId';
        const homeServerDomain = 'localDomain.com';
        const quotedMessage = `<mx-reply><blockquote><a href="https://matrix.to/#/${externalRoomId}/${eventToReplyTo}">In reply to</a> <a href="https://matrix.to/#/${originalEventSender}">${originalEventSender}</a><br /></blockquote></mx-reply>`;
        it('should parse the internal quote to the external one correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = 'hey people, how are you?';
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>${message}</p>`,
            });
        }));
        it('should parse the external user mention correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = 'hey @user:server.com';
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey <a href="https://matrix.to/#/@user:server.com">@user:server.com</a></p>`,
            });
        }));
        it('should parse the @all mention correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = 'hey @all';
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey <a href="https://matrix.to/#/externalRoomId">externalRoomId</a></p>`,
            });
        }));
        it('should parse the @here mention correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = 'hey @here';
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey <a href="https://matrix.to/#/externalRoomId">externalRoomId</a></p>`,
            });
        }));
        it('should parse the user local mentions appending the local domain server in the mention', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = 'hey @user';
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a></p>`,
            });
        }));
        it('should parse multiple and different mentions in the same message correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = 'hey @user:server.com, hey @all, hey @here @user';
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey <a href="https://matrix.to/#/@user:server.com">@user:server.com</a>, hey <a href="https://matrix.to/#/externalRoomId">externalRoomId</a>, hey <a href="https://matrix.to/#/externalRoomId">externalRoomId</a> <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a></p>`,
            });
        }));
        it('should return the message as-is when it does not have any mention', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = 'hey people, how are you?';
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>${message}</p>`,
            });
        }));
        it('should parse correctly a message containing both local mentions + some markdown', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = `hey @user, how are you? Hope **you** __are__ doing well, please see the list:
			# List 1:
			**Ordered List** 

			1. List Item 
			2. List Item 
			3. List Item 
			4. List Item`;
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see the list: # List 1: <strong>Ordered List</strong> </p> <pre><code> 1. List Item 2. List Item 3. List Item 4. List Item </code></pre>`,
            });
        }));
        it('should parse correctly a message containing both external mentions + some markdown', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = `hey, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see the list:
			# List 1:
			**Ordered List** 

			1. List Item 
			2. List Item 
			3. List Item 
			4. List Item`;
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see the list: # List 1: <strong>Ordered List</strong> </p> <pre><code> 1. List Item 2. List Item 3. List Item 4. List Item </code></pre>`,
            });
        }));
        it('should parse correctly a message containing both local mentions + external mentions + some markdown', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = `hey @user, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see the list:
			# List 1:
			**Ordered List** 

			1. List Item 
			2. List Item 
			3. List Item 
			4. List Item`;
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see the list: # List 1: <strong>Ordered List</strong> </p> <pre><code> 1. List Item 2. List Item 3. List Item 4. List Item </code></pre>`,
            });
        }));
        it('should parse correctly a message containing both mentions + some quoting inside the message', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = `hey @user, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see the list:
			# List 1:
			**Ordered List** 

			1. List Item 
			2. List Item 
			3. List Item 
			4. List Item
			
			> Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet 
			`;
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see the list: # List 1: <strong>Ordered List</strong> </p> <pre><code> 1. List Item 2. List Item 3. List Item 4. List Item &gt; Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet </code></pre>`,
            });
        }));
        it('should parse correctly a message containing both mentions + some quoting inside the message + an email inside the message', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = `hey @user, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see the list:
			# List 1:
			**Ordered List** 

			1. List Item 
			2. List Item 
			3. List Item 
			4. List Item
			
			> Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet 

			marcos.defendi@email.com
			`;
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see the list: # List 1: <strong>Ordered List</strong> </p> <pre><code> 1. List Item 2. List Item 3. List Item 4. List Item &gt; Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet marcos.defendi@email.com </code></pre>`,
            });
        }));
        it('should parse correctly a message containing a message with mentions + the whole markdown spec', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = `hey @user, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see:
			# Heading 1 

			**Paragraph text**: **Bold** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. 

			## Heading 2

			_Italict Text_: _Italict_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.

			### Heading 3 

			- Lists, Links and elements

			**Unordered List** 
			- List Item 1 
			- List Item 2 
			- List Item 3 
			- List Item 4

			**Ordered List** 

			1. List Item 
			2. List Item 
			3. List Item 
			4. List Item 

			> Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. 

			**Links:** 

			[Google](google.com)
			[Rocket.Chat](rocket.chat)
			[Rocket.Chat Link Test](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
			[**Rocket.Chat Link Test**](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
			[~~Rocket.Chat Link Test~~](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
			[__Rocket.Chat Link Test__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
			[__**~~Rocket.Chat Link Test~~**__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
			marcos.defendi@rocket.chat 
			+55991999999 
			\`Inline code\`
			\`\`\`typescript 
			const applyMarkdownIfRequires = ( list: MessageAttachmentDefault['mrkdwn_in'] = ['text', 'pretext'], key: MarkdownFields, text: string, variant: 'inline' | 'inlineWithoutBreaks' | 'document' = 'inline', ): ReactNode => (list?.includes(key) ? <MarkdownText parseEmoji variant={variant} content={text} /> : text); 
			\`\`\`

		`;
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see: # Heading 1 </p> <pre><code> **Paragraph text**: **Bold** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. ## Heading 2 _Italict Text_: _Italict_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. ### Heading 3 - Lists, Links and elements **Unordered List** - List Item 1 - List Item 2 - List Item 3 - List Item 4 **Ordered List** 1. List Item 2. List Item 3. List Item 4. List Item &gt; Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. **Links:** [Google](google.com) [Rocket.Chat](rocket.chat) [Rocket.Chat Link Test](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [**Rocket.Chat Link Test**](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [~~Rocket.Chat Link Test~~](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [__Rocket.Chat Link Test__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [__**~~Rocket.Chat Link Test~~**__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) marcos.defendi@rocket.chat +55991999999 \`Inline code\` \`\`\`typescript const applyMarkdownIfRequires = ( list: MessageAttachmentDefault[&#39;mrkdwn_in&#39;] = [&#39;text&#39;, &#39;pretext&#39;], key: MarkdownFields, text: string, variant: &#39;inline&#39; | &#39;inlineWithoutBreaks&#39; | &#39;document&#39; = &#39;inline&#39;, ): ReactNode =&gt; (list?.includes(key) ? &lt;MarkdownText parseEmoji variant={variant} content={text} /&gt; : text); \`\`\` </code></pre>`,
            });
        }));
        it('should parse correctly a message containing a message with mentions + the whole markdown spec + emojis', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = `hey @user, here its @remoteuser:matrix.org, how are you? Hope **you** __are__ doing well, please see:
			# Heading 1 

			**Paragraph text**: **Bold** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. 

			## Heading 2

			_Italict Text_: _Italict_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.

			### Heading 3 

			- Lists, Links and elements

			**Unordered List** 
			- List Item 1 
			- List Item 2 
			- List Item 3 
			- List Item 4

			**Ordered List** 

			1. List Item 
			2. List Item 
			3. List Item 
			4. List Item 

			> Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. 

			**Links:** 

			[Google](google.com)
			[Rocket.Chat](rocket.chat)
			[Rocket.Chat Link Test](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
			[**Rocket.Chat Link Test**](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
			[~~Rocket.Chat Link Test~~](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
			[__Rocket.Chat Link Test__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
			[__**~~Rocket.Chat Link Test~~**__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351)
			marcos.defendi@rocket.chat 
			+55991999999 
			\`Inline code\`
			\`\`\`typescript 
			const applyMarkdownIfRequires = ( list: MessageAttachmentDefault['mrkdwn_in'] = ['text', 'pretext'], key: MarkdownFields, text: string, variant: 'inline' | 'inlineWithoutBreaks' | 'document' = 'inline', ): ReactNode => (list?.includes(key) ? <MarkdownText parseEmoji variant={variant} content={text} /> : text); 
			\`\`\`
			😀
			😀
			😀
			😀
		`;
            (0, chai_1.expect)(yield (0, to_internal_parser_formatter_1.toExternalQuoteMessageFormat)({
                eventToReplyTo,
                message,
                externalRoomId,
                homeServerDomain,
                originalEventSender,
            })).to.be.eql({
                message: `> <${originalEventSender}> \n\n${message}`,
                formattedMessage: `${quotedMessage}<p>hey <a href="https://matrix.to/#/@user:localDomain.com">@user:localDomain.com</a>, here its <a href="https://matrix.to/#/@remoteuser:matrix.org">@remoteuser:matrix.org</a>, how are you? Hope <strong>you</strong> <strong>are</strong> doing well, please see: # Heading 1 </p> <pre><code> **Paragraph text**: **Bold** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. ## Heading 2 _Italict Text_: _Italict_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. ### Heading 3 - Lists, Links and elements **Unordered List** - List Item 1 - List Item 2 - List Item 3 - List Item 4 **Ordered List** 1. List Item 2. List Item 3. List Item 4. List Item &gt; Quote test: **Bold** _Italic_ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. **Links:** [Google](google.com) [Rocket.Chat](rocket.chat) [Rocket.Chat Link Test](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [**Rocket.Chat Link Test**](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [~~Rocket.Chat Link Test~~](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [__Rocket.Chat Link Test__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) [__**~~Rocket.Chat Link Test~~**__](https://desk.rocket.chat/support/rocketchat/ShowHomePage.do#Cases/dv/413244000073043351) marcos.defendi@rocket.chat +55991999999 \`Inline code\` \`\`\`typescript const applyMarkdownIfRequires = ( list: MessageAttachmentDefault[&#39;mrkdwn_in&#39;] = [&#39;text&#39;, &#39;pretext&#39;], key: MarkdownFields, text: string, variant: &#39;inline&#39; | &#39;inlineWithoutBreaks&#39; | &#39;document&#39; = &#39;inline&#39;, ): ReactNode =&gt; (list?.includes(key) ? &lt;MarkdownText parseEmoji variant={variant} content={text} /&gt; : text); \`\`\` 😀 😀 😀 😀 </code></pre>`,
            });
        }));
    });
});
