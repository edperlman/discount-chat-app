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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationChannel = void 0;
const home_content_1 = require("./fragments/home-content");
const home_flextab_1 = require("./fragments/home-flextab");
const home_sidenav_1 = require("./fragments/home-sidenav");
class FederationChannel {
    constructor(page) {
        this.page = page;
        this.content = new home_content_1.FederationHomeContent(page);
        this.sidenav = new home_sidenav_1.FederationSidenav(page);
        this.tabs = new home_flextab_1.FederationHomeFlextab(page);
    }
    get toastSuccess() {
        return this.page.locator('.rcx-toastbar.rcx-toastbar--success');
    }
    get toastError() {
        return this.page.locator('.rcx-toastbar.rcx-toastbar--error');
    }
    get btnContextualbarClose() {
        return this.page.locator('[data-qa="ContextualbarActionClose"]');
    }
    getFederationServerName() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.page.locator('[data-qa="federated-origin-server-name"]').locator('span').innerText()).substring(1).trim();
        });
    }
    createPublicChannelAndInviteUsersUsingCreationModal(channelName, usernamesToInvite) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, usernamesToInvite_1, usernamesToInvite_1_1;
            var _b, e_1, _c, _d;
            yield this.sidenav.openNewByLabel('Channel');
            yield this.sidenav.checkboxPrivateChannel.click();
            yield this.sidenav.checkboxFederatedChannel.click();
            yield this.sidenav.inputChannelName.type(channelName);
            try {
                for (_a = true, usernamesToInvite_1 = __asyncValues(usernamesToInvite); usernamesToInvite_1_1 = yield usernamesToInvite_1.next(), _b = usernamesToInvite_1_1.done, !_b; _a = true) {
                    _d = usernamesToInvite_1_1.value;
                    _a = false;
                    const username = _d;
                    yield this.sidenav.inviteUserToChannel(username);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = usernamesToInvite_1.return)) yield _c.call(usernamesToInvite_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield this.sidenav.btnCreateChannel.click();
        });
    }
    createDiscussionSearchingForChannel(channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sidenav.openNewByLabel('Discussion');
            yield this.page.locator('//label[text()="Parent channel or group"]/following-sibling::span//input').waitFor();
            yield this.page.locator('//label[text()="Parent channel or group"]/following-sibling::span//input').focus();
            yield this.page.locator('//label[text()="Parent channel or group"]/following-sibling::span//input').type(channelName, { delay: 100 });
        });
    }
    createTeam(teamName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sidenav.openNewByLabel('Team');
            yield this.page.locator('//label[text()="Name"]/following-sibling::span//input').type(teamName);
            yield this.sidenav.btnCreateChannel.waitFor();
            yield this.sidenav.btnCreateChannel.click();
        });
    }
    createPrivateGroupAndInviteUsersUsingCreationModal(channelName, usernamesToInvite) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, usernamesToInvite_2, usernamesToInvite_2_1;
            var _b, e_2, _c, _d;
            yield this.sidenav.openNewByLabel('Channel');
            yield this.sidenav.checkboxFederatedChannel.click();
            yield this.sidenav.inputChannelName.type(channelName);
            try {
                for (_a = true, usernamesToInvite_2 = __asyncValues(usernamesToInvite); usernamesToInvite_2_1 = yield usernamesToInvite_2.next(), _b = usernamesToInvite_2_1.done, !_b; _a = true) {
                    _d = usernamesToInvite_2_1.value;
                    _a = false;
                    const username = _d;
                    yield this.sidenav.inviteUserToChannel(username);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = usernamesToInvite_2.return)) yield _c.call(usernamesToInvite_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            yield this.sidenav.btnCreateChannel.click();
        });
    }
    createDirectMessagesUsingModal(usernamesToInvite) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, usernamesToInvite_3, usernamesToInvite_3_1;
            var _b, e_3, _c, _d;
            yield this.sidenav.openNewByLabel('Direct messages');
            try {
                for (_a = true, usernamesToInvite_3 = __asyncValues(usernamesToInvite); usernamesToInvite_3_1 = yield usernamesToInvite_3.next(), _b = usernamesToInvite_3_1.done, !_b; _a = true) {
                    _d = usernamesToInvite_3_1.value;
                    _a = false;
                    const username = _d;
                    yield this.sidenav.inviteUserToDM(username);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = usernamesToInvite_3.return)) yield _c.call(usernamesToInvite_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
            yield this.page
                .locator('//*[@id="modal-root"]//*[contains(@class, "rcx-modal__title") and contains(text(), "Direct messages")]')
                .click();
            yield this.sidenav.btnCreateChannel.click();
        });
    }
    createNonFederatedPublicChannelAndInviteUsersUsingCreationModal(channelName, usernamesToInvite) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, usernamesToInvite_4, usernamesToInvite_4_1;
            var _b, e_4, _c, _d;
            yield this.sidenav.openNewByLabel('Channel');
            yield this.sidenav.checkboxPrivateChannel.click();
            yield this.sidenav.inputChannelName.type(channelName);
            try {
                for (_a = true, usernamesToInvite_4 = __asyncValues(usernamesToInvite); usernamesToInvite_4_1 = yield usernamesToInvite_4.next(), _b = usernamesToInvite_4_1.done, !_b; _a = true) {
                    _d = usernamesToInvite_4_1.value;
                    _a = false;
                    const username = _d;
                    yield this.sidenav.inviteUserToChannel(username);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = usernamesToInvite_4.return)) yield _c.call(usernamesToInvite_4);
                }
                finally { if (e_4) throw e_4.error; }
            }
            yield this.sidenav.btnCreateChannel.click();
        });
    }
}
exports.FederationChannel = FederationChannel;
