"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const constants = __importStar(require("./tests/e2e/config/constants"));
exports.default = {
    globalSetup: require.resolve('./tests/e2e/config/global-setup.ts'),
    use: {
        channel: 'chromium',
        headless: true,
        ignoreHTTPSErrors: true,
        trace: 'retain-on-failure',
        baseURL: constants.BASE_URL,
        screenshot: process.env.CI ? 'off' : 'only-on-failure',
        video: process.env.CI ? 'off' : 'retain-on-failure',
        launchOptions: {
            // force GPU hardware acceleration
            // (even in headless mode)
            args: ['--use-gl=egl', '--use-fake-ui-for-media-stream'],
        },
        permissions: ['microphone'],
    },
    outputDir: 'tests/e2e/.playwright',
    reporter: [
        ['list'],
        process.env.REPORTER_ROCKETCHAT_REPORT === 'true' && [
            './reporters/rocketchat.ts',
            {
                url: process.env.REPORTER_ROCKETCHAT_URL,
                apiKey: process.env.REPORTER_ROCKETCHAT_API_KEY,
                branch: process.env.REPORTER_ROCKETCHAT_BRANCH,
                run: Number(process.env.REPORTER_ROCKETCHAT_RUN),
                draft: process.env.REPORTER_ROCKETCHAT_DRAFT === 'true',
                headSha: process.env.REPORTER_ROCKETCHAT_HEAD_SHA,
            },
        ],
        process.env.REPORTER_ROCKETCHAT_REPORT === 'true' && [
            './reporters/jira.ts',
            {
                url: `https://rocketchat.atlassian.net`,
                apiKey: (_a = process.env.REPORTER_JIRA_ROCKETCHAT_API_KEY) !== null && _a !== void 0 ? _a : process.env.JIRA_TOKEN,
                branch: process.env.REPORTER_ROCKETCHAT_BRANCH,
                run: Number(process.env.REPORTER_ROCKETCHAT_RUN),
                headSha: process.env.REPORTER_ROCKETCHAT_HEAD_SHA,
                author: process.env.REPORTER_ROCKETCHAT_AUTHOR,
                run_url: process.env.REPORTER_ROCKETCHAT_RUN_URL,
                pr: Number(process.env.REPORTER_ROCKETCHAT_PR),
                draft: process.env.REPORTER_ROCKETCHAT_DRAFT === 'true',
            },
        ],
        [
            'playwright-qase-reporter',
            {
                apiToken: `${process.env.QASE_API_TOKEN}`,
                rootSuiteTitle: 'Rocket.chat automation',
                projectCode: 'RC',
                runComplete: true,
                basePath: 'https://api.qase.io/v1',
                logging: true,
                uploadAttachments: false,
                environmentId: '1',
            },
        ],
    ].filter(Boolean),
    testDir: 'tests/e2e',
    testIgnore: 'tests/e2e/federation/**',
    workers: 1,
    timeout: 60 * 1000,
    globalTimeout: (process.env.IS_EE === 'true' ? 50 : 40) * 60 * 1000,
    maxFailures: process.env.CI ? 5 : undefined,
    // Retry on CI only.
    retries: parseInt(String(process.env.PLAYWRIGHT_RETRIES)) || 0,
};
