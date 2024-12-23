"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFileInput = void 0;
const react_1 = require("react");
const useFileInput = (props) => {
    const ref = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        const fileInput = document.createElement('input');
        fileInput.setAttribute('style', 'display: none;');
        Object.entries(props).forEach(([key, value]) => {
            fileInput.setAttribute(key, value);
        });
        document.body.appendChild(fileInput);
        ref.current = fileInput;
        return () => {
            ref.current = undefined;
            fileInput.remove();
        };
    }, [props]);
    return ref;
};
exports.useFileInput = useFileInput;
