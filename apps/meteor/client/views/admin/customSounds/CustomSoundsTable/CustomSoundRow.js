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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericTable_1 = require("../../../../components/GenericTable");
const CustomSoundRow = ({ onClick, sound }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isPlay, setPlayAudio] = (0, react_1.useState)(false);
    const customSound = (0, ui_contexts_1.useCustomSound)();
    const handleToggle = (0, react_1.useCallback)((sound) => {
        setPlayAudio(!isPlay);
        if (!isPlay) {
            return customSound.play(sound);
        }
        return customSound.pause(sound);
    }, [customSound, isPlay]);
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onKeyDown: onClick(sound._id), onClick: onClick(sound._id), tabIndex: 0, role: 'link', action: true, "qa-emoji-id": sound._id, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: sound.name }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: !isPlay ? 'play' : 'pause', small: true, "aria-label": !isPlay ? t('Play') : t('Pause'), onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggle(sound._id);
                    } }) })] }, sound._id));
};
exports.default = CustomSoundRow;
