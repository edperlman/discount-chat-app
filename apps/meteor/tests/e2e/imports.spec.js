"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
const csv_parse_1 = require("csv-parse");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
const rowUserName = [];
const csvImportedUsernames = [];
const dmMessages = [];
const importedRooms = [];
const slackCsvDir = path.resolve(__dirname, 'fixtures', 'files', 'slack_export_users.csv');
const zipCsvImportDir = path.resolve(__dirname, 'fixtures', 'files', 'csv_import.zip');
// These files have the same content from users.csv, channels.csv and messages1.csv from the zip file
// They have been extracted just so that we don't need to do that on the fly
const usersCsvDir = path.resolve(__dirname, 'fixtures', 'files', 'csv_import_users.csv');
const roomsCsvDir = path.resolve(__dirname, 'fixtures', 'files', 'csv_import_rooms.csv');
const dmMessagesCsvDir = path.resolve(__dirname, 'fixtures', 'files', 'dm_messages.csv');
const usersCsvsToJson = () => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => fs_1.default
        .createReadStream(slackCsvDir)
        .pipe((0, csv_parse_1.parse)({ delimiter: ',', from_line: 2 }))
        .on('data', (rows) => {
        rowUserName.push(rows[0]);
    })
        .on('end', resolve));
    yield new Promise((resolve) => fs_1.default
        .createReadStream(usersCsvDir)
        .pipe((0, csv_parse_1.parse)({ delimiter: ',' }))
        .on('data', (rows) => {
        rowUserName.push(rows[0]);
        csvImportedUsernames.push(rows[0]);
    })
        .on('end', resolve));
});
const countDmMessages = () => new Promise((resolve) => fs_1.default
    .createReadStream(dmMessagesCsvDir)
    .pipe((0, csv_parse_1.parse)({ delimiter: ',' }))
    .on('data', (rows) => {
    dmMessages.push(rows[3]);
})
    .on('end', resolve));
const roomsCsvToJson = () => new Promise((resolve) => fs_1.default
    .createReadStream(roomsCsvDir)
    .pipe((0, csv_parse_1.parse)({ delimiter: ',' }))
    .on('data', (rows) => {
    importedRooms.push({
        name: rows[0],
        ownerUsername: rows[1],
        visibility: rows[2],
        members: rows[3],
    });
})
    .on('end', resolve));
test_1.test.describe.serial('imports', () => {
    test_1.test.beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield usersCsvsToJson();
        yield roomsCsvToJson();
        yield countDmMessages();
    }));
    (0, test_1.test)('expect import users data from slack', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const poAdmin = new page_objects_1.Admin(page);
        yield page.goto('/admin/import');
        yield poAdmin.btnImportNewFile.click();
        yield (yield poAdmin.getOptionFileType("Slack's Users CSV")).click();
        yield poAdmin.inputFile.setInputFiles(slackCsvDir);
        yield poAdmin.btnImport.click();
        yield poAdmin.btnStartImport.click();
        yield (0, test_1.expect)(poAdmin.importStatusTableFirstRowCell).toBeVisible({
            timeout: 30000,
        });
    }));
    (0, test_1.test)('expect import users data from zipped CSV files', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const poAdmin = new page_objects_1.Admin(page);
        yield page.goto('/admin/import');
        yield poAdmin.btnImportNewFile.click();
        yield (yield poAdmin.getOptionFileType('CSV')).click();
        yield poAdmin.inputFile.setInputFiles(zipCsvImportDir);
        yield poAdmin.btnImport.click();
        yield poAdmin.findFileCheckboxByUsername('billy.billy').click();
        yield poAdmin.btnStartImport.click();
        yield (0, test_1.expect)(poAdmin.importStatusTableFirstRowCell).toBeVisible({
            timeout: 30000,
        });
    }));
    (0, test_1.test)('expect all imported users to be actually listed as users', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        var _b, e_1, _c, _d;
        yield page.goto('/admin/users');
        try {
            for (var _e = true, rowUserName_1 = __asyncValues(rowUserName), rowUserName_1_1; rowUserName_1_1 = yield rowUserName_1.next(), _b = rowUserName_1_1.done, !_b; _e = true) {
                _d = rowUserName_1_1.value;
                _e = false;
                const user = _d;
                if (user === 'billy.billy') {
                    yield (0, test_1.expect)(page.locator(`tbody tr td:first-child >> text="${user}"`)).not.toBeVisible();
                }
                else {
                    (0, test_1.expect)(page.locator(`tbody tr td:first-child >> text="${user}"`));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_b && (_c = rowUserName_1.return)) yield _c.call(rowUserName_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }));
    (0, test_1.test)('expect all imported rooms to be actually listed as rooms with correct members count', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        var _b, e_2, _c, _d;
        const poAdmin = new page_objects_1.Admin(page);
        yield page.goto('/admin/rooms');
        try {
            for (var _e = true, importedRooms_1 = __asyncValues(importedRooms), importedRooms_1_1; importedRooms_1_1 = yield importedRooms_1.next(), _b = importedRooms_1_1.done, !_b; _e = true) {
                _d = importedRooms_1_1.value;
                _e = false;
                const room = _d;
                yield poAdmin.inputSearchRooms.fill(room.name);
                const expectedMembersCount = room.members.split(';').filter((username) => username !== room.ownerUsername).length + 1;
                (0, test_1.expect)(page.locator(`tbody tr td:nth-child(2) >> text="${expectedMembersCount}"`));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_e && !_b && (_c = importedRooms_1.return)) yield _c.call(importedRooms_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }));
    (0, test_1.test)('expect all imported rooms to have correct room type and owner', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        var _b, e_3, _c, _d;
        const poAdmin = new page_objects_1.Admin(page);
        yield page.goto('/admin/rooms');
        try {
            for (var _e = true, importedRooms_2 = __asyncValues(importedRooms), importedRooms_2_1; importedRooms_2_1 = yield importedRooms_2.next(), _b = importedRooms_2_1.done, !_b; _e = true) {
                _d = importedRooms_2_1.value;
                _e = false;
                const room = _d;
                yield poAdmin.inputSearchRooms.fill(room.name);
                yield poAdmin.getRoomRow(room.name).click();
                room.visibility === 'private'
                    ? yield (0, test_1.expect)(poAdmin.privateInput).toBeChecked()
                    : yield (0, test_1.expect)(poAdmin.privateInput).not.toBeChecked();
                yield (0, test_1.expect)(poAdmin.roomOwnerInput).toHaveValue(room.ownerUsername);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_e && !_b && (_c = importedRooms_2.return)) yield _c.call(importedRooms_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }));
    (0, test_1.test)('expect imported DM to be actually listed as a room with correct members and messages count', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        var _b, e_4, _c, _d;
        const poAdmin = new page_objects_1.Admin(page);
        yield page.goto('/admin/rooms');
        try {
            for (var _e = true, csvImportedUsernames_1 = __asyncValues(csvImportedUsernames), csvImportedUsernames_1_1; csvImportedUsernames_1_1 = yield csvImportedUsernames_1.next(), _b = csvImportedUsernames_1_1.done, !_b; _e = true) {
                _d = csvImportedUsernames_1_1.value;
                _e = false;
                const user = _d;
                yield poAdmin.inputSearchRooms.fill(user);
                (0, test_1.expect)(page.locator(`tbody tr td:first-child >> text="${user}"`));
                const expectedMembersCount = 2;
                (0, test_1.expect)(page.locator(`tbody tr td:nth-child(2) >> text="${expectedMembersCount}"`));
                const expectedMessagesCount = dmMessages.length;
                (0, test_1.expect)(page.locator(`tbody tr td:nth-child(3) >> text="${expectedMessagesCount}"`));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (!_e && !_b && (_c = csvImportedUsernames_1.return)) yield _c.call(csvImportedUsernames_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }));
});
