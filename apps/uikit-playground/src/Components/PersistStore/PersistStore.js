"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Context_1 = require("../../Context");
const persistStore_1 = __importDefault(require("../../utils/persistStore"));
const PersistStore = (props) => {
    const { state } = (0, react_1.useContext)(Context_1.context);
    const handleBeforeUnload = (0, react_1.useCallback)(() => {
        (0, persistStore_1.default)(state);
    }, [state]);
    (0, react_1.useEffect)(() => {
        window.onbeforeunload = handleBeforeUnload;
        return window.removeEventListener('onbeforeunload', handleBeforeUnload);
    }, [handleBeforeUnload, state]);
    return (0, jsx_runtime_1.jsx)(react_1.Fragment, Object.assign({}, props));
};
exports.default = PersistStore;
