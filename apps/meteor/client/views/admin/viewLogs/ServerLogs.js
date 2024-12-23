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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ansispan_1 = require("./ansispan");
const compareEntries = (a, b) => a.ts.getTime() - b.ts.getTime();
const unserializeEntry = (_a) => {
    var { ts } = _a, entry = __rest(_a, ["ts"]);
    return (Object.assign({ ts: new Date(ts) }, entry));
};
const ServerLogs = () => {
    const [entries, setEntries] = (0, react_1.useState)([]);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const getStdoutQueue = (0, ui_contexts_1.useEndpoint)('GET', '/v1/stdout.queue');
    const subscribeToStdout = (0, ui_contexts_1.useStream)('stdout');
    (0, react_1.useEffect)(() => {
        const fetchLines = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { queue } = yield getStdoutQueue(undefined);
                setEntries(queue.map(unserializeEntry).sort(compareEntries));
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
        });
        fetchLines();
    }, [dispatchToastMessage, getStdoutQueue]);
    (0, react_1.useEffect)(() => subscribeToStdout('stdout', (entry) => {
        setEntries((entries) => [...entries, entry]);
    }), [subscribeToStdout]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const wrapperRef = (0, react_1.useRef)();
    const atBottomRef = (0, react_1.useRef)(false);
    const [newLogsVisible, setNewLogsVisible] = (0, react_1.useState)(false);
    const isAtBottom = (0, react_1.useCallback)((scrollThreshold = 0) => {
        const wrapper = wrapperRef.current;
        if (!wrapper) {
            return false;
        }
        if (wrapper.scrollTop + scrollThreshold >= wrapper.scrollHeight - wrapper.clientHeight) {
            setNewLogsVisible(false);
            return true;
        }
        return false;
    }, []);
    const sendToBottom = (0, react_1.useCallback)(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) {
            return;
        }
        wrapper.scrollTop = wrapper.scrollHeight - wrapper.clientHeight;
        setNewLogsVisible(false);
    }, []);
    const checkIfScrollIsAtBottom = (0, react_1.useCallback)(() => {
        atBottomRef.current = isAtBottom(100);
    }, [isAtBottom]);
    const sendToBottomIfNecessary = (0, react_1.useCallback)(() => {
        if (atBottomRef.current === true && isAtBottom() !== true) {
            sendToBottom();
        }
        else if (atBottomRef.current === false) {
            setNewLogsVisible(true);
        }
    }, [isAtBottom, sendToBottom]);
    (0, react_1.useEffect)(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) {
            return;
        }
        if (window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                    sendToBottomIfNecessary();
                });
            });
            observer.observe(wrapper, { childList: true });
            return () => {
                observer.disconnect();
            };
        }
        const handleSubtreeModified = () => {
            sendToBottomIfNecessary();
        };
        wrapper.addEventListener('DOMSubtreeModified', handleSubtreeModified);
        return () => {
            wrapper.removeEventListener('DOMSubtreeModified', handleSubtreeModified);
        };
    }, [sendToBottomIfNecessary]);
    (0, react_1.useEffect)(() => {
        const handleWindowResize = () => {
            setTimeout(() => {
                sendToBottomIfNecessary();
            }, 100);
        };
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [sendToBottomIfNecessary]);
    const handleWheel = (0, react_1.useCallback)(() => {
        atBottomRef.current = false;
        setTimeout(() => {
            checkIfScrollIsAtBottom();
        }, 100);
    }, [checkIfScrollIsAtBottom]);
    const handleTouchStart = () => {
        atBottomRef.current = false;
    };
    const handleTouchEnd = (0, react_1.useCallback)(() => {
        setTimeout(() => {
            checkIfScrollIsAtBottom();
        }, 100);
    }, [checkIfScrollIsAtBottom]);
    const handleScroll = (0, react_1.useCallback)(() => {
        atBottomRef.current = false;
        setTimeout(() => {
            checkIfScrollIsAtBottom();
        }, 100);
    }, [checkIfScrollIsAtBottom]);
    const handleClick = (0, react_1.useCallback)(() => {
        atBottomRef.current = true;
        sendToBottomIfNecessary();
    }, [sendToBottomIfNecessary]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { width: 'full', height: 'full', overflow: 'hidden', position: 'relative', display: 'flex', mbe: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Scrollable, { vertical: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { ref: wrapperRef, display: 'flex', flexDirection: 'column', padding: 8, flexGrow: 1, fontFamily: 'mono', color: 'default', bg: 'neutral', style: { wordBreak: 'break-all' }, onWheel: handleWheel, onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd, onScroll: handleScroll, borderRadius: 'x4', children: entries.sort(compareEntries).map(({ string }, i) => ((0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: { __html: (0, ansispan_1.ansispan)(string) } }, i))) }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { role: 'button', position: 'absolute', display: 'flex', justifyContent: 'center', insetBlockEnd: 8, insetInlineStart: '50%', width: 'x132', height: 'x32', marginInline: 'neg-x64', paddingBlock: 8, fontScale: 'c2', borderRadius: 'full', elevation: '1', color: 'default', bg: 'light', onClick: handleClick, textAlign: 'center', style: {
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease-out',
                    transform: newLogsVisible ? 'translateY(0)' : 'translateY(150%)',
                }, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'jump', size: 'x16' }), " ", t('New_logs')] })] }));
};
exports.default = ServerLogs;
