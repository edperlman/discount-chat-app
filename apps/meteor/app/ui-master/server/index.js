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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const meteor_1 = require("meteor/meteor");
const meteorhacks_inject_initial_1 = require("meteor/meteorhacks:inject-initial");
const tracker_1 = require("meteor/tracker");
const inject_1 = require("./inject");
const highOrderFunctions_1 = require("../../../lib/utils/highOrderFunctions");
const server_1 = require("../../settings/server");
const getURL_1 = require("../../utils/server/getURL");
require("./scripts");
__exportStar(require("./inject"), exports);
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const injections = Object.values(inject_1.headInjections.all()).filter((injection) => !!injection);
        meteorhacks_inject_initial_1.Inject.rawModHtml('headInjections', (0, inject_1.applyHeadInjections)(injections));
    });
    server_1.settings.watch('Default_Referrer_Policy', (value) => {
        if (!value) {
            return (0, inject_1.injectIntoHead)('noreferrer', '<meta name="referrer" content="same-origin" />');
        }
        (0, inject_1.injectIntoHead)('noreferrer', `<meta name="referrer" content="${value}" />`);
    });
    if (process.env.DISABLE_ANIMATION) {
        (0, inject_1.injectIntoHead)('disable-animation', `
		<style>
			body, body * {
				animation: none !important;
			}
			</style>
			`);
    }
    server_1.settings.watch('Assets_SvgFavicon_Enable', (value) => {
        const standardFavicons = `
			<link rel="icon" sizes="16x16" type="image/png" href=${(0, getURL_1.getURL)('assets/favicon_16.png')} />
			<link rel="icon" sizes="32x32" type="image/png" href=${(0, getURL_1.getURL)('assets/favicon_32.png')} />`;
        if (value) {
            (0, inject_1.injectIntoHead)('Assets_SvgFavicon_Enable', `${standardFavicons}
				<link rel="icon" sizes="any" type="image/svg+xml" href=${(0, getURL_1.getURL)('assets/favicon.svg')} />`);
        }
        else {
            (0, inject_1.injectIntoHead)('Assets_SvgFavicon_Enable', standardFavicons);
        }
    });
    server_1.settings.watch('theme-color-sidebar-background', (value) => {
        const escapedValue = (0, string_helpers_1.escapeHTML)(value);
        (0, inject_1.injectIntoHead)('theme-color-sidebar-background', `<meta name="msapplication-TileColor" content="${escapedValue}" /><meta name="theme-color" content="${escapedValue}" />`);
    });
    server_1.settings.watch('Site_Name', (value = 'Rocket.Chat') => {
        const escapedValue = (0, string_helpers_1.escapeHTML)(value);
        (0, inject_1.injectIntoHead)('Site_Name', `<title>${escapedValue}</title>` +
            `<meta name="application-name" content="${escapedValue}">` +
            `<meta name="apple-mobile-web-app-title" content="${escapedValue}">`);
    });
    server_1.settings.watch('Meta_language', (value = '') => {
        const escapedValue = (0, string_helpers_1.escapeHTML)(value);
        (0, inject_1.injectIntoHead)('Meta_language', `<meta http-equiv="content-language" content="${escapedValue}"><meta name="language" content="${escapedValue}">`);
    });
    server_1.settings.watch('Meta_robots', (value = '') => {
        const escapedValue = (0, string_helpers_1.escapeHTML)(value);
        (0, inject_1.injectIntoHead)('Meta_robots', `<meta name="robots" content="${escapedValue}">`);
    });
    server_1.settings.watch('Meta_msvalidate01', (value = '') => {
        const escapedValue = (0, string_helpers_1.escapeHTML)(value);
        (0, inject_1.injectIntoHead)('Meta_msvalidate01', `<meta name="msvalidate.01" content="${escapedValue}">`);
    });
    server_1.settings.watch('Meta_google-site-verification', (value = '') => {
        const escapedValue = (0, string_helpers_1.escapeHTML)(value);
        (0, inject_1.injectIntoHead)('Meta_google-site-verification', `<meta name="google-site-verification" content="${escapedValue}">`);
    });
    server_1.settings.watch('Meta_fb_app_id', (value = '') => {
        const escapedValue = (0, string_helpers_1.escapeHTML)(value);
        (0, inject_1.injectIntoHead)('Meta_fb_app_id', `<meta property="fb:app_id" content="${escapedValue}">`);
    });
    server_1.settings.watch('Meta_custom', (value = '') => {
        (0, inject_1.injectIntoHead)('Meta_custom', value);
    });
    const baseUrl = ((prefix) => {
        if (!prefix) {
            return '/';
        }
        prefix = prefix.trim();
        if (!prefix) {
            return '/';
        }
        return /\/$/.test(prefix) ? prefix : `${prefix}/`;
    })(__meteor_runtime_config__.ROOT_URL_PATH_PREFIX);
    (0, inject_1.injectIntoHead)('base', `<base href="${baseUrl}">`);
});
const renderDynamicCssList = (0, highOrderFunctions_1.withDebouncing)({ wait: 500 })(() => __awaiter(void 0, void 0, void 0, function* () {
    // const variables = RocketChat.models.Settings.findOne({_id:'theme-custom-variables'}, {fields: { value: 1}});
    const colors = yield models_1.Settings.find({ _id: /theme-color-rc/i }, { projection: { value: 1, editor: 1 } }).toArray();
    const css = colors
        .filter((color) => !!(color === null || color === void 0 ? void 0 : color.value))
        .map(({ _id, value, editor }) => {
        if (editor === 'expression') {
            return `--${_id.replace('theme-color-', '')}: var(--${value});`;
        }
        return `--${_id.replace('theme-color-', '')}: ${value};`;
    })
        .join('\n');
    (0, inject_1.injectIntoBody)('dynamic-variables', `<style id='css-variables'> :root {${css}}</style>`);
}));
await renderDynamicCssList();
server_1.settings.watchByRegex(/theme-color-rc/i, renderDynamicCssList);
(0, inject_1.injectIntoBody)('react-root', `
<noscript style="color: white; text-align:center">
	You need to enable JavaScript to run this app.
</noscript>
<div id="react-root">
	<div class="page-loading" role="alert" aria-busy="true" aria-live="polite" aria-label="loading">
		<div class="loading__animation">
			<div class="loading__animation__bounce"></div>
			<div class="loading__animation__bounce"></div>
			<div class="loading__animation__bounce"></div>
		</div>
	</div>
</div>
`);
(0, inject_1.injectIntoBody)('icons', (_a = (await Assets.getTextAsync('public/icons.svg'))) !== null && _a !== void 0 ? _a : '');
