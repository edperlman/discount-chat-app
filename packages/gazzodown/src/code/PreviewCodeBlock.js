"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewCodeBlock = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PreviewCodeBlock = ({ lines }) => {
    const firstLine = (0, react_1.useMemo)(() => { var _a; return (_a = lines.find((line) => line.value.value.trim())) === null || _a === void 0 ? void 0 : _a.value.value.trim(); }, [lines]);
    if (!firstLine) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: firstLine });
};
exports.PreviewCodeBlock = PreviewCodeBlock;
exports.default = exports.PreviewCodeBlock;
