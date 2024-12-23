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
exports.HomeFlextabMembers = void 0;
class HomeFlextabMembers {
    constructor(page) {
        this.page = page;
    }
    memberOption(username) {
        return this.page.getByRole('dialog').locator('li', { hasText: username });
    }
    openMemberInfo(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.memberOption(username).click();
        });
    }
    getMenuItemAction(action) {
        return this.page.locator(`role=menuitem[name="${action}"]`);
    }
    openMoreActions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=button[name="More"]').click();
        });
    }
    openMemberOptionMoreActions(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.memberOption(username).hover();
            yield this.memberOption(username).locator('role=button[name="More"]').click();
        });
    }
    addUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=button[name="Add"]').click();
            yield this.page.locator('//label[contains(text(), "Choose users")]/..//input').fill(username);
            yield this.page.locator(`[data-qa-type="autocomplete-user-option"] >> text=${username}`).first().click();
            yield this.page.locator('role=button[name="Add users"]').click();
        });
    }
    inviteUser() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=button[name="Invite Link"]').click();
        });
    }
    muteUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openMemberOptionMoreActions(username);
            yield this.getMenuItemAction('Mute user').click();
            yield this.page.locator('.rcx-modal .rcx-button--danger').click();
            yield this.page.getByRole('dialog').getByRole('button').first().click();
        });
    }
    unmuteUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openMemberOptionMoreActions(username);
            yield this.getMenuItemAction('Unmute user').click();
        });
    }
    setUserAsModerator(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openMemberOptionMoreActions(username);
            yield this.getMenuItemAction('Set as moderator').click();
        });
    }
    setUserAsOwner(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openMemberOptionMoreActions(username);
            yield this.getMenuItemAction('Set as owner').click();
        });
    }
    showAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('.rcx-select >> text=Online').first().click();
            yield this.page.locator('.rcx-option:has-text("All")').first().click();
        });
    }
    ignoreUserAction(action, username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openMemberInfo(username);
            yield this.openMoreActions();
            yield this.getMenuItemAction(action).click();
        });
    }
    ignoreUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ignoreUserAction('Ignore', username);
        });
    }
    unignoreUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ignoreUserAction('Unignore', username);
        });
    }
    get confirmRemoveUserModal() {
        return this.page.getByRole('dialog', { name: 'Confirmation', exact: true });
    }
    confirmRemoveUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.confirmRemoveUserModal.getByRole('button', { name: 'Remove', exact: true }).click();
        });
    }
}
exports.HomeFlextabMembers = HomeFlextabMembers;
