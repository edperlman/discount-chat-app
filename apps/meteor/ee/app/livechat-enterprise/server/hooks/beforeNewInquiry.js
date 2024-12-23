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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../../lib/callbacks");
callbacks_1.callbacks.add('livechat.beforeInquiry', (extraData) => __awaiter(void 0, void 0, void 0, function* () {
    const { sla: slaSearchTerm, priority: prioritySearchTerm } = extraData, props = __rest(extraData, ["sla", "priority"]);
    if (!slaSearchTerm && !prioritySearchTerm) {
        return extraData;
    }
    let sla = null;
    let priority = null;
    if (slaSearchTerm) {
        sla = yield models_1.OmnichannelServiceLevelAgreements.findOneByIdOrName(slaSearchTerm, {
            projection: { dueTimeInMinutes: 1 },
        });
        if (!sla) {
            throw new meteor_1.Meteor.Error('error-invalid-sla', 'Invalid sla', {
                function: 'livechat.beforeInquiry',
            });
        }
    }
    if (prioritySearchTerm) {
        priority = yield models_1.LivechatPriority.findOneByIdOrName(prioritySearchTerm, {
            projection: { _id: 1, sortItem: 1 },
        });
        if (!priority) {
            throw new meteor_1.Meteor.Error('error-invalid-priority', 'Invalid priority', {
                function: 'livechat.beforeInquiry',
            });
        }
    }
    const ts = new Date();
    const changes = {
        ts,
    };
    if (sla) {
        changes.slaId = sla._id;
        changes.estimatedWaitingTimeQueue = sla.dueTimeInMinutes;
    }
    if (priority) {
        changes.priorityId = priority._id;
        changes.priorityWeight = priority.sortItem;
    }
    return Object.assign(Object.assign({}, props), changes);
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-before-new-inquiry');
