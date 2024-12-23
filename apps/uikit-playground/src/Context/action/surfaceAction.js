"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.surfaceAction = void 0;
const reducer_1 = require("../reducer");
const surfaceAction = (payload) => ({
    type: reducer_1.ActionTypes.Surface,
    payload,
});
exports.surfaceAction = surfaceAction;
