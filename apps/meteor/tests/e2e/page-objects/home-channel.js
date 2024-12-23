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
exports.HomeChannel = void 0;
const fragments_1 = require("./fragments");
class HomeChannel {
    constructor(page) {
        this.page = page;
        this.content = new fragments_1.HomeContent(page);
        this.sidenav = new fragments_1.HomeSidenav(page);
        this.sidebar = new fragments_1.Sidebar(page);
        this.sidepanel = new fragments_1.Sidepanel(page);
        this.navbar = new fragments_1.Navbar(page);
        this.tabs = new fragments_1.HomeFlextab(page);
    }
    get toastSuccess() {
        return this.page.locator('.rcx-toastbar.rcx-toastbar--success');
    }
    get btnContextualbarClose() {
        return this.page.locator('[data-qa="ContextualbarActionClose"]');
    }
    dismissToast() {
        return __awaiter(this, void 0, void 0, function* () {
            // this is a workaround for when the toast is blocking the click of the button
            yield this.toastSuccess.locator('button >> i.rcx-icon--name-cross.rcx-icon').click();
            yield this.page.mouse.move(0, 0);
        });
    }
    get composer() {
        return this.page.locator('textarea[name="msg"]');
    }
    get userCardToolbar() {
        return this.page.locator('[role=toolbar][aria-label="User card actions"]');
    }
    get composerToolbar() {
        return this.page.locator('[role=toolbar][aria-label="Composer Primary Actions"]');
    }
    get composerToolbarActions() {
        return this.page.locator('[role=toolbar][aria-label="Composer Primary Actions"] button');
    }
    get roomHeaderFavoriteBtn() {
        return this.page.getByRole('button', { name: 'Favorite' });
    }
    get readOnlyFooter() {
        return this.page.locator('footer', { hasText: 'This room is read only' });
    }
    get roomHeaderToolbar() {
        return this.page.locator('[role=toolbar][aria-label="Primary Room actions"]');
    }
    get markUnread() {
        return this.page.locator('role=menuitem[name="Mark Unread"]');
    }
}
exports.HomeChannel = HomeChannel;
