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
exports.useScrollableMessageList = void 0;
const react_1 = require("react");
const useScrollableRecordList_1 = require("./useScrollableRecordList");
const mapMessageFromApi_1 = require("../../lib/utils/mapMessageFromApi");
const useScrollableMessageList = (messageList, fetchMessages, initialItemCount) => {
    const fetchItems = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        const batchChanges = yield fetchMessages(start, end);
        return Object.assign(Object.assign({}, (batchChanges.items && { items: batchChanges.items.map(mapMessageFromApi_1.mapMessageFromApi) })), (batchChanges.itemCount && { itemCount: batchChanges.itemCount }));
    }), [fetchMessages]);
    return (0, useScrollableRecordList_1.useScrollableRecordList)(messageList, fetchItems, initialItemCount);
};
exports.useScrollableMessageList = useScrollableMessageList;
