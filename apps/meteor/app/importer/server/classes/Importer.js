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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Importer = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const adm_zip_1 = __importDefault(require("adm-zip"));
const __1 = require("..");
const ImportDataConverter_1 = require("./ImportDataConverter");
const ImporterProgress_1 = require("./ImporterProgress");
const ImporterWebsocket_1 = require("./ImporterWebsocket");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const i18n_1 = require("../../../utils/lib/i18n");
const ImporterProgressStep_1 = require("../../lib/ImporterProgressStep");
/**
 * Base class for all of the importers.
 */
class Importer {
    constructor(info, importRecord, converterOptions = {}) {
        this.AdmZip = adm_zip_1.default;
        this._lastProgressReportTotal = 0;
        if (!info.key || !info.importer) {
            throw new Error('Information passed in must be a valid ImporterInfo instance.');
        }
        this.info = info;
        this.logger = new logger_1.Logger(`${this.info.name} Importer`);
        this.converter = new ImportDataConverter_1.ImportDataConverter(this.logger, converterOptions);
        this.importRecord = importRecord;
        this.progress = new ImporterProgress_1.ImporterProgress(this.info.key, this.info.name);
        this.oldSettings = {};
        this.progress.step = this.importRecord.status;
        this._lastProgressReportTotal = 0;
        this.reloadCount();
        this.logger.debug(`Constructed a new ${this.info.name} Importer.`);
    }
    /**
     * Registers the file name and content type on the import operation
     */
    startFileUpload(fileName, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateProgress(ImporterProgressStep_1.ProgressStep.UPLOADING);
            return this.updateRecord(Object.assign({ file: fileName }, (contentType ? { contentType } : {})));
        });
    }
    /**
     * Takes the uploaded file and extracts the users, channels, and messages from it.
     *
     * @param {string} _fullFilePath the full path of the uploaded file
     * @returns {ImporterProgress} The progress record of the import.
     */
    prepareUsingLocalFile(_fullFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateProgress(ImporterProgressStep_1.ProgressStep.PREPARING_STARTED);
        });
    }
    /**
     * Starts the import process. The implementing method should defer
     * as soon as the selection is set, so the user who started the process
     * doesn't end up with a "locked" UI while Meteor waits for a response.
     * The returned object should be the progress.
     *
     * @param {IImporterShortSelection} importSelection The selection data.
     * @returns {ImporterProgress} The progress record of the import.
     */
    startImport(importSelection, startedByUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateProgress(ImporterProgressStep_1.ProgressStep.IMPORTING_STARTED);
            this.reloadCount();
            const started = Date.now();
            const beforeImportFn = (_a) => __awaiter(this, [_a], void 0, function* ({ data, dataType: type }) {
                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                if (this.importRecord.valid === false) {
                    this.converter.abort();
                    throw new Error('The import operation is no longer valid.');
                }
                switch (type) {
                    case 'channel': {
                        if ((_b = importSelection.channels) === null || _b === void 0 ? void 0 : _b.all) {
                            return true;
                        }
                        if (!((_d = (_c = importSelection.channels) === null || _c === void 0 ? void 0 : _c.list) === null || _d === void 0 ? void 0 : _d.length)) {
                            return false;
                        }
                        const channelData = data;
                        const id = channelData.t === 'd' ? '__directMessages__' : channelData.importIds[0];
                        return (_e = importSelection.channels.list) === null || _e === void 0 ? void 0 : _e.includes(id);
                    }
                    case 'user': {
                        if ((_f = importSelection.users) === null || _f === void 0 ? void 0 : _f.all) {
                            return true;
                        }
                        if (!((_h = (_g = importSelection.users) === null || _g === void 0 ? void 0 : _g.list) === null || _h === void 0 ? void 0 : _h.length)) {
                            return false;
                        }
                        const userData = data;
                        const id = userData.importIds[0];
                        return importSelection.users.list.includes(id);
                    }
                    case 'contact': {
                        if ((_j = importSelection.contacts) === null || _j === void 0 ? void 0 : _j.all) {
                            return true;
                        }
                        if (!((_l = (_k = importSelection.contacts) === null || _k === void 0 ? void 0 : _k.list) === null || _l === void 0 ? void 0 : _l.length)) {
                            return false;
                        }
                        const contactData = data;
                        const id = contactData.importIds[0];
                        return importSelection.contacts.list.includes(id);
                    }
                }
                return false;
            });
            const afterImportFn = () => __awaiter(this, void 0, void 0, function* () {
                yield this.addCountCompleted(1);
                if (this.importRecord.valid === false) {
                    this.converter.abort();
                    throw new Error('The import operation is no longer valid.');
                }
            });
            const afterImportAllMessagesFn = (importedRoomIds) => __awaiter(this, void 0, void 0, function* () { return core_services_1.api.broadcast('notify.importedMessages', { roomIds: importedRoomIds }); });
            const afterBatchFn = (successCount, errorCount) => __awaiter(this, void 0, void 0, function* () {
                if (successCount) {
                    yield this.addCountCompleted(successCount);
                }
                if (errorCount) {
                    yield this.addCountError(errorCount);
                }
                if (this.importRecord.valid === false) {
                    this.converter.abort();
                    throw new Error('The import operation is no longer valid.');
                }
            });
            const onErrorFn = () => __awaiter(this, void 0, void 0, function* () {
                yield this.addCountCompleted(1);
            });
            process.nextTick(() => __awaiter(this, void 0, void 0, function* () {
                yield this.backupSettingValues();
                try {
                    yield this.applySettingValues({});
                    yield this.updateProgress(ImporterProgressStep_1.ProgressStep.IMPORTING_USERS);
                    yield this.converter.convertUsers({ beforeImportFn, afterImportFn, onErrorFn, afterBatchFn });
                    yield this.updateProgress(ImporterProgressStep_1.ProgressStep.IMPORTING_CONTACTS);
                    yield this.converter.convertContacts({ beforeImportFn, afterImportFn, onErrorFn });
                    yield this.updateProgress(ImporterProgressStep_1.ProgressStep.IMPORTING_CHANNELS);
                    yield this.converter.convertChannels(startedByUserId, { beforeImportFn, afterImportFn, onErrorFn });
                    yield this.updateProgress(ImporterProgressStep_1.ProgressStep.IMPORTING_MESSAGES);
                    yield this.converter.convertMessages({ afterImportFn, onErrorFn, afterImportAllMessagesFn });
                    yield this.updateProgress(ImporterProgressStep_1.ProgressStep.FINISHING);
                    process.nextTick(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.converter.clearSuccessfullyImportedData();
                    }));
                    yield this.updateProgress(ImporterProgressStep_1.ProgressStep.DONE);
                }
                catch (e) {
                    this.logger.error(e);
                    yield this.updateProgress(ImporterProgressStep_1.ProgressStep.ERROR);
                }
                finally {
                    yield this.applySettingValues(this.oldSettings);
                }
                const timeTook = Date.now() - started;
                this.logger.log(`Import took ${timeTook} milliseconds.`);
            }));
            return this.getProgress();
        });
    }
    backupSettingValues() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const allowUsernameChange = (_a = (yield models_1.Settings.findOneById('Accounts_AllowUsernameChange'))) === null || _a === void 0 ? void 0 : _a.value;
            const maxFileSize = (_b = (yield models_1.Settings.findOneById('FileUpload_MaxFileSize'))) === null || _b === void 0 ? void 0 : _b.value;
            const mediaTypeWhiteList = (_c = (yield models_1.Settings.findOneById('FileUpload_MediaTypeWhiteList'))) === null || _c === void 0 ? void 0 : _c.value;
            const mediaTypeBlackList = (_d = (yield models_1.Settings.findOneById('FileUpload_MediaTypeBlackList'))) === null || _d === void 0 ? void 0 : _d.value;
            this.oldSettings = {
                allowUsernameChange,
                maxFileSize,
                mediaTypeWhiteList,
                mediaTypeBlackList,
            };
        });
    }
    applySettingValues(settingValues) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const settingsIds = [
                { _id: 'Accounts_AllowUsernameChange', value: (_a = settingValues.allowUsernameChange) !== null && _a !== void 0 ? _a : true },
                { _id: 'FileUpload_MaxFileSize', value: (_b = settingValues.maxFileSize) !== null && _b !== void 0 ? _b : -1 },
                { _id: 'FileUpload_MediaTypeWhiteList', value: (_c = settingValues.mediaTypeWhiteList) !== null && _c !== void 0 ? _c : '*' },
                { _id: 'FileUpload_MediaTypeBlackList', value: (_d = settingValues.mediaTypeBlackList) !== null && _d !== void 0 ? _d : '' },
            ];
            const promises = settingsIds.map((setting) => models_1.Settings.updateValueById(setting._id, setting.value));
            (yield Promise.all(promises)).forEach((value, index) => {
                if (value === null || value === void 0 ? void 0 : value.modifiedCount) {
                    void (0, notifyListener_1.notifyOnSettingChangedById)(settingsIds[index]._id);
                }
            });
        });
    }
    getProgress() {
        return this.progress;
    }
    /**
     * Updates the progress step of this importer.
     * It also changes some internal settings at various stages of the import.
     * This way the importer can adjust user/room information at will.
     *
     * @param {ProgressStep} step The progress step which this import is currently at.
     * @returns {ImporterProgress} The progress record of the import.
     */
    updateProgress(step) {
        return __awaiter(this, void 0, void 0, function* () {
            this.progress.step = step;
            this.logger.debug(`${this.info.name} is now at ${step}.`);
            yield this.updateRecord({ status: this.progress.step });
            // Do not send the default progress report during the preparing stage - the classes are sending their own report in a different format.
            if (!ImporterProgressStep_1.ImportPreparingStartedStates.includes(this.progress.step)) {
                this.reportProgress();
            }
            return this.progress;
        });
    }
    reloadCount() {
        var _a, _b, _c;
        this.progress.count.total = ((_a = this.importRecord.count) === null || _a === void 0 ? void 0 : _a.total) || 0;
        this.progress.count.completed = ((_b = this.importRecord.count) === null || _b === void 0 ? void 0 : _b.completed) || 0;
        this.progress.count.error = ((_c = this.importRecord.count) === null || _c === void 0 ? void 0 : _c.error) || 0;
    }
    /**
     * Adds the passed in value to the total amount of items needed to complete.
     *
     * @param {number} count The amount to add to the total count of items.
     * @returns {ImporterProgress} The progress record of the import.
     */
    addCountToTotal(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.progress.count.total += count;
            yield this.updateRecord({ 'count.total': this.progress.count.total });
            return this.progress;
        });
    }
    /**
     * Adds the passed in value to the total amount of items completed.
     *
     * @param {number} count The amount to add to the total count of finished items.
     * @returns {ImporterProgress} The progress record of the import.
     */
    addCountCompleted(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.progress.count.completed += count;
            return this.maybeUpdateRecord();
        });
    }
    addCountError(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.progress.count.error += count;
            return this.maybeUpdateRecord();
        });
    }
    maybeUpdateRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            // Only update the database every 500 messages (or 50 for other records)
            // Or the completed is greater than or equal to the total amount
            const count = this.progress.count.completed + this.progress.count.error;
            const range = this.progress.step === ImporterProgressStep_1.ProgressStep.IMPORTING_MESSAGES ? 500 : 50;
            if (count % range === 0 || count >= this.progress.count.total || count - this._lastProgressReportTotal > range) {
                this._lastProgressReportTotal = this.progress.count.completed + this.progress.count.error;
                yield this.updateRecord({ 'count.completed': this.progress.count.completed, 'count.error': this.progress.count.error });
                this.reportProgress();
            }
            else if (!this._reportProgressHandler) {
                this._reportProgressHandler = setTimeout(() => {
                    this.reportProgress();
                }, 250);
            }
            this.logger.log(`${this.progress.count.completed} records imported, ${this.progress.count.error} failed`);
            return this.progress;
        });
    }
    /**
     * Sends an updated progress to the websocket
     */
    reportProgress() {
        if (this._reportProgressHandler) {
            clearTimeout(this._reportProgressHandler);
            this._reportProgressHandler = undefined;
        }
        ImporterWebsocket_1.ImporterWebsocket.progressUpdated(this.progress);
    }
    /**
     * Updates the import record with the given fields being `set`.
     */
    updateRecord(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.importRecord) {
                return this.importRecord;
            }
            yield models_1.Imports.update({ _id: this.importRecord._id }, { $set: fields });
            // #TODO: Remove need for the typecast
            this.importRecord = (yield models_1.Imports.findOne(this.importRecord._id));
            return this.importRecord;
        });
    }
    buildSelection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateProgress(ImporterProgressStep_1.ProgressStep.USER_SELECTION);
            const users = yield models_1.ImportData.getAllUsersForSelection();
            const channels = yield models_1.ImportData.getAllChannelsForSelection();
            const contacts = yield models_1.ImportData.getAllContactsForSelection();
            const hasDM = yield models_1.ImportData.checkIfDirectMessagesExists();
            const selectionUsers = users.map((u) => new __1.SelectionUser(u.data.importIds[0], u.data.username, u.data.emails[0], Boolean(u.data.deleted), u.data.type === 'bot', true));
            const selectionChannels = channels.map((c) => new __1.SelectionChannel(c.data.importIds[0], c.data.name, Boolean(c.data.archived), true, c.data.t === 'p', c.data.t === 'd'));
            const selectionContacts = contacts.map((c) => ({
                id: c.data.importIds[0],
                name: c.data.name || '',
                emails: c.data.emails || [],
                phones: c.data.phones || [],
                do_import: true,
            }));
            const selectionMessages = yield models_1.ImportData.countMessages();
            if (hasDM) {
                selectionChannels.push(new __1.SelectionChannel('__directMessages__', (0, i18n_1.t)('Direct_Messages'), false, true, true, true));
            }
            const results = new __1.Selection(this.info.name, selectionUsers, selectionChannels, selectionMessages, selectionContacts);
            return results;
        });
    }
    /**
     * Utility method to check if the passed in error is a `MongoServerError` with the `codeName` of `'CursorNotFound'`.
     */
    isCursorNotFoundError(error) {
        return typeof error === 'object' && error !== null && 'codeName' in error && error.codeName === 'CursorNotFound';
    }
}
exports.Importer = Importer;
