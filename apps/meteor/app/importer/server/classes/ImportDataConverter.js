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
exports.ImportDataConverter = void 0;
const models_1 = require("@rocket.chat/models");
const tools_1 = require("@rocket.chat/tools");
const ContactConverter_1 = require("./converters/ContactConverter");
const ConverterCache_1 = require("./converters/ConverterCache");
const MessageConverter_1 = require("./converters/MessageConverter");
const RoomConverter_1 = require("./converters/RoomConverter");
const UserConverter_1 = require("./converters/UserConverter");
class ImportDataConverter {
    get options() {
        return this._options;
    }
    constructor(logger, options) {
        this._cache = new ConverterCache_1.ConverterCache();
        this._options = Object.assign({ workInMemory: false }, (options || {}));
        this.initializeUserConverter(logger);
        this.initializeContactConverter(logger);
        this.initializeRoomConverter(logger);
        this.initializeMessageConverter(logger);
    }
    getRecordConverterOptions() {
        return Object.assign(Object.assign({}, (0, tools_1.pick)(this._options, 'workInMemory')), { 
            // DbData is deleted by this class directly, so the converters don't need to do it individually
            deleteDbData: false });
    }
    getUserConverterOptions() {
        return Object.assign({ flagEmailsAsVerified: false, skipExistingUsers: false, skipNewUsers: false }, (0, tools_1.pick)(this._options, 'flagEmailsAsVerified', 'skipExistingUsers', 'skipNewUsers', 'skipUserCallbacks', 'skipDefaultChannels', 'quickUserInsertion', 'enableEmail2fa'));
    }
    initializeUserConverter(logger) {
        const userOptions = Object.assign(Object.assign({}, this.getRecordConverterOptions()), this.getUserConverterOptions());
        this._userConverter = new UserConverter_1.UserConverter(userOptions, logger, this._cache);
    }
    initializeContactConverter(logger) {
        const contactOptions = Object.assign({}, this.getRecordConverterOptions());
        this._contactConverter = new ContactConverter_1.ContactConverter(contactOptions, logger, this._cache);
    }
    initializeRoomConverter(logger) {
        const roomOptions = Object.assign({}, this.getRecordConverterOptions());
        this._roomConverter = new RoomConverter_1.RoomConverter(roomOptions, logger, this._cache);
    }
    initializeMessageConverter(logger) {
        const messageOptions = Object.assign({}, this.getRecordConverterOptions());
        this._messageConverter = new MessageConverter_1.MessageConverter(messageOptions, logger, this._cache);
    }
    addContact(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._contactConverter.addObject(data);
        });
    }
    addUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._userConverter.addObject(data);
        });
    }
    addChannel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._roomConverter.addObject(data);
        });
    }
    addMessage(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, useQuickInsert = false) {
            return this._messageConverter.addObject(data, {
                useQuickInsert: useQuickInsert || undefined,
            });
        });
    }
    convertContacts(callbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._contactConverter.convertData(callbacks);
        });
    }
    convertUsers(callbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._userConverter.convertData(callbacks);
        });
    }
    convertChannels(startedByUserId, callbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._roomConverter.convertChannels(startedByUserId, callbacks);
        });
    }
    convertMessages(callbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._messageConverter.convertData(callbacks);
        });
    }
    convertData(startedByUserId_1) {
        return __awaiter(this, arguments, void 0, function* (startedByUserId, callbacks = {}) {
            yield this.convertUsers(callbacks);
            yield this.convertContacts(callbacks);
            yield this.convertChannels(startedByUserId, callbacks);
            yield this.convertMessages(callbacks);
            process.nextTick(() => __awaiter(this, void 0, void 0, function* () {
                yield this.clearSuccessfullyImportedData();
            }));
        });
    }
    getAllConverters() {
        return [this._userConverter, this._roomConverter, this._messageConverter];
    }
    clearImportData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._options.workInMemory) {
                // Using raw collection since its faster
                yield models_1.ImportData.col.deleteMany({});
            }
            yield Promise.all(this.getAllConverters().map((converter) => converter.clearImportData()));
        });
    }
    clearSuccessfullyImportedData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._options.workInMemory) {
                yield models_1.ImportData.col.deleteMany({
                    errors: {
                        $exists: false,
                    },
                });
            }
            yield Promise.all(this.getAllConverters().map((converter) => converter.clearSuccessfullyImportedData()));
        });
    }
    abort() {
        this.getAllConverters().forEach((converter) => {
            converter.aborted = true;
        });
    }
}
exports.ImportDataConverter = ImportDataConverter;
