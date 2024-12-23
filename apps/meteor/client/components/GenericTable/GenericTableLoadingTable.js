"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericTableLoadingTable = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const GenericTableLoadingRow_1 = require("./GenericTableLoadingRow");
const GenericTableLoadingTable = ({ headerCells }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: Array.from({ length: 10 }, (_, i) => ((0, jsx_runtime_1.jsx)(GenericTableLoadingRow_1.GenericTableLoadingRow, { cols: headerCells }, i))) }));
exports.GenericTableLoadingTable = GenericTableLoadingTable;
