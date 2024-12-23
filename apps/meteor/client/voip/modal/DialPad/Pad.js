"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const PadButton_1 = __importDefault(require("./PadButton"));
const digits = [
    ['1', ''],
    ['2', 'ABC'],
    ['3', 'DEF'],
    ['4', 'GHI'],
    ['5', 'JKL'],
    ['6', 'MNO'],
    ['7', 'PQRS'],
    ['8', 'TUV'],
    ['9', 'WXYZ'],
    ['*', ''],
    ['0', '+'],
    ['#', ''],
];
const Pad = ({ onClickPadButton, onLongPressPadButton, }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mi: '-8px', mbs: '24px', children: digits.map((digit, idx) => ((0, jsx_runtime_1.jsx)(PadButton_1.default, { onClickPadButton: onClickPadButton, onLongPressPadButton: onLongPressPadButton, children: digit }, idx))) }));
exports.default = Pad;
