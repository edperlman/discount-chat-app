"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_CALLBACKS = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const isDefined_1 = require("./helpers/isDefined");
const WIDGET_OPEN_WIDTH = 365;
const WIDGET_OPEN_HEIGHT = 525;
const WIDGET_MINIMIZED_WIDTH = 54;
const WIDGET_MINIMIZED_HEIGHT = 54;
const WIDGET_MARGIN = 16;
window.RocketChat = window.RocketChat || { _: [] };
const config = {};
let widget;
let iframe;
let hookQueue = [];
let ready = false;
let smallScreen = false;
let scrollPosition;
let widgetHeight;
exports.VALID_CALLBACKS = [
    'chat-maximized',
    'chat-minimized',
    'chat-started',
    'chat-ended',
    'pre-chat-form-submit',
    'offline-form-submit',
    'show-widget',
    'hide-widget',
    'assign-agent',
    'agent-status-change',
    'queue-position-change',
    'no-agent-online',
];
const VALID_SYSTEM_MESSAGES = ['uj', 'ul', 'livechat-close', 'livechat-started', 'livechat_transfer_history'];
const callbacks = new emitter_1.Emitter();
function registerCallback(eventName, fn) {
    if (exports.VALID_CALLBACKS.indexOf(eventName) === -1) {
        return false;
    }
    return callbacks.on(eventName, fn);
}
function emitCallback(eventName, data) {
    if (typeof data !== 'undefined') {
        callbacks.emit(eventName, data);
    }
    else {
        callbacks.emit(eventName);
    }
}
function clearAllCallbacks() {
    callbacks.events().forEach((callback) => {
        callbacks.off(callback, () => undefined);
    });
}
// hooks
function callHook(action, ...params) {
    var _a;
    if (!ready) {
        return hookQueue.push([action, params]);
    }
    if (!(iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow)) {
        throw new Error('Widget is not initialized');
    }
    const data = {
        src: 'rocketchat',
        fn: action,
        args: params,
    };
    (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage(data, '*');
}
function processHookQueue() {
    if (!hookQueue.length) {
        return;
    }
    hookQueue.forEach(([action, params = []]) => {
        callHook(action, ...params);
    });
    hookQueue = [];
}
const updateWidgetStyle = (isOpened) => {
    if (!iframe || !widget) {
        throw new Error('Widget is not initialized');
    }
    const isFullscreen = smallScreen && widget.dataset.state !== 'triggered';
    if (smallScreen && isOpened) {
        scrollPosition = document.documentElement.scrollTop;
        document.body.classList.add('rc-livechat-mobile-full-screen');
    }
    else {
        document.body.classList.remove('rc-livechat-mobile-full-screen');
        if (smallScreen) {
            document.documentElement.scrollTop = scrollPosition;
        }
    }
    if (isOpened) {
        widget.style.left = isFullscreen ? '0' : 'auto';
        /**
         * If we use widget.style.height = smallScreen ? '100vh' : ...
         * In above case some browser's viewport height is not rendered correctly
         * so, as 100vh will resolve to 100% of the current viewport height,
         * so fixed it to 100% avoiding problem for some browsers. Similar resolution
         * for widget.style.width
         */
        widget.style.height = isFullscreen ? '100%' : `${WIDGET_MARGIN + widgetHeight + WIDGET_MARGIN + WIDGET_MINIMIZED_HEIGHT}px`;
        widget.style.width = isFullscreen ? '100%' : `${WIDGET_MARGIN + WIDGET_OPEN_WIDTH + WIDGET_MARGIN}px`;
    }
    else {
        widget.style.left = 'auto';
        widget.style.width = `${WIDGET_MARGIN + WIDGET_MINIMIZED_WIDTH + WIDGET_MARGIN}px`;
        widget.style.height = `${WIDGET_MARGIN + WIDGET_MINIMIZED_HEIGHT + WIDGET_MARGIN}px`;
    }
};
const createWidget = (url) => {
    widget = document.createElement('div');
    widget.className = 'rocketchat-widget';
    widget.style.position = 'fixed';
    widget.style.width = `${WIDGET_MARGIN + WIDGET_MINIMIZED_WIDTH + WIDGET_MARGIN}px`;
    widget.style.height = `${WIDGET_MARGIN + WIDGET_MINIMIZED_HEIGHT + WIDGET_MARGIN}px`;
    widget.style.maxHeight = '100vh';
    widget.style.bottom = '0';
    widget.style.left = '0';
    widget.style.zIndex = '12345';
    widget.dataset.state = 'closed';
    const container = document.createElement('div');
    container.className = 'rocketchat-container';
    container.style.width = '100%';
    container.style.height = '100%';
    iframe = document.createElement('iframe');
    iframe.id = 'rocketchat-iframe';
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.backgroundColor = 'transparent';
    container.appendChild(iframe);
    widget.appendChild(container);
    document.body.appendChild(widget);
    const handleMediaQueryTest = ({ matches }) => {
        if (!widget) {
            return;
        }
        smallScreen = matches;
        updateWidgetStyle(widget.dataset.state === 'opened');
        callHook('setExpanded', smallScreen);
        callHook('setParentUrl', window.location.href);
    };
    const mediaQueryList = window.matchMedia('screen and (max-device-width: 480px)');
    mediaQueryList.addListener(handleMediaQueryTest);
    handleMediaQueryTest(mediaQueryList);
};
const openWidget = () => {
    if (!iframe || !widget) {
        throw new Error('Widget is not initialized');
    }
    if (widget.dataset.state === 'opened') {
        return;
    }
    widgetHeight = WIDGET_OPEN_HEIGHT;
    widget.dataset.state = 'opened';
    updateWidgetStyle(true);
    iframe.focus();
    emitCallback('chat-maximized');
};
const setWidgetPosition = (position = 'right') => {
    if (!widget) {
        throw new Error('Widget is not initialized');
    }
    widget.style.left = position === 'left' ? '0' : 'auto';
    widget.style.right = position !== 'left' ? '0' : 'auto';
};
const resizeWidget = (height) => {
    if (!widget) {
        throw new Error('Widget is not initialized');
    }
    widgetHeight = height;
    widget.dataset.state = 'triggered';
    updateWidgetStyle(true);
};
function closeWidget() {
    if (!iframe || !widget) {
        throw new Error('Widget is not initialized');
    }
    if (widget.dataset.state === 'closed') {
        return;
    }
    widget.dataset.state = 'closed';
    updateWidgetStyle(false);
    emitCallback('chat-minimized');
}
function pageVisited(change) {
    callHook('pageVisited', {
        change,
        location: JSON.parse(JSON.stringify(document.location)),
        title: document.title,
    });
}
function setCustomField(key, value = '', overwrite = true) {
    if (typeof overwrite === 'undefined') {
        overwrite = true;
    }
    if (!key) {
        return;
    }
    callHook('setCustomField', key, value, overwrite);
}
function setCustomFields(fields) {
    if (!Array.isArray(fields)) {
        console.log('Error: Invalid parameters. Value must be an array of objects');
        return;
    }
    fields.forEach(([key, value, overwrite = true]) => {
        setCustomField(key, value, overwrite);
    });
}
function setTheme(theme) {
    if ((theme === null || theme === void 0 ? void 0 : theme.position) !== 'left' && (theme === null || theme === void 0 ? void 0 : theme.position) !== 'right') {
        if (theme === null || theme === void 0 ? void 0 : theme.position) {
            console.warn(`Error: Position "${theme === null || theme === void 0 ? void 0 : theme.position}" is invalid. It must be "left" or "right"`);
        }
        delete theme.position;
    }
    callHook('setTheme', theme);
}
function setDepartment(department) {
    callHook('setDepartment', department);
}
function setBusinessUnit(businessUnit) {
    callHook('setBusinessUnit', businessUnit);
}
function clearBusinessUnit() {
    callHook('clearBusinessUnit');
}
function setGuestToken(token) {
    callHook('setGuestToken', token);
}
function setGuestName(name) {
    callHook('setGuestName', name);
}
function setGuestEmail(email) {
    callHook('setGuestEmail', email);
}
function registerGuest(guest) {
    callHook('registerGuest', guest);
}
function clearDepartment() {
    callHook('clearDepartment');
}
function setAgent(agent) {
    callHook('setAgent', agent);
}
function setLanguage(lang) {
    callHook('setLanguage', lang);
}
function showWidget() {
    callHook('showWidget');
    emitCallback('show-widget');
}
function hideWidget() {
    callHook('hideWidget');
    emitCallback('hide-widget');
}
function maximizeWidget() {
    callHook('maximizeWidget');
    emitCallback('chat-maximized');
}
function minimizeWidget() {
    callHook('minimizeWidget');
    emitCallback('chat-minimized');
}
function setParentUrl(url) {
    callHook('setParentUrl', url);
}
function transferChat(department) {
    callHook('transferChat', department);
}
function setGuestMetadata(metadata) {
    if (typeof metadata !== 'object') {
        throw new Error('Invalid metadata');
    }
    callHook('setGuestMetadata', metadata);
}
function setHiddenSystemMessages(hidden) {
    if (!Array.isArray(hidden)) {
        throw new Error('Error: Invalid parameters. Value must be an array of strings');
    }
    const hiddenSystemMessages = hidden.filter((h) => {
        if (VALID_SYSTEM_MESSAGES.includes(h)) {
            return true;
        }
        console.warn(`Error: Invalid system message "${h}"`);
        return false;
    });
    callHook('setHiddenSystemMessages', hiddenSystemMessages);
}
function initialize(initParams) {
    for (const initKey in initParams) {
        if (!initParams.hasOwnProperty(initKey)) {
            continue;
        }
        const params = initParams[initKey];
        if (!(0, isDefined_1.isDefined)(params)) {
            continue;
        }
        switch (initKey) {
            case 'customField':
                setCustomField(...params);
                continue;
            case 'setCustomFields':
                setCustomFields(params);
                continue;
            case 'theme':
                setTheme(params);
                continue;
            case 'department':
                setDepartment(params);
                continue;
            case 'businessUnit':
                setBusinessUnit(params);
                continue;
            case 'guestToken':
                setGuestToken(params);
                continue;
            case 'guestName':
                setGuestName(params);
                continue;
            case 'guestEmail':
                setGuestEmail(params);
                continue;
            case 'registerGuest':
                registerGuest(params);
                continue;
            case 'language':
                setLanguage(params);
                continue;
            case 'agent':
                setAgent(params);
                continue;
            case 'parentUrl':
                setParentUrl(params);
                continue;
            case 'setGuestMetadata':
                setGuestMetadata(params);
                continue;
            case 'hiddenSystemMessages':
                setHiddenSystemMessages(params);
                continue;
            default:
                continue;
        }
    }
}
const api = {
    popup: null,
    openWidget,
    resizeWidget,
    ready() {
        ready = true;
        processHookQueue();
    },
    minimizeWindow() {
        closeWidget();
    },
    restoreWindow() {
        if (api.popup && api.popup.closed !== true) {
            api.popup.close();
            api.popup = null;
        }
        openWidget();
    },
    openPopout(token = '') {
        var _a, _b;
        closeWidget();
        if (!config.url) {
            throw new Error('Config.url is not set!');
        }
        api.popup = window.open(`${config.url}${config.url.lastIndexOf('?') > -1 ? '&' : '?'}mode=popout`, 'livechat-popout', `width=${WIDGET_OPEN_WIDTH}, height=${widgetHeight}, toolbars=no`);
        const data = {
            src: 'rocketchat',
            fn: 'setGuestToken',
            args: [token],
        };
        (_a = api.popup) === null || _a === void 0 ? void 0 : _a.postMessage(data, '*');
        (_b = api.popup) === null || _b === void 0 ? void 0 : _b.focus();
    },
    removeWidget() {
        document.body.removeChild(widget);
    },
    callback(eventName, data) {
        emitCallback(eventName, data);
    },
    showWidget() {
        if (!iframe) {
            throw new Error('Widget is not initialized');
        }
        iframe.style.display = 'initial';
        emitCallback('show-widget');
    },
    hideWidget() {
        if (!iframe) {
            throw new Error('Widget is not initialized');
        }
        iframe.style.display = 'none';
        emitCallback('hide-widget');
    },
    resetDocumentStyle() {
        document.body.classList.remove('rc-livechat-mobile-full-screen');
    },
    setFullScreenDocumentMobile() {
        smallScreen && document.body.classList.add('rc-livechat-mobile-full-screen');
    },
    setWidgetPosition,
};
const livechatWidgetAPI = {
    // initParams
    initialize,
    pageVisited,
    setCustomField,
    setTheme,
    setDepartment,
    clearDepartment,
    setGuestToken,
    setGuestName,
    setGuestEmail,
    setAgent,
    registerGuest,
    setLanguage,
    showWidget,
    hideWidget,
    maximizeWidget,
    minimizeWidget,
    setBusinessUnit,
    clearBusinessUnit,
    setParentUrl,
    setGuestMetadata,
    clearAllCallbacks,
    setHiddenSystemMessages,
    transferChat,
    // callbacks
    onChatMaximized(fn) {
        registerCallback('chat-maximized', fn);
    },
    onChatMinimized(fn) {
        registerCallback('chat-minimized', fn);
    },
    onChatStarted(fn) {
        registerCallback('chat-started', fn);
    },
    onChatEnded(fn) {
        registerCallback('chat-ended', fn);
    },
    onPrechatFormSubmit(fn) {
        registerCallback('pre-chat-form-submit', fn);
    },
    onOfflineFormSubmit(fn) {
        registerCallback('offline-form-submit', fn);
    },
    onWidgetShown(fn) {
        registerCallback('show-widget', fn);
    },
    onWidgetHidden(fn) {
        registerCallback('hide-widget', fn);
    },
    onAssignAgent(fn) {
        registerCallback('assign-agent', fn);
    },
    onAgentStatusChange(fn) {
        registerCallback('agent-status-change', fn);
    },
    onQueuePositionChange(fn) {
        registerCallback('queue-position-change', fn);
    },
    onServiceOffline(fn) {
        registerCallback('no-agent-online', fn);
    },
};
const currentPage = {
    href: null,
    title: null,
};
function onNewMessage(event) {
    if (event.source === event.target) {
        return;
    }
    if (!event.data || typeof event.data !== 'object') {
        return;
    }
    if (!event.data.src || event.data.src !== 'rocketchat') {
        return;
    }
    const { fn, args } = event.data;
    if (!api.hasOwnProperty(fn)) {
        return;
    }
    // There is an existing issue with overload resolution with type union arguments please see https://github.com/microsoft/TypeScript/issues/14107
    // @ts-expect-error: A spread argument must either have a tuple type or be passed to a rest parameter
    api[fn](...args);
}
const attachMessageListener = () => {
    window.addEventListener('message', onNewMessage, false);
};
const trackNavigation = () => {
    setInterval(() => {
        if (document.location.href !== currentPage.href) {
            pageVisited('url');
            currentPage.href = document.location.href;
        }
        if (document.title !== currentPage.title) {
            pageVisited('title');
            currentPage.title = document.title;
        }
    }, 800);
};
const init = (url) => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
        return;
    }
    config.url = trimmedUrl;
    createWidget(trimmedUrl);
    attachMessageListener();
    trackNavigation();
};
if (typeof window.initRocket !== 'undefined') {
    console.warn('initRocket is now deprecated. Please update the livechat code.');
    init(window.initRocket[0]);
}
if (typeof window.RocketChat.url !== 'undefined') {
    init(window.RocketChat.url);
}
const queue = window.RocketChat._;
window.RocketChat._.push = function (c) {
    c.call(window.RocketChat.livechat);
};
window.RocketChat = window.RocketChat._.push;
// exports
window.RocketChat.livechat = livechatWidgetAPI;
// proccess queue
queue.forEach((c) => {
    c.call(window.RocketChat.livechat);
});
