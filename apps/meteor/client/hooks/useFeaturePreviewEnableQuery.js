"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFeaturePreviewEnableQuery = void 0;
const react_1 = require("react");
const handleFeaturePreviewEnableQuery = (item, _, features) => {
    var _a;
    if (item.enableQuery) {
        const expected = item.enableQuery.value;
        const received = (_a = features.find((el) => { var _a; return el.name === ((_a = item.enableQuery) === null || _a === void 0 ? void 0 : _a.name); })) === null || _a === void 0 ? void 0 : _a.value;
        if (expected !== received) {
            item.disabled = true;
            item.value = false;
        }
        else {
            item.disabled = false;
        }
    }
    return item;
};
const groupFeaturePreview = (features) => Object.entries(features.reduce((result, currentValue) => {
    (result[currentValue.group] = result[currentValue.group] || []).push(currentValue);
    return result;
}, {}));
const useFeaturePreviewEnableQuery = (features) => {
    return (0, react_1.useMemo)(() => groupFeaturePreview(features.map(handleFeaturePreviewEnableQuery)), [features]);
};
exports.useFeaturePreviewEnableQuery = useFeaturePreviewEnableQuery;
