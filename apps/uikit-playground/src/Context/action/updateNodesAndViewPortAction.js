"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNodesAndViewPortAction = void 0;
const reducer_1 = require("../reducer");
const updateNodesAndViewPortAction = (payload) => ({
    type: reducer_1.ActionTypes.UpdateNodesAndViewPort,
    payload,
});
exports.updateNodesAndViewPortAction = updateNodesAndViewPortAction;
