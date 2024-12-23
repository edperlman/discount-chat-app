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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeAgo = void 0;
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const moment_1 = __importDefault(require("moment"));
const client_1 = require("../../../app/settings/client");
const client_2 = require("../../../app/utils/client");
const i18n_1 = require("../../../app/utils/lib/i18n");
const dayFormat = ['h:mm A', 'H:mm'];
const timeAgo = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const clockMode = tracker_1.Tracker.nonreactive(() => (0, client_2.getUserPreference)(meteor_1.Meteor.userId(), 'clockMode', false));
    const messageTimeFormat = tracker_1.Tracker.nonreactive(() => client_1.settings.get('Message_TimeFormat'));
    const sameDay = (typeof clockMode === 'number' ? dayFormat[clockMode - 1] : undefined) || messageTimeFormat;
    return (0, moment_1.default)(date).calendar(null, {
        lastDay: `[${(0, i18n_1.t)('yesterday')}]`,
        sameDay,
        lastWeek: 'dddd',
        sameElse(now) {
            const diff = Math.ceil(this.diff(now, 'years', true));
            return diff < 0 ? 'MMM D YYYY' : 'MMM D';
        },
    });
});
exports.timeAgo = timeAgo;
