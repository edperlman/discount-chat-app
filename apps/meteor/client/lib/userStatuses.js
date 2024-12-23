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
exports.userStatuses = exports.UserStatuses = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
class UserStatuses {
    constructor() {
        this.invisibleAllowed = true;
        this.store = new Map([core_typings_1.UserStatus.ONLINE, core_typings_1.UserStatus.AWAY, core_typings_1.UserStatus.BUSY, core_typings_1.UserStatus.OFFLINE].map((status) => [
            status,
            {
                id: status,
                name: status,
                statusType: status,
                localizeName: true,
            },
        ]));
    }
    delete(id) {
        this.store.delete(id);
    }
    put(customUserStatus) {
        this.store.set(customUserStatus.id, customUserStatus);
    }
    createFromCustom(customUserStatus) {
        if (!this.isValidType(customUserStatus.statusType)) {
            throw new Error('Invalid user status type');
        }
        return {
            name: customUserStatus.name,
            id: customUserStatus._id,
            statusType: customUserStatus.statusType,
            localizeName: false,
        };
    }
    isValidType(type) {
        return Object.values(core_typings_1.UserStatus).includes(type);
    }
    *[Symbol.iterator]() {
        for (const value of this.store.values()) {
            if (this.invisibleAllowed || value.statusType !== core_typings_1.UserStatus.OFFLINE) {
                yield value;
            }
        }
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield SDKClient_1.sdk.call('listCustomUserStatus');
            if (!result) {
                return;
            }
            for (const customStatus of result) {
                this.put(this.createFromCustom(customStatus));
            }
        });
    }
    watch(cb) {
        const updateSubscription = SDKClient_1.sdk.stream('notify-logged', ['updateCustomUserStatus'], (data) => {
            this.put(this.createFromCustom(data.userStatusData));
            cb === null || cb === void 0 ? void 0 : cb();
        });
        const deleteSubscription = SDKClient_1.sdk.stream('notify-logged', ['deleteCustomUserStatus'], (data) => {
            this.delete(data.userStatusData._id);
            cb === null || cb === void 0 ? void 0 : cb();
        });
        return () => {
            updateSubscription.stop();
            deleteSubscription.stop();
        };
    }
}
exports.UserStatuses = UserStatuses;
exports.userStatuses = new UserStatuses();
