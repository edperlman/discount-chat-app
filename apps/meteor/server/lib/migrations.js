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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getControl = getControl;
exports.addMigration = addMigration;
exports.migrateDatabase = migrateDatabase;
exports.onServerVersionChange = onServerVersionChange;
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const showBox_1 = require("./logger/showBox");
const rocketchat_info_1 = require("../../app/utils/rocketchat.info");
const sleep_1 = require("../../lib/utils/sleep");
const log = new logger_1.Logger('Migrations');
const migrations = new Set();
// sets the control record
function setControl(control) {
    void models_1.Migrations.updateMany({
        _id: 'control',
    }, {
        $set: {
            version: control.version,
            locked: control.locked,
        },
    }, {
        upsert: true,
    });
    return control;
}
// gets the current control record, optionally creating it if non-existant
function getControl() {
    return __awaiter(this, void 0, void 0, function* () {
        const control = (yield models_1.Migrations.findOne({
            _id: 'control',
        }));
        return (control ||
            setControl({
                version: 0,
                locked: false,
            }));
    });
}
// Returns true if lock was acquired.
function lock() {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        const dateMinusInterval = new Date();
        dateMinusInterval.setMinutes(dateMinusInterval.getMinutes() - 5);
        const build = rocketchat_info_1.Info ? rocketchat_info_1.Info.build.date : date;
        // This is atomic. The selector ensures only one caller at a time will see
        // the unlocked control, and locking occurs in the same update's modifier.
        // All other simultaneous callers will get false back from the update.
        return ((yield models_1.Migrations.updateMany({
            _id: 'control',
            $or: [
                {
                    locked: false,
                },
                {
                    lockedAt: {
                        $lt: dateMinusInterval,
                    },
                },
                {
                    buildAt: {
                        $ne: build,
                    },
                },
            ],
        }, {
            $set: {
                locked: true,
                lockedAt: date,
                buildAt: build,
            },
        })).matchedCount === 1);
    });
}
function addMigration(migration) {
    if (!(migration === null || migration === void 0 ? void 0 : migration.version)) {
        throw new Error('Migration version is required');
    }
    if (!(migration === null || migration === void 0 ? void 0 : migration.up)) {
        throw new Error('Migration up() is required');
    }
    migrations.add(migration);
}
// Side effect: saves version.
function unlock(version) {
    setControl({
        locked: false,
        version,
    });
}
function getOrderedMigrations() {
    return Array.from(migrations).sort((a, b) => a.version - b.version);
}
function showError(version, control, e) {
    (0, showBox_1.showErrorBox)('ERROR! SERVER STOPPED', [
        'Your database migration failed:',
        e.message,
        '',
        'Please make sure you are running the latest version and try again.',
        'If the problem persists, please contact support.',
        '',
        `This Rocket.Chat version: ${rocketchat_info_1.Info.version}`,
        `Database locked at version: ${control.version}`,
        `Database target version: ${version}`,
        '',
        `Commit: ${rocketchat_info_1.Info.commit.hash}`,
        `Date: ${rocketchat_info_1.Info.commit.date}`,
        `Branch: ${rocketchat_info_1.Info.commit.branch}`,
        `Tag: ${rocketchat_info_1.Info.commit.tag}`,
    ].join('\n'));
}
// run the actual migration
function migrate(direction, migration) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (typeof migration[direction] !== 'function') {
            throw new Error(`Cannot migrate ${direction} on version ${migration.version}`);
        }
        log.startup(`Running ${direction}() on version ${migration.version}${migration.name ? `(${migration.name})` : ''}`);
        yield ((_a = migration[direction]) === null || _a === void 0 ? void 0 : _a.call(migration, migration));
    });
}
const maxAttempts = 30;
const retryInterval = 10;
let currentAttempt = 0;
function migrateDatabase(targetVersion, subcommands) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const control = yield getControl();
        const currentVersion = control.version;
        const orderedMigrations = getOrderedMigrations();
        if (orderedMigrations.length === 0) {
            log.startup('No migrations to run');
            return true;
        }
        // version 0 means it is a fresh database, just set the control to latest known version and skip
        if (currentVersion === 0) {
            setControl({
                locked: false,
                version: orderedMigrations[orderedMigrations.length - 1].version,
            });
            return true;
        }
        const version = targetVersion === 'latest' ? orderedMigrations[orderedMigrations.length - 1].version : targetVersion;
        // get latest version
        // const { version } = orderedMigrations[orderedMigrations.length - 1];
        if (!(yield lock())) {
            const msg = `Not migrating, control is locked. Attempt ${currentAttempt}/${maxAttempts}`;
            if (currentAttempt <= maxAttempts) {
                log.warn(`${msg}. Trying again in ${retryInterval} seconds.`);
                yield (0, sleep_1.sleep)(retryInterval * 1000);
                currentAttempt++;
                return migrateDatabase(targetVersion, subcommands);
            }
            const control = yield getControl(); // Side effect: upserts control document.
            (0, showBox_1.showErrorBox)('ERROR! SERVER STOPPED', [
                'Your database migration control is locked.',
                'Please make sure you are running the latest version and try again.',
                'If the problem persists, please contact support.',
                '',
                `This Rocket.Chat version: ${rocketchat_info_1.Info.version}`,
                `Database locked at version: ${control.version}`,
                `Database target version: ${version}`,
                '',
                `Commit: ${rocketchat_info_1.Info.commit.hash}`,
                `Date: ${rocketchat_info_1.Info.commit.date}`,
                `Branch: ${rocketchat_info_1.Info.commit.branch}`,
                `Tag: ${rocketchat_info_1.Info.commit.tag}`,
            ].join('\n'));
            process.exit(1);
        }
        if (subcommands === null || subcommands === void 0 ? void 0 : subcommands.includes('rerun')) {
            log.startup(`Rerunning version ${targetVersion}`);
            const migration = orderedMigrations.find((migration) => migration.version === targetVersion);
            if (!migration) {
                throw new Error(`Cannot rerun migration ${targetVersion}`);
            }
            try {
                yield migrate('up', migration);
            }
            catch (e) {
                showError(version, control, e);
                log.error({ err: e });
                process.exit(1);
            }
            log.startup('Finished migrating.');
            unlock(currentVersion);
            return true;
        }
        if (currentVersion === version) {
            log.startup(`Not migrating, already at version ${version}`);
            unlock(currentVersion);
            return true;
        }
        const startIdx = orderedMigrations.findIndex((migration) => migration.version === currentVersion);
        if (startIdx === -1) {
            throw new Error(`Can't find migration version ${currentVersion}`);
        }
        const endIdx = orderedMigrations.findIndex((migration) => migration.version === version);
        if (endIdx === -1) {
            throw new Error(`Can't find migration version ${version}`);
        }
        log.startup(`Migrating from version ${orderedMigrations[startIdx].version} -> ${orderedMigrations[endIdx].version}`);
        try {
            const migrations = [];
            if (currentVersion < version) {
                for (let i = startIdx; i < endIdx; i++) {
                    migrations.push(() => __awaiter(this, void 0, void 0, function* () {
                        yield migrate('up', orderedMigrations[i + 1]);
                        setControl({
                            locked: true,
                            version: orderedMigrations[i + 1].version,
                        });
                    }));
                }
            }
            else {
                for (let i = startIdx; i > endIdx; i--) {
                    migrations.push(() => __awaiter(this, void 0, void 0, function* () {
                        yield migrate('down', orderedMigrations[i]);
                        setControl({
                            locked: true,
                            version: orderedMigrations[i - 1].version,
                        });
                    }));
                }
            }
            try {
                for (var _d = true, migrations_1 = __asyncValues(migrations), migrations_1_1; migrations_1_1 = yield migrations_1.next(), _a = migrations_1_1.done, !_a; _d = true) {
                    _c = migrations_1_1.value;
                    _d = false;
                    const migration = _c;
                    yield migration();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = migrations_1.return)) yield _b.call(migrations_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (e) {
            showError(version, control, e);
            log.error({ err: e });
            process.exit(1);
        }
        unlock(orderedMigrations[endIdx].version);
        log.startup('Finished migrating.');
        // remember to run meteor with --once otherwise it will restart
        if (subcommands === null || subcommands === void 0 ? void 0 : subcommands.includes('exit')) {
            process.exit(0);
        }
        return true;
    });
}
function onServerVersionChange(cb) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const result = yield models_1.Migrations.findOneAndUpdate({
            _id: 'upgrade',
        }, {
            $set: {
                hash: rocketchat_info_1.Info.commit.hash,
            },
        }, {
            upsert: true,
        });
        if (((_a = result.value) === null || _a === void 0 ? void 0 : _a.hash) === rocketchat_info_1.Info.commit.hash) {
            return;
        }
        yield cb();
    });
}
