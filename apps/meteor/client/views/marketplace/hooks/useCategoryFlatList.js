"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCategoryFlatList = void 0;
const react_1 = require("react");
const useCategoryFlatList = (categories) => (0, react_1.useMemo)(() => categories.flatMap((group) => group.items).filter(({ id }) => id !== 'all'), [categories]);
exports.useCategoryFlatList = useCategoryFlatList;
