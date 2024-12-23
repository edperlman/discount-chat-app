"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useComposerPopup = exports.createMessageBoxPopupConfig = exports.ComposerPopupContext = void 0;
const react_1 = require("react");
exports.ComposerPopupContext = (0, react_1.createContext)(undefined);
const createMessageBoxPopupConfig = (partial) => {
    var _a, _b;
    return Object.assign({ blurOnSelectItem: true, closeOnEsc: true, triggerAnywhere: true, suffix: ' ', prefix: (_b = (_a = partial.prefix) !== null && _a !== void 0 ? _a : partial.trigger) !== null && _b !== void 0 ? _b : ' ', getValue: (item) => item._id }, partial);
};
exports.createMessageBoxPopupConfig = createMessageBoxPopupConfig;
const useComposerPopup = () => {
    const composerPopupContext = (0, react_1.useContext)(exports.ComposerPopupContext);
    if (!composerPopupContext) {
        throw new Error('useComposerPopup must be used within ComposerPopupContext');
    }
    return composerPopupContext;
};
exports.useComposerPopup = useComposerPopup;
