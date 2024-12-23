"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ToneItem = ({ tone }) => {
    let toneEmoji;
    switch (tone) {
        case 1:
            toneEmoji = '<span class="emojione emojione-diversity _270b-1f3fb">✋🏻</span>';
            break;
        case 2:
            toneEmoji = '<span class="emojione emojione-diversity _270b-1f3fc">✋🏼</span>';
            break;
        case 3:
            toneEmoji = '<span class="emojione emojione-diversity _270b-1f3fd">✋🏽</span>';
            break;
        case 4:
            toneEmoji = '<span class="emojione emojione-diversity _270b-1f3fe">✋🏾</span>';
            break;
        case 5:
            toneEmoji = '<span class="emojione emojione-diversity _270b-1f3ff">✋🏿</span>';
            break;
        default:
            toneEmoji = '<span class="emojione emojione-people _270b">✋</span>';
    }
    return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { dangerouslySetInnerHTML: { __html: toneEmoji } });
};
exports.default = ToneItem;
