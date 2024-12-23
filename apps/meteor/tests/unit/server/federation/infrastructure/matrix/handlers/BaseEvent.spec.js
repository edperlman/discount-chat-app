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
const BaseEvent_1 = require("../../../../../../../server/services/federation/infrastructure/matrix/handlers/BaseEvent");
describe('Federation - Infrastructure - Matrix - MatrixBaseEventHandler', () => {
    describe('#equals()', () => {
        class MyHandler extends BaseEvent_1.MatrixBaseEventHandler {
            constructor() {
                super();
                this.eventType = 'type';
            }
            handle() {
                throw new Error('Method not implemented.');
            }
        }
        const myHandler = new MyHandler();
        it('should return true if the type is equals to the provided one', () => {
            (0, chai_1.expect)(myHandler.equals({ type: 'type' })).to.be.true;
        });
        it('should return false if the type is different to the provided one', () => {
            (0, chai_1.expect)(myHandler.equals('different')).to.be.false;
        });
    });
    describe('#handle()', () => {
        const spyFn = (0, chai_1.spy)();
        class MyHandler extends BaseEvent_1.MatrixBaseEventHandler {
            constructor() {
                super();
                this.eventType = 'type';
            }
            handle() {
                return __awaiter(this, void 0, void 0, function* () {
                    spyFn();
                });
            }
        }
        const myHandler = new MyHandler();
        it('should call the handler fn in the implementated class', () => __awaiter(void 0, void 0, void 0, function* () {
            yield myHandler.handle();
            (0, chai_1.expect)(spyFn).to.be.called;
        }));
    });
});
