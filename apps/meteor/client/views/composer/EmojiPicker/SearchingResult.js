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
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_virtuoso_1 = require("react-virtuoso");
const EmojiElement_1 = __importDefault(require("./EmojiElement"));
const SearchingResultWrapper_1 = __importDefault(require("./SearchingResultWrapper"));
const CustomScrollbars_1 = require("../../../components/CustomScrollbars");
const SearchingResult = ({ searchResults, handleSelectEmoji }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const ref = (0, react_1.useRef)(null);
    if (searchResults.length === 0) {
        return (0, jsx_runtime_1.jsx)(ui_client_1.EmojiPickerNotFound, { children: t('No_emojis_found') });
    }
    return ((0, jsx_runtime_1.jsx)(react_virtuoso_1.VirtuosoGrid, { ref: ref, totalCount: searchResults.length, components: {
            Scroller: CustomScrollbars_1.VirtuosoScrollbars,
            List: SearchingResultWrapper_1.default,
        }, itemContent: (index) => {
            const { emoji, image } = searchResults[index] || {};
            return (0, jsx_runtime_1.jsx)(EmojiElement_1.default, { emoji: emoji, image: image, onClick: handleSelectEmoji });
        } }));
};
exports.default = SearchingResult;
