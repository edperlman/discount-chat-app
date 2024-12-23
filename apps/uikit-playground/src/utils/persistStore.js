"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const persistStore = (state) => {
    localStorage.setItem('pesrist', JSON.stringify(state));
};
exports.default = persistStore;
