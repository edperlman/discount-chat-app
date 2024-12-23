"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
const DeleteElementBtn_1 = __importDefault(require("../Preview/Display/UiKitElementWrapper/DeleteElementBtn"));
const UiKitElementWrapper_1 = __importDefault(require("../Preview/Display/UiKitElementWrapper/UiKitElementWrapper"));
const RenderPayload_1 = __importDefault(require("../RenderPayload/RenderPayload"));
const DraggableListItem = ({ block, surface, index, }) => ((0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.Draggable, { draggableId: block.id, index: index, children: (provided) => ((0, jsx_runtime_1.jsx)("div", Object.assign({ ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps, { children: (0, jsx_runtime_1.jsxs)(UiKitElementWrapper_1.default, { children: [(0, jsx_runtime_1.jsx)(DeleteElementBtn_1.default, { elementIndex: index }), (0, jsx_runtime_1.jsx)(RenderPayload_1.default, { surface: surface, blocks: [block.payload] })] }, index) }))) }));
exports.default = DraggableListItem;
