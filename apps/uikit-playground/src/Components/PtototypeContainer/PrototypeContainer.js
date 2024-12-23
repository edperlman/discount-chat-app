"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Context_1 = require("../../Context");
const fuselage_1 = require("@rocket.chat/fuselage");
const PrototypeRender_1 = __importDefault(require("../PrototypeRender/PrototypeRender"));
const PrototypeContainer = () => {
    var _a;
    const { state: { projects, activeProject, screens }, } = (0, react_1.useContext)(Context_1.context);
    const [currentScreenID, setCurrentScreenID] = (0, react_1.useState)(projects[activeProject].screens[0]);
    const activeActions = (0, react_1.useMemo)(() => {
        var _a;
        return (_a = projects[activeProject]) === null || _a === void 0 ? void 0 : _a.flowEdges.map((edge) => edge.sourceHandle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeProject, projects, projects[activeProject].flowEdges]);
    if (!projects[activeProject].screens.length)
        return null;
    const { surface, blocks } = ((_a = screens[currentScreenID]) === null || _a === void 0 ? void 0 : _a.payload) ||
        screens[projects[activeProject].screens[0]].payload;
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Scrollable, { vertical: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: "100%", h: "100%", children: (0, jsx_runtime_1.jsx)(PrototypeRender_1.default, { surface: surface, blocks: blocks, activeActions: activeActions, flowEdges: projects[activeProject].flowEdges, onSelectAction: setCurrentScreenID }) }) }));
};
exports.default = PrototypeContainer;
