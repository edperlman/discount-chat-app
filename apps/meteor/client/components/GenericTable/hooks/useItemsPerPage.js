"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useItemsPerPage = void 0;
const react_1 = require("react");
const useItemsPerPage = (itemsPerPageInitialValue = 25) => {
    const [itemsPerPage, setItemsPerPage] = (0, react_1.useState)(itemsPerPageInitialValue);
    return [itemsPerPage, setItemsPerPage];
};
exports.useItemsPerPage = useItemsPerPage;
