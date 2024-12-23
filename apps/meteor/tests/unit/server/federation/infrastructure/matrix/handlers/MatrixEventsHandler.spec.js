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
const handlers_1 = require("../../../../../../../server/services/federation/infrastructure/matrix/handlers");
describe('Federation - Infrastructure - Matrix - MatrixEventsHandler', () => {
    describe('#handleEvent()', () => {
        const spyFn = (0, chai_1.spy)();
        const myHandler = new handlers_1.MatrixEventsHandler([
            {
                eventType: 'eventType',
                equals: (event) => event.type === 'eventType',
                handle: spyFn,
            },
        ]);
        it('should call the handler fn properly', () => __awaiter(void 0, void 0, void 0, function* () {
            yield myHandler.handleEvent({ type: 'eventType' });
            (0, chai_1.expect)(spyFn).to.have.been.called.with({ type: 'eventType' });
        }));
        it('should NOT call the handler if there is no handler for the event', () => __awaiter(void 0, void 0, void 0, function* () {
            yield myHandler.handleEvent({ type: 'eventType2' });
            (0, chai_1.expect)(spyFn).to.not.be.called;
        }));
    });
});
