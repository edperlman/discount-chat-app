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
const i18next_1 = __importDefault(require("i18next"));
const api_1 = require("../api");
const store_1 = __importDefault(require("../store"));
const constants_1 = __importDefault(require("./constants"));
const main_1 = require("./main");
const room_1 = require("./room");
let connectedListener;
let disconnectedListener;
let initiated = false;
const { livechatDisconnectedAlertId, livechatConnectedAlertId } = constants_1.default;
const Connection = {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (initiated) {
                return;
            }
            initiated = true;
            yield this.connect();
        });
    },
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve().then(() => __importStar(require('../i18next')));
                this.clearListeners();
                yield (0, main_1.loadConfig)();
                this.addListeners();
                yield api_1.Livechat.connection.connect();
                this.clearAlerts();
            }
            catch (e) {
                console.error('Connecting error: ', e);
            }
        });
    },
    // reconnect() {
    // 	if (timer) {
    // 		return;
    // 	}
    // 	timer = setTimeout(async () => {
    // 		try {
    // 			clearTimeout(timer);
    // 			timer = false;
    // 			await this.connect();
    // 			await loadMessages();
    // 		} catch (e) {
    // 			console.error('Reconecting error: ', e);
    // 			this.reconnect();
    // 		}
    // 	}, 5000);
    // },
    clearAlerts() {
        return __awaiter(this, void 0, void 0, function* () {
            const { alerts } = store_1.default.state;
            yield store_1.default.setState({
                alerts: alerts === null || alerts === void 0 ? void 0 : alerts.filter((alert) => ![livechatDisconnectedAlertId, livechatConnectedAlertId].includes(alert.id)),
            });
        });
    },
    displayAlert() {
        return __awaiter(this, arguments, void 0, function* (alert = {}) {
            const { alerts } = store_1.default.state;
            yield store_1.default.setState({ alerts: (alerts === null || alerts === void 0 ? void 0 : alerts.push(alert), alerts) });
        });
    },
    handleConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Connection.clearAlerts();
            yield Connection.displayAlert({ id: livechatConnectedAlertId, children: i18next_1.default.t('livechat_connected'), success: true });
            yield (0, room_1.loadMessages)();
        });
    },
    handleDisconnected() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Connection.clearAlerts();
            yield Connection.displayAlert({
                id: livechatDisconnectedAlertId,
                children: i18next_1.default.t('livechat_is_not_connected'),
                error: true,
                timeout: 0,
            });
            // self.reconnect();
        });
    },
    addListeners() {
        if (!connectedListener) {
            connectedListener = api_1.Livechat.connection.on('connected', this.handleConnected);
        }
        if (!disconnectedListener) {
            disconnectedListener = api_1.Livechat.connection.on('disconnected', this.handleDisconnected);
        }
    },
    clearListeners() {
        connectedListener === null || connectedListener === void 0 ? void 0 : connectedListener();
        connectedListener = undefined;
        disconnectedListener === null || disconnectedListener === void 0 ? void 0 : disconnectedListener();
        disconnectedListener = undefined;
    },
};
exports.default = Connection;
