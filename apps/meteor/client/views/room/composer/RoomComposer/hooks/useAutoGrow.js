"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoGrow = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const shadowStyleBase = {
    position: 'fixed',
    top: '-10000px',
    left: '-10000px',
    resize: 'none',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    willChange: 'contents',
};
const useAutoGrow = (ref, shadowRef, hideTextArea) => {
    const [style, setStyle] = (0, react_1.useState)(() => ref.current && window.getComputedStyle(ref.current));
    (0, react_1.useEffect)(() => {
        const { current: textarea } = ref;
        if (!textarea) {
            return;
        }
        setStyle(() => ref.current && window.getComputedStyle(ref.current));
    }, [ref]);
    (0, react_1.useEffect)(() => {
        const { current: textarea } = ref;
        if (!textarea) {
            return;
        }
        const updateTextareaSize = () => {
            const { value } = textarea;
            const { current: shadow } = shadowRef;
            if (!shadow) {
                return;
            }
            shadow.innerHTML = value
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n$/, '<br/>&nbsp;')
                .replace(/\n/g, '<br/>');
        };
        updateTextareaSize();
        textarea.addEventListener('input', updateTextareaSize);
        return () => {
            textarea.removeEventListener('input', updateTextareaSize);
        };
    }, [ref, shadowRef]);
    const shadowContentSize = (0, fuselage_hooks_1.useContentBoxSize)(shadowRef);
    const composerContentSize = (0, fuselage_hooks_1.useContentBoxSize)(ref);
    return {
        textAreaStyle: Object.assign(Object.assign(Object.assign({}, (hideTextArea && {
            visibility: 'hidden',
        })), { whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowWrap: 'break-word', willChange: 'contents', wordBreak: 'normal', overflowY: shadowContentSize.blockSize > parseInt((style === null || style === void 0 ? void 0 : style.maxHeight) || '0') ? 'scroll' : 'hidden' }), (shadowContentSize.blockSize && {
            height: `${shadowContentSize.blockSize}px`,
        })),
        shadowStyle: Object.assign(Object.assign({}, shadowStyleBase), { font: style === null || style === void 0 ? void 0 : style.font, width: composerContentSize.inlineSize, minHeight: style === null || style === void 0 ? void 0 : style.lineHeight, lineHeight: style === null || style === void 0 ? void 0 : style.lineHeight }),
    };
};
exports.useAutoGrow = useAutoGrow;
