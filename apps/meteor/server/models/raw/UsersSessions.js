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
exports.UsersSessionsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class UsersSessionsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'usersSessions', trash, {
            preventSetUpdatedAt: true,
            collectionNameResolver(name) {
                return name;
            },
        });
    }
    clearConnectionsFromInstanceId(instanceId) {
        return this.col.updateMany({}, {
            $pull: {
                connections: {
                    instanceId: {
                        $nin: instanceId,
                    },
                },
            },
        });
    }
    updateConnectionStatusById(uid, connectionId, status) {
        const query = {
            '_id': uid,
            'connections.id': connectionId,
        };
        const update = {
            $set: {
                'connections.$.status': status,
                'connections.$._updatedAt': new Date(),
            },
        };
        return this.updateOne(query, update);
    }
    removeConnectionsFromInstanceId(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateMany({
                'connections.instanceId': instanceId,
            }, {
                $pull: {
                    connections: {
                        instanceId,
                    },
                },
            });
        });
    }
    removeConnectionsFromOtherInstanceIds(instanceIds) {
        return this.updateMany({}, {
            $pull: {
                connections: {
                    instanceId: {
                        $nin: instanceIds,
                    },
                },
            },
        });
    }
    removeConnectionByConnectionId(connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateMany({
                'connections.id': connectionId,
            }, {
                $pull: {
                    connections: {
                        id: connectionId,
                    },
                },
            });
        });
    }
    findByInstanceId(instanceId) {
        return this.find({
            'connections.instanceId': instanceId,
        });
    }
    addConnectionById(userId, { id, instanceId, status }) {
        const now = new Date();
        const update = {
            $push: {
                connections: {
                    id,
                    instanceId,
                    status,
                    _createdAt: now,
                    _updatedAt: now,
                },
            },
        };
        return this.updateOne({ _id: userId }, update, { upsert: true });
    }
    findByOtherInstanceIds(instanceIds, options) {
        return this.find({
            'connections.instanceId': {
                $exists: true,
                $nin: instanceIds,
            },
        }, options);
    }
}
exports.UsersSessionsRaw = UsersSessionsRaw;
