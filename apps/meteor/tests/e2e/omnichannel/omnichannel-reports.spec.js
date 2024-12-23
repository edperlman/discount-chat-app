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
const constants_1 = require("../config/constants");
const userStates_1 = require("../fixtures/userStates");
const omnichannel_reports_1 = require("../page-objects/omnichannel-reports");
const test_1 = require("../utils/test");
const ENDPOINTS = {
    BY_STATUS: /\/v1\/livechat\/analytics\/dashboards\/conversations-by-status/,
    BY_SOURCE: /\/v1\/livechat\/analytics\/dashboards\/conversations-by-source/,
    BY_DEPARTMENT: /\/v1\/livechat\/analytics\/dashboards\/conversations-by-department/,
    BY_TAGS: /\/v1\/livechat\/analytics\/dashboards\/conversations-by-tags/,
    BY_AGENT: /\/v1\/livechat\/analytics\/dashboards\/conversations-by-agent/,
};
test_1.test.skip(!constants_1.IS_EE, 'Omnichannel Reports > Enterprise Only');
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe.serial('Omnichannel Reports', () => {
    let poReports;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const requests = yield Promise.all([
            api.post('/livechat/users/agent', { username: 'user1' }),
            api.post('/livechat/users/manager', { username: 'user1' }),
        ]);
        yield (0, test_1.expect)(requests.every((request) => request.status() === 200)).toBe(true);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poReports = new omnichannel_reports_1.OmnichannelReports(page);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/omnichannel/reports');
        yield page.locator('.main-content').waitFor();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([api.delete('/livechat/users/agent/user1'), api.delete('/livechat/users/manager/user1')]);
    }));
    (0, test_1.test)('Status Section', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('Empty state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.route(ENDPOINTS.BY_STATUS, (route) => __awaiter(void 0, void 0, void 0, function* () {
                yield route.fulfill({ json: { data: [], total: 0 } });
            }));
            yield poReports.statusSection.selectPeriod('this week');
            yield (0, test_1.expect)(poReports.statusSection.txtStateTitle).toHaveText('No data available for the selected period');
            yield (0, test_1.expect)(poReports.statusSection.txtStateSubtitle).toHaveText('This chart will update as soon as conversations start.');
            yield (0, test_1.expect)(poReports.statusSection.txtSummary).toHaveText('0 conversations, this week');
        }));
        yield test_1.test.step('Error state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.route(ENDPOINTS.BY_STATUS, (route) => __awaiter(void 0, void 0, void 0, function* () {
                yield route.abort();
            }));
            yield poReports.statusSection.selectPeriod('this month');
            yield (0, test_1.expect)(poReports.statusSection.element).toHaveAttribute('aria-busy', 'false');
            yield (0, test_1.expect)(poReports.statusSection.btnRetry).toBeVisible();
            yield (0, test_1.expect)(poReports.statusSection.txtStateTitle).toHaveText('Something went wrong');
            yield test_1.test.step('Retry', () => __awaiter(void 0, void 0, void 0, function* () {
                yield page.route(ENDPOINTS.BY_STATUS, (route) => __awaiter(void 0, void 0, void 0, function* () {
                    yield route.fulfill({ json: { data: [], total: 0 } });
                }));
                const responsePromise = page.waitForResponse(ENDPOINTS.BY_STATUS);
                yield poReports.statusSection.btnRetry.click();
                yield responsePromise;
            }));
        }));
        yield test_1.test.step('Render data', () => __awaiter(void 0, void 0, void 0, function* () {
            const mock = {
                data: [
                    { label: 'Open', value: 25 },
                    { label: 'Queued', value: 25 },
                    { label: 'Closed', value: 25 },
                    { label: 'On_Hold', value: 25 },
                ],
                total: 100,
            };
            yield page.route(ENDPOINTS.BY_STATUS, (route) => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield route.fetch();
                yield route.fulfill({ response, json: mock });
            }));
            yield poReports.statusSection.selectPeriod('last year');
            yield (0, test_1.expect)(poReports.statusSection.legendItem(`Closed 25 (25%)`)).toBeVisible();
            yield (0, test_1.expect)(poReports.statusSection.legendItem(`Open 25 (25%)`)).toBeVisible();
            yield (0, test_1.expect)(poReports.statusSection.legendItem(`Queued 25 (25%)`)).toBeVisible();
            yield (0, test_1.expect)(poReports.statusSection.legendItem(`On hold 25 (25%)`)).toBeVisible();
            yield (0, test_1.expect)(poReports.statusSection.txtSummary).toHaveText('100 conversations, last year');
        }));
    }));
    (0, test_1.test)('Channels Section', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('Empty state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.route(ENDPOINTS.BY_SOURCE, (route) => __awaiter(void 0, void 0, void 0, function* () {
                yield route.fulfill({ json: { data: [], total: 0 } });
            }));
            yield poReports.channelsSection.selectPeriod('this week');
            yield (0, test_1.expect)(poReports.channelsSection.txtStateTitle).toHaveText('No data available for the selected period');
            yield (0, test_1.expect)(poReports.channelsSection.txtStateSubtitle).toHaveText('This chart shows the most used channels.');
            yield (0, test_1.expect)(poReports.channelsSection.txtSummary).toHaveText('0 conversations, this week');
        }));
        yield test_1.test.step('Error state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.route(ENDPOINTS.BY_SOURCE, (route) => __awaiter(void 0, void 0, void 0, function* () {
                yield route.abort();
            }));
            yield poReports.channelsSection.selectPeriod('last 15 days');
            yield (0, test_1.expect)(poReports.channelsSection.element).toHaveAttribute('aria-busy', 'false');
            yield (0, test_1.expect)(poReports.channelsSection.btnRetry).toBeVisible();
            yield (0, test_1.expect)(poReports.channelsSection.txtStateTitle).toHaveText('Something went wrong');
            yield test_1.test.step('Retry', () => __awaiter(void 0, void 0, void 0, function* () {
                yield page.route(ENDPOINTS.BY_SOURCE, (route) => __awaiter(void 0, void 0, void 0, function* () {
                    yield route.fulfill({ json: { data: [], total: 0 } });
                }));
                const responsePromise = page.waitForResponse(ENDPOINTS.BY_SOURCE);
                yield poReports.channelsSection.btnRetry.click();
                yield responsePromise;
            }));
        }));
        yield test_1.test.step('Render data', () => __awaiter(void 0, void 0, void 0, function* () {
            const mock = {
                data: [
                    { label: 'Channel 1', value: 50 },
                    { label: 'Channel 2', value: 50 },
                ],
                total: 100,
            };
            yield page.route(ENDPOINTS.BY_SOURCE, (route) => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield route.fetch();
                yield route.fulfill({ response, json: mock });
            }));
            yield poReports.channelsSection.selectPeriod('last year');
            yield (0, test_1.expect)(poReports.channelsSection.legendItem(`Channel 1 50 (50%)`)).toBeVisible();
            yield (0, test_1.expect)(poReports.channelsSection.legendItem(`Channel 2 50 (50%)`)).toBeVisible();
            yield (0, test_1.expect)(poReports.channelsSection.txtSummary).toHaveText('100 conversations, last year');
        }));
        yield test_1.test.step('More than 5 channels', () => __awaiter(void 0, void 0, void 0, function* () {
            const mock = {
                data: [
                    { label: 'Channel 1', value: 15 },
                    { label: 'Channel 2', value: 15 },
                    { label: 'Channel 3', value: 15 },
                    { label: 'Channel 4', value: 15 },
                    { label: 'Channel 5', value: 15 },
                    { label: 'Channel 6', value: 15 },
                    { label: 'Channel 7', value: 15 },
                    { label: 'Channel 8', value: 15 },
                ],
                total: 120,
            };
            yield page.route(ENDPOINTS.BY_SOURCE, (route) => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield route.fetch();
                yield route.fulfill({ response, json: mock });
            }));
            yield poReports.channelsSection.selectPeriod('last 6 months');
            yield (0, test_1.expect)(poReports.channelsSection.legendItem(`Others 45 (37.5%)`)).toBeVisible();
            yield (0, test_1.expect)(poReports.channelsSection.txtSummary).toHaveText('120 conversations, last 6 months');
        }));
    }));
    (0, test_1.test)('Departments Section', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('Empty state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.route(ENDPOINTS.BY_DEPARTMENT, (route) => __awaiter(void 0, void 0, void 0, function* () {
                yield route.fulfill({ json: { data: [], total: 0 } });
            }));
            yield poReports.departmentsSection.selectPeriod('this week');
            yield (0, test_1.expect)(poReports.departmentsSection.txtStateTitle).toHaveText('No data available for the selected period');
            yield (0, test_1.expect)(poReports.departmentsSection.txtStateSubtitle).toHaveText('This chart displays the departments that receive the most conversations.');
            yield (0, test_1.expect)(poReports.departmentsSection.txtSummary).toHaveText('0 departments and 0 conversations, this week');
        }));
        yield test_1.test.step('Error state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.route(ENDPOINTS.BY_DEPARTMENT, (route) => __awaiter(void 0, void 0, void 0, function* () {
                yield route.abort();
            }));
            yield poReports.departmentsSection.selectPeriod('this month');
            yield (0, test_1.expect)(poReports.departmentsSection.element).toHaveAttribute('aria-busy', 'false');
            yield (0, test_1.expect)(poReports.departmentsSection.btnRetry).toBeVisible();
            yield (0, test_1.expect)(poReports.departmentsSection.txtStateTitle).toHaveText('Something went wrong');
            yield test_1.test.step('Retry', () => __awaiter(void 0, void 0, void 0, function* () {
                yield page.route(ENDPOINTS.BY_DEPARTMENT, (route) => __awaiter(void 0, void 0, void 0, function* () {
                    yield route.fulfill({ json: { data: [], total: 0 } });
                }));
                const responsePromise = page.waitForResponse(ENDPOINTS.BY_DEPARTMENT);
                yield poReports.departmentsSection.btnRetry.click();
                yield responsePromise;
            }));
        }));
        yield test_1.test.step('Render data', () => __awaiter(void 0, void 0, void 0, function* () {
            const mock = {
                data: [
                    { label: 'Department 1', value: 10 },
                    { label: 'Department 2', value: 20 },
                    { label: 'Department 3', value: 30 },
                    { label: 'Department 4', value: 40 },
                ],
                total: 100,
                unspecified: 42,
            };
            yield page.route(ENDPOINTS.BY_DEPARTMENT, (route) => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield route.fetch();
                yield route.fulfill({ response, json: mock });
            }));
            yield poReports.departmentsSection.selectPeriod('last 6 months');
            yield (0, test_1.expect)(poReports.departmentsSection.chartItem('Department 1', 10)).toBeVisible();
            yield (0, test_1.expect)(poReports.departmentsSection.chartItem('Department 2', 20)).toBeVisible();
            yield (0, test_1.expect)(poReports.departmentsSection.chartItem('Department 3', 30)).toBeVisible();
            yield (0, test_1.expect)(poReports.departmentsSection.chartItem('Department 4', 40)).toBeVisible();
            yield (0, test_1.expect)(poReports.departmentsSection.txtSummary).toHaveText('4 departments and 100 conversations, last 6 months (42 without department)');
        }));
    }));
    (0, test_1.test)('Tags Section', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('Empty state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.route(ENDPOINTS.BY_TAGS, (route) => __awaiter(void 0, void 0, void 0, function* () {
                yield route.fulfill({ json: { data: [], total: 0 } });
            }));
            yield poReports.tagsSection.selectPeriod('this week');
            yield (0, test_1.expect)(poReports.tagsSection.txtStateTitle).toHaveText('No data available for the selected period');
            yield (0, test_1.expect)(poReports.tagsSection.txtStateSubtitle).toHaveText('This chart shows the most frequently used tags.');
            yield (0, test_1.expect)(poReports.tagsSection.txtSummary).toHaveText('0 tags and 0 conversations, this week');
        }));
        yield test_1.test.step('Error state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.route(ENDPOINTS.BY_TAGS, (route) => __awaiter(void 0, void 0, void 0, function* () {
                yield route.abort();
            }));
            yield poReports.tagsSection.selectPeriod('this month');
            yield (0, test_1.expect)(poReports.tagsSection.element).toHaveAttribute('aria-busy', 'false');
            yield (0, test_1.expect)(poReports.tagsSection.btnRetry).toBeVisible();
            yield (0, test_1.expect)(poReports.tagsSection.txtStateTitle).toHaveText('Something went wrong');
            yield test_1.test.step('Retry', () => __awaiter(void 0, void 0, void 0, function* () {
                yield page.route(ENDPOINTS.BY_TAGS, (route) => __awaiter(void 0, void 0, void 0, function* () {
                    yield route.fulfill({ json: { data: [], total: 0 } });
                }));
                const responsePromise = page.waitForResponse(ENDPOINTS.BY_TAGS);
                yield poReports.tagsSection.btnRetry.click();
                yield responsePromise;
            }));
        }));
        yield test_1.test.step('Render data', () => __awaiter(void 0, void 0, void 0, function* () {
            const mock = {
                data: [
                    { label: 'Tag 1', value: 10 },
                    { label: 'Tag 2', value: 20 },
                    { label: 'Tag 3', value: 30 },
                    { label: 'Tag 4', value: 40 },
                ],
                total: 100,
                unspecified: 42,
            };
            yield page.route(ENDPOINTS.BY_TAGS, (route) => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield route.fetch();
                yield route.fulfill({ response, json: mock });
            }));
            yield poReports.tagsSection.selectPeriod('last 6 months');
            yield (0, test_1.expect)(poReports.tagsSection.chartItem('Tag 1', 10)).toBeVisible();
            yield (0, test_1.expect)(poReports.tagsSection.chartItem('Tag 2', 20)).toBeVisible();
            yield (0, test_1.expect)(poReports.tagsSection.chartItem('Tag 3', 30)).toBeVisible();
            yield (0, test_1.expect)(poReports.tagsSection.chartItem('Tag 4', 40)).toBeVisible();
            yield (0, test_1.expect)(poReports.tagsSection.txtSummary).toHaveText('4 tags and 100 conversations, last 6 months (42 without tags)');
        }));
    }));
    (0, test_1.test)('Agents Section', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('Empty state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.route(ENDPOINTS.BY_AGENT, (route) => __awaiter(void 0, void 0, void 0, function* () {
                yield route.fulfill({ json: { data: [], total: 0 } });
            }));
            yield poReports.agentsSection.selectPeriod('this week');
            yield (0, test_1.expect)(poReports.agentsSection.txtStateTitle).toHaveText('No data available for the selected period');
            yield (0, test_1.expect)(poReports.agentsSection.txtStateSubtitle).toHaveText('This chart displays which agents receive the highest volume of conversations.');
            yield (0, test_1.expect)(poReports.agentsSection.txtSummary).toHaveText('0 agents and 0 conversations, this week');
        }));
        yield test_1.test.step('Error state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.route(ENDPOINTS.BY_AGENT, (route) => __awaiter(void 0, void 0, void 0, function* () {
                yield route.abort();
            }));
            yield poReports.agentsSection.selectPeriod('this month');
            yield (0, test_1.expect)(poReports.agentsSection.element).toHaveAttribute('aria-busy', 'false');
            yield (0, test_1.expect)(poReports.agentsSection.btnRetry).toBeVisible();
            yield (0, test_1.expect)(poReports.agentsSection.txtStateTitle).toHaveText('Something went wrong');
            yield test_1.test.step('Retry', () => __awaiter(void 0, void 0, void 0, function* () {
                yield page.route(ENDPOINTS.BY_AGENT, (route) => __awaiter(void 0, void 0, void 0, function* () {
                    yield route.fulfill({ json: { data: [], total: 0 } });
                }));
                const responsePromise = page.waitForResponse(ENDPOINTS.BY_AGENT);
                yield poReports.agentsSection.btnRetry.click();
                yield responsePromise;
            }));
        }));
        yield test_1.test.step('Render data', () => __awaiter(void 0, void 0, void 0, function* () {
            const mock = {
                data: [
                    { label: 'Agent 1', value: 10 },
                    { label: 'Agent 2', value: 20 },
                    { label: 'Agent 3', value: 30 },
                    { label: 'Agent 4', value: 40 },
                ],
                total: 100,
                unspecified: 42,
            };
            yield page.route(ENDPOINTS.BY_AGENT, (route) => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield route.fetch();
                yield route.fulfill({ response, json: mock });
            }));
            yield poReports.agentsSection.selectPeriod('last 6 months');
            yield (0, test_1.expect)(poReports.agentsSection.txtSummary).toHaveText('4 agents and 100 conversations, last 6 months (42 without assignee)');
            yield (0, test_1.expect)(poReports.agentsSection.chartItem('Agent 1', 10)).toBeVisible();
            yield (0, test_1.expect)(poReports.agentsSection.chartItem('Agent 2', 20)).toBeVisible();
            yield (0, test_1.expect)(poReports.agentsSection.chartItem('Agent 3', 30)).toBeVisible();
            yield (0, test_1.expect)(poReports.agentsSection.chartItem('Agent 4', 40)).toBeVisible();
            yield (0, test_1.expect)(poReports.agentsSection.findRowByName('Agent 1')).toBeVisible();
            yield (0, test_1.expect)(poReports.agentsSection.findRowByName('Agent 2')).toBeVisible();
            yield (0, test_1.expect)(poReports.agentsSection.findRowByName('Agent 3')).toBeVisible();
            yield (0, test_1.expect)(poReports.agentsSection.findRowByName('Agent 4')).toBeVisible();
        }));
    }));
});
