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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_aria_1 = require("react-aria");
const Sidebar_1 = __importDefault(require("./Sidebar"));
const SidebarRegion = () => {
    const { isMobile, sidebar } = (0, ui_contexts_1.useLayout)();
    const sidebarMobileClass = (0, css_in_js_1.css) `
		position: absolute;
		user-select: none;
		transform: translate3d(-100%, 0, 0);
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		-webkit-user-drag: none;
		touch-action: pan-y;
		will-change: transform;

		.rtl & {
			transform: translate3d(200%, 0, 0);

			&.opened {
				box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 15px 1px;
				transform: translate3d(0px, 0px, 0px);
			}
		}
	`;
    const sideBarStyle = (0, css_in_js_1.css) `
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		height: 100%;
		user-select: none;
		transition: transform 0.3s;
		width: var(--sidebar-width);
		min-width: var(--sidebar-width);

		> .rcx-sidebar:not(:last-child) {
			visibility: hidden;
		}

		&.opened {
			box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 15px 1px;
			transform: translate3d(0px, 0px, 0px);
		}

		/* // 768px to 1599px
		// using em unit base 16
		@media (max-width: 48em) {
			width: 80%;
			min-width: 80%;
		} */

		// 1600px to 1919px
		// using em unit base 16
		@media (min-width: 100em) {
			width: var(--sidebar-md-width);
			min-width: var(--sidebar-md-width);
		}

		// 1920px and up
		// using em unit base 16
		@media (min-width: 120em) {
			width: var(--sidebar-lg-width);
			min-width: var(--sidebar-lg-width);
		}
	`;
    const sidebarWrapStyle = (0, css_in_js_1.css) `
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		height: 100%;
		user-select: none;
		transition: opacity 0.3s;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		touch-action: pan-y;
		-webkit-user-drag: none;

		&.opened {
			width: 100%;
			background-color: rgb(0, 0, 0);
			opacity: 0.8;
		}
	`;
    return ((0, jsx_runtime_1.jsxs)(react_aria_1.FocusScope, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { id: 'sidebar-region', className: ['rcx-sidebar', !sidebar.isCollapsed && isMobile && 'opened', sideBarStyle, isMobile && sidebarMobileClass].filter(Boolean), children: (0, jsx_runtime_1.jsx)(Sidebar_1.default, {}) }), isMobile && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: [sidebarWrapStyle, !sidebar.isCollapsed && 'opened'].filter(Boolean), onClick: () => sidebar.toggle() }))] }));
};
exports.default = (0, react_1.memo)(SidebarRegion);
