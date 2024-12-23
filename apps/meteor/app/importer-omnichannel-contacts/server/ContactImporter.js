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
exports.ContactImporter = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const sync_1 = require("csv-parse/lib/sync");
const addParsedContacts_1 = require("./addParsedContacts");
const server_1 = require("../../importer/server");
class ContactImporter extends server_1.Importer {
    constructor(info, importRecord, converterOptions = {}) {
        super(info, importRecord, converterOptions);
        this.csvParser = sync_1.parse;
    }
    prepareUsingLocalFile(fullFilePath) {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress },
            updateRecord: { get: () => super.updateRecord },
            getProgress: { get: () => super.getProgress }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('start preparing import operation');
            yield this.converter.clearImportData();
            server_1.ImporterWebsocket.progressUpdated({ rate: 0 });
            yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_CONTACTS);
            // Reading the whole file at once for compatibility with the code written for the other importers
            // We can change this to a stream once we improve the rest of the importer classes
            const fileContents = node_fs_1.default.readFileSync(fullFilePath, { encoding: 'utf8' });
            if (!fileContents || typeof fileContents !== 'string') {
                throw new Error('Failed to load file contents.');
            }
            const parsedContacts = this.csvParser(fileContents);
            const contactsCount = yield addParsedContacts_1.addParsedContacts.call(this.converter, parsedContacts);
            if (contactsCount === 0) {
                this.logger.error('No contacts found in the import file.');
                yield _super.updateProgress.call(this, server_1.ProgressStep.ERROR);
            }
            else {
                yield _super.updateRecord.call(this, { 'count.contacts': contactsCount, 'count.total': contactsCount });
                server_1.ImporterWebsocket.progressUpdated({ rate: 100 });
            }
            return _super.getProgress.call(this);
        });
    }
}
exports.ContactImporter = ContactImporter;
