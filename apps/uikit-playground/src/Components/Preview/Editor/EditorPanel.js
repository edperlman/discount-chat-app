"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const Context_1 = require("../../../Context");
const ToggleTabs_1 = __importDefault(require("../../ToggleTabs"));
const ActionBlockEditor_1 = __importDefault(require("./ActionBlockEditor"));
const ActionPreviewEditor_1 = __importDefault(require("./ActionPreviewEditor"));
const FlowDiagram_1 = __importDefault(require("../../../Pages/FlowDiagram"));
const PrototypeContainer_1 = __importDefault(require("../../PtototypeContainer/PrototypeContainer"));
var TabsItem;
(function (TabsItem) {
    TabsItem[TabsItem["ActionBlock"] = 0] = "ActionBlock";
    TabsItem[TabsItem["ActionPreview"] = 1] = "ActionPreview";
    TabsItem[TabsItem["FlowDiagram"] = 2] = "FlowDiagram";
    TabsItem[TabsItem["Prototype"] = 3] = "Prototype";
})(TabsItem || (TabsItem = {}));
const tabsItem = {
    [TabsItem.ActionBlock]: {
        name: 'Action Block',
        Container: ActionBlockEditor_1.default,
    },
    [TabsItem.ActionPreview]: {
        name: 'Action Preview',
        Container: ActionPreviewEditor_1.default,
    },
    [TabsItem.FlowDiagram]: {
        name: 'Flow Diagram',
        Container: FlowDiagram_1.default,
    },
    [TabsItem.Prototype]: { name: 'Prototype', Container: PrototypeContainer_1.default },
};
const EditorPanel = () => {
    const { state: { editorTabsToggle }, dispatch, } = (0, react_1.useContext)(Context_1.context);
    const toggleTabsHandler = (index) => {
        dispatch((0, Context_1.editorTabsToggleAction)(index));
    };
    const tabChangeStyle = (index) => {
        return (0, css_in_js_1.css) `
      transition: 0.5s ease;
      left: calc(-100% * ${index});
    `;
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { width: '100%', height: '100%', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: "relative", width: '100%', height: '100%', overflow: "hidden", className: [
                (0, css_in_js_1.css) `
            user-select: none;
          `,
            ], children: [(0, jsx_runtime_1.jsx)(ToggleTabs_1.default, { tabsItem: Object.values(tabsItem).map((item) => item.name), onChange: toggleTabsHandler, selectedTab: editorTabsToggle }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: "relative", width: '100%', height: "calc(100% - 40px)", flexDirection: "column", children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: "absolute", width: `calc(100% * ${Object.values(tabsItem).length})`, height: '100%', display: 'flex', borderBlockStart: "var(--default-border)", className: tabChangeStyle(editorTabsToggle), children: Object.values(tabsItem).map(({ Container }, index) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: index === editorTabsToggle ? ((0, jsx_runtime_1.jsx)(Container, {})) : ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: "100%", h: "100%" })) }))) }) })] }) }));
};
exports.default = EditorPanel;
