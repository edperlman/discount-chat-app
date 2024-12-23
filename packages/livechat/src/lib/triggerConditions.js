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
exports.conditions = exports.visitorRegisteredCondition = exports.chatOpenedCondition = exports.timeOnSiteCondition = exports.pageUrlCondition = void 0;
const store_1 = __importDefault(require("../store"));
const triggers_1 = __importDefault(require("./triggers"));
const pageUrlCondition = (condition) => {
    const { parentUrl } = triggers_1.default;
    if (!parentUrl || !condition.value) {
        return Promise.reject(`condition ${condition.name} not met`);
    }
    const hrefRegExp = new RegExp(`${condition === null || condition === void 0 ? void 0 : condition.value}`, 'g');
    if (hrefRegExp.test(parentUrl)) {
        return Promise.resolve();
    }
    return Promise.reject();
};
exports.pageUrlCondition = pageUrlCondition;
const timeOnSiteCondition = (condition) => {
    return new Promise((resolve, reject) => {
        const timeout = parseInt(`${(condition === null || condition === void 0 ? void 0 : condition.value) || 0}`, 10) * 1000;
        setTimeout(() => {
            const { user } = store_1.default.state;
            if (user === null || user === void 0 ? void 0 : user.token) {
                reject(`Condition "${condition.name}" is no longer valid`);
                return;
            }
            resolve();
        }, timeout);
    });
};
exports.timeOnSiteCondition = timeOnSiteCondition;
const chatOpenedCondition = () => {
    return new Promise((resolve) => {
        var _a;
        const openFunc = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            (_a = triggers_1.default.callbacks) === null || _a === void 0 ? void 0 : _a.off('chat-opened-by-visitor', openFunc);
            resolve();
        });
        (_a = triggers_1.default.callbacks) === null || _a === void 0 ? void 0 : _a.on('chat-opened-by-visitor', openFunc);
    });
};
exports.chatOpenedCondition = chatOpenedCondition;
const visitorRegisteredCondition = () => {
    return new Promise((resolve) => {
        var _a;
        const openFunc = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            (_a = triggers_1.default.callbacks) === null || _a === void 0 ? void 0 : _a.off('chat-visitor-registered', openFunc);
            resolve();
        });
        (_a = triggers_1.default.callbacks) === null || _a === void 0 ? void 0 : _a.on('chat-visitor-registered', openFunc);
    });
};
exports.visitorRegisteredCondition = visitorRegisteredCondition;
exports.conditions = {
    'page-url': exports.pageUrlCondition,
    'time-on-site': exports.timeOnSiteCondition,
    'chat-opened-by-visitor': exports.chatOpenedCondition,
    'after-guest-registration': exports.visitorRegisteredCondition,
};
