"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFlowEdgesAction = void 0;
const reducer_1 = require("../reducer");
const updateFlowEdgesAction = (payload) => ({
    type: reducer_1.ActionTypes.UpdateFlowEdges,
    payload,
});
exports.updateFlowEdgesAction = updateFlowEdgesAction;
