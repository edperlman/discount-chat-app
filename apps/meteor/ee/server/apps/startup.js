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
const meteor_1 = require("meteor/meteor");
const orchestrator_1 = require("./orchestrator");
const server_1 = require("../../../app/settings/server");
meteor_1.Meteor.startup(function _appServerOrchestrator() {
    return __awaiter(this, void 0, void 0, function* () {
        yield server_1.settingsRegistry.addGroup('General', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('Apps', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('Apps_Logs_TTL', '30_days', {
                            type: 'select',
                            values: [
                                {
                                    key: '7_days',
                                    i18nLabel: 'Apps_Logs_TTL_7days',
                                },
                                {
                                    key: '14_days',
                                    i18nLabel: 'Apps_Logs_TTL_14days',
                                },
                                {
                                    key: '30_days',
                                    i18nLabel: 'Apps_Logs_TTL_30days',
                                },
                            ],
                            public: true,
                            hidden: false,
                            alert: 'Apps_Logs_TTL_Alert',
                        });
                        yield this.add('Apps_Framework_Source_Package_Storage_Type', 'gridfs', {
                            type: 'select',
                            values: [
                                {
                                    key: 'gridfs',
                                    i18nLabel: 'GridFS',
                                },
                                {
                                    key: 'filesystem',
                                    i18nLabel: 'FileSystem',
                                },
                            ],
                            public: true,
                            hidden: false,
                            alert: 'Apps_Framework_Source_Package_Storage_Type_Alert',
                        });
                        yield this.add('Apps_Framework_Source_Package_Storage_FileSystem_Path', '', {
                            type: 'string',
                            public: true,
                            enableQuery: {
                                _id: 'Apps_Framework_Source_Package_Storage_Type',
                                value: 'filesystem',
                            },
                            alert: 'Apps_Framework_Source_Package_Storage_FileSystem_Alert',
                        });
                    });
                });
            });
        });
        server_1.settings.watch('Apps_Logs_TTL', (value) => __awaiter(this, void 0, void 0, function* () {
            if (!orchestrator_1.Apps.isInitialized()) {
                return;
            }
            let expireAfterSeconds = 0;
            switch (value) {
                case '7_days':
                    expireAfterSeconds = 604800;
                    break;
                case '14_days':
                    expireAfterSeconds = 1209600;
                    break;
                case '30_days':
                    expireAfterSeconds = 2592000;
                    break;
            }
            if (!expireAfterSeconds) {
                return;
            }
            const model = orchestrator_1.Apps._logModel;
            yield model.resetTTLIndex(expireAfterSeconds);
        }));
        orchestrator_1.Apps.initialize();
        void orchestrator_1.Apps.load();
    });
});
