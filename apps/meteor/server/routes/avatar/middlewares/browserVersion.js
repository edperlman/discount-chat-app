"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBrowserVersionCheck = exports.isIEOlderThan11 = void 0;
const ostrio_cookies_1 = require("meteor/ostrio:cookies");
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const getURL_1 = require("../../../../app/utils/server/getURL");
const cookies = new ostrio_cookies_1.Cookies();
const isIEOlderThan11 = (userAgent) => {
    if (!(userAgent === null || userAgent === void 0 ? void 0 : userAgent.browser.name) || !(userAgent === null || userAgent === void 0 ? void 0 : userAgent.browser.version)) {
        return false;
    }
    return userAgent.browser.name === 'IE' && parseInt(userAgent.browser.version) < 11;
};
exports.isIEOlderThan11 = isIEOlderThan11;
const handleBrowserVersionCheck = (request, res, next) => {
    const req = request;
    const browserVersionCheck = cookies.get('browser_version_check', req.headers.cookie);
    if (browserVersionCheck === 'bypass') {
        return next();
    }
    const userAgent = (0, ua_parser_js_1.default)(req.headers['user-agent']);
    if (browserVersionCheck !== 'force' && !(0, exports.isIEOlderThan11)(userAgent)) {
        return next();
    }
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.write(`
		<style>
			body {
				margin: 0;
				font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Helvetica Neue','Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Meiryo UI',Arial,sans-serif;
			}

			.rcx-box--text-style-headline {
				letter-spacing: 0rem;
				font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Meiryo UI, Arial, sans-serif;
				font-size: 1.375rem;
				font-weight: 400;
				line-height: 2rem;
			}

			.not-supported-browser {
				width: 100%;
				min-height: 100vh;

				text-align: center;

				background-image: url(${(0, getURL_1.getURL)('/images/404.svg')});
				background-repeat: no-repeat;
				background-position: center;
				background-size: cover;

				display: flex;
				justify-content: center;
				align-items: center;

				&__404 {
					font-size: 4em;
					font-weight: bold;
				}
			}

			.not-supported-browser__text {
				font-size: 4em;
				font-weight: bold;
			}

			.rcx-box--text-color-alternative {
				color: #ffffff;
			}

			.rcx-box, .rcx-box::before, .rcx-box::after {
				box-sizing: border-box;
				margin: 0;
				padding: 0;
				transition: all 230ms;
				border-width: 0;
				border-style: solid;
				border-color: currentColor;
				outline: none;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
				font-variant-numeric: tabular-nums;
			}

			.rcx-button {
				display: inline-block;
				text-align: center;
				vertical-align: middle;
				white-space: nowrap;
				text-decoration: none;
				cursor: pointer;
				outline: 0;
				letter-spacing: 0rem;
				font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Meiryo UI, Arial, sans-serif;
				font-size: 0.875rem;
				font-weight: 500;
				line-height: 1.25rem;
				overflow: hidden;
				text-overflow: ellipsis;
				padding: 7px 15px;
				padding-top: 7px;
				padding-bottom: 7px;
				padding-block: 7px;
				padding-left: 15px;
				padding-right: 15px;
				padding-inline: 15px;
			}

			.rcx-button--primary {
				color: #ffffff;
				border-width: 0.125rem;
				border-style: solid;
				border-color: #1d74f5;
				border-radius: 0.125rem;
				background-color: #1d74f5;
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
			}

			.rcx-box--text-color-primary {
				color: #1d74f5;
			}
			.rcx-box.rcx-\@s6mi60{margin:0.75rem !important;}.rcx-box.rcx-\@19aubzx{margin:2rem !important;}.rcx-box.rcx-\@1kgm1vs{-webkit-align-items:center !important;-webkit-box-align:center !important;-ms-flex-align:center !important;align-items:center !important;-webkit-box-pack:center !important;-webkit-justify-content:center !important;-ms-flex-pack:center !important;justify-content:center !important;-webkit-flex-direction:column !important;-ms-flex-direction:column !important;flex-direction:column !important;}.rcx-box.rcx-\@1qvl0ud{display:-webkit-box !important;display:-webkit-flex !important;display:-ms-flexbox !important;display:flex !important;}
		</style>

		<section class="rcx-box not-supported-browser rcx-@1kgm1vs rcx-@1qvl0ud">
			<div class="rcx-box">
				<div class="rcx-box rcx-box--text-color-alternative not-supported-browser__text rcx-@s6mi60">Browser not supported</div>
				<a class="rcx-box rcx-button rcx-button--primary" href="https://rocket.chat/docs/getting-support/#supported-browser-versions" target="_blank">Check the documentation</a>
				<a class="rcx-box rcx-button rcx-button--primary" href="#" onclick="document.cookie = 'browser_version_check=bypass; path=/'; location.reload(true);">Proceed anyway</a>
			</div>
		</section>
	`);
    return res.end();
};
exports.handleBrowserVersionCheck = handleBrowserVersionCheck;
