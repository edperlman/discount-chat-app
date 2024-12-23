"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCountSelected = exports.useToggleSelect = exports.useIsSelecting = exports.useIsSelectedMessage = exports.SelectedMessageContext = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const SelectedMessagesProvider_1 = require("../../providers/SelectedMessagesProvider");
exports.SelectedMessageContext = (0, react_1.createContext)({
    selectedMessageStore: SelectedMessagesProvider_1.selectedMessageStore,
});
const useIsSelectedMessage = (mid) => {
    const { selectedMessageStore } = (0, react_1.useContext)(exports.SelectedMessageContext);
    const subscribe = (0, react_1.useCallback)((callback) => selectedMessageStore.on(mid, callback), [selectedMessageStore, mid]);
    const getSnapshot = () => selectedMessageStore.isSelected(mid);
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useIsSelectedMessage = useIsSelectedMessage;
const useIsSelecting = () => {
    const { selectedMessageStore } = (0, react_1.useContext)(exports.SelectedMessageContext);
    const subscribe = (0, react_1.useCallback)((callback) => selectedMessageStore.on('toggleIsSelecting', callback), [selectedMessageStore]);
    const getSnapshot = () => selectedMessageStore.getIsSelecting();
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useIsSelecting = useIsSelecting;
const useToggleSelect = (mid) => {
    const { selectedMessageStore } = (0, react_1.useContext)(exports.SelectedMessageContext);
    return (0, react_1.useCallback)(() => {
        selectedMessageStore.toggle(mid);
    }, [mid, selectedMessageStore]);
};
exports.useToggleSelect = useToggleSelect;
const useCountSelected = () => {
    const { selectedMessageStore } = (0, react_1.useContext)(exports.SelectedMessageContext);
    const subscribe = (0, react_1.useCallback)((callback) => selectedMessageStore.on('change', callback), [selectedMessageStore]);
    const getSnapshot = () => selectedMessageStore.count();
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useCountSelected = useCountSelected;
