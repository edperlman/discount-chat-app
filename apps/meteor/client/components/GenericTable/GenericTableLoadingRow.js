"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericTableLoadingRow = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const GenericTableLoadingRow = ({ cols }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 40, width: 40 }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mi: 8, flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' })] })] }) }), Array.from({ length: cols - 1 }, (_, i) => ((0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }) }, i)))] }));
exports.GenericTableLoadingRow = GenericTableLoadingRow;
