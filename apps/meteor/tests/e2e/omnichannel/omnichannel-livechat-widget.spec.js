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
const page_objects_1 = require("../page-objects");
const test_1 = require("../utils/test");
test_1.test.describe('Omnichannel - Livechat Widget Embedded', () => {
    test_1.test.describe('Widget is working on Embedded View', () => {
        let page;
        let poLiveChat;
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
            page = yield browser.newPage();
            poLiveChat = new page_objects_1.OmnichannelLiveChatEmbedded(page);
            yield page.goto('/packages/rocketchat_livechat/assets/demo.html');
        }));
        test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield page.close();
        }));
        (0, test_1.test)('Open and Close widget', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('Expect widget to be visible while embedded in an iframe', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poLiveChat.btnOpenLiveChat()).toBeVisible();
            }));
        }));
    });
});
