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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const reactflow_1 = __importStar(require("reactflow"));
require("reactflow/dist/style.css");
const Context_1 = require("../../Context");
const ConnectionLine_1 = __importDefault(require("./ConnectionLine"));
const UIKitWrapper_1 = __importDefault(require("./UIKitWrapper/UIKitWrapper"));
const utils_1 = require("./utils");
const ControlButtons_1 = __importDefault(require("./ControlButtons"));
const useNodesAndEdges_1 = require("../../hooks/useNodesAndEdges");
const updateNodesAndViewPortAction_1 = require("../../Context/action/updateNodesAndViewPortAction");
const FlowContainer = () => {
    const { dispatch } = (0, react_1.useContext)(Context_1.context);
    const { nodes, edges, Viewport, onNodesChange, onEdgesChange, setEdges } = (0, useNodesAndEdges_1.useNodesAndEdges)();
    const { setViewport } = (0, reactflow_1.useReactFlow)();
    const nodeTypes = (0, react_1.useMemo)(() => ({
        custom: UIKitWrapper_1.default,
    }), 
    // used to rerender edge lines on reorder payload
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [edges]);
    const [rfInstance, setRfInstance] = (0, react_1.useState)();
    const edgeUpdateSuccessful = (0, react_1.useRef)(true);
    const onConnect = (0, react_1.useCallback)((connection) => {
        if (connection.source === connection.target)
            return;
        const newEdge = Object.assign(Object.assign({}, connection), { type: utils_1.FlowParams.edgeType, markerEnd: utils_1.FlowParams.markerEnd, style: utils_1.FlowParams.style });
        setEdges((eds) => (0, reactflow_1.addEdge)(newEdge, eds));
    }, [setEdges]);
    const onEdgeUpdateStart = (0, react_1.useCallback)(() => {
        edgeUpdateSuccessful.current = false;
    }, []);
    const onEdgeUpdate = (0, react_1.useCallback)((oldEdge, newConnection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => (0, reactflow_1.updateEdge)(oldEdge, newConnection, els));
    }, [setEdges]);
    const onEdgeUpdateEnd = (0, react_1.useCallback)((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => {
                return eds.filter((e) => e.id !== edge.id);
            });
        }
        edgeUpdateSuccessful.current = true;
    }, [setEdges]);
    const onNodeDragStop = () => {
        if (!(rfInstance === null || rfInstance === void 0 ? void 0 : rfInstance.toObject()))
            return;
        const { nodes, viewport } = rfInstance.toObject();
        dispatch((0, updateNodesAndViewPortAction_1.updateNodesAndViewPortAction)({ nodes, viewport }));
    };
    const onInit = (instance) => {
        setRfInstance(instance);
        Viewport && setViewport(Viewport);
    };
    return ((0, jsx_runtime_1.jsxs)(reactflow_1.default, { nodes: nodes, edges: edges, onInit: onInit, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, onEdgeUpdate: onEdgeUpdate, onNodeDragStop: onNodeDragStop, onEdgeUpdateStart: onEdgeUpdateStart, onEdgeUpdateEnd: onEdgeUpdateEnd, onConnect: onConnect, fitView: true, nodeTypes: nodeTypes, minZoom: 0.1, connectionLineComponent: ConnectionLine_1.default, children: [(0, jsx_runtime_1.jsx)(reactflow_1.MiniMap, { zoomable: true, pannable: true }), (0, jsx_runtime_1.jsx)(ControlButtons_1.default, {}), (0, jsx_runtime_1.jsx)(reactflow_1.Background, { color: "#aaa", gap: 16 })] }));
};
exports.default = FlowContainer;
