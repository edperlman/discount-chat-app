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
const tags_1 = require("./lib/tags");
const server_1 = require("../../../../../app/api/server");
const getPaginationItems_1 = require("../../../../../app/api/server/helpers/getPaginationItems");
server_1.API.v1.addRoute('livechat/tags', { authRequired: true, permissionsRequired: { GET: { permissions: ['view-l-room', 'manage-livechat-tags'], operation: 'hasAny' } } }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { text, viewAll, department } = this.queryParams;
            return server_1.API.v1.success(yield (0, tags_1.findTags)({
                userId: this.userId,
                text,
                department,
                viewAll: viewAll === 'true',
                pagination: {
                    offset,
                    count,
                    sort: typeof sort === 'string' ? JSON.parse(sort || '{}') : sort,
                },
            }));
        });
    },
});
server_1.API.v1.addRoute('livechat/tags/:tagId', { authRequired: true, permissionsRequired: { GET: { permissions: ['view-l-room', 'manage-livechat-tags'], operation: 'hasAny' } } }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tagId } = this.urlParams;
            return server_1.API.v1.success(yield (0, tags_1.findTagById)({
                userId: this.userId,
                tagId,
            }));
        });
    },
});
