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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const isTruthy_1 = require("../../../../lib/isTruthy");
const buttonStyle = (0, css_in_js_1.css) `
	position: absolute;
	z-index: 2;
	bottom: 8px;
	left: 50%;
	user-select: none;
	transform: translate(-50%, 0);

	&.not {
		visibility: hidden;
	}

	&.clicked {
		animation: fadeout 1s linear forwards;
	}

	@keyframes fadeout {
		50% {
			visibility: visible;
			transform: translate(-50%, 150%);
		}
		100% {
			visibility: hidden;
			transform: translate(-50%, 150%);
			position: fixed;
		}
	}
`;
const JumpToRecentMessageButton = ({ visible, onClick, text }) => {
    const [clicked, setClicked] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: [buttonStyle, !visible && 'not', clicked && 'clicked'].filter(isTruthy_1.isTruthy), children: (0, jsx_runtime_1.jsx)(fuselage_1.Bubble, { icon: 'arrow-down', onClick: () => {
                onClick();
                setClicked(true);
            }, children: text }) }));
};
exports.default = JumpToRecentMessageButton;
