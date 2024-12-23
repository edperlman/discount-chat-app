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
exports.MatrixEventsHandler = void 0;
class MatrixEventsHandler {
    // eslint-disable-next-line no-empty-function
    constructor(handlers) {
        this.handlers = handlers;
    }
    handleEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const handler = this.handlers.find((handler) => handler.equals(event));
            if (!handler) {
                return console.log(`Could not find handler for ${event.type}`, event);
            }
            try {
                yield handler.handle(event);
            }
            catch (e) {
                throw new Meteor.Error(e.message);
            }
        });
    }
}
exports.MatrixEventsHandler = MatrixEventsHandler;
