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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackUsersImporter = void 0;
const fs_1 = __importDefault(require("fs"));
const models_1 = require("@rocket.chat/models");
const sync_1 = require("csv-parse/lib/sync");
const server_1 = require("../../file/server");
const server_2 = require("../../importer/server");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
class SlackUsersImporter extends server_2.Importer {
    constructor(info, importRecord, converterOptions = {}) {
        super(info, importRecord, converterOptions);
        this.csvParser = sync_1.parse;
    }
    prepareUsingLocalFile(fullFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('start preparing import operation');
            yield this.converter.clearImportData();
            const file = fs_1.default.readFileSync(fullFilePath);
            const buffer = Buffer.isBuffer(file) ? file : Buffer.from(file);
            const { contentType } = this.importRecord;
            const fileName = this.importRecord.file;
            const data = buffer.toString('base64');
            const dataURI = `data:${contentType};base64,${data}`;
            return this.prepare(dataURI, fileName || '');
        });
    }
    prepare(dataURI, fileName) {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress },
            getProgress: { get: () => super.getProgress },
            addCountToTotal: { get: () => super.addCountToTotal },
            updateRecord: { get: () => super.updateRecord }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            this.logger.debug('start preparing import operation');
            yield this.converter.clearImportData();
            yield this.updateRecord({ file: fileName });
            yield _super.updateProgress.call(this, server_2.ProgressStep.PREPARING_USERS);
            const uriResult = server_1.RocketChatFile.dataURIParse(dataURI);
            const buf = Buffer.from(uriResult.image, 'base64');
            const parsed = this.csvParser(buf.toString());
            let userCount = 0;
            try {
                for (var _d = true, _e = __asyncValues(parsed.entries()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const [index, user] = _c;
                    // Ignore the first column
                    if (index === 0) {
                        continue;
                    }
                    const username = user[0];
                    const email = user[1];
                    if (!email) {
                        continue;
                    }
                    const name = user[7] || user[8] || username;
                    const newUser = {
                        emails: [email],
                        importIds: [email],
                        username,
                        name,
                        type: 'user',
                    };
                    switch (user[2]) {
                        case 'Admin':
                            newUser.roles = ['admin'];
                            break;
                        case 'Bot':
                            newUser.roles = ['bot'];
                            newUser.type = 'bot';
                            break;
                        case 'Deactivated':
                            newUser.deleted = true;
                            break;
                    }
                    yield this.converter.addUser(newUser);
                    userCount++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (userCount === 0) {
                this.logger.error('No users found in the import file.');
                yield _super.updateProgress.call(this, server_2.ProgressStep.ERROR);
                return _super.getProgress.call(this);
            }
            yield _super.updateProgress.call(this, server_2.ProgressStep.USER_SELECTION);
            yield _super.addCountToTotal.call(this, userCount);
            const { value } = yield models_1.Settings.incrementValueById('Slack_Users_Importer_Count', userCount, { returnDocument: 'after' });
            if (value) {
                void (0, notifyListener_1.notifyOnSettingChanged)(value);
            }
            yield _super.updateRecord.call(this, { 'count.users': userCount });
            return _super.getProgress.call(this);
        });
    }
}
exports.SlackUsersImporter = SlackUsersImporter;
