"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobileAction = void 0;
const reducer_1 = require("../reducer");
const isMobileAction = (payload) => ({
    type: reducer_1.ActionTypes.IsMobile,
    payload,
});
exports.isMobileAction = isMobileAction;
