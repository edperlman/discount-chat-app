"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileSort = void 0;
const bson_1 = require("./bson");
const comparisons_1 = require("./comparisons");
const lookups_1 = require("./lookups");
const createSortSpecParts = (spec) => {
    if (Array.isArray(spec)) {
        return spec.map((value) => {
            if (typeof value === 'string') {
                return {
                    lookup: (0, lookups_1.createLookupFunction)(value),
                    ascending: true,
                };
            }
            return {
                lookup: (0, lookups_1.createLookupFunction)(value[0]),
                ascending: value[1] !== 'desc',
            };
        });
    }
    return Object.entries(spec).map(([key, value]) => ({
        lookup: (0, lookups_1.createLookupFunction)(key),
        ascending: value >= 0,
    }));
};
const reduceValue = (branchValues, ascending) => []
    .concat(...branchValues.map((branchValue) => {
    if (!Array.isArray(branchValue)) {
        return [branchValue];
    }
    if ((0, comparisons_1.isEmptyArray)(branchValue)) {
        return [undefined];
    }
    return branchValue;
}))
    .reduce((reduced, value) => {
    const cmp = (0, bson_1.compareBSONValues)(reduced, value);
    if ((ascending && cmp > 0) || (!ascending && cmp < 0)) {
        return value;
    }
    return reduced;
});
const compileSort = (spec) => {
    const sortSpecParts = createSortSpecParts(spec);
    if (sortSpecParts.length === 0) {
        return () => 0;
    }
    return (a, b) => {
        for (let i = 0; i < sortSpecParts.length; ++i) {
            const specPart = sortSpecParts[i];
            const aValue = reduceValue(specPart.lookup(a), specPart.ascending);
            const bValue = reduceValue(specPart.lookup(b), specPart.ascending);
            const compare = (0, bson_1.compareBSONValues)(aValue, bValue);
            if (compare !== 0) {
                return specPart.ascending ? compare : -compare;
            }
        }
        return 0;
    };
};
exports.compileSort = compileSort;
