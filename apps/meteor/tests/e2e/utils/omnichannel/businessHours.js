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
exports.createBusinessHour = void 0;
const createBusinessHour = (api_1, ...args_1) => __awaiter(void 0, [api_1, ...args_1], void 0, function* (api, { id = null, name, departments = [] } = {}) {
    const departmentIds = departments.join(',');
    const response = yield api.post('/method.call/livechat:saveBusinessHour', {
        message: JSON.stringify({
            msg: 'method',
            id: id || '33',
            method: 'livechat:saveBusinessHour',
            params: [
                {
                    name,
                    timezoneName: 'America/Sao_Paulo',
                    daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    daysTime: [
                        { day: 'Monday', start: { time: '08:00' }, finish: { time: '18:00' }, open: true },
                        { day: 'Tuesday', start: { time: '08:00' }, finish: { time: '18:00' }, open: true },
                        { day: 'Wednesday', start: { time: '08:00' }, finish: { time: '18:00' }, open: true },
                        { day: 'Thursday', start: { time: '08:00' }, finish: { time: '18:00' }, open: true },
                        { day: 'Friday', start: { time: '08:00' }, finish: { time: '18:00' }, open: true },
                    ],
                    departmentsToApplyBusinessHour: departmentIds,
                    active: true,
                    type: 'custom',
                    timezone: 'America/Sao_Paulo',
                    workHours: [
                        { day: 'Monday', start: '08:00', finish: '18:00', open: true },
                        { day: 'Tuesday', start: '08:00', finish: '18:00', open: true },
                        { day: 'Wednesday', start: '08:00', finish: '18:00', open: true },
                        { day: 'Thursday', start: '08:00', finish: '18:00', open: true },
                        { day: 'Friday', start: '08:00', finish: '18:00', open: true },
                    ],
                },
            ],
        }),
    });
    return response;
});
exports.createBusinessHour = createBusinessHour;
