"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCategoryToggle = void 0;
const react_1 = require("react");
const useCategoryToggle = (setData) => {
    const onSelected = (0, react_1.useCallback)((item) => setData((prev) => {
        const categories = prev.flatMap((group) => group.items);
        const categoriesWithoutAll = categories.filter(({ id }) => id !== 'all');
        const allCategoriesOption = categories.find(({ id }) => id === 'all');
        const toggledCategory = categories.find(({ id }) => id === item.id);
        const isAllCategoriesToggled = item.id === 'all';
        if (isAllCategoriesToggled) {
            categoriesWithoutAll.forEach((currentItem) => {
                currentItem.checked = !item.checked;
            });
        }
        if (toggledCategory) {
            toggledCategory.checked = !toggledCategory.checked;
        }
        if (allCategoriesOption && categoriesWithoutAll.some((currentCategory) => currentCategory.checked === false)) {
            allCategoriesOption.checked = false;
        }
        return [...prev];
    }), [setData]);
    return onSelected;
};
exports.useCategoryToggle = useCategoryToggle;
