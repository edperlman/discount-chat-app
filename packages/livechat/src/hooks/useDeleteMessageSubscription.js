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
exports.useDeleteMessageSubscription = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const hooks_1 = require("preact/hooks");
const store_1 = __importDefault(require("../store"));
// TODO: optimize this function
const deleteMessage = (messageId) => {
    var _a;
    store_1.default.setState({
        messages: (_a = store_1.default.state.messages) === null || _a === void 0 ? void 0 : _a.filter((message) => message._id !== messageId),
    });
};
const useDeleteMessageSubscription = (rid) => {
    const stream = (0, ui_contexts_1.useStream)('notify-room');
    (0, hooks_1.useEffect)(() => {
        if (!rid) {
            return;
        }
        return stream(`${rid}/deleteMessage`, (_a) => __awaiter(void 0, [_a], void 0, function* ({ _id }) {
            deleteMessage(_id);
        }));
    }, [rid, stream]);
};
exports.useDeleteMessageSubscription = useDeleteMessageSubscription;
