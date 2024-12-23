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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const availablePercentualWidths = [47, 68, 75, 82];
const MessageListSkeleton = ({ messageCount = 2 }) => {
    const widths = (0, react_1.useMemo)(() => Array.from({ length: messageCount }, (_, index) => `${availablePercentualWidths[index % availablePercentualWidths.length]}%`), [messageCount]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', height: '100%', justifyContent: 'flex-start', flexDirection: 'column', children: widths.map((width, index) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { pi: 24, pb: 16, display: 'flex', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', width: 36, height: 36 }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mis: 8, flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: width })] })] }, index))) }));
};
exports.default = (0, react_1.memo)(MessageListSkeleton);
