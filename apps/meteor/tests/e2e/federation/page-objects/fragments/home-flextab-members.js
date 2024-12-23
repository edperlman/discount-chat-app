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
exports.FederationHomeFlextabMembers = void 0;
class FederationHomeFlextabMembers {
    constructor(page) {
        this.page = page;
    }
    getUserInList(username) {
        return this.page.locator(`[data-qa="MemberItem-${username}"]`);
    }
    get addUsersButton() {
        return this.page.locator('role=button[name="Add"]');
    }
    get btnRemoveUserFromRoom() {
        return this.page.locator('[value="removeUser"]');
    }
    get btnMenuUserInfo() {
        return this.page.locator('[data-qa="UserUserInfo-menu"]');
    }
    getKebabMenuForUser(username) {
        return this.page.locator(`[data-username="${username}"] [data-testid="menu"]`);
    }
    getOptionFromKebabMenuForUser(optionName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.locator(`ol li[value="${optionName}"].rcx-option`);
        });
    }
    removeUserFromRoom(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getUserInList(username).hover();
            yield this.getKebabMenuForUser(username).click();
            yield (yield this.getOptionFromKebabMenuForUser('removeUser')).click();
            yield this.page.locator('#modal-root dialog .rcx-modal__inner .rcx-modal__footer .rcx-button--danger').click();
        });
    }
    addMultipleUsers(usernames) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, usernames_1, usernames_1_1;
            var _b, e_1, _c, _d;
            yield this.addUsersButton.click();
            try {
                for (_a = true, usernames_1 = __asyncValues(usernames); usernames_1_1 = yield usernames_1.next(), _b = usernames_1_1.done, !_b; _a = true) {
                    _d = usernames_1_1.value;
                    _a = false;
                    const username = _d;
                    yield this.page.locator('//label[contains(text(), "Choose users")]/..//input').type(username);
                    yield this.page.locator(`[data-qa-type="autocomplete-user-option"] >> text=${username}`).waitFor();
                    yield this.page.locator(`[data-qa-type="autocomplete-user-option"] >> text=${username}`).first().click();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = usernames_1.return)) yield _c.call(usernames_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield this.addUsersButton.click();
        });
    }
    showAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('.rcx-select >> text=Online').first().click();
            yield this.page.locator('.rcx-option:has-text("All")').first().click();
        });
    }
}
exports.FederationHomeFlextabMembers = FederationHomeFlextabMembers;
