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
const data_1 = require("../../mocks/data");
const createAuxContext_1 = require("../fixtures/createAuxContext");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const agents_1 = require("../utils/omnichannel/agents");
const test_1 = require("../utils/test");
const visitor = (0, data_1.createFakeVisitor)();
// Endpoint defaults are reset after each test, so if not in matrix assume is true
const endpointMatrix = [
    [{ url: '/settings/FileUpload_Enabled', value: false }],
    [{ url: '/settings/Livechat_fileupload_enabled', value: false }],
    [
        { url: '/settings/FileUpload_Enabled', value: false },
        { url: '/settings/Livechat_fileupload_enabled', value: false },
    ],
];
const beforeTest = (poLiveChat) => __awaiter(void 0, void 0, void 0, function* () {
    yield poLiveChat.page.goto('/livechat');
    yield poLiveChat.openAnyLiveChat();
    yield poLiveChat.sendMessage(visitor, false);
    yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
    yield poLiveChat.btnSendMessageToOnlineAgent.click();
    yield poLiveChat.txtChatMessage('this_a_test_message_from_user').waitFor({ state: 'visible' });
});
test_1.test.describe('OC - Livechat - OC - File Upload', () => {
    let poLiveChat;
    let poHomeOmnichannel;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        agent = yield (0, agents_1.createAgent)(api, 'user1');
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/');
        poHomeOmnichannel = new page_objects_1.HomeOmnichannel(page);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/FileUpload_Enabled', { value: true });
        yield api.post('/settings/Livechat_fileupload_enabled', { value: true });
        yield poHomeOmnichannel.page.close();
        yield agent.delete();
    }));
    // Default settings are FileUpload_Enabled true and Livechat_fileupload_enabled true
    (0, test_1.test)('OC - Livechat - txt Drag & Drop', () => __awaiter(void 0, void 0, void 0, function* () {
        yield beforeTest(poLiveChat);
        yield test_1.test.step('expect to upload a txt file', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.dragAndDropTxtFile();
            yield (0, test_1.expect)(poLiveChat.findUploadedFileLink('any_file.txt')).toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Livechat - lst Drag & Drop', () => __awaiter(void 0, void 0, void 0, function* () {
        yield beforeTest(poLiveChat);
        yield test_1.test.step('expect to upload a lst file', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.dragAndDropLstFile();
            yield (0, test_1.expect)(poLiveChat.findUploadedFileLink('lst-test.lst')).toBeVisible();
        }));
    }));
});
test_1.test.describe('OC - Livechat - OC - File Upload - Disabled', () => {
    let poLiveChat;
    let poHomeOmnichannel;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        agent = yield (0, agents_1.createAgent)(api, 'user1');
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/');
        poHomeOmnichannel = new page_objects_1.HomeOmnichannel(page);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        var _b;
        yield api.post('/settings/FileUpload_Enabled', { value: true });
        yield api.post('/settings/Livechat_fileupload_enabled', { value: true });
        yield ((_b = poHomeOmnichannel.page) === null || _b === void 0 ? void 0 : _b.close());
        yield agent.delete();
    }));
    endpointMatrix.forEach((endpoints) => {
        const testName = endpoints.map((endpoint) => { var _a; return (_a = endpoint.url.split('/').pop()) === null || _a === void 0 ? void 0 : _a.concat(`=${endpoint.value}`); }).join(' ');
        (0, test_1.test)(`OC - Livechat - txt Drag & Drop - ${testName}`, (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
            poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
            yield Promise.all(endpoints.map((endpoint) => __awaiter(void 0, void 0, void 0, function* () {
                yield api.post(endpoint.url, { value: endpoint.value });
            })));
            yield poLiveChat.page.goto('/livechat');
            yield poLiveChat.openAnyLiveChat();
            yield poLiveChat.sendMessage(visitor, false);
            yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield poLiveChat.txtChatMessage('this_a_test_message_from_user').waitFor({ state: 'visible' });
            yield test_1.test.step('expect to upload a txt file', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.dragAndDropTxtFile();
                yield (0, test_1.expect)(poLiveChat.alertMessage('File upload is disabled')).toBeVisible();
            }));
        }));
    });
});
