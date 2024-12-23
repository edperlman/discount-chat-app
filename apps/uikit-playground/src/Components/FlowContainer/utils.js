"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowParams = void 0;
exports.createNodesAndEdges = createNodesAndEdges;
const reactflow_1 = require("reactflow");
function createNodesAndEdges(screens) {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const nodes = screens.map((screen, i) => {
        const degrees = i * (360 / 8);
        const radians = degrees * (Math.PI / 180);
        const x = 250 * Math.cos(radians) + center.x;
        const y = 250 * Math.sin(radians) + center.y;
        return {
            id: screen.id,
            type: 'custom',
            position: { x, y },
            data: screen,
        };
    });
    return { nodes };
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
