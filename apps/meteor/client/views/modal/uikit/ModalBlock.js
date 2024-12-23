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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const fuselage_ui_kit_1 = require("@rocket.chat/fuselage-ui-kit");
const UiKit = __importStar(require("@rocket.chat/ui-kit"));
const react_1 = __importStar(require("react"));
const react_aria_1 = require("react-aria");
const getButtonStyle_1 = require("./getButtonStyle");
const getURL_1 = require("../../../../app/utils/client/getURL");
const focusableElementsString = `
	a[href]:not([tabindex="-1"]),
	area[href]:not([tabindex="-1"]),
	input:not([disabled]):not([tabindex="-1"]),
	select:not([disabled]):not([tabindex="-1"]),
	textarea:not([disabled]):not([tabindex="-1"]),
	button:not([disabled]):not([tabindex="-1"]),
	iframe,
	object,
	embed,
	[tabindex]:not([tabindex="-1"]),
	[contenteditable]`;
const focusableElementsStringInvalid = `
	a[href]:not([tabindex="-1"]):invalid,
	area[href]:not([tabindex="-1"]):invalid,
	input:not([disabled]):not([tabindex="-1"]):invalid,
	select:not([disabled]):not([tabindex="-1"]):invalid,
	textarea:not([disabled]):not([tabindex="-1"]):invalid,
	button:not([disabled]):not([tabindex="-1"]):invalid,
	iframe:invalid,
	object:invalid,
	embed:invalid,
	[tabindex]:not([tabindex="-1"]):invalid,
	[contenteditable]:invalid`;
const isFocusable = (element) => element !== null && 'focus' in element && typeof element.focus === 'function';
const KeyboardCode = new Map([
    ['ENTER', 13],
    ['ESC', 27],
    ['TAB', 9],
]);
const ModalBlock = ({ view, errors, onSubmit, onClose, onCancel }) => {
    const id = `modal_id_${(0, fuselage_hooks_1.useUniqueId)()}`;
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!ref.current) {
            return;
        }
        if (errors && Object.keys(errors).length) {
            const element = ref.current.querySelector(focusableElementsStringInvalid);
            element === null || element === void 0 ? void 0 : element.focus();
        }
        else {
            const element = ref.current.querySelector(focusableElementsString);
            element === null || element === void 0 ? void 0 : element.focus();
        }
    }, [errors]);
    const previousFocus = (0, react_1.useMemo)(() => document.activeElement, []);
    (0, react_1.useEffect)(() => () => {
        if (previousFocus && isFocusable(previousFocus)) {
            return previousFocus.focus();
        }
    }, [previousFocus]);
    const handleKeyDown = (0, react_1.useCallback)((event) => {
        var _a;
        switch (event.keyCode) {
            case KeyboardCode.get('ENTER'):
                if (((_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.nodeName) !== 'TEXTAREA') {
                    return onSubmit(event);
                }
                return;
            case KeyboardCode.get('ESC'):
                event.stopPropagation();
                event.preventDefault();
                onClose();
                return;
            case KeyboardCode.get('TAB'):
                if (!ref.current) {
                    return;
                }
                const elements = Array.from(ref.current.querySelectorAll(focusableElementsString));
                const [first] = elements;
                const last = elements.pop();
                if (!ref.current.contains(document.activeElement)) {
                    return first.focus();
                }
                if (event.shiftKey) {
                    if (!first || first === document.activeElement) {
                        last === null || last === void 0 ? void 0 : last.focus();
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    return;
                }
                if (!last || last === document.activeElement) {
                    first.focus();
                    event.stopPropagation();
                    event.preventDefault();
                }
        }
    }, [onClose, onSubmit]);
    (0, react_1.useEffect)(() => {
        const element = document.querySelector('#modal-root');
        const container = element.querySelector('.rcx-modal__content');
        const close = (e) => {
            if (e.target !== element) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            onClose();
            return false;
        };
        const ignoreIfNotContains = (e) => {
            if (e.target !== element) {
                return;
            }
            if (!container.contains(e.target)) {
                return;
            }
            return handleKeyDown(e);
        };
        document.addEventListener('keydown', ignoreIfNotContains);
        element.addEventListener('click', close);
        return () => {
            document.removeEventListener('keydown', ignoreIfNotContains);
            element.removeEventListener('click', close);
        };
    }, [handleKeyDown, onClose]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.AnimatedVisibility, { visibility: fuselage_1.AnimatedVisibility.UNHIDING, children: (0, jsx_runtime_1.jsx)(react_aria_1.FocusScope, { contain: true, restoreFocus: true, autoFocus: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { open: true, id: id, ref: ref, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [view.showIcon ? (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Thumb, { url: (0, getURL_1.getURL)(`/api/apps/${view.appId}/icon`) }) : null, (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: fuselage_ui_kit_1.modalParser.text(view.title, UiKit.BlockContext.NONE, 0) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { tabIndex: -1, onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'form', method: 'post', action: '#', onSubmit: onSubmit, children: (0, jsx_runtime_1.jsx)(fuselage_ui_kit_1.UiKitComponent, { render: fuselage_ui_kit_1.UiKitModal, blocks: view.blocks }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [view.close && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: view.close.style === 'danger', onClick: onCancel, children: fuselage_ui_kit_1.modalParser.text(view.close.text, UiKit.BlockContext.NONE, 0) })), view.submit && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, Object.assign({}, (0, getButtonStyle_1.getButtonStyle)(view.submit), { onClick: onSubmit, children: fuselage_ui_kit_1.modalParser.text(view.submit.text, UiKit.BlockContext.NONE, 1) })))] }) })] }) }) }));
};
exports.default = ModalBlock;
