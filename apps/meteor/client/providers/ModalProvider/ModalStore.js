"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modalStore = void 0;
const emitter_1 = require("@rocket.chat/emitter");
class ModalStore extends emitter_1.Emitter {
    constructor() {
        super(...arguments);
        this.modalStack = [];
        // open function erases all other modals from the stack
        this.open = (node, region) => {
            this.modalStack = [{ node, region }];
            this.update();
            return {
                close: () => {
                    this.modalStack = this.modalStack.filter((modal) => modal !== this.current);
                    this.update();
                },
                cancel: this.close,
            };
        };
        this.push = (node, region) => {
            this.modalStack = [...this.modalStack, { node, region }];
            this.update();
            return {
                close: () => {
                    this.modalStack = this.modalStack.filter((modal) => modal !== this.current);
                    this.update();
                },
                cancel: this.close,
            };
        };
        this.close = () => {
            this.modalStack = this.modalStack.slice(0, -1);
            this.update();
        };
        this.subscribe = (cb) => {
            this.on('update', cb);
            return () => this.off('update', cb);
        };
        this.getSnapshot = () => {
            return this.current;
        };
    }
    update() {
        this.emit('update');
    }
    get current() {
        var _a;
        return (_a = this.modalStack[this.modalStack.length - 1]) !== null && _a !== void 0 ? _a : null;
    }
}
exports.modalStore = new ModalStore();
