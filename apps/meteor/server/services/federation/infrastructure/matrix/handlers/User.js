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
exports.MatrixUserTypingStatusChangedHandler = void 0;
const BaseEvent_1 = require("./BaseEvent");
const UserReceiver_1 = require("../converters/user/UserReceiver");
const MatrixEventType_1 = require("../definitions/MatrixEventType");
class MatrixUserTypingStatusChangedHandler extends BaseEvent_1.MatrixBaseEventHandler {
    constructor(userService) {
        super();
        this.userService = userService;
        this.eventType = MatrixEventType_1.MatrixEventType.USER_TYPING_STATUS_CHANGED;
    }
    handle(externalEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userService.onUserTyping(UserReceiver_1.MatrixUserReceiverConverter.toUserTypingDto(externalEvent));
        });
    }
}
exports.MatrixUserTypingStatusChangedHandler = MatrixUserTypingStatusChangedHandler;
