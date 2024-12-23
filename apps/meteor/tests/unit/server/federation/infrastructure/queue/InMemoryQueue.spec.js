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
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const { InMemoryQueue } = proxyquire_1.default.noCallThru().load('../../../../../../server/services/federation/infrastructure/queue/InMemoryQueue', {
    fastq: {
        promise(handler) {
            return {
                push: (task) => handler.call(this, task),
            };
        },
    },
});
describe('Federation - Infrastructure - Queue - InMemoryQueue', () => {
    const queue = new InMemoryQueue();
    describe('#addToQueue()', () => {
        it('should throw an error if the instance was not set beforehand', () => {
            (0, chai_1.expect)(() => queue.addToQueue({})).to.throw('You need to set the handler first');
        });
        it('should push the task to the queue instance to be handled when the instance was properly defined', () => {
            const spiedCb = (0, chai_1.spy)(() => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const concurrency = 1;
            queue.setHandler(spiedCb, concurrency);
            queue.addToQueue({ task: 'my-task' });
            (0, chai_1.expect)(spiedCb).to.have.been.called.with({ task: 'my-task' });
        });
    });
});
