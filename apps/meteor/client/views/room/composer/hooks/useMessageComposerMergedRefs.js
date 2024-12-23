"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageComposerMergedRefs = void 0;
const react_1 = require("react");
const isRefCallback = (x) => typeof x === 'function';
const isMutableRefObject = (x) => typeof x === 'object';
/**
 * Merges multiple refs into a single ref callback.
 * it was not meant to be used with in any different place than MessageBox
 *
 * @param refs The refs to merge.
 * @returns The merged ref callback.
 */
const useMessageComposerMergedRefs = (...refs) => {
    return (0, react_1.useCallback)((refValue) => {
        refs.filter(Boolean).forEach((ref) => {
            if (isRefCallback(ref)) {
                ref(refValue);
                return;
            }
            if (isMutableRefObject(ref)) {
                ref.current = refValue;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, refs);
};
exports.useMessageComposerMergedRefs = useMessageComposerMergedRefs;
