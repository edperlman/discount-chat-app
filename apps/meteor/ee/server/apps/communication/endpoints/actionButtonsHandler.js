"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionButtonsHandler = void 0;
const server_1 = require("../../../../../app/api/server");
const actionButtonsHandler = (apiManager) => [
    {
        authRequired: false,
    },
    {
        get() {
            const manager = apiManager._manager;
            const buttons = manager.getUIActionButtonManager().getAllActionButtons();
            return server_1.API.v1.success(buttons);
        },
    },
];
exports.actionButtonsHandler = actionButtonsHandler;
