"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuselageMessageSurfaceRenderer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const UiKit = __importStar(require("@rocket.chat/ui-kit"));
const FuselageSurfaceRenderer_1 = require("./FuselageSurfaceRenderer");
const VideoConferenceBlock_1 = __importDefault(require("../blocks/VideoConferenceBlock/VideoConferenceBlock"));
const AppIdContext_1 = require("../contexts/AppIdContext");
class FuselageMessageSurfaceRenderer extends FuselageSurfaceRenderer_1.FuselageSurfaceRenderer {
    constructor() {
        super([
            'actions',
            'context',
            'divider',
            'image',
            'input',
            'section',
            'preview',
            'video_conf',
        ]);
        this.plain_text = FuselageSurfaceRenderer_1.renderTextObject;
        this.mrkdwn = FuselageSurfaceRenderer_1.renderTextObject;
    }
    video_conf(block, context, index) {
        if (context === UiKit.BlockContext.BLOCK) {
            return ((0, jsx_runtime_1.jsx)(AppIdContext_1.AppIdProvider, { appId: block.appId, children: (0, jsx_runtime_1.jsx)(VideoConferenceBlock_1.default, { block: block, context: context, index: index, surfaceRenderer: this }) }, index));
        }
        return null;
    }
}
exports.FuselageMessageSurfaceRenderer = FuselageMessageSurfaceRenderer;
