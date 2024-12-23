"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isServerInteraction = exports.isReportErrorsServerInteraction = exports.isCloseContextualBarServerInteraction = exports.isUpdateContextualBarServerInteraction = exports.isOpenContextualBarServerInteraction = exports.isCloseBannerServerInteraction = exports.isUpdateBannerServerInteraction = exports.isOpenBannerServerInteraction = exports.isCloseModalServerInteraction = exports.isUpdateModalServerInteraction = exports.isOpenModalServerInteraction = void 0;
const typia_1 = __importDefault(require("typia"));
exports.isOpenModalServerInteraction = typia_1.default.createIs();
exports.isUpdateModalServerInteraction = typia_1.default.createIs();
exports.isCloseModalServerInteraction = typia_1.default.createIs();
exports.isOpenBannerServerInteraction = typia_1.default.createIs();
exports.isUpdateBannerServerInteraction = typia_1.default.createIs();
exports.isCloseBannerServerInteraction = typia_1.default.createIs();
exports.isOpenContextualBarServerInteraction = typia_1.default.createIs();
exports.isUpdateContextualBarServerInteraction = typia_1.default.createIs();
exports.isCloseContextualBarServerInteraction = typia_1.default.createIs();
exports.isReportErrorsServerInteraction = typia_1.default.createIs();
const isServerInteraction = (input) => (0, exports.isOpenModalServerInteraction)(input) ||
    (0, exports.isUpdateModalServerInteraction)(input) ||
    (0, exports.isCloseModalServerInteraction)(input) ||
    (0, exports.isOpenBannerServerInteraction)(input) ||
    (0, exports.isUpdateBannerServerInteraction)(input) ||
    (0, exports.isCloseBannerServerInteraction)(input) ||
    (0, exports.isOpenContextualBarServerInteraction)(input) ||
    (0, exports.isUpdateContextualBarServerInteraction)(input) ||
    (0, exports.isCloseContextualBarServerInteraction)(input) ||
    (0, exports.isReportErrorsServerInteraction)(input);
exports.isServerInteraction = isServerInteraction;
