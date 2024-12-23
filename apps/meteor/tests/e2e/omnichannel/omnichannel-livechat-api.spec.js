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
const af_ZA_1 = require("@faker-js/faker/locale/af_ZA");
const data_1 = require("../../mocks/data");
const constants_1 = require("../config/constants");
const createAuxContext_1 = require("../fixtures/createAuxContext");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const agents_1 = require("../utils/omnichannel/agents");
const departments_1 = require("../utils/omnichannel/departments");
const test_1 = require("../utils/test");
const createFakeVisitorRegistration = (extra) => (Object.assign(Object.assign(Object.assign({}, (0, data_1.createFakeVisitor)()), { token: af_ZA_1.faker.string.uuid() }), extra));
test_1.test.describe('OC - Livechat API', () => {
    // TODO: Check if there is a way to add livechat to the global window object
    test_1.test.describe('Basic Widget Interactions', () => {
        // Tests that rely only on the widget itself, without requiring further interaction from the main RC app
        let poAuxContext;
        let poLiveChat;
        let page;
        let agent;
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
            agent = yield (0, agents_1.createAgent)(api, 'user1');
            page = yield browser.newPage();
            poLiveChat = new page_objects_1.OmnichannelLiveChatEmbedded(page);
            const { page: pageCtx } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
            poAuxContext = { page: pageCtx, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(pageCtx) };
            yield page.goto('/packages/rocketchat_livechat/assets/demo.html');
        }));
        test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.delete();
            yield poAuxContext.page.close();
            yield page.close();
        }));
        (0, test_1.test)('OC - Livechat API - Open and Close widget', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('Expect widget to be visible after maximizeWidget()', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.maximizeWidget());
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).toBeVisible();
            }));
            yield test_1.test.step('Expect widget not be visible after minimizeWidget()', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.minimizeWidget());
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
            }));
        }));
        (0, test_1.test)('OC - Livechat API - Show and Hide widget', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('Expect livechat button not be visible after minimizeWidget()', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.hideWidget());
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByRole('button', { name: 'Rocket.Chat' })).not.toBeVisible();
            }));
            yield test_1.test.step('Expect livechat button to be visible after show()', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.showWidget());
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByRole('button', { name: 'Rocket.Chat' })).toBeVisible();
            }));
        }));
        test_1.test.skip('OC - Livechat API - setAgent', () => __awaiter(void 0, void 0, void 0, function* () {
            // Set agent does not actually set the agent, it just sets the default agent on the widget state
            // Maybe that is used in an integration? Since as it is now, when the user starts a chat, the agent will be overriden
            // TODO: Find the use case of the setAgent method
            yield test_1.test.step('Expect setAgent to do something', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.setAgent({ username: 'user1', _id: 'user1' }));
            }));
        }));
        (0, test_1.test)('OC - Livechat API - setLanguage', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('Expect language to be pt-BR', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.maximizeWidget());
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.setLanguage('pt-BR'));
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Por favor, nos passe algumas informações antes de iniciar o chat')).toBeVisible();
            }));
            yield test_1.test.step('Expect language to be en', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.setLanguage('en'));
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Please, tell us some information to start the chat')).toBeVisible();
            }));
        }));
        (0, test_1.test)('OC - Livechat API - setTheme', () => __awaiter(void 0, void 0, void 0, function* () {
            const registerGuestVisitor = createFakeVisitorRegistration();
            yield test_1.test.step('Expect setTheme set color', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => {
                    window.RocketChat.livechat.maximizeWidget();
                    window.RocketChat.livechat.setTheme({ color: 'rgb(50, 50, 50)' });
                });
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').locator('header')).toHaveCSS('background-color', 'rgb(50, 50, 50)');
            }));
            yield test_1.test.step('Expect setTheme set fontColor', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => {
                    window.RocketChat.livechat.maximizeWidget();
                    window.RocketChat.livechat.setTheme({ fontColor: 'rgb(50, 50, 50)' });
                });
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').locator('header')).toHaveCSS('color', 'rgb(50, 50, 50)');
            }));
            // TODO: fix iconColor setTheme property
            // await test.step('Expect setTheme set iconColor', async () => {
            // 	await poLiveChat.page.evaluate(() => {
            // 		window.RocketChat.livechat.maximizeWidget();
            // 		window.RocketChat.livechat.setTheme({ iconColor: 'rgb(50, 50, 50)' });
            // 	});
            // 	await expect(page.frameLocator('#rocketchat-iframe').locator('header')).toHaveCSS('color', 'rgb(50, 50, 50)');
            // });
            yield test_1.test.step('Expect setTheme set title', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => {
                    window.RocketChat.livechat.maximizeWidget();
                    window.RocketChat.livechat.setTheme({ title: 'CustomTitle' });
                });
                yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.registerGuest(registerGuestVisitor), registerGuestVisitor);
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('CustomTitle')).toBeVisible();
            }));
            // await test.step('Expect setTheme set offlineTitle', async () => {
            // 	await poLiveChat.page.evaluate(() => {
            // 		window.RocketChat.livechat.maximizeWidget();
            // 		window.RocketChat.livechat.setTheme({ offlineTitle: 'CustomOfflineTitle' });
            // 	});
            // 	await expect(page.frameLocator('#rocketchat-iframe').getByText('CustomTitle')).toBeVisible();
            // });
        }));
        test_1.test.skip('OC - Livechat API - setParentUrl', () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO: check how to test this, not sure there is a clear indication of parent url changes
            yield test_1.test.step('Expect setParentUrl to do something', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.setParentUrl('http://localhost:3000'));
            }));
        }));
    });
    test_1.test.describe('Complex Widget Interactions', () => {
        // Needs Departments to test this, so needs an EE license for multiple deps
        test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
        // Tests that requires interaction from an agent or more
        let poAuxContext;
        let poLiveChat;
        let page;
        let agent;
        let agent2;
        let departments;
        let pageContext;
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            agent = yield (0, agents_1.createAgent)(api, 'user1');
            agent2 = yield (0, agents_1.createAgent)(api, 'user2');
            departments = yield Promise.all([(0, departments_1.createDepartment)(api), (0, departments_1.createDepartment)(api)]);
            const [departmentA, departmentB] = departments.map(({ data }) => data);
            yield (0, departments_1.addAgentToDepartment)(api, { department: departmentA, agentId: agent.data._id });
            yield (0, departments_1.addAgentToDepartment)(api, { department: departmentB, agentId: agent2.data._id });
            (0, test_1.expect)((yield api.post('/settings/Livechat_offline_email', { value: 'test@testing.com' })).status()).toBe(200);
        }));
        test_1.test.beforeEach((_a, testInfo_1) => __awaiter(void 0, [_a, testInfo_1], void 0, function* ({ browser }, testInfo) {
            page = yield browser.newPage();
            poLiveChat = new page_objects_1.OmnichannelLiveChatEmbedded(page);
            const { page: pageCtx } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
            poAuxContext = { page: pageCtx, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(pageCtx) };
            // This is needed since the livechat will not react to online/offline status changes if already loaded in a page
            if (testInfo.title === 'Expect onOfflineFormSubmit to trigger callback') {
                yield poAuxContext.poHomeOmnichannel.sidenav.switchStatus('offline');
            }
            else {
                yield poAuxContext.poHomeOmnichannel.sidenav.switchStatus('online');
            }
            yield page.goto('/packages/rocketchat_livechat/assets/demo.html');
        }));
        test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield poAuxContext.page.close();
            yield page.close();
            yield (pageContext === null || pageContext === void 0 ? void 0 : pageContext.close());
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield agent.delete();
            yield agent2.delete();
            yield (0, test_1.expect)((yield api.post('/settings/Omnichannel_enable_department_removal', { value: true })).status()).toBe(200);
            yield Promise.all([...departments.map((department) => department.delete())]);
            yield (0, test_1.expect)((yield api.post('/settings/Omnichannel_enable_department_removal', { value: false })).status()).toBe(200);
        }));
        // clearBusinessUnit
        // clearDepartment
        // initialize
        // maximizeWidget
        // minimizeWidget
        // pageVisited
        // registerGuest
        // setAgent
        // setBusinessUnit
        // setCustomField
        // setDepartment
        // setGuestEmail
        // setGuestName
        // setGuestToken
        // setParentUrl
        // setTheme
        test_1.test.skip('OC - Livechat API - clearBusinessUnit', () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO: check how to test this, and if this is working as intended
            yield test_1.test.step('Expect clearBusinessUnit to do something', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.clearBusinessUnit());
            }));
        }));
        test_1.test.skip('OC - Livechat API - setBusinessUnit', () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO
            yield test_1.test.step('Expect setBusinessUnit to do something', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.setBusinessUnit());
            }));
        }));
        test_1.test.skip('OC - Livechat API - setCustomField', () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO
            yield test_1.test.step('Expect setCustomField to do something', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.setCustomField({ key: 'test', value: 'test' }));
            }));
        }));
        test_1.test.skip('OC - Livechat API - clearDepartment', () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO
            yield test_1.test.step('Expect clearDepartment to do something', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.clearDepartment());
            }));
        }));
        test_1.test.describe('OC - Livechat API - setDepartment', () => {
            let poAuxContext2;
            test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
                const { page: pageCtx2 } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user2);
                poAuxContext2 = { page: pageCtx2, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(pageCtx2) };
            }));
            test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
                yield poAuxContext2.page.close();
            }));
            (0, test_1.test)('setDepartment - Called during ongoing conversation', () => __awaiter(void 0, void 0, void 0, function* () {
                const [departmentA, departmentB] = departments.map(({ data }) => data);
                const registerGuestVisitor = createFakeVisitorRegistration({
                    department: departmentA._id,
                });
                // Start Chat
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.maximizeWidget());
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).toBeVisible();
                yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.registerGuest(registerGuestVisitor), registerGuestVisitor);
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
                yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
                yield poLiveChat.btnSendMessageToOnlineAgent.click();
                yield test_1.test.step('Expect registered guest to be in dep1', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poAuxContext.poHomeOmnichannel.sidenav.openChat(registerGuestVisitor.name);
                    yield (0, test_1.expect)(poAuxContext.poHomeOmnichannel.content.channelHeader).toContainText(registerGuestVisitor.name);
                }));
                const depId = departmentB._id;
                yield test_1.test.step('Expect chat not be transferred', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poLiveChat.page.evaluate((depId) => window.RocketChat.livechat.setDepartment(depId), depId);
                    yield poAuxContext2.page.locator('role=navigation >> role=button[name=Search]').click();
                    yield poAuxContext2.page.locator('role=search >> role=searchbox').fill(registerGuestVisitor.name);
                    yield (0, test_1.expect)(poAuxContext2.page.locator(`role=search >> role=listbox >> role=link >> text="${registerGuestVisitor.name}"`)).not.toBeVisible();
                }));
                yield test_1.test.step('Expect registered guest to still be in dep1', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poAuxContext.poHomeOmnichannel.sidenav.openChat(registerGuestVisitor.name);
                    yield (0, test_1.expect)(poAuxContext.poHomeOmnichannel.content.channelHeader).toContainText(registerGuestVisitor.name);
                }));
            }));
            (0, test_1.test)('setDepartment - Called before conversation', () => __awaiter(void 0, void 0, void 0, function* () {
                const departmentB = departments[1].data;
                const registerGuestVisitor = (0, data_1.createFakeVisitor)();
                const depId = departmentB._id;
                yield poLiveChat.page.evaluate((depId) => window.RocketChat.livechat.setDepartment(depId), depId);
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.maximizeWidget());
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).toBeVisible();
                yield poLiveChat.sendMessage(registerGuestVisitor, false);
                yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
                yield poLiveChat.btnSendMessageToOnlineAgent.click();
                yield test_1.test.step('Expect registered guest to be in dep2', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poAuxContext2.page.locator('role=navigation >> role=button[name=Search]').click();
                    yield poAuxContext2.page.locator('role=search >> role=searchbox').fill(registerGuestVisitor.name);
                    yield poAuxContext2.page.locator(`role=search >> role=listbox >> role=link >> text="${registerGuestVisitor.name}"`).click();
                    yield poAuxContext2.page.locator('role=main').waitFor();
                    yield poAuxContext2.page.locator('role=main >> role=heading[level=1]').waitFor();
                    yield (0, test_1.expect)(poAuxContext2.page.locator('role=main >> .rcx-skeleton')).toHaveCount(0);
                    yield (0, test_1.expect)(poAuxContext2.page.locator('role=main >> role=list')).not.toHaveAttribute('aria-busy', 'true');
                }));
                yield test_1.test.step('Expect registered guest not to be in dep1', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poAuxContext.page.locator('role=navigation >> role=button[name=Search]').click();
                    yield poAuxContext.page.locator('role=search >> role=searchbox').fill(registerGuestVisitor.name);
                    yield (0, test_1.expect)(poAuxContext.page.locator(`role=search >> role=listbox >> role=link >> text="${registerGuestVisitor.name}"`)).not.toBeVisible();
                }));
            }));
        });
        test_1.test.describe('OC - Livechat API - transferChat', () => {
            let poAuxContext2;
            test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
                const { page: pageCtx2 } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user2);
                poAuxContext2 = { page: pageCtx2, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(pageCtx2) };
            }));
            test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
                yield poAuxContext2.page.close();
            }));
            (0, test_1.test)('transferChat - Called during ongoing conversation', () => __awaiter(void 0, void 0, void 0, function* () {
                const [departmentA, departmentB] = departments.map(({ data }) => data);
                const registerGuestVisitor = createFakeVisitorRegistration({
                    department: departmentA._id,
                });
                // Start Chat
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.maximizeWidget());
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).toBeVisible();
                yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.registerGuest(registerGuestVisitor), registerGuestVisitor);
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
                yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
                yield poLiveChat.btnSendMessageToOnlineAgent.click();
                yield test_1.test.step('Expect registered guest to be in dep1', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poAuxContext.poHomeOmnichannel.sidenav.openChat(registerGuestVisitor.name);
                    yield (0, test_1.expect)(poAuxContext.poHomeOmnichannel.content.channelHeader).toContainText(registerGuestVisitor.name);
                }));
                const depId = departmentB._id;
                yield test_1.test.step('Expect chat to be transferred', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poLiveChat.page.evaluate((depId) => window.RocketChat.livechat.transferChat(depId), depId);
                    yield poAuxContext2.page.locator('role=navigation >> role=button[name=Search]').click();
                    yield poAuxContext2.page.locator('role=search >> role=searchbox').fill(registerGuestVisitor.name);
                    yield (0, test_1.expect)(poAuxContext2.page.locator(`role=search >> role=listbox >> role=link >> text="${registerGuestVisitor.name}"`)).toBeVisible();
                }));
            }));
        });
        (0, test_1.test)('OC - Livechat API - registerGuest', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
            const registerGuestVisitor = createFakeVisitorRegistration();
            yield test_1.test.step('Expect registerGuest to create a valid guest', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.maximizeWidget());
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).toBeVisible();
                yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.registerGuest(registerGuestVisitor), registerGuestVisitor);
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
                yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
                yield poLiveChat.btnSendMessageToOnlineAgent.click();
            }));
            yield test_1.test.step('Expect registered guest to have valid info', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poAuxContext.poHomeOmnichannel.sidenav.openChat(registerGuestVisitor.name);
                yield poAuxContext.poHomeOmnichannel.content.btnGuestInfo.click();
                // For some reason the guest info email information is being set to lowercase
                yield (0, test_1.expect)(poAuxContext.poHomeOmnichannel.content.infoContactEmail).toHaveText(registerGuestVisitor.email.toLowerCase());
            }));
            yield test_1.test.step('Expect registerGuest to log in an existing guest and load chat history', () => __awaiter(void 0, void 0, void 0, function* () {
                ({ page: pageContext } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1));
                yield pageContext.goto('/packages/rocketchat_livechat/assets/demo.html');
                yield pageContext.evaluate(() => window.RocketChat.livechat.maximizeWidget());
                yield (0, test_1.expect)(pageContext.frameLocator('#rocketchat-iframe').getByText('Start Chat')).toBeVisible();
                yield pageContext.evaluate((registerGuestVisitor) => window.RocketChat.livechat.registerGuest(registerGuestVisitor), registerGuestVisitor);
                yield (0, test_1.expect)(pageContext.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
                yield (0, test_1.expect)(pageContext.frameLocator('#rocketchat-iframe').getByText('this_a_test_message_from_visitor')).toBeVisible();
            }));
        }));
        (0, test_1.test)('OC - Livechat API - registerGuest different guests', () => __awaiter(void 0, void 0, void 0, function* () {
            const registerGuestVisitor1 = createFakeVisitorRegistration();
            const registerGuestVisitor2 = createFakeVisitorRegistration();
            yield test_1.test.step('Expect registerGuest to create guest 1', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.maximizeWidget());
                yield (0, test_1.expect)(poLiveChat.page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).toBeVisible();
                yield poLiveChat.page.evaluate((registerGuestVisitor1) => window.RocketChat.livechat.registerGuest(registerGuestVisitor1), registerGuestVisitor1);
                yield (0, test_1.expect)(poLiveChat.page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
                yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor_1');
                yield poLiveChat.btnSendMessageToOnlineAgent.click();
                yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_a_test_message_from_visitor_1')).toBeVisible();
                yield poAuxContext.poHomeOmnichannel.sidenav.openChat(registerGuestVisitor1.name);
                yield poAuxContext.poHomeOmnichannel.content.sendMessage('this_is_a_test_message_from_agent');
                yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_is_a_test_message_from_agent')).toBeVisible();
            }));
            yield test_1.test.step('Expect registerGuest to create guest 2', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate((registerGuestVisitor2) => window.RocketChat.livechat.registerGuest(registerGuestVisitor2), registerGuestVisitor2);
                // wait for load messages to happen
                yield page.waitForResponse((response) => response.url().includes(`token=${registerGuestVisitor2.token}`));
                yield poLiveChat.page
                    .frameLocator('#rocketchat-iframe')
                    .getByText('this_a_test_message_from_visitor_1')
                    .waitFor({ state: 'hidden' });
                yield (0, test_1.expect)(poLiveChat.page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
                yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor_2');
                yield poLiveChat.btnSendMessageToOnlineAgent.click();
                yield poLiveChat.txtChatMessage('this_a_test_message_from_visitor_2').waitFor({ state: 'visible' });
                yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_a_test_message_from_visitor_2')).toBeVisible();
            }));
        }));
        (0, test_1.test)('OC - Livechat API - registerGuest multiple times', () => __awaiter(void 0, void 0, void 0, function* () {
            const registerGuestVisitor = createFakeVisitorRegistration();
            yield test_1.test.step('Expect registerGuest work with the same token, multiple times', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.maximizeWidget());
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).toBeVisible();
                yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.registerGuest(registerGuestVisitor), registerGuestVisitor);
                yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
                yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
                yield poLiveChat.btnSendMessageToOnlineAgent.click();
                yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_a_test_message_from_visitor')).toBeVisible();
                yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.registerGuest(registerGuestVisitor), registerGuestVisitor);
                yield page.waitForResponse('**/api/v1/livechat/visitor');
                yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_a_test_message_from_visitor')).toBeVisible();
                yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.registerGuest(registerGuestVisitor), registerGuestVisitor);
                yield page.waitForResponse('**/api/v1/livechat/visitor');
                yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_a_test_message_from_visitor')).toBeVisible();
            }));
        }));
        test_1.test.skip('OC - Livechat API - setGuestEmail', () => __awaiter(void 0, void 0, void 0, function* () {
            const registerGuestVisitor = createFakeVisitorRegistration();
            // Start Chat
            yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.maximizeWidget());
            yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).toBeVisible();
            yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.registerGuest(registerGuestVisitor), registerGuestVisitor);
            yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
            yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield test_1.test.step('Expect setGuestEmail to change a guest email', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.setGuestEmail(`changed${registerGuestVisitor.email}`), registerGuestVisitor);
            }));
            yield test_1.test.step('Expect registered guest to have valid info', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poAuxContext.poHomeOmnichannel.sidenav.openChat(registerGuestVisitor.name);
                yield poAuxContext.poHomeOmnichannel.content.btnGuestInfo.click();
                // For some reason the guest info email information is being set to lowercase
                yield (0, test_1.expect)(poAuxContext.poHomeOmnichannel.content.infoContactEmail).toHaveText(`changed${registerGuestVisitor.email}`.toLowerCase());
            }));
        }));
        (0, test_1.test)('OC - Livechat API - setGuestName', () => __awaiter(void 0, void 0, void 0, function* () {
            const registerGuestVisitor = createFakeVisitorRegistration();
            // Start Chat
            yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.maximizeWidget());
            yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).toBeVisible();
            yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.registerGuest(registerGuestVisitor), registerGuestVisitor);
            yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
            yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield poAuxContext.poHomeOmnichannel.sidenav.openChat(registerGuestVisitor.name);
            yield test_1.test.step('Expect setGuestEmail to change a guest email', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.setGuestName(`changed${registerGuestVisitor.name}`), registerGuestVisitor);
            }));
            yield test_1.test.step('Expect registered guest to have valid info', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poAuxContext.poHomeOmnichannel.content.infoHeaderName).toContainText(`changed${registerGuestVisitor.name}`);
            }));
        }));
        (0, test_1.test)('OC - Livechat API - setGuestToken', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
            const registerGuestVisitor = createFakeVisitorRegistration();
            // Register guest and send a message
            yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.maximizeWidget());
            yield poLiveChat.page.evaluate((registerGuestVisitor) => window.RocketChat.livechat.registerGuest(registerGuestVisitor), registerGuestVisitor);
            yield (0, test_1.expect)(page.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
            yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield test_1.test.step('Expect setGuestToken to log in an existing guest and load chat history', () => __awaiter(void 0, void 0, void 0, function* () {
                ({ page: pageContext } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1));
                yield pageContext.goto('/packages/rocketchat_livechat/assets/demo.html');
                yield pageContext.evaluate(() => window.RocketChat.livechat.maximizeWidget());
                yield (0, test_1.expect)(pageContext.frameLocator('#rocketchat-iframe').getByText('Start Chat')).toBeVisible();
                yield pageContext.evaluate((registerGuestVisitor) => window.RocketChat.livechat.setGuestToken(registerGuestVisitor.token), registerGuestVisitor);
                yield (0, test_1.expect)(pageContext.frameLocator('#rocketchat-iframe').getByText('Start Chat')).not.toBeVisible();
                yield (0, test_1.expect)(pageContext.frameLocator('#rocketchat-iframe').getByText('this_a_test_message_from_visitor')).toBeVisible();
            }));
        }));
    });
    test_1.test.describe('Widget Listeners', () => {
        // Tests that listen to events from the widget, and check if they are being triggered
        let poAuxContext;
        let poLiveChat;
        let page;
        let agent;
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            agent = yield (0, agents_1.createAgent)(api, 'user1');
            (0, test_1.expect)((yield api.post('/settings/Livechat_offline_email', { value: 'test@testing.com' })).status()).toBe(200);
        }));
        test_1.test.beforeEach((_a, testInfo_1) => __awaiter(void 0, [_a, testInfo_1], void 0, function* ({ browser }, testInfo) {
            page = yield browser.newPage();
            poLiveChat = new page_objects_1.OmnichannelLiveChatEmbedded(page);
            const { page: pageCtx } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
            poAuxContext = { page: pageCtx, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(pageCtx) };
            // This is needed since the livechat will not react to online/offline status changes if already loaded in a page
            if (testInfo.title === 'Expect onOfflineFormSubmit to trigger callback') {
                yield poAuxContext.poHomeOmnichannel.sidenav.switchStatus('offline');
            }
            else {
                yield poAuxContext.poHomeOmnichannel.sidenav.switchStatus('online');
            }
            yield page.goto('/packages/rocketchat_livechat/assets/demo.html');
        }));
        test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield poAuxContext.page.close();
            yield page.close();
        }));
        test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.delete();
        }));
        (0, test_1.test)('OC - Livechat API - onChatMaximized & onChatMinimized', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('Expect onChatMaximized to trigger callback', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => new Promise((resolve) => {
                    window.RocketChat.livechat.onChatMaximized(() => {
                        resolve();
                    });
                    window.RocketChat.livechat.maximizeWidget();
                }));
            }));
            yield test_1.test.step('Expect onChatMinimized to trigger callback', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => new Promise((resolve) => {
                    window.RocketChat.livechat.onChatMinimized(() => {
                        resolve();
                    });
                    window.RocketChat.livechat.minimizeWidget();
                }));
            }));
        }));
        (0, test_1.test)('OC - Livechat API - onChatStarted & onChatEnded', () => __awaiter(void 0, void 0, void 0, function* () {
            const newVisitor = (0, data_1.createFakeVisitor)();
            yield test_1.test.step('Expect onChatStarted to trigger callback', () => __awaiter(void 0, void 0, void 0, function* () {
                const watchForTrigger = page.waitForFunction(() => window.onChatStarted === true);
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.onChatStarted(() => {
                    window.onChatStarted = true;
                }));
                yield poLiveChat.openLiveChat();
                yield poLiveChat.sendMessage(newVisitor, false);
                yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
                yield poLiveChat.btnSendMessageToOnlineAgent.click();
                yield watchForTrigger;
            }));
            yield test_1.test.step('Expect onChatEnded to trigger callback', () => __awaiter(void 0, void 0, void 0, function* () {
                const watchForTrigger = page.waitForFunction(() => window.onChatEnded === true);
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.onChatEnded(() => {
                    window.onChatEnded = true;
                }));
                yield poAuxContext.poHomeOmnichannel.sidenav.openChat(newVisitor.name);
                yield poAuxContext.poHomeOmnichannel.content.btnCloseChat.click();
                yield poAuxContext.poHomeOmnichannel.content.closeChatModal.inputComment.fill('this_is_a_test_comment');
                yield poAuxContext.poHomeOmnichannel.content.closeChatModal.btnConfirm.click();
                yield (0, test_1.expect)(poAuxContext.poHomeOmnichannel.toastSuccess).toBeVisible();
                yield watchForTrigger;
            }));
        }));
        (0, test_1.test)('OC - Livechat API - onPrechatFormSubmit & onAssignAgent', () => __awaiter(void 0, void 0, void 0, function* () {
            const newVisitor = (0, data_1.createFakeVisitor)();
            yield test_1.test.step('Expect onPrechatFormSubmit to trigger callback', () => __awaiter(void 0, void 0, void 0, function* () {
                const watchForTrigger = page.waitForFunction(() => window.onPrechatFormSubmit === true);
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.onPrechatFormSubmit(() => {
                    window.onPrechatFormSubmit = true;
                }));
                yield poLiveChat.openLiveChat();
                yield poLiveChat.sendMessage(newVisitor, false);
                yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
                yield poLiveChat.btnSendMessageToOnlineAgent.click();
                yield watchForTrigger;
            }));
            yield test_1.test.step('Expect onAssignAgent to trigger callback', () => __awaiter(void 0, void 0, void 0, function* () {
                const watchForTrigger = page.waitForFunction(() => window.onAssignAgent === true);
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.onAssignAgent(() => {
                    window.onAssignAgent = true;
                }));
                yield poLiveChat.btnSendMessageToOnlineAgent.click();
                yield watchForTrigger;
            }));
        }));
        // TODO: Fix this Flaky test
        test_1.test.skip('onAgentStatusChange', () => __awaiter(void 0, void 0, void 0, function* () {
            const newVisitor = (0, data_1.createFakeVisitor)();
            yield poLiveChat.openLiveChat();
            yield poLiveChat.sendMessage(newVisitor, false);
            yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            const watchForTrigger = page.waitForFunction(() => window.onAgentStatusChange === true);
            yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.onAgentStatusChange(() => {
                window.onAgentStatusChange = true;
            }));
            yield poAuxContext.poHomeOmnichannel.sidenav.openChat(newVisitor.name);
            yield poAuxContext.poHomeOmnichannel.sidenav.switchStatus('offline');
            yield watchForTrigger;
        }));
        (0, test_1.test)('OC - Livechat API - onOfflineFormSubmit', () => __awaiter(void 0, void 0, void 0, function* () {
            const newVisitor = (0, data_1.createFakeVisitor)();
            yield poAuxContext.poHomeOmnichannel.sidenav.switchStatus('offline');
            const watchForTrigger = page.waitForFunction(() => window.onOfflineFormSubmit === true);
            yield poLiveChat.page.reload();
            yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.onOfflineFormSubmit(() => {
                window.onOfflineFormSubmit = true;
            }));
            yield poLiveChat.openLiveChat();
            yield poLiveChat.sendMessage(newVisitor, true);
            yield watchForTrigger;
        }));
        (0, test_1.test)('OC - Livechat API - onWidgetHidden & onWidgetShown', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('Expect onWidgetHidden to trigger callback', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => new Promise((resolve) => {
                    window.RocketChat.livechat.onWidgetHidden(() => {
                        resolve();
                    });
                    window.RocketChat.livechat.hideWidget();
                }));
            }));
            yield test_1.test.step('Expect onWidgetShown to trigger callback', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => new Promise((resolve) => {
                    window.RocketChat.livechat.onWidgetShown(() => {
                        resolve();
                    });
                    window.RocketChat.livechat.showWidget();
                }));
            }));
        }));
        test_1.test.skip('OC - Livechat API - onServiceOffline', () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO: Not sure how to test this, need to check if playwright has a way to mock a server disconnect
            yield test_1.test.step('Expect onServiceOffline to do something', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.onServiceOffline(() => console.log('onServiceOffline')));
            }));
        }));
        test_1.test.skip('OC - Livechat API - onQueuePositionChange', () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO
            yield test_1.test.step('Expect onQueuePositionChange to do something', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.onQueuePositionChange(() => console.log('onQueuePositionChange')));
            }));
        }));
    });
});
