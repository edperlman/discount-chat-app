"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navMenuToggleAction = void 0;
const reducer_1 = require("../reducer");
const navMenuToggleAction = (payload) => ({
    type: reducer_1.ActionTypes.NavMenuToggle,
    payload,
});
exports.navMenuToggleAction = navMenuToggleAction;
