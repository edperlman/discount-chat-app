"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncate = truncate;
exports.trim = trim;
exports.ltrim = ltrim;
exports.rtrim = rtrim;
exports.capitalize = capitalize;
exports.stripTags = stripTags;
exports.strLeft = strLeft;
exports.strRight = strRight;
exports.strRightBack = strRightBack;
exports.numberFormat = numberFormat;
exports.pad = pad;
exports.lrpad = lrpad;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
function truncate(str, length) {
    return str.length > length ? `${str.slice(0, length - 3)}...` : str;
}
function makeString(object) {
    if (!object)
        return '';
    return String(object);
}
function defaultToWhiteSpace(characters) {
    if (!characters)
        return '\\s';
    if (typeof characters === 'object' && 'source' in characters)
        return characters.source;
    return `[${(0, string_helpers_1.escapeRegExp)(makeString(characters))}]`;
}
const nativeTrim = String.prototype.trim;
const nativeTrimLeft = String.prototype.trimLeft;
const nativeTrimRight = String.prototype.trimRight;
function trim(_str, _characters) {
    const str = makeString(_str);
    if (!_characters && nativeTrim)
        return nativeTrim.call(str);
    const characters = defaultToWhiteSpace(_characters);
    return str.replace(new RegExp(`^${characters}+|${characters}+$`, 'g'), '');
}
function ltrim(_str, _characters) {
    const str = makeString(_str);
    if (!_characters && nativeTrimLeft)
        return nativeTrimLeft.call(str);
    const characters = defaultToWhiteSpace(_characters);
    return str.replace(new RegExp(`^${characters}+`), '');
}
function rtrim(_str, _characters) {
    const str = makeString(_str);
    if (!_characters && nativeTrimRight)
        return nativeTrimRight.call(str);
    const characters = defaultToWhiteSpace(_characters);
    return str.replace(new RegExp(`${characters}+$`), '');
}
function capitalize(_str, lowercaseRest) {
    const str = makeString(_str);
    const remainingChars = !lowercaseRest ? str.slice(1) : str.slice(1).toLowerCase();
    return str.charAt(0).toUpperCase() + remainingChars;
}
function stripTags(str) {
    return (0, sanitize_html_1.default)(makeString(str));
}
function strLeft(_str, _sep) {
    const str = makeString(_str);
    const sep = makeString(_sep);
    const pos = !sep ? -1 : str.indexOf(sep);
    return ~pos ? str.slice(0, pos) : str;
}
function strRight(_str, _sep) {
    const str = makeString(_str);
    const sep = makeString(_sep);
    const pos = !sep ? -1 : str.indexOf(sep);
    return ~pos ? str.slice(pos + sep.length, str.length) : str;
}
function strRightBack(_str, _sep) {
    const str = makeString(_str);
    const sep = makeString(_sep);
    const pos = !sep ? -1 : str.lastIndexOf(sep);
    return ~pos ? str.slice(pos + sep.length, str.length) : str;
}
function numberFormat(_number, dec, dsep, tsep) {
    if (isNaN(_number) || _number === null || _number === undefined)
        return '';
    const number = _number.toFixed(~~dec);
    tsep = typeof tsep === 'string' ? tsep : ',';
    const parts = number.split('.');
    const fnums = parts[0];
    const decimals = parts[1] ? (dsep || '.') + parts[1] : '';
    return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, `$1${tsep}`) + decimals;
}
function pad(_str, _length, padStr, type = 'right') {
    const str = makeString(_str);
    const length = ~~_length;
    let padlen = 0;
    if (!padStr)
        padStr = ' ';
    else if (padStr.length > 1)
        padStr = padStr.charAt(0);
    switch (type) {
        case 'right':
            padlen = length - str.length;
            return str + padStr.repeat(padlen);
        case 'both':
            padlen = length - str.length;
            return padStr.repeat(Math.ceil(padlen / 2)) + str + padStr.repeat(Math.floor(padlen / 2));
        default: // 'left'
            padlen = length - str.length;
            return padStr.repeat(padlen) + str;
    }
}
function lrpad(str, length, padStr) {
    return pad(str, length, padStr, 'both');
}
