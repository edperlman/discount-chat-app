"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCtx;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function createCtx(reducer, initialState) {
    const defaultDispatch = () => initialState;
    const context = (0, react_1.createContext)({
        state: initialState,
        dispatch: defaultDispatch,
    });
    const Provider = (props) => {
        const [state, dispatch] = (0, react_1.useReducer)(reducer, initialState);
        return (0, jsx_runtime_1.jsx)(context.Provider, Object.assign({ value: { state, dispatch } }, props));
    };
    return [context, Provider];
}
