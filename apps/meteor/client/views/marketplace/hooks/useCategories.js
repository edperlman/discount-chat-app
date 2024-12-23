"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCategories = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useCategoryFlatList_1 = require("./useCategoryFlatList");
const useCategoryToggle_1 = require("./useCategoryToggle");
const orchestrator_1 = require("../../../apps/orchestrator");
const handleAPIError_1 = require("../helpers/handleAPIError");
const useCategories = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [categories, setCategories] = (0, react_1.useState)([]);
    const fetchCategories = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fetchedCategories = yield orchestrator_1.AppClientOrchestratorInstance.getCategories();
            const mappedCategories = fetchedCategories
                .filter((currentCategory) => !currentCategory.hidden)
                .map((currentCategory) => ({
                id: currentCategory.id,
                label: currentCategory.title,
                checked: false,
            }));
            setCategories([
                {
                    items: [
                        {
                            id: 'all',
                            label: t('All_categories'),
                        },
                    ],
                },
                {
                    label: t('Filter_by_category'),
                    items: mappedCategories,
                },
            ]);
        }
        catch (e) {
            (0, handleAPIError_1.handleAPIError)(e);
        }
    }), [t]);
    (0, react_1.useEffect)(() => {
        const fetchCategoriesWrapper = () => __awaiter(void 0, void 0, void 0, function* () {
            yield fetchCategories();
        });
        fetchCategoriesWrapper();
    }, [fetchCategories]);
    const onSelected = (0, useCategoryToggle_1.useCategoryToggle)(setCategories);
    const flatCategories = (0, useCategoryFlatList_1.useCategoryFlatList)(categories);
    const originalSize = (0, useCategoryFlatList_1.useCategoryFlatList)(categories).length;
    const selectedCategories = (0, react_1.useMemo)(() => flatCategories.filter((category) => Boolean(category.checked)), [flatCategories]);
    return [categories, selectedCategories, originalSize === selectedCategories.length ? [] : selectedCategories, onSelected];
};
exports.useCategories = useCategories;
