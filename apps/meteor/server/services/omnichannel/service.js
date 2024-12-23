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
exports.OmnichannelService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const moment_1 = __importDefault(require("moment"));
const queue_1 = require("./queue");
const LivechatTyped_1 = require("../../../app/livechat/server/lib/LivechatTyped");
const RoutingManager_1 = require("../../../app/livechat/server/lib/RoutingManager");
const server_1 = require("../../../app/settings/server");
class OmnichannelService extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'omnichannel';
        this.queueWorker = new queue_1.OmnichannelQueue();
    }
    created() {
        return __awaiter(this, void 0, void 0, function* () {
            this.onEvent('presence.status', (_a) => __awaiter(this, [_a], void 0, function* ({ user }) {
                if (!(user === null || user === void 0 ? void 0 : user._id)) {
                    return;
                }
                const hasRole = user.roles.some((role) => ['livechat-manager', 'livechat-monitor', 'livechat-agent'].includes(role));
                if (hasRole) {
                    // TODO change `Livechat.notifyAgentStatusChanged` to a service call
                    yield LivechatTyped_1.Livechat.notifyAgentStatusChanged(user._id, user.status);
                }
            }));
        });
    }
    started() {
        return __awaiter(this, void 0, void 0, function* () {
            server_1.settings.watchMultiple(['Livechat_enabled', 'Livechat_Routing_Method'], () => {
                this.queueWorker.shouldStart();
            });
            license_1.License.onLimitReached('monthlyActiveContacts', () => __awaiter(this, void 0, void 0, function* () {
                this.queueWorker.isRunning() && (yield this.queueWorker.stop());
            }));
            license_1.License.onValidateLicense(() => __awaiter(this, void 0, void 0, function* () {
                RoutingManager_1.RoutingManager.isMethodSet() && (yield this.queueWorker.shouldStart());
            }));
            // NOTE: When there's no license or license is invalid, we fallback to CE behavior
            // CE behavior means there's no MAC limit, so we start the queue
            license_1.License.onInvalidateLicense(() => __awaiter(this, void 0, void 0, function* () {
                this.queueWorker.isRunning() && (yield this.queueWorker.shouldStart());
            }));
        });
    }
    isWithinMACLimit(room) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const currentMonth = moment_1.default.utc().format('YYYY-MM');
            return ((_b = (_a = room.v) === null || _a === void 0 ? void 0 : _a.activity) === null || _b === void 0 ? void 0 : _b.includes(currentMonth)) || !(yield license_1.License.shouldPreventAction('monthlyActiveContacts'));
        });
    }
}
exports.OmnichannelService = OmnichannelService;
