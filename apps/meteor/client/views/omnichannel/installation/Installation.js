"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Wrapper_1 = __importDefault(require("./Wrapper"));
const Page_1 = require("../../../components/Page");
const RawText_1 = __importDefault(require("../../../components/RawText"));
const TextCopy_1 = __importDefault(require("../../../components/TextCopy"));
// TODO: use `CodeSnippet` Component
const Installation = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const siteUrl = (0, ui_contexts_1.useSetting)('Site_Url', (0, ui_contexts_1.useAbsoluteUrl)()('')).replace(/\/$/, '');
    const installString = `<!-- Start of Rocket.Chat Livechat Script -->
	<script type="text/javascript">
	(function(w, d, s, u) {
		w.RocketChat = function(c) { w.RocketChat._.push(c) }; w.RocketChat._ = []; w.RocketChat.url = u;
		var h = d.getElementsByTagName(s)[0], j = d.createElement(s);
		j.async = true; j.src = '${siteUrl}/livechat/rocketchat-livechat.min.js?_=201903270000';
		h.parentNode.insertBefore(j, h);
	})(window, document, 'script', '${siteUrl}/livechat');
	</script>`;
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Installation') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { maxWidth: 'x600', alignSelf: 'center', children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)(RawText_1.default, { children: t('To_install_RocketChat_Livechat_in_your_website_copy_paste_this_code_above_the_last_body_tag_on_your_site') }) }), (0, jsx_runtime_1.jsx)(TextCopy_1.default, { pi: 'none', text: installString, wrapper: Wrapper_1.default })] }) })] }));
};
exports.default = Installation;
