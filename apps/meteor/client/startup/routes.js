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
const react_1 = __importStar(require("react"));
const appLayout_1 = require("../lib/appLayout");
const RouterProvider_1 = require("../providers/RouterProvider");
const MainLayout_1 = __importDefault(require("../views/root/MainLayout"));
const IndexRoute = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/root/IndexRoute'))));
const MeetRoute = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/meet/MeetRoute'))));
const HomePage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/home/HomePage'))));
const DirectoryPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/directory'))));
const OmnichannelDirectoryRouter = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/omnichannel/directory/OmnichannelDirectoryRouter'))));
const OmnichannelQueueList = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/omnichannel/queueList'))));
const CMSPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('@rocket.chat/web-ui-registration'))).then(({ CMSPage }) => ({ default: CMSPage })));
const SecretURLPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/invite/SecretURLPage'))));
const InvitePage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/invite/InvitePage'))));
const ConferenceRoute = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/conference/ConferenceRoute'))));
const SetupWizardRoute = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/setupWizard/SetupWizardRoute'))));
const MailerUnsubscriptionPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/mailer/MailerUnsubscriptionPage'))));
const LoginTokenRoute = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/root/LoginTokenRoute'))));
const SAMLLoginRoute = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/root/SAMLLoginRoute'))));
const ResetPasswordPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('@rocket.chat/web-ui-registration'))).then(({ ResetPasswordPage }) => ({ default: ResetPasswordPage })));
const OAuthAuthorizationPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/oauth/OAuthAuthorizationPage'))));
const OAuthErrorPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/oauth/OAuthErrorPage'))));
const NotFoundPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/notFound/NotFoundPage'))));
RouterProvider_1.router.defineRoutes([
    {
        path: '/',
        id: 'index',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(IndexRoute, {})),
    },
    {
        path: '/login',
        id: 'login',
        element: (0, react_1.createElement)(() => {
            (0, react_1.useEffect)(() => {
                RouterProvider_1.router.navigate('/home');
            }, []);
            return null;
        }),
    },
    {
        path: '/meet/:rid',
        id: 'meet',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(MeetRoute, {})),
    },
    {
        path: '/home',
        id: 'home',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(MainLayout_1.default, { children: (0, jsx_runtime_1.jsx)(HomePage, {}) })),
    },
    {
        path: '/directory/:tab?',
        id: 'directory',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(MainLayout_1.default, { children: (0, jsx_runtime_1.jsx)(DirectoryPage, {}) })),
    },
    {
        path: '/omnichannel-directory/:tab?/:context?/:id?/',
        id: 'omnichannel-directory',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(MainLayout_1.default, { children: (0, jsx_runtime_1.jsx)(OmnichannelDirectoryRouter, {}) })),
    },
    {
        path: '/livechat-queue',
        id: 'livechat-queue',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(MainLayout_1.default, { children: (0, jsx_runtime_1.jsx)(OmnichannelQueueList, {}) })),
    },
    {
        path: '/terms-of-service',
        id: 'terms-of-service',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(CMSPage, { page: 'Layout_Terms_of_Service' })),
    },
    {
        path: '/privacy-policy',
        id: 'privacy-policy',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(CMSPage, { page: 'Layout_Privacy_Policy' })),
    },
    {
        path: '/legal-notice',
        id: 'legal-notice',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(CMSPage, { page: 'Layout_Legal_Notice' })),
    },
    {
        path: '/register/:hash',
        id: 'register-secret-url',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(SecretURLPage, {})),
    },
    {
        path: '/invite/:hash',
        id: 'invite',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(InvitePage, {})),
    },
    {
        path: '/conference/:id',
        id: 'conference',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(ConferenceRoute, {})),
    },
    {
        path: '/setup-wizard/:step?',
        id: 'setup-wizard',
        element: (0, jsx_runtime_1.jsx)(SetupWizardRoute, {}),
    },
    {
        path: '/mailer/unsubscribe/:_id/:createdAt',
        id: 'mailer-unsubscribe',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(MailerUnsubscriptionPage, {})),
    },
    {
        path: '/login-token/:token',
        id: 'tokenLogin',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(LoginTokenRoute, {})),
    },
    {
        path: '/reset-password/:token',
        id: 'resetPassword',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(ResetPasswordPage, {})),
    },
    {
        path: '/oauth/authorize',
        id: 'oauth/authorize',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(OAuthAuthorizationPage, {})),
    },
    {
        path: '/oauth/error/:error',
        id: 'oauth/error',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(OAuthErrorPage, {})),
    },
    {
        path: '/saml/:token',
        id: 'saml',
        element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(SAMLLoginRoute, {})),
    },
    {
        path: '*',
        id: 'not-found',
        element: (0, jsx_runtime_1.jsx)(NotFoundPage, {}),
    },
]);
