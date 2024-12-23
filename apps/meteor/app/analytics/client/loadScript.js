"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnalytics = void 0;
const meteor_1 = require("meteor/meteor");
const react_1 = require("react");
const useReactiveValue_1 = require("../../../client/hooks/useReactiveValue");
const client_1 = require("../../settings/client");
const useAnalytics = () => {
    const uid = (0, useReactiveValue_1.useReactiveValue)(() => meteor_1.Meteor.userId());
    const googleId = (0, useReactiveValue_1.useReactiveValue)(() => client_1.settings.get('GoogleAnalytics_enabled') && client_1.settings.get('GoogleAnalytics_ID'));
    const piwikUrl = (0, useReactiveValue_1.useReactiveValue)(() => client_1.settings.get('PiwikAnalytics_enabled') && client_1.settings.get('PiwikAnalytics_url'));
    (0, react_1.useEffect)(() => {
        if (uid) {
            window._paq = window._paq || [];
            window._paq.push(['setUserId', uid]);
        }
    });
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        if (!googleId) {
            return;
        }
        if (googleId.startsWith('G-')) {
            // Google Analytics 4
            const f = document.getElementsByTagName('script')[0];
            const j = document.createElement('script');
            j.async = true;
            j.src = `//www.googletagmanager.com/gtag/js?id=${googleId}`;
            (_a = f.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(j, f);
            // injecting the dataLayer into the windows global object
            const w = window;
            const dataLayer = w.dataLayer || [];
            const gtag = (key, value) => {
                dataLayer.push(key, value);
            };
            gtag('js', new Date());
            gtag('config', googleId);
        }
        else {
            // Google Analytics 3
            (function (i, s, o, g, r, a, m) {
                i.GoogleAnalyticsObject = r;
                (i[r] =
                    i[r] ||
                        function (...args) {
                            (i[r].q = i[r].q || []).push(args);
                            // eslint-disable-next-line no-sequences
                        }),
                    (i[r].l = new Date().getTime());
                // eslint-disable-next-line no-sequences
                (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
            (_b = window.ga) === null || _b === void 0 ? void 0 : _b.call(window, 'create', googleId, 'auto');
            (_c = window.ga) === null || _c === void 0 ? void 0 : _c.call(window, 'send', 'pageview');
        }
    }, [googleId, uid]);
    (0, react_1.useEffect)(() => {
        var _a;
        if (!piwikUrl) {
            (_a = document.getElementById('piwik-analytics')) === null || _a === void 0 ? void 0 : _a.remove();
            window._paq = [];
            return;
        }
        const piwikSiteId = piwikUrl && client_1.settings.get('PiwikAnalytics_siteId');
        const piwikPrependDomain = piwikUrl && client_1.settings.get('PiwikAnalytics_prependDomain');
        const piwikCookieDomain = piwikUrl && client_1.settings.get('PiwikAnalytics_cookieDomain');
        const piwikDomains = piwikUrl && client_1.settings.get('PiwikAnalytics_domains');
        const piwikAdditionalTracker = piwikUrl && client_1.settings.get('PiwikAdditionalTrackers');
        window._paq = window._paq || [];
        window._paq.push(['trackPageView']);
        window._paq.push(['enableLinkTracking']);
        if (piwikPrependDomain) {
            window._paq.push(['setDocumentTitle', `${window.location.hostname}/${document.title}`]);
        }
        const upperLevelDomain = `*.${window.location.hostname.split('.').slice(1).join('.')}`;
        if (piwikCookieDomain) {
            window._paq.push(['setCookieDomain', upperLevelDomain]);
        }
        if (piwikDomains) {
            // array
            const domainsArray = piwikDomains.split(/\n/);
            const domains = [];
            for (let i = 0; i < domainsArray.length; i++) {
                // only push domain if it contains a non whitespace character.
                if (/\S/.test(domainsArray[i])) {
                    domains.push(`*.${domainsArray[i].trim()}`);
                }
            }
            window._paq.push(['setDomains', domains]);
        }
        (() => {
            var _a;
            try {
                if (/\S/.test(piwikAdditionalTracker)) {
                    // piwikAdditionalTracker is not empty or whitespace only
                    const addTrackers = JSON.parse(piwikAdditionalTracker);
                    for (let i = 0; i < addTrackers.length; i++) {
                        const tracker = addTrackers[i];
                        window._paq.push(['addTracker', `${tracker.trackerURL}js/`, tracker.siteId]);
                    }
                }
            }
            catch (e) {
                // parsing JSON faild
                console.log('Error while parsing JSON value of "piwikAdditionalTracker": ', e);
            }
            window._paq.push(['setTrackerUrl', `${piwikUrl}js/`]);
            window._paq.push(['setSiteId', Number.parseInt(piwikSiteId)]);
            const d = document;
            const g = d.createElement('script');
            g.setAttribute('id', 'piwik-analytics');
            const s = d.getElementsByTagName('script')[0];
            g.type = 'text/javascript';
            g.async = true;
            g.defer = true;
            g.src = `${piwikUrl}js/`;
            (_a = s.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(g, s);
        })();
    }, [piwikUrl]);
};
exports.useAnalytics = useAnalytics;
