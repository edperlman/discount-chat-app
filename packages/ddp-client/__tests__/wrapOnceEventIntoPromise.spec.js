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
const emitter_1 = require("@rocket.chat/emitter");
const wrapOnceEventIntoPromise_1 = require("../src/wrapOnceEventIntoPromise");
it('should resolve', () => __awaiter(void 0, void 0, void 0, function* () {
    const emitter = new emitter_1.Emitter();
    const promise = (0, wrapOnceEventIntoPromise_1.wrapOnceEventIntoPromise)(emitter, 'test');
    emitter.emit('test', 'test');
    const result = yield promise;
    expect(result).toBe('test');
}));
it('should reject', () => __awaiter(void 0, void 0, void 0, function* () {
    const emitter = new emitter_1.Emitter();
    const promise = (0, wrapOnceEventIntoPromise_1.wrapOnceEventIntoPromise)(emitter, 'test');
    emitter.emit('test', { error: 'test' });
    yield expect(promise).rejects.toBe('test');
    expect.assertions(1);
}));
