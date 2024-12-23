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
exports.AppPersistenceBridge = void 0;
const PersistenceBridge_1 = require("@rocket.chat/apps-engine/server/bridges/PersistenceBridge");
class AppPersistenceBridge extends PersistenceBridge_1.PersistenceBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    purge(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App's persistent storage is being purged: ${appId}`);
            yield this.orch.getPersistenceModel().remove({ appId });
        });
    }
    create(data, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is storing a new object in their persistence.`, data);
            if (typeof data !== 'object') {
                throw new Error('Attempted to store an invalid data type, it must be an object.');
            }
            return this.orch
                .getPersistenceModel()
                .insertOne({ appId, data })
                .then(({ insertedId }) => insertedId || '');
        });
    }
    createWithAssociations(data, associations, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is storing a new object in their persistence that is associated with some models.`, data, associations);
            if (typeof data !== 'object') {
                throw new Error('Attempted to store an invalid data type, it must be an object.');
            }
            return this.orch
                .getPersistenceModel()
                .insertOne({ appId, associations, data })
                .then(({ insertedId }) => insertedId || '');
        });
    }
    readById(id, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is reading their data in their persistence with the id: "${id}"`);
            const record = yield this.orch.getPersistenceModel().findOneById(id);
            return record === null || record === void 0 ? void 0 : record.data;
        });
    }
    readByAssociations(associations, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is searching for records that are associated with the following:`, associations);
            const records = yield this.orch
                .getPersistenceModel()
                .find({
                appId,
                associations: { $all: associations },
            })
                .toArray();
            return Array.isArray(records) ? records.map((r) => r.data) : [];
        });
    }
    remove(id, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is removing one of their records by the id: "${id}"`);
            const record = yield this.orch.getPersistenceModel().findOne({ _id: id, appId });
            if (!record) {
                return undefined;
            }
            yield this.orch.getPersistenceModel().remove({ _id: id, appId });
            return record.data;
        });
    }
    removeByAssociations(associations, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is removing records with the following associations:`, associations);
            const query = {
                appId,
                associations: {
                    $all: associations,
                },
            };
            const records = yield this.orch.getPersistenceModel().find(query).toArray();
            if (!(records === null || records === void 0 ? void 0 : records.length)) {
                return undefined;
            }
            yield this.orch.getPersistenceModel().remove(query);
            return Array.isArray(records) ? records.map((r) => r.data) : [];
        });
    }
    update(id, data, _upsert, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is updating the record "${id}" to:`, data);
            if (typeof data !== 'object') {
                throw new Error('Attempted to store an invalid data type, it must be an object.');
            }
            throw new Error('Not implemented.');
        });
    }
    updateByAssociations(associations_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (associations, data, upsert = true, appId) {
            this.orch.debugLog(`The App ${appId} is updating the record with association to data as follows:`, associations, data);
            if (typeof data !== 'object') {
                throw new Error('Attempted to store an invalid data type, it must be an object.');
            }
            const query = {
                appId,
                associations,
            };
            return this.orch
                .getPersistenceModel()
                .update(query, { $set: { data } }, { upsert })
                .then(({ upsertedId }) => upsertedId || '');
        });
    }
}
exports.AppPersistenceBridge = AppPersistenceBridge;
