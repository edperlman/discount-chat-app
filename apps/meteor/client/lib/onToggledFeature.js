"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onToggledFeature = void 0;
const react_query_1 = require("@tanstack/react-query");
const fetchFeatures_1 = require("./fetchFeatures");
const queryClient_1 = require("./queryClient");
const onToggledFeature = (feature, { up, down, }) => {
    const observer = new react_query_1.QueryObserver(queryClient_1.queryClient, {
        queryKey: ['ee.features'],
        queryFn: fetchFeatures_1.fetchFeatures,
        staleTime: Infinity,
    });
    let enabled = false;
    return observer.subscribe((result) => {
        if (!result.isSuccess) {
            return;
        }
        const features = result.data;
        const hasFeature = features.includes(feature);
        if (!enabled && hasFeature) {
            up === null || up === void 0 ? void 0 : up();
            enabled = true;
        }
        if (enabled && !hasFeature) {
            down === null || down === void 0 ? void 0 : down();
            enabled = false;
        }
    });
};
exports.onToggledFeature = onToggledFeature;
