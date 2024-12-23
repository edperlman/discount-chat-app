"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDropTarget = void 0;
const react_1 = require("react");
const hasFilesToUpload = (dataTransfer) => dataTransfer.types.includes('Files');
const hasURLToUpload = (dataTransfer) => dataTransfer.types.includes('text/uri-list') && dataTransfer.types.includes('text/html');
const useDropTarget = () => {
    const [visible, setVisible] = (0, react_1.useState)(false);
    const onDragEnter = (0, react_1.useCallback)((event) => {
        event.stopPropagation();
        if (!hasFilesToUpload(event.dataTransfer) && !hasURLToUpload(event.dataTransfer)) {
            return;
        }
        setVisible(true);
    }, []);
    const onDismiss = (0, react_1.useCallback)(() => {
        setVisible(false);
    }, []);
    const triggerProps = (0, react_1.useMemo)(() => ({ onDragEnter }), [onDragEnter]);
    const overlayProps = (0, react_1.useMemo)(() => ({ visible, onDismiss }), [visible, onDismiss]);
    return {
        triggerProps,
        overlayProps,
    };
};
exports.useDropTarget = useDropTarget;
