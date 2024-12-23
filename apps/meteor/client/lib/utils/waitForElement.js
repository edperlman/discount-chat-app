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
exports.waitForElement = void 0;
const waitForElement = (selector_1, ...args_1) => __awaiter(void 0, [selector_1, ...args_1], void 0, function* (selector, { parent = document.documentElement, signal } = {}) {
    const element = parent.querySelector(selector);
    return new Promise((resolve, reject) => {
        if (element) {
            return resolve(element);
        }
        const observer = new MutationObserver((_, obs) => {
            const element = parent.querySelector(selector);
            if (element) {
                obs.disconnect(); // stop observing
                return resolve(element);
            }
        });
        observer.observe(parent, {
            childList: true,
            subtree: true,
        });
        signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', () => {
            observer.disconnect();
            reject(new DOMException('Aborted', 'AbortError'));
        });
    });
});
exports.waitForElement = waitForElement;
