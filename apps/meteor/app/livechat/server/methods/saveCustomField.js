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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
meteor_1.Meteor.methods({
    'livechat:saveCustomField'(_id, customFieldData) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid || !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'view-livechat-manager'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'livechat:saveCustomField',
                });
            }
            if (_id) {
                (0, check_1.check)(_id, String);
            }
            (0, check_1.check)(customFieldData, check_1.Match.ObjectIncluding({
                field: String,
                label: String,
                scope: String,
                visibility: String,
                regexp: String,
                searchable: Boolean,
            }));
            if (!/^[0-9a-zA-Z-_]+$/.test(customFieldData.field)) {
                throw new meteor_1.Meteor.Error('error-invalid-custom-field-name', 'Invalid custom field name. Use only letters, numbers, hyphens and underscores.', { method: 'livechat:saveCustomField' });
            }
            if (_id) {
                const customField = yield models_1.LivechatCustomField.findOneById(_id);
                if (!customField) {
                    throw new meteor_1.Meteor.Error('error-invalid-custom-field', 'Custom Field Not found', {
                        method: 'livechat:saveCustomField',
                    });
                }
            }
            if (!_id) {
                const customField = yield models_1.LivechatCustomField.findOneById(customFieldData.field);
                if (customField) {
                    throw new meteor_1.Meteor.Error('error-custom-field-name-already-exists', 'Custom field name already exists', {
                        method: 'livechat:saveCustomField',
                    });
                }
            }
            const { field, label, scope, visibility } = customFieldData, extraData = __rest(customFieldData, ["field", "label", "scope", "visibility"]);
            return models_1.LivechatCustomField.createOrUpdateCustomField(_id, field, label, scope, visibility, Object.assign({}, extraData));
        });
    },
});
