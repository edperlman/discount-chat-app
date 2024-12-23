"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowParams = void 0;
exports.useNodesAndEdges = useNodesAndEdges;
/* eslint-disable react-hooks/exhaustive-deps */
const reactflow_1 = require("reactflow");
const react_1 = require("react");
const Context_1 = require("../Context");
function useNodesAndEdges() {
    var _a;
    const { state: { screens, projects, activeProject }, dispatch, } = (0, react_1.useContext)(Context_1.context);
    const [nodes, setNodes, onNodesChange] = (0, reactflow_1.useNodesState)([]);
    const [edges, _setEdges, onEdgesChange] = (0, reactflow_1.useEdgesState)([]);
    const setEdges = (callback) => {
        const _edges = callback(edges);
        _setEdges(_edges);
        dispatch((0, Context_1.updateFlowEdgesAction)(_edges));
    };
    (0, react_1.useEffect)(() => {
        const prevNodes = projects[activeProject].flowNodes;
        const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const activeScreens = projects[activeProject].screens.map((id) => screens[id]);
        activeScreens.map((screen, i) => {
            if (prevNodes.map((node) => node.id).includes(screen.id))
                return;
            const degrees = i * (360 / 8);
            const radians = degrees * (Math.PI / 180);
            const x = 250 * activeScreens.length * Math.cos(radians) + center.x;
            const y = 250 * activeScreens.length * Math.sin(radians) + center.y;
            prevNodes.push({
                id: screen.id,
                type: 'custom',
                position: { x, y },
                data: screen.id,
            });
        });
        setNodes(prevNodes);
    }, [
        activeProject,
        projects,
        screens,
        JSON.stringify(screens),
        projects[activeProject].screens,
        setNodes,
    ]);
    (0, react_1.useEffect)(() => {
        const _edges = projects[activeProject].flowEdges;
        _setEdges(_edges);
    }, [
        activeProject,
        projects,
        screens,
        projects[activeProject].flowEdges,
        _setEdges,
    ]);
    const Viewport = (_a = projects[activeProject]) === null || _a === void 0 ? void 0 : _a.viewport;
    return {
        nodes,
        edges,
        Viewport,
        onNodesChange,
        onEdgesChange,
        setNodes,
        setEdges,
    };
}
exports.FlowParams = {
    edgeType: 'smoothstep',
    markerEnd: {
        type: reactflow_1.MarkerType.Arrow,
    },
    style: {
        strokeWidth: 2,
        stroke: 'var(--RCPG-primary-color)',
    },
};
