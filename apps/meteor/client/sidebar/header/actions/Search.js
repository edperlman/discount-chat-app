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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const tinykeys_1 = __importDefault(require("tinykeys"));
const SearchList_1 = __importDefault(require("../../search/SearchList"));
const Search = (props) => {
    const [searchOpen, setSearchOpen] = (0, react_1.useState)(false);
    const ref = (0, react_1.useRef)(null);
    const handleCloseSearch = (0, fuselage_hooks_1.useMutableCallback)(() => {
        setSearchOpen(false);
    });
    (0, fuselage_hooks_1.useOutsideClick)([ref], handleCloseSearch);
    const openSearch = (0, fuselage_hooks_1.useMutableCallback)(() => {
        setSearchOpen(true);
    });
    (0, react_1.useEffect)(() => {
        const unsubscribe = (0, tinykeys_1.default)(window, {
            '$mod+K': (event) => {
                event.preventDefault();
                openSearch();
            },
            '$mod+P': (event) => {
                event.preventDefault();
                openSearch();
            },
        });
        return () => {
            unsubscribe();
        };
    }, [openSearch]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Action, Object.assign({ icon: 'magnifier', onClick: openSearch }, props)), searchOpen && (0, jsx_runtime_1.jsx)(SearchList_1.default, { ref: ref, onClose: handleCloseSearch })] }));
};
exports.default = Search;
