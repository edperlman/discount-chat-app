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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const crypto_1 = require("crypto");
const api_data_1 = require("../../data/api-data");
const chat_helper_1 = require("../../data/chat.helper");
const permissions_helper_1 = require("../../data/permissions.helper");
const rooms_helper_1 = require("../../data/rooms.helper");
(0, mocha_1.describe)('[Engagement Dashboard]', function () {
    this.retries(0);
    const isEnterprise = Boolean(process.env.IS_EE);
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => (0, permissions_helper_1.updatePermission)('view-engagement-dashboard', ['admin']));
    (0, mocha_1.after)(() => (0, permissions_helper_1.updatePermission)('view-engagement-dashboard', ['admin']));
    (isEnterprise ? mocha_1.describe : mocha_1.describe.skip)('[/engagement-dashboard/channels/list]', () => {
        let testRoom;
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            const randomSuffix = (0, crypto_1.randomBytes)(4).toString('hex');
            testRoom = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.engagement.${Date.now()}-${randomSuffix}` })).body.channel;
        }));
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testRoom._id });
        }));
        (0, mocha_1.it)('should fail if user does not have the view-engagement-dashboard permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-engagement-dashboard', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                end: new Date().toISOString(),
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                offset: 0,
                count: 25,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should fail if start param is not a valid date', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-engagement-dashboard', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                start: 'invalid-date',
                end: new Date().toISOString(),
                offset: 0,
                count: 25,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('Match error: Failed Match.Where validation in field start');
            });
        }));
        (0, mocha_1.it)('should fail if end param is not a valid date', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                end: 'invalid-date',
                offset: 0,
                count: 25,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('Match error: Failed Match.Where validation in field end');
            });
        }));
        (0, mocha_1.it)('should fail if start param is not provided', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                end: new Date(),
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal("Match error: Missing key 'start'");
            });
        }));
        (0, mocha_1.it)('should fail if end param is not provided', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal("Match error: Missing key 'end'");
            });
        }));
        (0, mocha_1.it)('should succesfuly return results', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                end: new Date().toISOString(),
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset', 0);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('channels');
                (0, chai_1.expect)(res.body.channels).to.be.an('array').that.is.not.empty;
                (0, chai_1.expect)(res.body.channels[0]).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(res.body.channels[0]).to.have.property('messages').that.is.a('number');
                (0, chai_1.expect)(res.body.channels[0]).to.have.property('lastWeekMessages').that.is.a('number');
                (0, chai_1.expect)(res.body.channels[0]).to.have.property('diffFromLastWeek').that.is.a('number');
                (0, chai_1.expect)(res.body.channels[0].room).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(res.body.channels[0].room).to.have.property('_id').that.is.a('string');
                (0, chai_1.expect)(res.body.channels[0].room).to.have.property('name').that.is.a('string');
                (0, chai_1.expect)(res.body.channels[0].room).to.have.property('ts').that.is.a('string');
                (0, chai_1.expect)(res.body.channels[0].room).to.have.property('t').that.is.a('string');
                (0, chai_1.expect)(res.body.channels[0].room).to.have.property('_updatedAt').that.is.a('string');
            });
        }));
        (0, mocha_1.it)('should not return empty rooms when the hideRoomsWithNoActivity param is provided', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                end: new Date().toISOString(),
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                hideRoomsWithNoActivity: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset', 0);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('channels');
                const channelRecord = res.body.channels.find(({ room }) => room._id === testRoom._id);
                (0, chai_1.expect)(channelRecord).to.be.undefined;
            });
        }));
        (0, mocha_1.it)('should correctly count messages in an empty room', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                end: new Date().toISOString(),
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset', 0);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('channels');
                (0, chai_1.expect)(res.body.channels).to.be.an('array').that.is.not.empty;
                const channelRecord = res.body.channels.find(({ room }) => room._id === testRoom._id);
                (0, chai_1.expect)(channelRecord).not.to.be.undefined;
                (0, chai_1.expect)(channelRecord).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(channelRecord).to.have.property('messages', 0);
                (0, chai_1.expect)(channelRecord).to.have.property('lastWeekMessages', 0);
                (0, chai_1.expect)(channelRecord).to.have.property('diffFromLastWeek', 0);
                (0, chai_1.expect)(channelRecord.room).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(channelRecord.room).to.have.property('_id', testRoom._id);
                (0, chai_1.expect)(channelRecord.room).to.have.property('name', testRoom.name);
                (0, chai_1.expect)(channelRecord.room).to.have.property('ts', testRoom.ts);
                (0, chai_1.expect)(channelRecord.room).to.have.property('t', testRoom.t);
                (0, chai_1.expect)(channelRecord.room).to.have.property('_updatedAt', testRoom._updatedAt);
            });
        }));
        (0, mocha_1.it)('should correctly count messages diff compared to last week when the hideRoomsWithNoActivity param is provided and there are messages in a room', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, chat_helper_1.sendSimpleMessage)({ roomId: testRoom._id });
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                end: new Date().toISOString(),
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                hideRoomsWithNoActivity: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset', 0);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('channels');
                (0, chai_1.expect)(res.body.channels).to.be.an('array').that.is.not.empty;
                const channelRecord = res.body.channels.find(({ room }) => room._id === testRoom._id);
                (0, chai_1.expect)(channelRecord).not.to.be.undefined;
                (0, chai_1.expect)(channelRecord).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(channelRecord).to.have.property('messages', 1);
                (0, chai_1.expect)(channelRecord).to.have.property('lastWeekMessages', 0);
                (0, chai_1.expect)(channelRecord).to.have.property('diffFromLastWeek', 1);
                (0, chai_1.expect)(channelRecord.room).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(channelRecord.room).to.have.property('_id', testRoom._id);
                (0, chai_1.expect)(channelRecord.room).to.have.property('name', testRoom.name);
                (0, chai_1.expect)(channelRecord.room).to.have.property('ts', testRoom.ts);
                (0, chai_1.expect)(channelRecord.room).to.have.property('t', testRoom.t);
            });
        }));
        (0, mocha_1.it)('should correctly count messages diff compared to last week when there are messages in a room', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                end: new Date().toISOString(),
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset', 0);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('channels');
                (0, chai_1.expect)(res.body.channels).to.be.an('array').that.is.not.empty;
                const channelRecord = res.body.channels.find(({ room }) => room._id === testRoom._id);
                (0, chai_1.expect)(channelRecord).not.to.be.undefined;
                (0, chai_1.expect)(channelRecord).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(channelRecord).to.have.property('messages', 1);
                (0, chai_1.expect)(channelRecord).to.have.property('lastWeekMessages', 0);
                (0, chai_1.expect)(channelRecord).to.have.property('diffFromLastWeek', 1);
                (0, chai_1.expect)(channelRecord.room).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(channelRecord.room).to.have.property('_id', testRoom._id);
                (0, chai_1.expect)(channelRecord.room).to.have.property('name', testRoom.name);
                (0, chai_1.expect)(channelRecord.room).to.have.property('ts', testRoom.ts);
                (0, chai_1.expect)(channelRecord.room).to.have.property('t', testRoom.t);
            });
        }));
        (0, mocha_1.it)('should correctly count messages from last week and diff when moving to the next week and providing the hideRoomsWithNoActivity param', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                end: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
                start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                hideRoomsWithNoActivity: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset', 0);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('channels');
                (0, chai_1.expect)(res.body.channels).to.be.an('array').that.is.not.empty;
                const channelRecord = res.body.channels.find(({ room }) => room._id === testRoom._id);
                (0, chai_1.expect)(channelRecord).not.to.be.undefined;
                (0, chai_1.expect)(channelRecord).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(channelRecord).to.have.property('messages', 0);
                (0, chai_1.expect)(channelRecord).to.have.property('lastWeekMessages', 1);
                (0, chai_1.expect)(channelRecord).to.have.property('diffFromLastWeek', -1);
                (0, chai_1.expect)(channelRecord.room).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(channelRecord.room).to.have.property('_id', testRoom._id);
                (0, chai_1.expect)(channelRecord.room).to.have.property('name', testRoom.name);
                (0, chai_1.expect)(channelRecord.room).to.have.property('ts', testRoom.ts);
                (0, chai_1.expect)(channelRecord.room).to.have.property('t', testRoom.t);
            });
        }));
        (0, mocha_1.it)('should correctly count messages from last week and diff when moving to the next week', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('engagement-dashboard/channels/list'))
                .set(api_data_1.credentials)
                .query({
                end: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
                start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset', 0);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('channels');
                (0, chai_1.expect)(res.body.channels).to.be.an('array').that.is.not.empty;
                const channelRecord = res.body.channels.find(({ room }) => room._id === testRoom._id);
                (0, chai_1.expect)(channelRecord).not.to.be.undefined;
                (0, chai_1.expect)(channelRecord).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(channelRecord).to.have.property('messages', 0);
                (0, chai_1.expect)(channelRecord).to.have.property('lastWeekMessages', 1);
                (0, chai_1.expect)(channelRecord).to.have.property('diffFromLastWeek', -1);
                (0, chai_1.expect)(channelRecord.room).to.be.an('object').that.is.not.empty;
                (0, chai_1.expect)(channelRecord.room).to.have.property('_id', testRoom._id);
                (0, chai_1.expect)(channelRecord.room).to.have.property('name', testRoom.name);
                (0, chai_1.expect)(channelRecord.room).to.have.property('ts', testRoom.ts);
                (0, chai_1.expect)(channelRecord.room).to.have.property('t', testRoom.t);
            });
        }));
    });
});
