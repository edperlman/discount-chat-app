"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tabsToggleAction = void 0;
const reducer_1 = require("../reducer");
const tabsToggleAction = (payload) => ({
    type: reducer_1.ActionTypes.EditorToggle,
    payload,
});
exports.tabsToggleAction = tabsToggleAction;
