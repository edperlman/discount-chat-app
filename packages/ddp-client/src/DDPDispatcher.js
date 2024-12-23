"use strict";
/**
 * A queue of ddp blocking methods that are waiting to be sent to the server.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDPDispatcher = void 0;
const MinimalDDPClient_1 = require("./MinimalDDPClient");
class DDPDispatcher extends MinimalDDPClient_1.MinimalDDPClient {
    constructor() {
        super(...arguments);
        this.queue = [];
    }
    dispatch(msg, options) {
        if (options === null || options === void 0 ? void 0 : options.wait) {
            this.wait(msg);
            return;
        }
        this.pushItem(msg);
    }
    wait(block) {
        this.queue.push({
            wait: true,
            items: [block],
        });
        if (this.queue.length === 1) {
            this.sendOutstandingBlocks();
        }
    }
    pushItem(item) {
        const block = this.tail();
        if (!block || block.wait) {
            this.queue.push({
                wait: false,
                items: [item],
            });
        }
        if (!block) {
            this.sendOutstandingBlocks();
            return;
        }
        if (block.wait) {
            return;
        }
        block.items.push(item);
    }
    tail() {
        return this.queue[this.queue.length - 1];
    }
    sendOutstandingBlocks() {
        const block = this.queue[0];
        if (!block) {
            return;
        }
        block.items.forEach((payload) => {
            this.emit('send', payload);
        });
        if (block.wait) {
            return;
        }
        this.queue.shift();
        this.sendOutstandingBlocks();
    }
    removeItem(item) {
        const block = this.queue[0];
        if (!block) {
            return;
            // throw new Error('No block to remove item from');
        }
        const index = block.items.indexOf(item);
        if (index === -1) {
            return;
            // throw new Error('Item not found in block');
        }
        block.items.splice(index, 1);
        if (block.items.length === 0) {
            this.queue.shift();
            this.sendOutstandingBlocks();
        }
    }
}
exports.DDPDispatcher = DDPDispatcher;
