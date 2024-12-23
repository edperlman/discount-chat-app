"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewTabsToggleAction = void 0;
const reducer_1 = require("../reducer");
const previewTabsToggleAction = (payload) => ({
    type: reducer_1.ActionTypes.PreviewToggle,
    payload,
});
exports.previewTabsToggleAction = previewTabsToggleAction;
