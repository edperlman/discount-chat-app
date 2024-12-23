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
const core_typings_1 = require("@rocket.chat/core-typings");
const filterBusinessHoursThatMustBeOpened_1 = require("./filterBusinessHoursThatMustBeOpened");
describe('different timezones between server and business hours', () => {
    beforeEach(() => jest.useFakeTimers().setSystemTime(new Date('2024-04-20T20:10:11Z')));
    afterEach(() => jest.useRealTimers());
    it('should return a bh when the finish time resolves to a different day on server', () => __awaiter(void 0, void 0, void 0, function* () {
        const bh = yield (0, filterBusinessHoursThatMustBeOpened_1.filterBusinessHoursThatMustBeOpened)([
            {
                _id: '65c40fa9052d6750ae25df83',
                name: '',
                active: true,
                type: core_typings_1.LivechatBusinessHourTypes.DEFAULT,
                workHours: [
                    {
                        day: 'Sunday',
                        start: {
                            time: '00:00',
                            utc: {
                                dayOfWeek: 'Saturday',
                                time: '18:30',
                            },
                            cron: {
                                dayOfWeek: 'Saturday',
                                time: '15:30',
                            },
                        },
                        finish: {
                            time: '23:59',
                            utc: {
                                dayOfWeek: 'Sunday',
                                time: '18:29',
                            },
                            cron: {
                                dayOfWeek: 'Sunday',
                                time: '15:29',
                            },
                        },
                        open: true,
                        code: '',
                    },
                ],
                timezone: {
                    name: 'Asia/Kolkata',
                    utc: '+05:30',
                },
                ts: new Date(),
            },
        ]);
        expect(bh.length).toEqual(1);
    }));
});
