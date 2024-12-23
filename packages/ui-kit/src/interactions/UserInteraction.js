"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoomActionButtonUserInteraction = exports.isMesssageActionButtonUserInteraction = exports.isUserDropdownActionButtonUserInteraction = exports.isMessageBoxActionButtonUserInteraction = exports.isViewSubmitUserInteraction = exports.isViewClosedUserInteraction = exports.isViewBlockActionUserInteraction = exports.isMessageBlockActionUserInteraction = void 0;
const typia_1 = __importDefault(require("typia"));
exports.isMessageBlockActionUserInteraction = typia_1.default.createIs();
exports.isViewBlockActionUserInteraction = typia_1.default.createIs();
exports.isViewClosedUserInteraction = typia_1.default.createIs();
exports.isViewSubmitUserInteraction = typia_1.default.createIs();
exports.isMessageBoxActionButtonUserInteraction = typia_1.default.createIs();
exports.isUserDropdownActionButtonUserInteraction = typia_1.default.createIs();
exports.isMesssageActionButtonUserInteraction = typia_1.default.createIs();
exports.isRoomActionButtonUserInteraction = typia_1.default.createIs();
