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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const defaultGutters = ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'];
function CodeMirror(_a) {
    var { lineNumbers = true, lineWrapping = true, mode = 'javascript', gutters = defaultGutters, foldGutter = true, matchBrackets = true, autoCloseBrackets = true, matchTags = true, showTrailingSpace = true, highlightSelectionMatches = true, readOnly, value: valueProp, defaultValue, onChange } = _a, props = __rest(_a, ["lineNumbers", "lineWrapping", "mode", "gutters", "foldGutter", "matchBrackets", "autoCloseBrackets", "matchTags", "showTrailingSpace", "highlightSelectionMatches", "readOnly", "value", "defaultValue", "onChange"]);
    const [value, setValue] = (0, react_1.useState)(valueProp || defaultValue);
    const textAreaRef = (0, react_1.useRef)(null);
    const editorRef = (0, react_1.useRef)(null);
    const handleChange = (0, fuselage_hooks_1.useMutableCallback)(onChange);
    (0, react_1.useEffect)(() => {
        if (editorRef.current) {
            return;
        }
        const setupCodeMirror = () => __awaiter(this, void 0, void 0, function* () {
            const { default: CodeMirror } = yield Promise.resolve().then(() => __importStar(require('codemirror')));
            yield Promise.all([
                Promise.resolve().then(() => __importStar(require('../../../../../../../app/ui/client/lib/codeMirror/codeMirror'))),
                Promise.resolve().then(() => __importStar(require('codemirror/addon/edit/matchbrackets'))),
                Promise.resolve().then(() => __importStar(require('codemirror/addon/edit/closebrackets'))),
                Promise.resolve().then(() => __importStar(require('codemirror/addon/edit/matchtags'))),
                Promise.resolve().then(() => __importStar(require('codemirror/addon/edit/trailingspace'))),
                Promise.resolve().then(() => __importStar(require('codemirror/addon/search/match-highlighter'))),
                Promise.resolve().then(() => __importStar(require('codemirror/lib/codemirror.css'))),
            ]);
            if (!textAreaRef.current) {
                return;
            }
            editorRef.current = CodeMirror.fromTextArea(textAreaRef.current, {
                lineNumbers,
                lineWrapping,
                mode,
                gutters,
                foldGutter,
                matchBrackets,
                autoCloseBrackets,
                matchTags,
                showTrailingSpace,
                highlightSelectionMatches,
                readOnly,
            });
            editorRef.current.on('change', (doc) => {
                const value = doc.getValue();
                setValue(value);
                handleChange(value);
            });
        });
        setupCodeMirror();
        return () => {
            if (!editorRef.current) {
                return;
            }
            editorRef.current.toTextArea();
        };
    }, [
        autoCloseBrackets,
        foldGutter,
        gutters,
        highlightSelectionMatches,
        lineNumbers,
        lineWrapping,
        matchBrackets,
        matchTags,
        mode,
        handleChange,
        readOnly,
        textAreaRef,
        showTrailingSpace,
    ]);
    (0, react_1.useEffect)(() => {
        setValue(valueProp);
    }, [valueProp]);
    (0, react_1.useEffect)(() => {
        if (!editorRef.current) {
            return;
        }
        if (value !== editorRef.current.getValue()) {
            editorRef.current.setValue(value !== null && value !== void 0 ? value : '');
        }
    }, [textAreaRef, value]);
    return (0, jsx_runtime_1.jsx)("textarea", Object.assign({ readOnly: true, ref: textAreaRef, style: { display: 'none' }, value: value }, props));
}
exports.default = CodeMirror;
