"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocumentTitle = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const ee = new emitter_1.Emitter();
const titles = new Set();
const useReactiveDocumentTitle = () => (0, shim_1.useSyncExternalStore)((0, react_1.useCallback)((callback) => ee.on('change', callback), []), () => Array.from(titles)
    .reverse()
    .map(({ title }) => title)
    .join(' - '));
const useReactiveDocumentTitleKey = () => (0, shim_1.useSyncExternalStore)((0, react_1.useCallback)((callback) => ee.on('change', callback), []), () => Array.from(titles)
    .filter(({ refocus }) => refocus)
    .map(({ title }) => title)
    .join(' - '));
const useDocumentTitle = (documentTitle, refocus = true) => {
    (0, react_1.useEffect)(() => {
        const titleObj = {
            title: documentTitle,
            refocus,
        };
        if (titleObj.title) {
            titles.add(titleObj);
        }
        ee.emit('change');
        return () => {
            titles.delete(titleObj);
            ee.emit('change');
        };
    }, [documentTitle, refocus]);
    return { title: useReactiveDocumentTitle(), key: useReactiveDocumentTitleKey() };
};
exports.useDocumentTitle = useDocumentTitle;
