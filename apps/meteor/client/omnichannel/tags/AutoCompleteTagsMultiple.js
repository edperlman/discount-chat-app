"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useRecordList_1 = require("../../hooks/lists/useRecordList");
const useAsyncState_1 = require("../../hooks/useAsyncState");
const useTagsList_1 = require("../../hooks/useTagsList");
const AutoCompleteTagsMultiple = ({ value = [], onlyMyTags = false, onChange = () => undefined, department, viewAll = false, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [tagsFilter, setTagsFilter] = (0, react_1.useState)('');
    const debouncedTagsFilter = (0, fuselage_hooks_1.useDebouncedValue)(tagsFilter, 500);
    const { itemsList: tagsList, loadMoreItems: loadMoreTags } = (0, useTagsList_1.useTagsList)((0, react_1.useMemo)(() => ({ filter: debouncedTagsFilter, onlyMyTags, department, viewAll }), [debouncedTagsFilter, onlyMyTags, department, viewAll]));
    const { phase: tagsPhase, items: tagsItems, itemCount: tagsTotal } = (0, useRecordList_1.useRecordList)(tagsList);
    const tagsOptions = (0, react_1.useMemo)(() => {
        const pending = value.filter(({ value }) => !tagsItems.find((tag) => tag.value === value));
        return [...tagsItems, ...pending];
    }, [tagsItems, value]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.PaginatedMultiSelectFiltered, { withTitle: true, value: value, onChange: onChange, filter: tagsFilter, setFilter: setTagsFilter, options: tagsOptions, width: '100%', flexShrink: 0, flexGrow: 0, placeholder: t('Select_an_option'), endReached: tagsPhase === useAsyncState_1.AsyncStatePhase.LOADING ? () => undefined : (start) => start && loadMoreTags(start, Math.min(50, tagsTotal)) }));
};
exports.default = (0, react_1.memo)(AutoCompleteTagsMultiple);
