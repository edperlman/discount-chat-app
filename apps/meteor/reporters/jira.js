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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
class JIRAReporter {
    constructor(options) {
        this.url = options.url;
        this.apiKey = options.apiKey;
        this.branch = options.branch;
        this.draft = options.draft;
        this.run = options.run;
        this.headSha = options.headSha;
        this.author = options.author;
        this.run_url = options.run_url;
        this.pr = options.pr;
    }
    onTestEnd(test, result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.REPORTER_ROCKETCHAT_REPORT !== 'true') {
                return;
            }
            if (this.draft === true) {
                return;
            }
            if (result.status === 'passed' || result.status === 'skipped') {
                return;
            }
            const payload = {
                name: test.title,
                status: result.status,
                duration: result.duration,
                branch: this.branch,
                draft: this.draft,
                run: this.run,
                headSha: this.headSha,
            };
            console.log(`Sending test result to JIRA: ${JSON.stringify(payload)}`);
            // first search and check if there is an existing issue
            // replace all ()[]- with nothing
            const search = yield (0, node_fetch_1.default)(`${this.url}/rest/api/2/search?${new URLSearchParams({
                jql: `project = FLAKY AND summary ~ '${payload.name.replace(/[\(\)\[\]-]/g, '')}'`,
            })}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${this.apiKey}`,
                },
            });
            if (!search.ok) {
                throw new Error(`JIRA: Failed to search for existing issue: ${search.statusText}.` +
                    `${this.url}/rest/api/2/search${new URLSearchParams({
                        jql: `project = FLAKY AND summary ~ '${payload.name}'`,
                    })}`);
            }
            const { issues } = yield search.json();
            const existing = issues.find((issue) => issue.fields.summary === payload.name);
            if (existing) {
                const { location } = test;
                if (this.pr === 0) {
                    yield (0, node_fetch_1.default)(`${this.url}/rest/api/2/issue/${existing.key}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            update: {
                                labels: [
                                    {
                                        add: 'flaky_Develop',
                                    },
                                ],
                            },
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${this.apiKey}`,
                        },
                    });
                }
                yield (0, node_fetch_1.default)(`${this.url}/rest/api/2/issue/${existing.key}/comment`, {
                    method: 'POST',
                    body: JSON.stringify({
                        body: `Test run ${payload.run} failed
author: ${this.author}
PR: ${this.pr}
https://github.com/RocketChat/Rocket.Chat/blob/${payload.headSha}/${location.file.replace('/home/runner/work/Rocket.Chat/Rocket.Chat', '')}#L${location.line}:${location.column}
${this.run_url}
`,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${this.apiKey}`,
                    },
                });
                return;
            }
            const data = {
                fields: Object.assign({ summary: payload.name, description: '', issuetype: {
                        name: 'Tech Debt',
                    }, project: {
                        key: 'FLAKY',
                    } }, (this.pr === 0 && { labels: ['flaky_Develop'] })),
            };
            const responseIssue = yield (0, node_fetch_1.default)(`${this.url}/rest/api/2/issue`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${this.apiKey}`,
                },
            });
            const issue = (yield responseIssue.json()).key;
            const { location } = test;
            yield (0, node_fetch_1.default)(`${this.url}/rest/api/2/issue/${issue}/comment`, {
                method: 'POST',
                body: JSON.stringify({
                    body: `Test run ${payload.run} failed
author: ${this.author}
PR: ${this.pr}
https://github.com/RocketChat/Rocket.Chat/blob/${payload.headSha}/${location.file.replace('/home/runner/work/Rocket.Chat/Rocket.Chat', '')}#L${location.line}:${location.column},
${this.run_url}
`,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${this.apiKey}`,
                },
            });
        });
    }
}
exports.default = JIRAReporter;
