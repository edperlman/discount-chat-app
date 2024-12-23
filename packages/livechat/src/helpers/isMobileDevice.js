"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobileDevice = void 0;
const isMobileDevice = () => window.innerWidth <= 800 && window.innerHeight >= 630;
exports.isMobileDevice = isMobileDevice;
