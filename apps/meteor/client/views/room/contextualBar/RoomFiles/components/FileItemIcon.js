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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const FileItemIcon = ({ type }) => {
    switch (type) {
        case 'application/vnd.ms-excel':
            return ((0, jsx_runtime_1.jsxs)("svg", { width: '50', height: '49', viewBox: '0 0 50 49', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', children: [(0, jsx_runtime_1.jsx)("rect", { width: '48', height: '48', rx: '3', fill: '#1ECB92' }), (0, jsx_runtime_1.jsx)("path", { d: 'M14.0065 16.5001C13.3153 16.5001 12.7549 17.0598 12.7549 17.7501V40.2509C12.7549 40.9413 13.3153 41.5009 14.0065 41.5009H44.0462C44.7375 41.5009 45.2979 40.9413 45.2979 40.2509V17.7501C45.2979 17.0598 44.7375 16.5001 44.0462 16.5001H14.0065ZM15.2582 23.7775V19.0001H21.0992V23.7775H15.2582ZM15.2582 26.2775H21.0992V31.8135H15.2582V26.2775ZM15.2582 34.3135H21.0992V39.0009H15.2582V34.3135ZM23.6025 39.0009V34.3135H42.7946V39.0009H23.6025ZM42.7946 31.8135H23.6025V26.2775H42.7946V31.8135ZM42.7946 23.7775H23.6025V19.0001H42.7946V23.7775Z', fill: 'white' })] }));
        case 'application/msword':
            return ((0, jsx_runtime_1.jsxs)("svg", { width: '50', height: '49', viewBox: '0 0 50 49', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', children: [(0, jsx_runtime_1.jsx)("rect", { width: '48', height: '48', rx: '3', fill: '#1D74F5' }), ' ', (0, jsx_runtime_1.jsx)("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M15.2578 19C15.2578 18.3096 15.8182 17.75 16.5095 17.75H41.5425C42.2338 17.75 42.7942 18.3096 42.7942 19C42.7942 19.6904 42.2338 20.25 41.5425 20.25H16.5095C15.8182 20.25 15.2578 19.6904 15.2578 19ZM15.2578 25.4516C15.2578 24.7613 15.8182 24.2016 16.5095 24.2016H41.5425C42.2338 24.2016 42.7942 24.7613 42.7942 25.4516C42.7942 26.142 42.2338 26.7016 41.5425 26.7016H16.5095C15.8182 26.7016 15.2578 26.142 15.2578 25.4516ZM15.2578 32.5484C15.2578 31.858 15.8182 31.2984 16.5095 31.2984H41.5425C42.2338 31.2984 42.7942 31.858 42.7942 32.5484C42.7942 33.2387 42.2338 33.7984 41.5425 33.7984H16.5095C15.8182 33.7984 15.2578 33.2387 15.2578 32.5484ZM15.2578 39C15.2578 38.3096 15.8182 37.75 16.5095 37.75H29.9888C30.6801 37.75 31.2405 38.3096 31.2405 39C31.2405 39.6904 30.6801 40.25 29.9888 40.25H16.5095C15.8182 40.25 15.2578 39.6904 15.2578 39Z', fill: 'white' })] }));
        case 'audio':
            return ((0, jsx_runtime_1.jsxs)("svg", { width: '50', height: '49', viewBox: '0 0 50 49', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', children: [(0, jsx_runtime_1.jsx)("rect", { width: '48', height: '48', rx: '3', fill: '#1D74F5' }), (0, jsx_runtime_1.jsx)("path", { d: 'M40.6439 15.514C40.9482 15.7509 41.1262 16.1147 41.1262 16.5V34H41.1219C41.1248 34.0677 41.1262 34.1358 41.1262 34.2043C41.1262 36.9016 38.8847 39.0882 36.1196 39.0882C33.3545 39.0882 31.113 36.9016 31.113 34.2043C31.113 31.5069 33.3545 29.3203 36.1196 29.3203C37.0315 29.3203 37.8865 29.5581 38.6229 29.9737V18.1042L23.6031 21.8853V37.8673C23.6031 40.5646 21.3615 42.7515 18.5965 42.7515C15.8314 42.7515 13.5898 40.5649 13.5898 37.8675C13.5898 35.1702 15.8314 32.9836 18.5965 32.9836C19.5084 32.9836 20.3634 33.2214 21.0998 33.637V20.9113C21.0998 20.3386 21.4894 19.8392 22.0455 19.6992L39.5686 15.2879C39.9428 15.1937 40.3395 15.2772 40.6439 15.514Z', fill: 'white' })] }));
        case 'video':
            return ((0, jsx_runtime_1.jsxs)("svg", { width: '50', height: '49', viewBox: '0 0 50 49', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', children: [(0, jsx_runtime_1.jsx)("rect", { width: '48', height: '48', rx: '3', fill: '#1D74F5' }), (0, jsx_runtime_1.jsx)("path", { d: 'M20.2651 17.75C19.5738 17.75 19.0134 18.3096 19.0134 19C19.0134 19.6904 19.5738 20.25 20.2651 20.25H30.2783C30.9696 20.25 31.53 19.6904 31.53 19C31.53 18.3096 30.9696 17.75 30.2783 17.75H20.2651Z', fill: 'white' }), (0, jsx_runtime_1.jsx)("path", { d: 'M15.6757 22.3331C14.754 22.3331 14.0068 23.0793 14.0068 23.9998V38.9998C14.0068 39.9203 14.754 40.6665 15.6757 40.6665H35.7022C36.6238 40.6665 37.371 39.9203 37.371 38.9998V33.9998L41.1976 37.8213C42.2489 38.8712 44.0465 38.1276 44.0465 36.6428V26.3568C44.0465 24.872 42.2489 24.1284 41.1976 25.1783L37.371 28.9998V23.9998C37.371 23.0793 36.6238 22.3331 35.7022 22.3331H15.6757Z', fill: 'white' })] }));
        case 'application/pdf':
            return ((0, jsx_runtime_1.jsxs)("svg", { width: '50', height: '49', viewBox: '0 0 50 49', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', children: [(0, jsx_runtime_1.jsx)("rect", { width: '48', height: '48', rx: '3', fill: '#F5455C' }), (0, jsx_runtime_1.jsx)("path", { d: 'M30 11C39.3888 11 47 18.6112 47 28H30V11Z', fill: 'white' }), (0, jsx_runtime_1.jsx)("path", { d: 'M11 30C11 20.6112 18.6112 13 28 13V30H45C45 39.3888 37.3888 47 28 47C18.6112 47 11 39.3888 11 30Z', fill: 'white' })] }));
        case 'application/x-zip-compressed':
            return ((0, jsx_runtime_1.jsxs)("svg", { width: '50', height: '49', viewBox: '0 0 50 49', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', children: [(0, jsx_runtime_1.jsx)("rect", { width: '48', height: '48', rx: '3', fill: '#F3BE08' }), (0, jsx_runtime_1.jsx)("path", { d: 'M24.0195 14.8333C24.0195 14.3731 24.3931 14 24.854 14H28.1917C28.6526 14 29.0261 14.3731 29.0261 14.8333V19H24.854C24.3931 19 24.0195 18.6269 24.0195 18.1667V14.8333Z', fill: 'white' }), (0, jsx_runtime_1.jsx)("path", { d: 'M29.0261 19H33.1983C33.6592 19 34.0328 19.3731 34.0328 19.8333V23.1667C34.0328 23.6269 33.6592 24 33.1983 24H29.0261V19Z', fill: 'white' }), (0, jsx_runtime_1.jsx)("path", { d: 'M24.0195 24.8333C24.0195 24.3731 24.3931 24 24.854 24H29.0261V29H24.854C24.3931 29 24.0195 28.6269 24.0195 28.1667V24.8333Z', fill: 'white' }), (0, jsx_runtime_1.jsx)("path", { d: 'M29.0261 29H33.1983C33.6592 29 34.0328 29.3731 34.0328 29.8333V34H29.0261V29Z', fill: 'white' }), (0, jsx_runtime_1.jsx)("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M25.6884 34C24.7667 34 24.0195 34.7462 24.0195 35.6667V42.3333C24.0195 43.2538 24.7667 44 25.6884 44H32.3639C33.2856 44 34.0328 43.2538 34.0328 42.3333V34H25.6884ZM28.1917 37.3333C27.7309 37.3333 27.3573 37.7064 27.3573 38.1667V39.8333C27.3573 40.2936 27.7309 40.6667 28.1917 40.6667H29.8606C30.3214 40.6667 30.695 40.2936 30.695 39.8333V38.1667C30.695 37.7064 30.3214 37.3333 29.8606 37.3333H28.1917Z', fill: 'white' })] }));
        default:
            return ((0, jsx_runtime_1.jsxs)("svg", { width: '48', height: '48', viewBox: '0 0 48 48', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', children: [(0, jsx_runtime_1.jsx)("rect", { width: '48', height: '48', rx: '3', fill: '#1D74F5' }), (0, jsx_runtime_1.jsx)("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M23.1305 32.2896C23.7097 32.9907 24.5921 33.3685 25.4992 33.3038L29.716 33.0025C30.948 32.9146 31.9784 32.0331 32.2561 30.8296L33.1453 26.9766C33.3399 26.1332 33.1354 25.2472 32.5908 24.5745L25.1973 15.4414C24.8715 15.0389 24.2812 14.9768 23.8788 15.3026C23.4763 15.6283 23.4142 16.2187 23.74 16.6211L31.1335 25.7543C31.315 25.9785 31.3832 26.2739 31.3183 26.555L30.4292 30.408C30.3366 30.8092 29.9931 31.103 29.5825 31.1323L25.3656 31.4335C25.0632 31.4551 24.7691 31.3292 24.576 31.0955L16.7831 21.6619C16.6238 21.469 16.5481 21.2205 16.573 20.9716L16.7951 18.7504C16.8431 18.2712 17.2463 17.9062 17.728 17.9062H20.7838C21.0604 17.9062 21.3228 18.0283 21.5009 18.2398L28.1687 26.1578L27.8743 28.2187H25.8452L19.0951 20.1186C18.7636 19.7208 18.1725 19.6671 17.7747 19.9985C17.3769 20.33 17.3232 20.9211 17.6547 21.3189L24.4048 29.4191C24.7611 29.8466 25.2888 30.0937 25.8452 30.0937H27.8743C28.8074 30.0937 29.5985 29.4076 29.7304 28.4839L30.0249 26.423C30.1004 25.8944 29.9469 25.3586 29.6029 24.9501L22.9351 17.0321C22.4007 16.3975 21.6134 16.0312 20.7838 16.0312H17.728C16.2831 16.0312 15.0732 17.1261 14.9294 18.5639L14.7073 20.785C14.6326 21.5318 14.8595 22.2774 15.3375 22.8561L23.1305 32.2896Z', fill: 'white' })] }));
    }
};
exports.default = (0, react_1.memo)(FileItemIcon);
