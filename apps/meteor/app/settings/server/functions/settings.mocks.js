"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
class SettingsClass {
    constructor() {
        this.delay = 0;
        this.data = new Map();
        this.upsertCalls = 0;
        this.insertCalls = 0;
    }
    setDelay(delay) {
        this.delay = delay;
    }
    find() {
        return [];
    }
    checkQueryMatch(key, data, queryValue) {
        if (typeof queryValue === 'object') {
            if (queryValue.$exists !== undefined) {
                return (data.hasOwnProperty(key) && data[key] !== undefined) === queryValue.$exists;
            }
        }
        return queryValue === data[key];
    }
    findOne(query) {
        return [...this.data.values()].find((data) => Object.entries(query).every(([key, value]) => this.checkQueryMatch(key, data, value)));
    }
    insertOne(doc) {
        this.data.set(doc._id, doc);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.settings.set(doc);
        this.insertCalls++;
    }
    updateOne(query, update, options) {
        const existent = this.findOne(query);
        const data = Object.assign(Object.assign(Object.assign(Object.assign({}, existent), query), update), update.$set);
        if (!existent) {
            Object.assign(data, update.$setOnInsert);
        }
        if (update.$unset) {
            Object.keys(update.$unset).forEach((key) => {
                delete data[key];
            });
        }
        const modifiers = ['$set', '$setOnInsert', '$unset'];
        modifiers.forEach((key) => {
            delete data[key];
        });
        if ((options === null || options === void 0 ? void 0 : options.upsert) === true && !modifiers.some((key) => Object.keys(update).includes(key))) {
            throw new Error('Invalid upsert');
        }
        if (this.delay) {
            setTimeout(() => {
                // console.log(query, data);
                this.data.set(query._id, data);
                // Can't import before the mock command on end of this file!
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                this.settings.set(data);
            }, this.delay);
        }
        else {
            this.data.set(query._id, data);
            // Can't import before the mock command on end of this file!
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            this.settings.set(data);
        }
        this.upsertCalls++;
    }
    findOneAndUpdate({ _id }, value, options) {
        this.updateOne({ _id }, value, options);
        return { value: this.findOne({ _id }) };
    }
    updateValueById(id, value) {
        this.data.set(id, Object.assign(Object.assign({}, this.data.get(id)), { value }));
        // Can't import before the mock command on end of this file!
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        if (this.delay) {
            setTimeout(() => {
                this.settings.set(this.data.get(id));
            }, this.delay);
        }
        else {
            this.settings.set(this.data.get(id));
        }
    }
}
exports.Settings = new SettingsClass();
