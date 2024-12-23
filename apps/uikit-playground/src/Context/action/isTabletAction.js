"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTabletAction = void 0;
const reducer_1 = require("../reducer");
const isTabletAction = (payload) => ({
    type: reducer_1.ActionTypes.IsTablet,
    payload,
});
exports.isTabletAction = isTabletAction;
