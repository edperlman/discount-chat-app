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
const TimeoutControl_1 = require("../src/TimeoutControl");
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');
it('should call the heartbeat and timeout callbacks respecting the informed time', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const heartbeatCallback = jest.fn();
        const timeoutCallback = jest.fn();
        const timeout = new TimeoutControl_1.TimeoutControl(100);
        timeout.reset();
        expect(setTimeout).toHaveBeenCalledTimes(2);
        timeout.on('heartbeat', heartbeatCallback);
        timeout.on('timeout', timeoutCallback);
        // At this point in time, the callback should not have been called yet
        expect(heartbeatCallback).not.toBeCalled();
        expect(timeoutCallback).not.toBeCalled();
        jest.advanceTimersByTime(60);
        expect(heartbeatCallback).toHaveBeenCalledTimes(1);
        expect(timeoutCallback).not.toBeCalled();
        jest.advanceTimersByTime(60);
        expect(heartbeatCallback).toHaveBeenCalledTimes(1);
        expect(timeoutCallback).toHaveBeenCalledTimes(1);
    });
});
it('should never call the timeout callback if the reset method is called', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const heartbeatCallback = jest.fn();
        const timeoutCallback = jest.fn();
        const timeout = new TimeoutControl_1.TimeoutControl(100);
        timeout.reset();
        expect(setTimeout).toHaveBeenCalledTimes(2);
        timeout.on('heartbeat', heartbeatCallback);
        timeout.on('timeout', timeoutCallback);
        // At this point in time, the callback should not have been called yet
        expect(heartbeatCallback).not.toBeCalled();
        expect(timeoutCallback).not.toBeCalled();
        jest.advanceTimersByTime(60);
        expect(heartbeatCallback).toHaveBeenCalledTimes(1);
        expect(timeoutCallback).not.toBeCalled();
        timeout.reset();
        jest.advanceTimersByTime(60);
        expect(heartbeatCallback).toHaveBeenCalledTimes(2);
        expect(timeoutCallback).not.toBeCalled();
    });
});
afterEach(() => {
    jest.clearAllMocks();
});
