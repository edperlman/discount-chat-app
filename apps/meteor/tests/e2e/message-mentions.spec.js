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
const faker_1 = require("@faker-js/faker");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const utils_1 = require("./utils");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
const getMentionText = (username, kind) => {
    if (kind === 1) {
        return `You mentioned ${username}, but they're not in this room.`;
    }
    if (kind === 2) {
        return `You mentioned ${username}, but they're not in this room. You can ask a room admin to add them.`;
    }
    if (kind === 3) {
        return `You mentioned ${username}, but they're not in this room. You let them know via DM.`;
    }
    return `Hello @${username}, how are you`;
};
test_1.test.describe.serial('Should not allow to send @all mention if permission to do so is disabled', () => {
    let poHomeChannel;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    let targetChannel2;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'mention-all', roles: [] }] })).status()).toBe(200);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'mention-all', roles: ['admin', 'owner', 'moderator', 'user'] }] })).status()).toBe(200);
        yield (0, utils_1.deleteChannel)(api, targetChannel2);
    }));
    (0, test_1.test)('expect to receive an error as notification when sending @all while permission is disabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const adminPage = new page_objects_1.HomeChannel(page);
        yield test_1.test.step('create private room', () => __awaiter(void 0, void 0, void 0, function* () {
            targetChannel2 = faker_1.faker.string.uuid();
            yield poHomeChannel.sidenav.openNewByLabel('Channel');
            yield poHomeChannel.sidenav.inputChannelName.type(targetChannel2);
            yield poHomeChannel.sidenav.btnCreate.click();
            yield (0, test_1.expect)(page).toHaveURL(`/group/${targetChannel2}`);
        }));
        yield test_1.test.step('receive notify message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield adminPage.content.sendMessage('@all ');
            yield (0, test_1.expect)(adminPage.content.lastUserMessage).toContainText('Notify all in this room is not allowed');
        }));
    }));
});
test_1.test.describe.serial('Should not allow to send @here mention if permission to do so is disabled', () => {
    let poHomeChannel;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    let targetChannel2;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'mention-here', roles: [] }] })).status()).toBe(200);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'mention-here', roles: ['admin', 'owner', 'moderator', 'user'] }] })).status()).toBe(200);
        yield (0, utils_1.deleteChannel)(api, targetChannel2);
    }));
    (0, test_1.test)('expect to receive an error as notification when sending here while permission is disabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const adminPage = new page_objects_1.HomeChannel(page);
        yield test_1.test.step('create private room', () => __awaiter(void 0, void 0, void 0, function* () {
            targetChannel2 = faker_1.faker.string.uuid();
            yield poHomeChannel.sidenav.openNewByLabel('Channel');
            yield poHomeChannel.sidenav.inputChannelName.type(targetChannel2);
            yield poHomeChannel.sidenav.btnCreate.click();
            yield (0, test_1.expect)(page).toHaveURL(`/group/${targetChannel2}`);
        }));
        yield test_1.test.step('receive notify message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield adminPage.content.sendMessage('@here ');
            yield (0, test_1.expect)(adminPage.content.lastUserMessage).toContainText('Notify all in this room is not allowed');
        }));
    }));
});
test_1.test.describe.serial('message-mentions', () => {
    let poHomeChannel;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('expect show "all" and "here" options', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openChat('general');
        yield poHomeChannel.content.inputMessage.type('@');
        yield (0, test_1.expect)(poHomeChannel.content.messagePopupUsers.locator('role=listitem >> text="all"')).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.content.messagePopupUsers.locator('role=listitem >> text="here"')).toBeVisible();
    }));
    test_1.test.describe('users not in channel', () => {
        let targetChannel;
        let targetChannel2;
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            targetChannel = yield (0, utils_1.createTargetPrivateChannel)(api);
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, utils_1.deleteChannel)(api, targetChannel);
        }));
        (0, test_1.test)('all actions', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            const adminPage = new page_objects_1.HomeChannel(page);
            const mentionText = getMentionText(userStates_1.Users.user1.data.username, 1);
            yield test_1.test.step('receive bot message', () => __awaiter(void 0, void 0, void 0, function* () {
                yield adminPage.sidenav.openChat(targetChannel);
                yield adminPage.content.sendMessage(getMentionText(userStates_1.Users.user1.data.username));
                yield (0, test_1.expect)(adminPage.content.lastUserMessage.locator('.rcx-message-block')).toContainText(mentionText);
            }));
            yield test_1.test.step('show "Do nothing" action', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(adminPage.content.lastUserMessage.locator('button >> text="Do nothing"')).toBeVisible();
            }));
            yield test_1.test.step('show "Add them" action', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(adminPage.content.lastUserMessage.locator('button >> text="Add them"')).toBeVisible();
            }));
            yield test_1.test.step('show "Let them know" action', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(adminPage.content.lastUserMessage.locator('button >> text="Let them know"')).toBeVisible();
            }));
            yield test_1.test.step('dismiss', () => __awaiter(void 0, void 0, void 0, function* () {
                yield adminPage.content.lastUserMessage.locator('button >> text="Do nothing"').click();
            }));
            yield test_1.test.step('receive second bot message', () => __awaiter(void 0, void 0, void 0, function* () {
                yield adminPage.content.sendMessage(getMentionText(userStates_1.Users.user1.data.username));
                yield (0, test_1.expect)(adminPage.content.lastUserMessage.locator('.rcx-message-block')).toContainText(mentionText);
            }));
            yield test_1.test.step('send message to users', () => __awaiter(void 0, void 0, void 0, function* () {
                yield adminPage.content.lastUserMessage.locator('button >> text="Let them know"').click();
                yield (0, test_1.expect)(adminPage.content.lastUserMessageBody).toContainText(getMentionText(userStates_1.Users.user1.data.username, 3));
            }));
            yield test_1.test.step('receive third bot message', () => __awaiter(void 0, void 0, void 0, function* () {
                yield adminPage.content.sendMessage(getMentionText(userStates_1.Users.user1.data.username));
                yield (0, test_1.expect)(adminPage.content.lastUserMessage.locator('.rcx-message-block')).toContainText(mentionText);
            }));
            yield test_1.test.step('add users to room', () => __awaiter(void 0, void 0, void 0, function* () {
                yield adminPage.content.lastUserMessage.locator('button >> text="Add them"').click();
                yield (0, test_1.expect)(adminPage.content.lastSystemMessageBody).toContainText('added');
            }));
        }));
        test_1.test.describe(() => {
            test_1.test.use({ storageState: userStates_1.Users.user1.state });
            (0, test_1.test)('dismiss and share message actions', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                const mentionText = getMentionText(userStates_1.Users.user2.data.username, 1);
                const userPage = new page_objects_1.HomeChannel(page);
                yield test_1.test.step('receive bot message', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield userPage.sidenav.openChat(targetChannel);
                    yield userPage.content.sendMessage(getMentionText(userStates_1.Users.user2.data.username));
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('.rcx-message-block')).toContainText(mentionText);
                }));
                yield test_1.test.step('show "Do nothing" action', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('button >> text="Do nothing"')).toBeVisible();
                }));
                yield test_1.test.step('show "Let them know" action', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('button >> text="Let them know"')).toBeVisible();
                }));
                yield test_1.test.step('not show "Add them action', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('button >> text="Add them"')).not.toBeVisible();
                }));
                yield test_1.test.step('dismiss', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield userPage.content.lastUserMessage.locator('button >> text="Do nothing"').click();
                }));
                yield test_1.test.step('receive second bot message', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield userPage.sidenav.openChat(targetChannel);
                    yield userPage.content.sendMessage(getMentionText(userStates_1.Users.user2.data.username));
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('.rcx-message-block')).toContainText(mentionText);
                }));
                yield test_1.test.step('send message to users', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield userPage.content.lastUserMessage.locator('button >> text="Let them know"').click();
                    yield (0, test_1.expect)(userPage.content.lastUserMessageBody).toContainText(getMentionText(userStates_1.Users.user2.data.username, 3));
                }));
            }));
        });
        test_1.test.describe(() => {
            test_1.test.use({ storageState: userStates_1.Users.user1.state });
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'create-d', roles: ['admin'] }] })).status()).toBe(200);
            }));
            test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'create-d', roles: ['admin', 'user', 'bot', 'app'] }] })).status()).toBe(200);
            }));
            (0, test_1.test)('dismiss and add users actions', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                const mentionText = getMentionText(userStates_1.Users.user2.data.username, 1);
                const userPage = new page_objects_1.HomeChannel(page);
                yield test_1.test.step('create private room', () => __awaiter(void 0, void 0, void 0, function* () {
                    targetChannel2 = faker_1.faker.string.uuid();
                    yield poHomeChannel.sidenav.openNewByLabel('Channel');
                    yield poHomeChannel.sidenav.inputChannelName.type(targetChannel2);
                    yield poHomeChannel.sidenav.btnCreate.click();
                    yield (0, test_1.expect)(page).toHaveURL(`/group/${targetChannel2}`);
                }));
                yield test_1.test.step('receive bot message', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield userPage.sidenav.openChat(targetChannel2);
                    yield userPage.content.sendMessage(getMentionText(userStates_1.Users.user2.data.username));
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('.rcx-message-block')).toContainText(mentionText);
                }));
                yield test_1.test.step('show "Do nothing" action', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('button >> text="Do nothing"')).toBeVisible();
                }));
                yield test_1.test.step('show "Add them" action', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('button >> text="Add them"')).toBeVisible();
                }));
                yield test_1.test.step('not show "Let them know" action', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('button >> text="Let them know"')).not.toBeVisible();
                }));
                yield test_1.test.step('dismiss', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield userPage.content.lastUserMessage.locator('button >> text="Do nothing"').click();
                }));
                yield test_1.test.step('receive second bot message', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield userPage.sidenav.openChat(targetChannel2);
                    yield userPage.content.sendMessage(getMentionText(userStates_1.Users.user2.data.username));
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('.rcx-message-block')).toContainText(mentionText);
                }));
                yield test_1.test.step('add users to room', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield userPage.content.lastUserMessage.locator('button >> text="Add them"').click();
                    yield (0, test_1.expect)(userPage.content.lastSystemMessageBody).toContainText('added');
                }));
            }));
        });
        test_1.test.describe(() => {
            test_1.test.use({ storageState: userStates_1.Users.user2.state });
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'create-d', roles: ['admin'] }] })).status()).toBe(200);
            }));
            test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'create-d', roles: ['admin', 'user', 'bot', 'app'] }] })).status()).toBe(200);
            }));
            (0, test_1.test)('no actions', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                const userPage = new page_objects_1.HomeChannel(page);
                yield test_1.test.step('receive bot message', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield userPage.sidenav.openChat(targetChannel2);
                    yield userPage.content.sendMessage(getMentionText(userStates_1.Users.user3.data.username));
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('.rcx-message-block')).toContainText(getMentionText(userStates_1.Users.user3.data.username, 2));
                }));
                yield test_1.test.step('not show "Do nothing" action', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('button >> text="Do nothing"')).not.toBeVisible();
                }));
                yield test_1.test.step('not show "Add them" action', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('button >> text="Add them"')).not.toBeVisible();
                }));
                yield test_1.test.step('not show "Let them know" action', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('button >> text="Let them know"')).not.toBeVisible();
                }));
            }));
        });
        test_1.test.describe('team mention', () => {
            let team;
            test_1.test.use({ storageState: userStates_1.Users.user1.state });
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                team = yield (0, utils_1.createTargetTeam)(api);
            }));
            test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                yield (0, utils_1.deleteTeam)(api, team);
            }));
            (0, test_1.test)('should not receive bot message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                const userPage = new page_objects_1.HomeChannel(page);
                yield test_1.test.step('do not receive bot message', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield userPage.sidenav.openChat(targetChannel);
                    yield userPage.content.sendMessage(getMentionText(team));
                    yield (0, test_1.expect)(userPage.content.lastUserMessage.locator('.rcx-message-block')).not.toBeVisible();
                }));
            }));
        });
    });
});
