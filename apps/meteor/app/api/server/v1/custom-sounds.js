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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
api_1.API.v1.addRoute('custom-sounds.list', { authRequired: true, validateParams: rest_typings_1.isCustomSoundsListProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, query } = yield this.parseJsonQuery();
            const { name } = this.queryParams;
            const filter = Object.assign(Object.assign({}, query), (name ? { name: { $regex: (0, string_helpers_1.escapeRegExp)(name), $options: 'i' } } : {}));
            const { cursor, totalCount } = models_1.CustomSounds.findPaginated(filter, {
                sort: sort || { name: 1 },
                skip: offset,
                limit: count,
            });
            const [sounds, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                sounds,
                count: sounds.length,
                offset,
                total,
            });
        });
    },
});
