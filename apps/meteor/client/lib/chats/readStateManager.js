"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadStateManager = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../app/models/client");
const LegacyRoomManager_1 = require("../../../app/ui-utils/client/lib/LegacyRoomManager");
const RoomHistoryManager_1 = require("../../../app/ui-utils/client/lib/RoomHistoryManager");
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
const highOrderFunctions_1 = require("../../../lib/utils/highOrderFunctions");
class ReadStateManager extends emitter_1.Emitter {
    constructor(rid) {
        super();
        this.onUnreadStateChange = (callback) => {
            return this.on('unread-state-change', callback);
        };
        this.getFirstUnreadRecordId = () => {
            return this.firstUnreadRecordId;
        };
        this.handleWindowEvents = () => {
            const handleWindowFocus = () => {
                this.attemptMarkAsRead();
            };
            const handleWindowKeyUp = (event) => {
                if (event.key === 'Escape') {
                    this.markAsRead();
                    this.updateFirstUnreadRecordId();
                }
            };
            window.addEventListener('focus', handleWindowFocus);
            window.addEventListener('keyup', handleWindowKeyUp);
            return () => {
                window.removeEventListener('focus', handleWindowFocus);
                window.removeEventListener('keyup', handleWindowKeyUp);
            };
        };
        this.debouncedMarkAsRead = (0, highOrderFunctions_1.withDebouncing)({ wait: 1000 })(() => {
            try {
                return this.markAsRead();
            }
            catch (e) {
                console.error(e);
            }
        });
        this.rid = rid;
    }
    getRid() {
        return this.rid;
    }
    // TODO: Use ref to get unreadMark
    // private unreadMark?: HTMLElement;
    get unreadMark() {
        return document.querySelector('.rcx-message-divider--unread');
    }
    updateSubscription(subscription) {
        var _a;
        if (!subscription) {
            return;
        }
        const firstUpdate = !this.subscription;
        this.subscription = subscription;
        (_a = LegacyRoomManager_1.LegacyRoomManager.getOpenedRoomByRid(this.rid)) === null || _a === void 0 ? void 0 : _a.unreadSince.set(this.subscription.ls);
        const { unread, alert } = this.subscription;
        if (!unread && !alert) {
            return;
        }
        if (firstUpdate) {
            this.updateFirstUnreadRecordId();
            return;
        }
        if (document.hasFocus() && this.firstUnreadRecordId) {
            return;
        }
        this.updateFirstUnreadRecordId();
    }
    updateFirstUnreadRecordId() {
        var _a, _b;
        if (!((_a = this.subscription) === null || _a === void 0 ? void 0 : _a.ls)) {
            return;
        }
        const firstUnreadRecord = client_1.Messages.findOne({
            'rid': this.subscription.rid,
            'ts': {
                $gt: this.subscription.ls,
            },
            'u._id': {
                $ne: (_b = meteor_1.Meteor.userId()) !== null && _b !== void 0 ? _b : undefined,
            },
        }, {
            sort: {
                ts: 1,
            },
        });
        this.setFirstUnreadRecordId(firstUnreadRecord === null || firstUnreadRecord === void 0 ? void 0 : firstUnreadRecord._id);
        RoomHistoryManager_1.RoomHistoryManager.once('loaded-messages', () => this.updateFirstUnreadRecordId());
    }
    setFirstUnreadRecordId(firstUnreadRecordId) {
        this.firstUnreadRecordId = firstUnreadRecordId;
        this.emit('unread-state-change', this.firstUnreadRecordId);
    }
    clearUnreadMark() {
        this.setFirstUnreadRecordId(undefined);
    }
    isUnreadMarkVisible() {
        var _a;
        if (!this.unreadMark) {
            return false;
        }
        return this.unreadMark.offsetTop > (((_a = this.unreadMark.offsetParent) === null || _a === void 0 ? void 0 : _a.scrollTop) || 0);
    }
    // This will only mark as read if the unread mark is visible
    attemptMarkAsRead() {
        const { alert, unread } = this.subscription || {};
        if (!alert && unread === 0) {
            return;
        }
        if (!document.hasFocus()) {
            return;
        }
        if (this.unreadMark && !this.isUnreadMarkVisible()) {
            return;
        }
        // if there are unloaded unread messages, don't mark as read
        if (RoomHistoryManager_1.RoomHistoryManager.getRoom(this.rid).unreadNotLoaded.get() > 0) {
            return;
        }
        return this.markAsRead();
    }
    // this will always mark as read.
    markAsRead() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.rid) {
                return;
            }
            return SDKClient_1.sdk.rest.post('/v1/subscriptions.read', { rid: this.rid }).then(() => {
                RoomHistoryManager_1.RoomHistoryManager.getRoom(this.rid).unreadNotLoaded.set(0);
            });
        });
    }
}
exports.ReadStateManager = ReadStateManager;
