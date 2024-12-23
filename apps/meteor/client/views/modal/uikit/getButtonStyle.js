"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getButtonStyle = void 0;
// TODO: Move to fuselage-ui-kit
const getButtonStyle = (buttonElement) => {
    return (buttonElement === null || buttonElement === void 0 ? void 0 : buttonElement.style) === 'danger' ? { danger: true } : { primary: true };
};
exports.getButtonStyle = getButtonStyle;
