"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipSession = void 0;
const useVoipEffect_1 = require("./useVoipEffect");
const useVoipSession = () => {
    return (0, useVoipEffect_1.useVoipEffect)((client) => client.getSession(), null);
};
exports.useVoipSession = useVoipSession;
