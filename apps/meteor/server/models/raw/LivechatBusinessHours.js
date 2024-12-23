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
exports.LivechatBusinessHoursRaw = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const BaseRaw_1 = require("./BaseRaw");
class LivechatBusinessHoursRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'livechat_business_hours', trash);
    }
    findOneDefaultBusinessHour(options) {
        return this.findOne({ type: core_typings_1.LivechatBusinessHourTypes.DEFAULT }, options);
    }
    findActiveAndOpenBusinessHoursByDay(day, options) {
        return this.find({
            active: true,
            workHours: {
                $elemMatch: {
                    $or: [{ 'start.cron.dayOfWeek': day }, { 'finish.cron.dayOfWeek': day }],
                    open: true,
                },
            },
        }, options).toArray();
    }
    findActiveBusinessHours(options = {}) {
        return this.find({
            active: true,
        }, options).toArray();
    }
    findDefaultActiveAndOpenBusinessHoursByDay(day, options) {
        return this.find({
            type: core_typings_1.LivechatBusinessHourTypes.DEFAULT,
            active: true,
            workHours: {
                $elemMatch: {
                    $or: [{ 'start.cron.dayOfWeek': day }, { 'finish.cron.dayOfWeek': day }],
                    open: true,
                },
            },
        }, options).toArray();
    }
    insertOne(data) {
        const _super = Object.create(null, {
            insertOne: { get: () => super.insertOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.insertOne.call(this, Object.assign(Object.assign({}, data), { ts: new Date() }));
        });
    }
    findHoursToScheduleJobs() {
        return this.col
            .aggregate([
            {
                $facet: {
                    start: [
                        { $match: { active: true } },
                        { $project: { _id: 0, workHours: 1 } },
                        { $unwind: { path: '$workHours' } },
                        { $match: { 'workHours.open': true } },
                        {
                            $group: {
                                _id: { day: '$workHours.start.cron.dayOfWeek' },
                                times: { $addToSet: '$workHours.start.cron.time' },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                day: '$_id.day',
                                times: 1,
                            },
                        },
                    ],
                    finish: [
                        { $match: { active: true } },
                        { $project: { _id: 0, workHours: 1 } },
                        { $unwind: { path: '$workHours' } },
                        { $match: { 'workHours.open': true } },
                        {
                            $group: {
                                _id: { day: '$workHours.finish.cron.dayOfWeek' },
                                times: { $addToSet: '$workHours.finish.cron.time' },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                day: '$_id.day',
                                times: 1,
                            },
                        },
                    ],
                },
            },
        ])
            .toArray();
    }
    findActiveBusinessHoursToOpen(day, start, type, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                active: true,
                workHours: {
                    $elemMatch: {
                        'start.cron.dayOfWeek': day,
                        'start.cron.time': start,
                        'open': true,
                    },
                },
            };
            if (type) {
                query.type = type;
            }
            return this.col.find(query, options).toArray();
        });
    }
    findActiveBusinessHoursToClose(day, finish, type, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                active: true,
                workHours: {
                    $elemMatch: {
                        'finish.cron.dayOfWeek': day,
                        'finish.cron.time': finish,
                        'open': true,
                    },
                },
            };
            if (type) {
                query.type = type;
            }
            return this.col.find(query, options).toArray();
        });
    }
    disableBusinessHour(businessHourId) {
        return this.updateOne({ _id: businessHourId }, { $set: { active: false } });
    }
}
exports.LivechatBusinessHoursRaw = LivechatBusinessHoursRaw;
