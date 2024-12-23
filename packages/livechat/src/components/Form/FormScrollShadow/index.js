"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormScrollShadow = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const hooks_1 = require("preact/hooks");
const createClassName_1 = require("../../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const FormScrollShadow = ({ topRef, bottomRef, children, }) => {
    const [atTop, setAtTop] = (0, hooks_1.useState)(true);
    const [atBottom, setAtBottom] = (0, hooks_1.useState)(false);
    const callback = (entries) => {
        entries.forEach((entry) => {
            entry.target.id === 'top' && setAtTop(entry.isIntersecting);
            entry.target.id === 'bottom' && setAtBottom(entry.isIntersecting);
        });
    };
    (0, hooks_1.useEffect)(() => {
        if (!(topRef === null || topRef === void 0 ? void 0 : topRef.current) || !(bottomRef === null || bottomRef === void 0 ? void 0 : bottomRef.current)) {
            return;
        }
        const observer = new IntersectionObserver(callback, {
            root: document.getElementById('scrollShadow'),
            rootMargin: '0px',
            threshold: 0.1,
        });
        if (topRef.current) {
            observer.observe(topRef.current);
        }
        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [bottomRef, topRef]);
    return ((0, jsx_runtime_1.jsx)("div", { id: 'scrollShadow', className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'scrollShadow', { atTop, atBottom }), children: children }));
};
exports.FormScrollShadow = FormScrollShadow;
