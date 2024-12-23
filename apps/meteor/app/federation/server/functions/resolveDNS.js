"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTXT = exports.resolveSRV = void 0;
const dns_1 = __importDefault(require("dns"));
const util_1 = __importDefault(require("util"));
const dnsResolveSRV = util_1.default.promisify(dns_1.default.resolveSrv);
const dnsResolveTXT = util_1.default.promisify(dns_1.default.resolveTxt);
const resolveSRV = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const [_a] = yield dnsResolveSRV(url), { name } = _a, resolved = __rest(_a, ["name"]);
    return Object.assign({ target: name }, resolved);
});
exports.resolveSRV = resolveSRV;
const resolveTXT = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const [resolved] = yield dnsResolveTXT(url);
    return Array.isArray(resolved) ? resolved.join('') : resolved;
});
exports.resolveTXT = resolveTXT;
