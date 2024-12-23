"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./splitPlane.css");
const react_1 = require("react");
const react_split_pane_1 = __importDefault(require("react-split-pane"));
const Context_1 = require("../../../Context");
const Display_1 = __importDefault(require("../Display"));
const Editor_1 = __importDefault(require("../Editor"));
const SplitPlaneContainer = ({ PreviewSize, }) => {
    const { state: { isTablet }, dispatch, } = (0, react_1.useContext)(Context_1.context);
    (0, react_1.useEffect)(() => {
        dispatch((0, Context_1.previewTabsToggleAction)(0));
    }, [isTablet, dispatch]);
    const splitPaneProps = {
        defaultSize: (PreviewSize.inlineSize || 1) * 0.5,
        minSize: 300,
        maxSize: (PreviewSize.inlineSize || 1) - 350,
        allowResize: !isTablet,
    };
    return isTablet ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Display_1.default, {}), (0, jsx_runtime_1.jsx)(Editor_1.default, {})] })) : ((0, jsx_runtime_1.jsxs)(react_split_pane_1.default, Object.assign({}, splitPaneProps, { children: [(0, jsx_runtime_1.jsx)(Display_1.default, {}), (0, jsx_runtime_1.jsx)(Editor_1.default, {})] })));
};
exports.default = SplitPlaneContainer;
