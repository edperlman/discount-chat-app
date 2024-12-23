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
const constants_1 = require("../config/constants");
const createAuxContext_1 = require("../fixtures/createAuxContext");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const test_1 = require("../utils/test");
test_1.test.skip(!constants_1.IS_EE, 'Export transcript as PDF > Enterprie Only');
test_1.test.describe('omnichannel- export chat transcript as PDF', () => {
    let poLiveChat;
    let newVisitor;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser }) {
        newVisitor = (0, data_1.createFakeVisitor)();
        // Set user user 1 as manager and agent
        yield api.post('/livechat/users/agent', { username: 'user1' });
        yield api.post('/livechat/users/manager', { username: 'user1' });
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
        agent = { page, poHomeChannel: new page_objects_1.HomeOmnichannel(page) };
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.delete('/livechat/users/agent/user1');
        yield api.delete('/livechat/users/manager/user1');
        yield agent.page.close();
    }));
    (0, test_1.test)('Export PDF transcript', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('Expect send a message as a visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.goto('/livechat');
            yield poLiveChat.openLiveChat();
            yield poLiveChat.sendMessage(newVisitor, false);
            yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
        }));
        yield test_1.test.step('Expect to have 1 omnichannel assigned to agent 1', () => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise((resolve) => setTimeout(resolve, 5000));
            yield agent.poHomeChannel.sidenav.openChat(newVisitor.name);
        }));
        yield test_1.test.step('Expect to be not able send transcript as PDF', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.poHomeChannel.content.btnSendTranscript.click();
            yield agent.poHomeChannel.content.btnSendTranscriptAsPDF.hover();
            yield (0, test_1.expect)(agent.poHomeChannel.content.btnSendTranscriptAsPDF).toHaveAttribute('aria-disabled', 'true');
        }));
        yield test_1.test.step('Expect chat to be closed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.poHomeChannel.content.btnCloseChat.click();
            yield agent.poHomeChannel.content.inputModalClosingComment.type('any_comment');
            yield agent.poHomeChannel.transcript.checkboxPDF.click();
            yield agent.poHomeChannel.content.btnModalConfirm.click();
            yield (0, test_1.expect)(agent.poHomeChannel.toastSuccess).toBeVisible();
        }));
        // Exported PDF can be downloaded from rocket.cat room
        yield test_1.test.step('Expect to have exported PDF in rocket.cat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.waitForTimeout(3000);
            yield agent.poHomeChannel.sidenav.openChat('rocket.cat');
            yield (0, test_1.expect)(agent.poHomeChannel.transcript.DownloadedPDF).toBeVisible();
        }));
        // PDF can be exported from Omnichannel Contact Center
        yield test_1.test.step('Expect to have exported PDF in rocket.cat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.poHomeChannel.transcript.contactCenter.click();
            yield agent.poHomeChannel.transcript.contactCenterChats.click();
            yield agent.poHomeChannel.transcript.contactCenterSearch.type(newVisitor.name);
            yield page.waitForTimeout(3000);
            yield agent.poHomeChannel.transcript.firstRow.click();
            yield agent.poHomeChannel.transcript.btnOpenChat.click();
            yield agent.poHomeChannel.content.btnSendTranscript.click();
            yield (0, test_1.expect)(agent.poHomeChannel.content.btnSendTranscriptAsPDF).toHaveAttribute('aria-disabled', 'false');
            yield agent.poHomeChannel.content.btnSendTranscriptAsPDF.click();
            yield (0, test_1.expect)(agent.poHomeChannel.toastSuccess).toBeVisible();
        }));
    }));
});
