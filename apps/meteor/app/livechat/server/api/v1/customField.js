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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const server_1 = require("../../../../api/server");
const getPaginationItems_1 = require("../../../../api/server/helpers/getPaginationItems");
const LivechatTyped_1 = require("../../lib/LivechatTyped");
const customFields_1 = require("../lib/customFields");
const livechat_1 = require("../lib/livechat");
server_1.API.v1.addRoute('livechat/custom.field', { validateParams: rest_typings_1.isPOSTLivechatCustomFieldParams }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, key, value, overwrite } = this.bodyParams;
            const guest = yield (0, livechat_1.findGuest)(token);
            if (!guest) {
                throw new Error('invalid-token');
            }
            if (!(yield LivechatTyped_1.Livechat.setCustomFields({ token, key, value, overwrite }))) {
                return server_1.API.v1.failure();
            }
            return server_1.API.v1.success({ field: { key, value, overwrite } });
        });
    },
});
server_1.API.v1.addRoute('livechat/custom.fields', { validateParams: rest_typings_1.isPOSTLivechatCustomFieldsParams }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = this.bodyParams;
            const guest = yield (0, livechat_1.findGuest)(token);
            if (!guest) {
                throw new Error('invalid-token');
            }
            const fields = yield Promise.all(this.bodyParams.customFields.map((customField) => __awaiter(this, void 0, void 0, function* () {
                const data = Object.assign({ token }, customField);
                if (!(yield LivechatTyped_1.Livechat.setCustomFields(data))) {
                    throw new Error('error-setting-custom-field');
                }
                return { Key: customField.key, value: customField.value, overwrite: customField.overwrite };
            })));
            return server_1.API.v1.success({ fields });
        });
    },
});
server_1.API.v1.addRoute('livechat/custom-fields', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isLivechatCustomFieldsProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { text } = this.queryParams;
            const customFields = yield (0, customFields_1.findLivechatCustomFields)({
                text,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            });
            return server_1.API.v1.success(customFields);
        });
    },
});
server_1.API.v1.addRoute('livechat/custom-fields/:_id', { authRequired: true, permissionsRequired: ['view-l-room'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { customField } = yield (0, customFields_1.findCustomFieldById)({ customFieldId: this.urlParams._id });
            return server_1.API.v1.success({
                customField,
            });
        });
    },
});
