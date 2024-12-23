"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryQueue = void 0;
const fastq_1 = __importDefault(require("fastq"));
class InMemoryQueue {
    setHandler(handler, concurrency) {
        this.instance = fastq_1.default.promise(handler, concurrency);
    }
    addToQueue(task) {
        if (!this.instance) {
            throw new Error('You need to set the handler first');
        }
        this.instance.push(task).catch(console.error);
    }
}
exports.InMemoryQueue = InMemoryQueue;
