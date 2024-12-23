"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOutboundPhoneNumber = void 0;
const parseOutboundPhoneNumber = (phoneNumber) => (phoneNumber ? phoneNumber.replace(/\*/g, '+') : '');
exports.parseOutboundPhoneNumber = parseOutboundPhoneNumber;
