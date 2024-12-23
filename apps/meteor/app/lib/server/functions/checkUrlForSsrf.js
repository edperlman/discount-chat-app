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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUrlForSsrf = exports.isValidDomain = exports.isValidIPv4 = exports.isIpInAnyRange = exports.isIpInRange = exports.ipToLong = exports.nslookup = void 0;
const dns_1 = require("dns");
// https://en.wikipedia.org/wiki/Reserved_IP_addresses + Alibaba Metadata IP
const ranges = [
    '0.0.0.0/8',
    '10.0.0.0/8',
    '100.64.0.0/10',
    '127.0.0.0/8',
    '169.254.0.0/16',
    '172.16.0.0/12',
    '192.0.0.0/24',
    '192.0.2.0/24',
    '192.88.99.0/24',
    '192.168.0.0/16',
    '198.18.0.0/15',
    '198.51.100.0/24',
    '203.0.113.0/24',
    '224.0.0.0/4',
    '240.0.0.0/4',
    '255.255.255.255',
    '100.100.100.200/32',
];
const nslookup = (hostname) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        (0, dns_1.lookup)(hostname, (error, address) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(address);
            }
        });
    });
});
exports.nslookup = nslookup;
const ipToLong = (ip) => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
};
exports.ipToLong = ipToLong;
const isIpInRange = (ip, range) => {
    const [rangeIp, subnet] = range.split('/');
    const ipLong = (0, exports.ipToLong)(ip);
    const rangeIpLong = (0, exports.ipToLong)(rangeIp);
    const mask = ~(Math.pow(2, (32 - Number(subnet))) - 1);
    return (ipLong & mask) === (rangeIpLong & mask);
};
exports.isIpInRange = isIpInRange;
const isIpInAnyRange = (ip) => ranges.some((range) => (0, exports.isIpInRange)(ip, range));
exports.isIpInAnyRange = isIpInAnyRange;
const isValidIPv4 = (ip) => {
    const octets = ip.split('.');
    if (octets.length !== 4)
        return false;
    return octets.every((octet) => {
        const num = Number(octet);
        return num >= 0 && num <= 255 && octet === num.toString();
    });
};
exports.isValidIPv4 = isValidIPv4;
const isValidDomain = (domain) => {
    const domainPattern = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,63}(?<!-)\.?([A-Za-z0-9-]{2,63}\.?)*[A-Za-z]{2,63}$/;
    if (!domainPattern.test(domain)) {
        return false;
    }
    return true;
};
exports.isValidDomain = isValidDomain;
const checkUrlForSsrf = (url) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(url.startsWith('http://') || url.startsWith('https://'))) {
        return false;
    }
    const [, address] = url.split('://');
    const ipOrDomain = address.includes('/') ? address.split('/')[0] : address;
    if (!((0, exports.isValidIPv4)(ipOrDomain) || (0, exports.isValidDomain)(ipOrDomain))) {
        return false;
    }
    if ((0, exports.isValidIPv4)(ipOrDomain) && (0, exports.isIpInAnyRange)(ipOrDomain)) {
        return false;
    }
    if ((0, exports.isValidDomain)(ipOrDomain) && /metadata.google.internal/.test(ipOrDomain.toLowerCase())) {
        return false;
    }
    if ((0, exports.isValidDomain)(ipOrDomain)) {
        try {
            const ipAddress = yield (0, exports.nslookup)(ipOrDomain);
            if ((0, exports.isIpInAnyRange)(ipAddress)) {
                return false;
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    return true;
});
exports.checkUrlForSsrf = checkUrlForSsrf;
