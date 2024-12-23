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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_virtuoso_1 = require("react-virtuoso");
const EmojiCategoryRow_1 = __importDefault(require("./EmojiCategoryRow"));
const CustomScrollbars_1 = require("../../../components/CustomScrollbars");
const CategoriesResult = (0, react_1.forwardRef)(function CategoriesResult({ emojiListByCategory, categoriesPosition, customItemsLimit, handleLoadMore, handleSelectEmoji, handleScroll }, ref) {
    const wrapper = (0, react_1.useRef)(null);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { ref: wrapper, className: (0, css_in_js_1.css) `
				&.pointer-none .rcx-emoji-picker__element {
					pointer-events: none;
				}
			`, height: 'full', children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { ref: ref, totalCount: emojiListByCategory.length, data: emojiListByCategory, onScroll: handleScroll, components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars }, isScrolling: (isScrolling) => {
                if (!wrapper.current) {
                    return;
                }
                if (isScrolling) {
                    wrapper.current.classList.add('pointer-none');
                }
                else {
                    wrapper.current.classList.remove('pointer-none');
                }
            }, itemContent: (_, data) => ((0, jsx_runtime_1.jsx)(EmojiCategoryRow_1.default, Object.assign({ categoryKey: data.key, categoriesPosition: categoriesPosition, customItemsLimit: customItemsLimit, handleLoadMore: handleLoadMore, handleSelectEmoji: handleSelectEmoji }, data))) }) }));
});
exports.default = CategoriesResult;
