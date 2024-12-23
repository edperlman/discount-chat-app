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
class RocketChatReporter {
    constructor(options) {
        this.url = options.url;
        this.apiKey = options.apiKey;
        this.branch = options.branch;
        this.draft = options.draft;
        this.run = options.run;
    }
    onTestEnd(test, result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.REPORTER_ROCKETCHAT_REPORT !== 'true') {
                console.log('REPORTER_ROCKETCHAT_REPORT is not true, skipping', {
                    draft: this.draft,
                    branch: this.branch,
                });
                return;
            }
            const payload = {
                name: test.title,
                status: result.status,
                duration: result.duration,
                branch: this.branch,
                draft: this.draft,
                run: this.run,
            };
            try {
                const res = yield (0, node_fetch_1.default)(this.url, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Api-Key': this.apiKey,
                    },
                });
                if (!res.ok) {
                    console.error('Error sending test result to Rocket.Chat', JSON.stringify(payload), res);
                }
            }
            catch (error) {
                console.error('Unknown error while sending test result to Rocket.Chat', JSON.stringify(payload), error);
            }
        });
    }
}
exports.default = RocketChatReporter;
