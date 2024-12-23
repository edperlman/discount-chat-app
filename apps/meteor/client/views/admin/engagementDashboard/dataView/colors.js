"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.polychromaticColors = exports.monochromaticColors = void 0;
const colors_json_1 = __importDefault(require("@rocket.chat/fuselage-tokens/colors.json"));
exports.monochromaticColors = [
    colors_json_1.default.b100,
    colors_json_1.default.b200,
    colors_json_1.default.b300,
    colors_json_1.default.b400,
    colors_json_1.default.b500,
    colors_json_1.default.b600,
    colors_json_1.default.b700,
    colors_json_1.default.b800,
    colors_json_1.default.b900,
];
exports.polychromaticColors = [colors_json_1.default.y500, colors_json_1.default.g500, colors_json_1.default.b500];
