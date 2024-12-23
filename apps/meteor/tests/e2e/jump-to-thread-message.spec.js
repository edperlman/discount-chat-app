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
const userStates_1 = require("./fixtures/userStates");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('Threads', () => {
    let targetChannel;
    let threadMessage;
    let mainMessage;
    const fillMessages = (api) => __awaiter(void 0, void 0, void 0, function* () {
        const { message: parentMessage } = yield (yield api.post('/chat.postMessage', { roomId: targetChannel._id, text: 'this is a message for reply' })).json();
        mainMessage = parentMessage;
        // fill thread with messages
        const largeSimpleMessage = 'This is a large message with a lot of text to create scroll view in thread'.repeat(5);
        const { message: childMessage } = yield (yield api.post('/chat.postMessage', { roomId: targetChannel._id, text: largeSimpleMessage, tmid: parentMessage._id })).json();
        threadMessage = childMessage;
        yield Promise.all(Array.from({ length: 5 }).map(() => api.post('/chat.postMessage', { roomId: targetChannel._id, text: largeSimpleMessage, tmid: parentMessage._id })));
        // fill room with normal messages
        yield Promise.all(Array.from({ length: 5 }).map(() => api.post('/chat.postMessage', { roomId: targetChannel._id, text: largeSimpleMessage })));
    });
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = (yield (yield api.post('/channels.create', { name: random_1.Random.id() })).json()).channel;
        yield fillMessages(api);
    }));
    test_1.test.afterAll(({ api }) => api.post('/channels.delete', { roomId: targetChannel._id }));
    (0, test_1.test)('expect to jump scroll to a non-thread message on opening its message link', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const messageLink = `/channel/${targetChannel.name}?msg=${mainMessage._id}`;
        yield page.goto(messageLink);
        const message = yield page.locator(`[aria-label=\"Message list\"] [data-id=\"${mainMessage._id}\"]`);
        yield (0, test_1.expect)(message).toBeVisible();
        yield (0, test_1.expect)(message).toBeInViewport();
    }));
    (0, test_1.test)('expect to jump scroll to thread message on opening its message link', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const threadMessageLink = `/channel/general?msg=${threadMessage._id}`;
        yield page.goto(threadMessageLink);
        const message = yield page.locator(`[aria-label=\"Thread message list\"] [data-id=\"${threadMessage._id}\"]`);
        yield (0, test_1.expect)(message).toBeVisible();
        yield (0, test_1.expect)(message).toBeInViewport();
    }));
});
