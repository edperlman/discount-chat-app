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
exports.expect = exports.test = void 0;
/* eslint-disable react-hooks/rules-of-hooks */
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const playwright_1 = __importDefault(require("@axe-core/playwright"));
const test_1 = require("@playwright/test");
const uuid_1 = require("uuid");
const constants_1 = require("../config/constants");
const userStates_1 = require("../fixtures/userStates");
const PATH_NYC_OUTPUT = path.join(process.cwd(), '.nyc_output');
let apiContext;
const cacheFromCredentials = new Map();
exports.test = test_1.test.extend({
    context: (_a, use_1) => __awaiter(void 0, [_a, use_1], void 0, function* ({ context }, use) {
        if (!process.env.E2E_COVERAGE) {
            yield use(context);
            yield context.close();
            return;
        }
        yield context.addInitScript(() => window.addEventListener('beforeunload', () => window.collectIstanbulCoverage(JSON.stringify(window.__coverage__))));
        yield fs.promises.mkdir(PATH_NYC_OUTPUT, { recursive: true });
        yield context.exposeFunction('collectIstanbulCoverage', (coverageJSON) => {
            if (coverageJSON) {
                fs.writeFileSync(path.join(PATH_NYC_OUTPUT, `playwright_coverage_${(0, uuid_1.v4)()}.json`), coverageJSON);
            }
        });
        yield use(context);
        yield Promise.all(context.pages().map((page) => __awaiter(void 0, void 0, void 0, function* () {
            yield page.evaluate(() => window.collectIstanbulCoverage(JSON.stringify(window.__coverage__)));
            yield page.close();
        })));
    }),
    api: (_a, use_1) => __awaiter(void 0, [_a, use_1], void 0, function* ({ request }, use) {
        const newContext = (token, userId) => __awaiter(void 0, void 0, void 0, function* () {
            return test_1.request.newContext({
                baseURL: constants_1.BASE_API_URL,
                extraHTTPHeaders: {
                    'X-Auth-Token': token,
                    'X-User-Id': userId,
                },
            });
        });
        const login = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
            if (credentials.username === userStates_1.Users.admin.data.username) {
                return newContext(userStates_1.Users.admin.data.loginToken, userStates_1.Users.admin.data.username);
            }
            if (cacheFromCredentials.has(credentials.username + credentials.password)) {
                const token = cacheFromCredentials.get(credentials.username + credentials.password);
                return newContext(token, credentials.username);
            }
            const resp = yield request.post(`${constants_1.BASE_API_URL}/login`, { data: credentials });
            const json = yield resp.json();
            cacheFromCredentials.set(credentials.username + credentials.password, json.data.authToken);
            return newContext(json.data.authToken, json.data.userId);
        });
        const recreateContext = () => __awaiter(void 0, void 0, void 0, function* () {
            apiContext = yield login(constants_1.ADMIN_CREDENTIALS);
        });
        yield recreateContext();
        yield use({
            recreateContext,
            login,
            get(uri, params, prefix = constants_1.API_PREFIX) {
                return apiContext.get(prefix + uri, { params });
            },
            post(uri, data, prefix = constants_1.API_PREFIX) {
                return apiContext.post(prefix + uri, { data });
            },
            put(uri, data, prefix = constants_1.API_PREFIX) {
                return apiContext.put(prefix + uri, { data });
            },
            delete(uri, params, prefix = constants_1.API_PREFIX) {
                return apiContext.delete(prefix + uri, { params });
            },
        });
    }),
    makeAxeBuilder: (_a, use_1) => __awaiter(void 0, [_a, use_1], void 0, function* ({ page }, use) {
        const SELECT_KNOW_ISSUES = ['aria-hidden-focus', 'nested-interactive'];
        const makeAxeBuilder = () => new playwright_1.default({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .include('body')
            .disableRules([...SELECT_KNOW_ISSUES]);
        yield use(makeAxeBuilder);
    }),
});
exports.expect = exports.test.expect;
exports.expect.extend({
    toBeInvalid(received) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, exports.expect)(received).toHaveAttribute('aria-invalid', 'true');
                return {
                    message: () => `expected ${received} to be invalid`,
                    pass: true,
                };
            }
            catch (error) {
                return {
                    message: () => `expected ${received} to be invalid`,
                    pass: false,
                };
            }
        });
    },
    toBeBusy(received) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, exports.expect)(received).toHaveAttribute('aria-busy', 'true');
                return {
                    message: () => `expected ${received} to be busy`,
                    pass: true,
                };
            }
            catch (error) {
                return {
                    message: () => `expected ${received} to be busy`,
                    pass: false,
                };
            }
        });
    },
    hasAttribute(received, attribute) {
        return __awaiter(this, void 0, void 0, function* () {
            const pass = yield received.evaluate((node, attribute) => node.hasAttribute(attribute), attribute);
            return {
                message: () => `expected ${received} to have attribute \`${attribute}\``,
                pass,
            };
        });
    },
});
