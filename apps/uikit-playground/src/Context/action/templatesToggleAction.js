"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templatesToggleAction = void 0;
const reducer_1 = require("../reducer");
const templatesToggleAction = (payload) => ({
    type: reducer_1.ActionTypes.TemplatesToggle,
    payload,
});
exports.templatesToggleAction = templatesToggleAction;
