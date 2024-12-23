"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExternalLink = void 0;
const react_1 = require("react");
const InvalidUrlError_1 = require("../lib/errors/InvalidUrlError");
const useExternalLink = () => {
    return (0, react_1.useCallback)((url) => {
        if (!url) {
            throw new InvalidUrlError_1.InvalidUrlError();
        }
        window.open(url, '_blank', 'noopener noreferrer');
    }, []);
};
exports.useExternalLink = useExternalLink;
