"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRadioToggle = void 0;
const react_1 = require("react");
const useRadioToggle = (setData) => {
    const onSelected = (0, react_1.useCallback)((item) => {
        setData((prevState) => {
            prevState.items.forEach((currentItem) => {
                currentItem.checked = currentItem === item;
            });
            return Object.assign({}, prevState);
        });
    }, [setData]);
    return onSelected;
};
exports.useRadioToggle = useRadioToggle;
