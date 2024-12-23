"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSortMenu = void 0;
const react_i18next_1 = require("react-i18next");
const useGroupingListItems_1 = require("./useGroupingListItems");
const useSortModeItems_1 = require("./useSortModeItems");
const useViewModeItems_1 = require("./useViewModeItems");
const useSortMenu = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const viewModeItems = (0, useViewModeItems_1.useViewModeItems)();
    const sortModeItems = (0, useSortModeItems_1.useSortModeItems)();
    const groupingListItems = (0, useGroupingListItems_1.useGroupingListItems)();
    const sections = [
        { title: t('Display'), items: viewModeItems },
        { title: t('Sort_By'), items: sortModeItems },
        { title: t('Group_by'), items: groupingListItems },
    ];
    return sections;
};
exports.useSortMenu = useSortMenu;
