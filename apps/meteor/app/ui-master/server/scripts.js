"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inject_1 = require("./inject");
const server_1 = require("../../settings/server");
const getContent = () => `

${process.env.BUGSNAG_CLIENT
    ? `window.__BUGSNAG_KEY__ = "${process.env.BUGSNAG_CLIENT}";\n
window.addEventListener('load', function() {
	const event = new Event('bugsnag-error-boundary');
	window.dispatchEvent(event);
});
`
    : ''}

${process.env.DISABLE_ANIMATION ? 'window.DISABLE_ANIMATION = true;\n' : ''}

${server_1.settings.get('API_Use_REST_For_DDP_Calls') ? 'window.USE_REST_FOR_DDP_CALLS = true;\n' : ''}
${server_1.settings.get('ECDH_Enabled') ? 'window.ECDH_Enabled = true;\n' : ''}
// Custom_Script_Logged_Out
window.addEventListener('Custom_Script_Logged_Out', function() {
	${server_1.settings.get('Custom_Script_Logged_Out')}
})


// Custom_Script_Logged_In
window.addEventListener('Custom_Script_Logged_In', function() {
	${server_1.settings.get('Custom_Script_Logged_In')}
})


// Custom_Script_On_Logout
window.addEventListener('Custom_Script_On_Logout', function() {
	${server_1.settings.get('Custom_Script_On_Logout')}
})

${server_1.settings.get('Accounts_ForgetUserSessionOnWindowClose')
    ? `
window.addEventListener('load', function() {
	if (window.localStorage) {
		Object.keys(window.localStorage).forEach(function(key) {
			window.sessionStorage.setItem(key, window.localStorage.getItem(key));
		});
		window.localStorage.clear();
		Meteor._localStorage = window.sessionStorage;
		Accounts.config({ clientStorage: 'session'  });
	}
});
`
    : ''}`;
server_1.settings.watchMultiple([
    'API_Use_REST_For_DDP_Calls',
    'Custom_Script_Logged_Out',
    'Custom_Script_Logged_In',
    'Custom_Script_On_Logout',
    'Accounts_ForgetUserSessionOnWindowClose',
    'ECDH_Enabled',
], () => {
    const content = getContent();
    (0, inject_1.addScript)('scripts', content);
});
