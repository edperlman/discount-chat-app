"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDropdownVisibility = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
/**
 * useDropdownVisibility
 * is used to control the visibility of a dropdown
 * also checks if the user clicked outside the dropdown, but ignores if the click was on the anchor
 * @param {Object} props
 * @param {Object} props.reference - The reference where the dropdown will be attached to
 * @param {Object} props.target - The target, the dropdown itself
 * @returns {Object}
 * @returns {Boolean} isVisible - The visibility of the dropdown
 * @returns {Function} toggle - The function to toggle the dropdown
 */
const useDropdownVisibility = ({ reference, target, }) => {
    const [isVisible, toggle] = (0, fuselage_hooks_1.useToggle)(false);
    (0, fuselage_hooks_1.useOutsideClick)([target, reference], (0, react_1.useCallback)(() => toggle(false), [toggle]));
    return {
        isVisible,
        toggle,
    };
};
exports.useDropdownVisibility = useDropdownVisibility;
