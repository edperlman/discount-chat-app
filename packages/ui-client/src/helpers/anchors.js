"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unrefAnchorElement = exports.refAnchorElement = exports.ensureAnchorElement = void 0;
const ensureAnchorElement = (id) => {
    const existingAnchor = document.getElementById(id);
    if (existingAnchor)
        return existingAnchor;
    const newAnchor = document.createElement('div');
    newAnchor.id = id;
    document.body.appendChild(newAnchor);
    return newAnchor;
};
exports.ensureAnchorElement = ensureAnchorElement;
const getAnchorRefCount = (anchorElement) => {
    const { refCount } = anchorElement.dataset;
    if (refCount)
        return parseInt(refCount, 10);
    return 0;
};
const setAnchorRefCount = (anchorElement, refCount) => {
    anchorElement.dataset.refCount = String(refCount);
};
const refAnchorElement = (anchorElement) => {
    setAnchorRefCount(anchorElement, getAnchorRefCount(anchorElement) + 1);
};
exports.refAnchorElement = refAnchorElement;
const unrefAnchorElement = (anchorElement) => {
    const refCount = getAnchorRefCount(anchorElement) - 1;
    setAnchorRefCount(anchorElement, refCount);
    if (refCount <= 0) {
        document.body.removeChild(anchorElement);
    }
};
exports.unrefAnchorElement = unrefAnchorElement;
