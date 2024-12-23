"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editorTabsToggleAction = void 0;
const reducer_1 = require("../reducer");
const editorTabsToggleAction = (payload) => ({
    type: reducer_1.ActionTypes.EditorToggle,
    payload,
});
exports.editorTabsToggleAction = editorTabsToggleAction;
