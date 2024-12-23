"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildImageURL = void 0;
const isValidLink_1 = require("../../../../views/room/MessageList/lib/isValidLink");
const buildImageURL = (url, imageUrl) => {
    if ((0, isValidLink_1.isValidLink)(imageUrl)) {
        return JSON.stringify(imageUrl);
    }
    const { origin } = new URL(url);
    const imgURL = `${origin}/${imageUrl}`;
    const normalizedUrl = imgURL.replace(/([^:]\/)\/+/gm, '$1');
    return JSON.stringify(normalizedUrl);
};
exports.buildImageURL = buildImageURL;
