"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ascii_1 = __importStar(require("./ascii"));
const emojis_1 = __importDefault(require("./emojis"));
const shortnamePattern = new RegExp(/:[-+_a-z0-9]+:/, 'gi');
const regAscii = new RegExp(`((\\s|^)${ascii_1.asciiRegexp}(?=\\s|$|[!,.?]))`, 'gi');
const unescaped = {
    '&amp;': '&',
    '&#38;': '&',
    '&#x26;': '&',
    '&lt;': '<',
    '&#60;': '<',
    '&#x3C;': '<',
    '&gt;': '>',
    '&#62;': '>',
    '&#x3E;': '>',
    '&quot;': '"',
    '&#34;': '"',
    '&#x22;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&#x27;': "'",
};
const unescapeHTML = (string) => {
    return string.replace(/&(?:amp|#38|#x26|lt|#60|#x3C|gt|#62|#x3E|apos|#39|#x27|quot|#34|#x22);/gi, (match) => unescaped[match]);
};
const isAscii = (string) => {
    if (!(string === null || string === void 0 ? void 0 : string.trim()) || !(unescapeHTML(string) in ascii_1.default)) {
        return false;
    }
    return true;
};
const shortnameToUnicode = (stringMessage) => {
    stringMessage = stringMessage.replace(shortnamePattern, (shortname) => emojis_1.default[shortname] || shortname);
    stringMessage = stringMessage.replace(regAscii, (entire, _dummy1, _dummy2, m3) => {
        return isAscii(m3) ? unescapeHTML(m3) : entire;
    });
    return stringMessage;
};
exports.default = shortnameToUnicode;
