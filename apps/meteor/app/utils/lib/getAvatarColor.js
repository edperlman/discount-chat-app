"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatarColor = void 0;
const colors = ['#158D65', '#7F1B9F', '#B68D00', '#E26D0E', '#10529E', '#6C727A'];
const getAvatarColor = (name) => colors[name.length % colors.length];
exports.getAvatarColor = getAvatarColor;
