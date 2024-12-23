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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionManager = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const random_1 = require("@rocket.chat/random");
const i18next_1 = require("i18next");
const react_1 = require("react");
const UiKitTriggerTimeoutError_1 = require("./UiKitTriggerTimeoutError");
const banners = __importStar(require("../../../client/lib/banners"));
const imperativeModal_1 = require("../../../client/lib/imperativeModal");
const toast_1 = require("../../../client/lib/toast");
const exhaustiveCheck_1 = require("../../../lib/utils/exhaustiveCheck");
const SDKClient_1 = require("../../utils/client/lib/SDKClient");
const UiKitModal = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../../../client/views/modal/uikit/UiKitModal'))));
class ActionManager {
    constructor(router) {
        this.router = router;
        this.events = new emitter_1.Emitter();
        this.appIdByTriggerId = new Map();
        this.viewInstances = new Map();
    }
    invalidateTriggerId(id) {
        const appId = this.appIdByTriggerId.get(id);
        this.appIdByTriggerId.delete(id);
        return appId;
    }
    on(eventName, listener) {
        return this.events.on(eventName, listener);
    }
    off(eventName, listener) {
        return this.events.off(eventName, listener);
    }
    notifyBusy() {
        this.events.emit('busy', { busy: true });
    }
    notifyIdle() {
        this.events.emit('busy', { busy: false });
    }
    generateTriggerId(appId) {
        const triggerId = random_1.Random.id();
        this.appIdByTriggerId.set(triggerId, appId);
        setTimeout(() => this.invalidateTriggerId(triggerId), ActionManager.TRIGGER_TIMEOUT);
        return triggerId;
    }
    emitInteraction(appId, userInteraction) {
        return __awaiter(this, void 0, void 0, function* () {
            const triggerId = this.generateTriggerId(appId);
            return this.runWithTimeout(() => __awaiter(this, void 0, void 0, function* () {
                let interaction;
                try {
                    interaction = (yield SDKClient_1.sdk.rest.post(`/apps/ui.interaction/${appId}`, Object.assign(Object.assign({}, userInteraction), { triggerId })));
                    this.handleServerInteraction(interaction);
                }
                finally {
                    switch (userInteraction.type) {
                        case 'viewSubmit':
                            if (!!interaction && !['errors', 'modal.update', 'contextual_bar.update'].includes(interaction.type))
                                this.disposeView(userInteraction.viewId);
                            break;
                        case 'viewClosed':
                            if (!!interaction && interaction.type !== 'errors')
                                this.disposeView(userInteraction.payload.viewId);
                            break;
                    }
                }
            }), Object.assign({ triggerId, appId }, ('viewId' in userInteraction ? { viewId: userInteraction.viewId } : {})));
        });
    }
    runWithTimeout(task, details) {
        return __awaiter(this, void 0, void 0, function* () {
            this.notifyBusy();
            let timer;
            try {
                const taskPromise = task();
                const timeoutPromise = new Promise((_, reject) => {
                    timer = setTimeout(() => {
                        reject(new UiKitTriggerTimeoutError_1.UiKitTriggerTimeoutError('Timeout', details));
                    }, ActionManager.TRIGGER_TIMEOUT);
                });
                return yield Promise.race([taskPromise, timeoutPromise]);
            }
            catch (error) {
                if (error instanceof UiKitTriggerTimeoutError_1.UiKitTriggerTimeoutError) {
                    (0, toast_1.dispatchToastMessage)({
                        type: 'error',
                        message: (0, i18next_1.t)('UIKit_Interaction_Timeout'),
                    });
                    if (details.viewId) {
                        this.disposeView(details.viewId);
                    }
                }
            }
            finally {
                if (timer)
                    clearTimeout(timer);
                this.notifyIdle();
            }
        });
    }
    handleServerInteraction(interaction) {
        const { triggerId } = interaction;
        const appId = this.invalidateTriggerId(triggerId);
        if (!appId) {
            return;
        }
        switch (interaction.type) {
            case 'errors': {
                const { type, triggerId, viewId, appId, errors } = interaction;
                this.events.emit(interaction.viewId, {
                    type,
                    triggerId,
                    viewId,
                    appId,
                    errors,
                });
                break;
            }
            case 'modal.open': {
                const { view } = interaction;
                this.openModal(view);
                break;
            }
            case 'modal.update':
            case 'contextual_bar.update': {
                const { type, triggerId, appId, view } = interaction;
                this.events.emit(view.id, {
                    type,
                    triggerId,
                    viewId: view.id,
                    appId,
                    view,
                });
                break;
            }
            case 'modal.close': {
                break;
            }
            case 'banner.open': {
                const { type, triggerId } = interaction, view = __rest(interaction, ["type", "triggerId"]);
                this.openBanner(view);
                break;
            }
            case 'banner.update': {
                const { type, triggerId, appId, view } = interaction;
                this.events.emit(view.viewId, {
                    type,
                    triggerId,
                    viewId: view.viewId,
                    appId,
                    view,
                });
                break;
            }
            case 'banner.close': {
                const { viewId } = interaction;
                this.disposeView(viewId);
                break;
            }
            case 'contextual_bar.open': {
                const { view } = interaction;
                this.openContextualBar(view);
                break;
            }
            case 'contextual_bar.close': {
                const { view } = interaction;
                this.disposeView(view.id);
                break;
            }
            default:
                (0, exhaustiveCheck_1.exhaustiveCheck)(interaction);
        }
        return interaction.type;
    }
    getInteractionPayloadByViewId(viewId) {
        var _a;
        if (!viewId) {
            throw new Error('No viewId provided when checking for `user interaction payload`');
        }
        return (_a = this.viewInstances.get(viewId)) === null || _a === void 0 ? void 0 : _a.payload;
    }
    openView(surface, view) {
        switch (surface) {
            case 'modal':
                this.openModal(view);
                break;
            case 'banner':
                this.openBanner(view);
                break;
            case 'contextual_bar':
                this.openContextualBar(view);
                break;
        }
    }
    openModal(view) {
        const instance = imperativeModal_1.imperativeModal.open({
            component: UiKitModal,
            props: {
                key: view.id,
                initialView: view,
            },
        });
        this.viewInstances.set(view.id, {
            close: () => {
                instance.close();
                this.viewInstances.delete(view.id);
            },
        });
    }
    openBanner(view) {
        banners.open(view);
        this.viewInstances.set(view.viewId, {
            close: () => {
                banners.closeById(view.viewId);
            },
        });
    }
    openContextualBar(view) {
        this.viewInstances.set(view.id, {
            payload: {
                view,
            },
            close: () => {
                this.viewInstances.delete(view.id);
            },
        });
        const routeName = this.router.getRouteName();
        const routeParams = this.router.getRouteParameters();
        if (!routeName) {
            return;
        }
        this.router.navigate({
            name: routeName,
            params: Object.assign(Object.assign({}, routeParams), { tab: 'app', context: view.id }),
        });
    }
    disposeView(viewId) {
        var _a;
        const instance = this.viewInstances.get(viewId);
        (_a = instance === null || instance === void 0 ? void 0 : instance.close) === null || _a === void 0 ? void 0 : _a.call(instance);
        this.viewInstances.delete(viewId);
    }
}
exports.ActionManager = ActionManager;
ActionManager.TRIGGER_TIMEOUT = 5000;
ActionManager.TRIGGER_TIMEOUT_ERROR = 'TRIGGER_TIMEOUT_ERROR';
