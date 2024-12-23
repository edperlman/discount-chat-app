"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterEdges = void 0;
const filterEdges = (edges, activeActionIds, sourceId) => {
    return edges.filter((edge) => sourceId !== edge.source ||
        activeActionIds.includes(edge.sourceHandle || ''));
};
exports.filterEdges = filterEdges;
