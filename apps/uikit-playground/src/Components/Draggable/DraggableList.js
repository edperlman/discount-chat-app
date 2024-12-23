"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
const DraggableListItem_1 = __importDefault(require("./DraggableListItem"));
const constant_1 = require("../Preview/Display/Surface/constant");
const DraggableList = react_1.default.memo(({ blocks, surface, onDragEnd }) => ((0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.DragDropContext, { onDragEnd: onDragEnd, children: (0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.Droppable, { droppableId: "droppable-list", children: (provided) => ((0, jsx_runtime_1.jsxs)("div", Object.assign({ style: { padding: '10px' }, ref: provided.innerRef }, provided.droppableProps, { children: [blocks.map((block, index) => ((0, jsx_runtime_1.jsx)(DraggableListItem_1.default, { surface: surface || constant_1.SurfaceOptions.Message, block: block, index: index }, block.id))), provided.placeholder] }))) }) })));
exports.default = DraggableList;
