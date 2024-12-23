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
const api_data_1 = require("../../data/api-data");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
(0, mocha_1.describe)('[Calendar Events]', () => {
    let user2;
    let userCredentials;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        user2 = yield (0, users_helper_1.createUser)();
        userCredentials = yield (0, users_helper_1.login)(user2.username, user_1.password);
    }));
    (0, mocha_1.after)(() => (0, users_helper_1.deleteUser)(user2));
    (0, mocha_1.describe)('[/calendar-events.create]', () => {
        (0, mocha_1.it)('should successfully create an event in the calendar', () => __awaiter(void 0, void 0, void 0, function* () {
            let eventId;
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(api_data_1.credentials)
                .send({
                startTime: new Date().toISOString(),
                subject: 'Subject',
                description: 'Description',
                reminderMinutesBeforeStart: 10,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                eventId = res.body.id;
            });
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request.post((0, api_data_1.api)('calendar-events.delete')).set(api_data_1.credentials).send({ eventId });
            }));
        }));
        (0, mocha_1.it)('should fail to create an event without a start time', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(api_data_1.credentials)
                .send({
                subject: 'Subject',
                description: 'Description',
                reminderMinutesBeforeStart: 10,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail to create an event without a subject', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(api_data_1.credentials)
                .send({
                description: 'Description',
                startTime: new Date().toISOString(),
                reminderMinutesBeforeStart: 10,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail to create an event without a description', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(api_data_1.credentials)
                .send({
                subject: 'Subject',
                startTime: new Date().toISOString(),
                reminderMinutesBeforeStart: 10,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should successfully create an event without reminder information', () => __awaiter(void 0, void 0, void 0, function* () {
            let eventId;
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(api_data_1.credentials)
                .send({
                startTime: new Date().toISOString(),
                subject: 'Subject',
                description: 'Description',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                eventId = res.body.id;
            });
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request.post((0, api_data_1.api)('calendar-events.delete')).set(api_data_1.credentials).send({ eventId });
            }));
        }));
    });
    (0, mocha_1.describe)('[/calendar-events.list]', () => {
        const testSubject = `calendar-events.list-${Date.now()}`;
        const testSubject2 = `calendar-events.list-${Date.now()}`;
        let eventId;
        let eventId2;
        let eventId3;
        (0, mocha_1.before)('create sample events', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(api_data_1.credentials)
                .send({
                startTime: new Date().toISOString(),
                subject: testSubject,
                description: 'Description',
                reminderMinutesBeforeStart: 10,
            })
                .then((res) => {
                eventId = res.body.id;
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(api_data_1.credentials)
                .send({
                startTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
                subject: testSubject2,
                description: 'Future Event',
                reminderMinutesBeforeStart: 10,
            })
                .then((res) => {
                eventId2 = res.body.id;
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(userCredentials)
                .send({
                startTime: new Date().toISOString(),
                subject: testSubject,
                description: 'Description',
                reminderMinutesBeforeStart: 10,
            })
                .then((res) => {
                eventId3 = res.body.id;
            });
        }));
        (0, mocha_1.after)(() => Promise.all([
            api_data_1.request.post((0, api_data_1.api)('calendar-events.delete')).set(api_data_1.credentials).send({ eventId }),
            api_data_1.request.post((0, api_data_1.api)('calendar-events.delete')).set(api_data_1.credentials).send({ eventId: eventId2 }),
            api_data_1.request.post((0, api_data_1.api)('calendar-events.delete')).set(userCredentials).send({ eventId: eventId3 }),
        ]));
        (0, mocha_1.it)('should list only the events with the same date', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('calendar-events.list'))
                .set(api_data_1.credentials)
                .query({
                date: new Date().toISOString(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('data').that.is.an('array');
                const events = res.body.data.map((event) => event._id);
                (0, chai_1.expect)(events).to.be.an('array').that.includes(eventId);
                (0, chai_1.expect)(events).to.not.includes(eventId2);
            });
        }));
        (0, mocha_1.it)('should nost list events from other users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('calendar-events.list'))
                .set(userCredentials)
                .query({
                date: new Date().toISOString(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('data').that.is.an('array');
                const events = res.body.data.map((event) => event._id);
                (0, chai_1.expect)(events).to.be.an('array').that.includes(eventId3);
                (0, chai_1.expect)(events).to.not.includes(eventId);
            });
        }));
    });
    (0, mocha_1.describe)('[/calendar-events.info]', () => {
        const testSubject = `calendar-events.info-${Date.now()}`;
        let eventId;
        let eventId2;
        (0, mocha_1.before)('create sample events', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(api_data_1.credentials)
                .send({
                startTime: new Date().toISOString(),
                subject: testSubject,
                description: 'Description',
                reminderMinutesBeforeStart: 10,
            })
                .then((res) => {
                eventId = res.body.id;
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(userCredentials)
                .send({
                startTime: new Date().toISOString(),
                subject: testSubject,
                description: 'Description',
                reminderMinutesBeforeStart: 10,
            })
                .then((res) => {
                eventId2 = res.body.id;
            });
        }));
        (0, mocha_1.after)(() => Promise.all([
            api_data_1.request.post((0, api_data_1.api)('calendar-events.delete')).set(api_data_1.credentials).send({ eventId }),
            api_data_1.request.post((0, api_data_1.api)('calendar-events.delete')).set(userCredentials).send({ eventId: eventId2 }),
        ]));
        (0, mocha_1.it)('should return the event information', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('calendar-events.info'))
                .set(api_data_1.credentials)
                .query({
                id: eventId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('event').that.is.an('object').with.property('subject', testSubject);
            });
        }));
        (0, mocha_1.it)('should return the event information - regular user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('calendar-events.info'))
                .set(userCredentials)
                .query({
                id: eventId2,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('event').that.is.an('object').with.property('subject', testSubject);
            });
        }));
        (0, mocha_1.it)('should fail when querying an invalid event', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('calendar-events.info'))
                .set(api_data_1.credentials)
                .query({
                id: 'something-random',
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail when querying an event from another user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('calendar-events.info'))
                .set(api_data_1.credentials)
                .query({
                id: eventId2,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
    });
    (0, mocha_1.describe)('[/calendar-events.import]', () => {
        const eventsToRemove = [];
        (0, mocha_1.after)(() => Promise.all([
            ...eventsToRemove.map(({ credentials, eventId }) => api_data_1.request.post((0, api_data_1.api)('calendar-events.delete')).set(credentials).send({ eventId })),
        ]));
        (0, mocha_1.it)('should successfully import an event to the calendar', () => __awaiter(void 0, void 0, void 0, function* () {
            let eventId;
            const externalId = `calendar-events.import-${Date.now()}`;
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.import'))
                .set(api_data_1.credentials)
                .send({
                startTime: new Date().toISOString(),
                subject: 'Subject',
                description: 'Description',
                reminderMinutesBeforeStart: 10,
                externalId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                eventId = res.body.id;
                eventsToRemove.push({ credentials: api_data_1.credentials, eventId });
            });
        }));
        (0, mocha_1.it)('should fail to import an event without an external id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.import'))
                .set(api_data_1.credentials)
                .send({
                startTime: new Date().toISOString(),
                subject: 'Subject',
                description: 'Description',
                reminderMinutesBeforeStart: 10,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail to import an event without a start time', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.import'))
                .set(api_data_1.credentials)
                .send({
                subject: 'Subject',
                description: 'Description',
                reminderMinutesBeforeStart: 10,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail to import an event without a subject', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.import'))
                .set(api_data_1.credentials)
                .send({
                description: 'Description',
                startTime: new Date().toISOString(),
                reminderMinutesBeforeStart: 10,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail to import an event without a description', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.import'))
                .set(api_data_1.credentials)
                .send({
                subject: 'Subject',
                startTime: new Date().toISOString(),
                reminderMinutesBeforeStart: 10,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should successfully import an event without reminder information', () => __awaiter(void 0, void 0, void 0, function* () {
            let eventId;
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.import'))
                .set(api_data_1.credentials)
                .send({
                startTime: new Date().toISOString(),
                subject: 'Subject',
                description: 'Description',
                externalId: `calendar-events.import-external-id-${Date.now()}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                eventId = res.body.id;
            });
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request.post((0, api_data_1.api)('calendar-events.delete')).set(api_data_1.credentials).send({ eventId });
            }));
        }));
        (0, mocha_1.it)('should import a new event even if it was already imported by another user', () => __awaiter(void 0, void 0, void 0, function* () {
            let eventId;
            let eventId2;
            const externalId = `calendar-events.import-${Date.now()}`;
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.import'))
                .set(userCredentials)
                .send({
                startTime: new Date().toISOString(),
                subject: 'First User',
                description: 'Description',
                reminderMinutesBeforeStart: 10,
                externalId,
            })
                .then((res) => {
                eventId = res.body.id;
                eventsToRemove.push({ credentials: userCredentials, eventId });
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.import'))
                .set(api_data_1.credentials)
                .send({
                startTime: new Date().toISOString(),
                subject: 'Second User',
                description: 'Description',
                reminderMinutesBeforeStart: 10,
                externalId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.id).to.not.be.equal(eventId);
                eventId2 = res.body.id;
                eventsToRemove.push({ credentials: api_data_1.credentials, eventId: eventId2 });
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('calendar-events.info'))
                .set(userCredentials)
                .query({ id: eventId })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('event').that.is.an('object').with.property('subject', 'First User');
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('calendar-events.info'))
                .set(api_data_1.credentials)
                .query({ id: eventId2 })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('event').that.is.an('object').with.property('subject', 'Second User');
            });
        }));
        (0, mocha_1.it)('should update an event that has the same external id', () => __awaiter(void 0, void 0, void 0, function* () {
            let eventId;
            const externalId = `calendar-events.import-twice-${Date.now()}`;
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.import'))
                .set(api_data_1.credentials)
                .send({
                startTime: new Date().toISOString(),
                subject: 'Subject',
                description: 'Description',
                reminderMinutesBeforeStart: 10,
                externalId,
            })
                .then((res) => {
                eventId = res.body.id;
                eventsToRemove.push({ credentials: api_data_1.credentials, eventId });
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.import'))
                .set(api_data_1.credentials)
                .send({
                startTime: new Date().toISOString(),
                subject: 'New Subject',
                description: 'New Description',
                reminderMinutesBeforeStart: 15,
                externalId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => __awaiter(void 0, void 0, void 0, function* () {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('id', eventId);
            }));
            yield api_data_1.request
                .get((0, api_data_1.api)('calendar-events.info'))
                .set(api_data_1.credentials)
                .query({ id: eventId })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('event').that.is.an('object').with.property('subject', 'New Subject');
            });
        }));
    });
    (0, mocha_1.describe)('[/calendar-events.update]', () => {
        const testSubject = `calendar-events.update-${Date.now()}`;
        let eventId;
        (0, mocha_1.before)('create sample events', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(userCredentials)
                .send({
                startTime: new Date().toISOString(),
                subject: 'Old Subject',
                description: 'Old Description',
                reminderMinutesBeforeStart: 10,
            })
                .then((res) => {
                eventId = res.body.id;
            });
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('calendar-events.delete')).set(userCredentials).send({ eventId });
        }));
        (0, mocha_1.it)('should update the event with the new data', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.update'))
                .set(userCredentials)
                .send({
                eventId,
                startTime: new Date().toISOString(),
                subject: testSubject,
                description: 'New Description',
                reminderMinutesBeforeStart: 15,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => __awaiter(void 0, void 0, void 0, function* () {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            }));
            yield api_data_1.request
                .get((0, api_data_1.api)('calendar-events.info'))
                .set(userCredentials)
                .query({ id: eventId })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('event').that.is.an('object');
                (0, chai_1.expect)(res.body.event).to.have.property('subject', testSubject);
                (0, chai_1.expect)(res.body.event).to.have.property('description', 'New Description');
            });
        }));
        (0, mocha_1.it)('should fail to update an event that doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.update'))
                .set(userCredentials)
                .send({
                eventId: 'something-random',
                startTime: new Date().toISOString(),
                subject: testSubject,
                description: 'New Description',
                reminderMinutesBeforeStart: 15,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail to update an event from another user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.update'))
                .set(api_data_1.credentials)
                .send({
                eventId,
                startTime: new Date().toISOString(),
                subject: 'Another Subject',
                description: 'Third Description',
                reminderMinutesBeforeStart: 20,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
    });
    (0, mocha_1.describe)('[/calendar-events.delete]', () => {
        let eventId;
        (0, mocha_1.before)('create sample events', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.create'))
                .set(userCredentials)
                .send({
                startTime: new Date().toISOString(),
                subject: 'Subject',
                description: 'Description',
                reminderMinutesBeforeStart: 10,
            })
                .then((res) => {
                eventId = res.body.id;
            });
        }));
        (0, mocha_1.it)('should fail to delete an event from another user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.delete'))
                .set(api_data_1.credentials)
                .send({
                eventId,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should delete the specified event', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.delete'))
                .set(userCredentials)
                .send({
                eventId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => __awaiter(void 0, void 0, void 0, function* () {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            }));
            yield api_data_1.request
                .get((0, api_data_1.api)('calendar-events.info'))
                .set(userCredentials)
                .query({ id: eventId })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail to delete an event that doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('calendar-events.delete'))
                .set(userCredentials)
                .send({
                eventId: 'something-random',
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
    });
});
