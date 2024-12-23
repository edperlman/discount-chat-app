"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const basicEmailRegex = /^[^@]+@[^@]+$/;
const rfcEmailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const validateEmail = (email, options = { style: 'basic' }) => {
    switch (options.style) {
        case 'rfc':
            return rfcEmailRegex.test(email);
        case 'basic':
        default:
            return basicEmailRegex.test(email);
    }
};
exports.validateEmail = validateEmail;
