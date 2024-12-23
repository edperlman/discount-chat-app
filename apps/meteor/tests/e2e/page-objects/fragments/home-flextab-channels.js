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
exports.HomeFlextabChannels = void 0;
class HomeFlextabChannels {
    constructor(page) {
        this.page = page;
    }
    get channelsTab() {
        return this.page.getByRole('dialog', { exact: true });
    }
    get btnAddExisting() {
        return this.page.locator('button >> text="Add Existing"');
    }
    get btnCreateNew() {
        return this.page.locator('button >> text="Create new"');
    }
    get inputChannels() {
        return this.page.locator('#modal-root input').first();
    }
    get btnAdd() {
        return this.page.locator('role=dialog >> role=group >> role=button[name=Add]');
    }
    get channelsList() {
        return this.channelsTab.getByRole('list');
    }
    channelOption(name) {
        return this.channelsTab.locator('li', { hasText: name });
    }
    openChannelOptionMoreActions(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channelOption(name).hover();
            yield this.channelOption(name).locator('role=button[name="More"]').click();
        });
    }
    confirmRemoveChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page
                .getByRole('dialog', { name: 'Are you sure?', exact: true })
                .getByRole('button', { name: 'Remove', exact: true })
                .click();
        });
    }
    confirmDeleteRoom() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.getByRole('button', { name: 'Yes, delete', exact: true }).click();
        });
    }
}
exports.HomeFlextabChannels = HomeFlextabChannels;
