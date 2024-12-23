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
const check_1 = require("meteor/check");
const server_1 = require("../../../../app/api/server");
const getPaginationItems_1 = require("../../../../app/api/server/helpers/getPaginationItems");
const deprecationWarningLogger_1 = require("../../../../app/lib/server/lib/deprecationWarningLogger");
const channels_1 = require("../../lib/engagementDashboard/channels");
const date_1 = require("../../lib/engagementDashboard/date");
server_1.API.v1.addRoute('engagement-dashboard/channels/list', {
    authRequired: true,
    permissionsRequired: ['view-engagement-dashboard'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                start: check_1.Match.Where(date_1.isDateISOString),
                end: check_1.Match.Where(date_1.isDateISOString),
                hideRoomsWithNoActivity: check_1.Match.Maybe(String),
                offset: check_1.Match.Maybe(String),
                count: check_1.Match.Maybe(String),
            }));
            const { start, end, hideRoomsWithNoActivity } = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            if (hideRoomsWithNoActivity === undefined) {
                deprecationWarningLogger_1.apiDeprecationLogger.deprecatedParameterUsage(this.request.route, 'hideRoomsWithNoActivity', '7.0.0', this.response, ({ parameter, endpoint, version }) => `Returning rooms that had no activity in ${endpoint} is deprecated and will be removed on version ${version} along with the \`${parameter}\` param. Set \`${parameter}\` as \`true\` to check how the endpoint will behave starting on ${version}`);
            }
            const { channels, total } = yield (0, channels_1.findChannelsWithNumberOfMessages)({
                start: (0, date_1.mapDateForAPI)(start),
                end: (0, date_1.mapDateForAPI)(end),
                hideRoomsWithNoActivity: hideRoomsWithNoActivity === 'true',
                options: { offset, count },
            });
            return server_1.API.v1.success({
                channels,
                total,
                offset,
                count: channels.length,
            });
        });
    },
});
