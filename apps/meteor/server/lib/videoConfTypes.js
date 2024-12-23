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
exports.videoConfTypes = void 0;
const typeConditions = [];
exports.videoConfTypes = {
    registerVideoConferenceType(data, condition, priority = 1) {
        typeConditions.push({ data, condition, priority });
        typeConditions.sort(({ priority: prior1 }, { priority: prior2 }) => prior2 - prior1);
    },
    getTypeForRoom(room, allowRinging) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                for (var _d = true, typeConditions_1 = __asyncValues(typeConditions), typeConditions_1_1; typeConditions_1_1 = yield typeConditions_1.next(), _a = typeConditions_1_1.done, !_a; _d = true) {
                    _c = typeConditions_1_1.value;
                    _d = false;
                    const { data, condition } = _c;
                    if (yield condition(room, allowRinging)) {
                        if (typeof data === 'string') {
                            return {
                                type: data,
                            };
                        }
                        return data;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = typeConditions_1.return)) yield _b.call(typeConditions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return { type: 'videoconference' };
        });
    },
};
exports.videoConfTypes.registerVideoConferenceType({ type: 'livechat' }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ t }) { return t === 'l'; }));
