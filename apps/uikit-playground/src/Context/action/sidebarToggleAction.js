"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sidebarToggleAction = void 0;
const reducer_1 = require("../reducer");
const sidebarToggleAction = (payload) => ({
    type: reducer_1.ActionTypes.SidebarToggle,
    payload,
});
exports.sidebarToggleAction = sidebarToggleAction;
