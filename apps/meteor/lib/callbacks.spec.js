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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const callbacks_1 = require("./callbacks");
const callbacksBase_1 = require("./callbacks/callbacksBase");
(0, mocha_1.describe)('callbacks legacy', () => {
    (0, mocha_1.it)("if the callback doesn't return any value should return the original", () => __awaiter(void 0, void 0, void 0, function* () {
        callbacks_1.callbacks.add('test', () => undefined, callbacks_1.callbacks.priority.LOW, '1');
        const result = yield callbacks_1.callbacks.run('test', true);
        (0, chai_1.expect)(result).to.be.true;
        callbacks_1.callbacks.remove('test', '1');
    }));
    (0, mocha_1.it)('should return the value returned by the callback', () => __awaiter(void 0, void 0, void 0, function* () {
        callbacks_1.callbacks.add('test', () => false, callbacks_1.callbacks.priority.LOW, '1');
        const result = yield callbacks_1.callbacks.run('test', true);
        (0, chai_1.expect)(result).to.be.false;
        callbacks_1.callbacks.remove('test', '1');
    }));
    (0, mocha_1.it)('should accumulate the values returned by the callbacks', () => __awaiter(void 0, void 0, void 0, function* () {
        callbacks_1.callbacks.add('test', (old) => old * 5);
        callbacks_1.callbacks.add('test', (old) => old * 2);
        (0, chai_1.expect)(yield callbacks_1.callbacks.run('test', 3)).to.be.equal(30);
        (0, chai_1.expect)(yield callbacks_1.callbacks.run('test', 2)).to.be.equal(20);
    }));
});
(0, mocha_1.describe)('callbacks', () => {
    (0, mocha_1.it)("if the callback doesn't return any value should return the original", () => __awaiter(void 0, void 0, void 0, function* () {
        const test = callbacksBase_1.Callbacks.create('test');
        test.add(() => undefined, callbacks_1.callbacks.priority.LOW, '1');
        const result = yield test.run(true);
        (0, chai_1.expect)(result).to.be.true;
    }));
    (0, mocha_1.it)('should return the value returned by the callback', () => __awaiter(void 0, void 0, void 0, function* () {
        const test = callbacksBase_1.Callbacks.create('test');
        test.add(() => false, callbacks_1.callbacks.priority.LOW, '1');
        const result = yield test.run(true);
        (0, chai_1.expect)(result).to.be.false;
    }));
    (0, mocha_1.it)('should accumulate the values returned by the callbacks', () => __awaiter(void 0, void 0, void 0, function* () {
        const test = callbacksBase_1.Callbacks.create('test');
        test.add((old) => old * 5);
        test.add((old) => old * 2);
        (0, chai_1.expect)(yield test.run(3)).to.be.equal(30);
        (0, chai_1.expect)(yield test.run(2)).to.be.equal(20);
    }));
});
