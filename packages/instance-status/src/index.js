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
exports.InstanceStatus = void 0;
// import { IInstanceStatus } from '@rocket.chat/core-typings';
const events_1 = require("events");
const models_1 = require("@rocket.chat/models");
const tracing_1 = require("@rocket.chat/tracing");
const uuid_1 = require("uuid");
const events = new events_1.EventEmitter();
const defaultPingInterval = parseInt(String(process.env.MULTIPLE_INSTANCES_PING_INTERVAL)) || 10; // default to 10s
// if not set via env var ensures at least 3 ticks before expiring (multiple of 60s)
const indexExpire = (parseInt(String(process.env.MULTIPLE_INSTANCES_EXPIRE)) || Math.ceil((defaultPingInterval * 3) / 60)) * 60;
let createIndexes = () => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.InstanceStatus.col
        .indexes()
        .catch(function () {
        // the collection should not exists yet, return empty then
        return [];
    })
        .then(function (result) {
        return result.some(function (index) {
            if (index.key && index.key._updatedAt === 1) {
                if (index.expireAfterSeconds !== indexExpire) {
                    models_1.InstanceStatus.col.dropIndex(index.name);
                    return false;
                }
                return true;
            }
            return false;
        });
    })
        .then(function (created) {
        if (!created) {
            models_1.InstanceStatus.col.createIndex({ _updatedAt: 1 }, { expireAfterSeconds: indexExpire });
        }
    });
    createIndexes = () => __awaiter(void 0, void 0, void 0, function* () {
        // no op
    });
});
const ID = (0, uuid_1.v4)();
function id() {
    return ID;
}
const currentInstance = {
    name: '',
    extraInformation: {},
};
function registerInstance(name, extraInformation) {
    return __awaiter(this, void 0, void 0, function* () {
        createIndexes();
        currentInstance.name = name;
        currentInstance.extraInformation = extraInformation;
        // if (ID === undefined || ID === null) {
        // 	return console.error('[multiple-instances-status] only can be called after Meteor.startup');
        // }
        const instance = {
            $set: Object.assign({ pid: process.pid, name }, (extraInformation && { extraInformation })),
            $currentDate: {
                _createdAt: true,
                _updatedAt: true,
            },
        };
        try {
            yield models_1.InstanceStatus.updateOne({ _id: ID }, instance, { upsert: true });
            const result = yield models_1.InstanceStatus.findOne({ _id: ID });
            start();
            events.emit('registerInstance', result, instance);
            process.on('exit', onExit);
            return result;
        }
        catch (e) {
            return e;
        }
    });
}
function unregisterInstance() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield models_1.InstanceStatus.deleteOne({ _id: ID });
            stop();
            events.emit('unregisterInstance', ID);
            process.removeListener('exit', onExit);
            return result;
        }
        catch (e) {
            return e;
        }
    });
}
let pingInterval;
function start(interval) {
    stop();
    interval = interval || defaultPingInterval;
    pingInterval = setInterval(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, tracing_1.tracerSpan)('InstanceStatus.ping', {}, () => ping());
        });
    }, interval * 1000);
}
function stop() {
    if (!pingInterval) {
        return;
    }
    clearInterval(pingInterval);
    pingInterval = null;
}
function ping() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield models_1.InstanceStatus.updateOne({
            _id: ID,
        }, {
            $currentDate: {
                _updatedAt: true,
            },
        });
        if (result.modifiedCount === 0) {
            yield registerInstance(currentInstance.name, currentInstance.extraInformation);
        }
    });
}
function onExit() {
    return __awaiter(this, void 0, void 0, function* () {
        yield unregisterInstance();
    });
}
function updateConnections(conns) {
    return __awaiter(this, void 0, void 0, function* () {
        yield models_1.InstanceStatus.updateOne({
            _id: ID,
        }, {
            $set: {
                'extraInformation.conns': conns,
            },
        });
    });
}
exports.InstanceStatus = {
    id,
    registerInstance,
    updateConnections,
};
