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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const lib_1 = require("../../../app/authorization/lib");
const hasPermission_1 = require("../../../app/authorization/server/functions/hasPermission");
const server_1 = require("../../../app/settings/server");
meteor_1.Meteor.methods({
    'public-settings/get'(updatedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (updatedAt instanceof Date) {
                const records = yield models_1.Settings.findNotHiddenPublicUpdatedAfter(updatedAt).toArray();
                server_1.SettingsEvents.emit('fetch-settings', records);
                return {
                    update: records,
                    remove: yield models_1.Settings.trashFindDeletedAfter(updatedAt, {
                        hidden: {
                            $ne: true,
                        },
                        public: true,
                    }, {
                        projection: {
                            _id: 1,
                            _deletedAt: 1,
                        },
                    }).toArray(),
                };
            }
            const publicSettings = (yield models_1.Settings.findNotHiddenPublic().toArray());
            server_1.SettingsEvents.emit('fetch-settings', publicSettings);
            return publicSettings;
        });
    },
    'private-settings/get'(updatedAfter) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                return [];
            }
            const privilegedSetting = yield (0, hasPermission_1.hasAtLeastOnePermissionAsync)(uid, ['view-privileged-setting', 'edit-privileged-setting']);
            const manageSelectedSettings = privilegedSetting || (yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-selected-settings'));
            if (!manageSelectedSettings) {
                return [];
            }
            const bypass = (settings) => __awaiter(this, void 0, void 0, function* () { return settings; });
            const applyFilter = (fn, args) => fn(args);
            const getAuthorizedSettingsFiltered = (settings) => __awaiter(this, void 0, void 0, function* () {
                return (yield Promise.all(settings.map((record) => __awaiter(this, void 0, void 0, function* () {
                    if (yield (0, hasPermission_1.hasPermissionAsync)(uid, (0, lib_1.getSettingPermissionId)(record._id))) {
                        return record;
                    }
                })))).filter(Boolean);
            });
            const getAuthorizedSettings = (updatedAfter, privilegedSetting) => __awaiter(this, void 0, void 0, function* () {
                return applyFilter(privilegedSetting ? bypass : getAuthorizedSettingsFiltered, yield models_1.Settings.findNotHidden(updatedAfter && { updatedAfter }).toArray());
            });
            if (!(updatedAfter instanceof Date)) {
                // this does not only imply an unfiltered setting range, it also identifies the caller's context:
                // If called *with* filter (see below), the user wants a collection as a result.
                // in this case, it shall only be a plain array
                return getAuthorizedSettings(updatedAfter, privilegedSetting);
            }
            return {
                update: yield getAuthorizedSettings(updatedAfter, privilegedSetting),
                remove: yield models_1.Settings.trashFindDeletedAfter(updatedAfter, {
                    hidden: {
                        $ne: true,
                    },
                }, {
                    projection: {
                        _id: 1,
                        _deletedAt: 1,
                    },
                }).toArray(),
            };
        });
    },
});
