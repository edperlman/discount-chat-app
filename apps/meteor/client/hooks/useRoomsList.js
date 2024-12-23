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
exports.useRoomsList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useScrollableRecordList_1 = require("./lists/useScrollableRecordList");
const useComponentDidUpdate_1 = require("./useComponentDidUpdate");
const RecordList_1 = require("../lib/lists/RecordList");
const useRoomsList = (options) => {
    const [itemsList, setItemsList] = (0, react_1.useState)(() => new RecordList_1.RecordList());
    const reload = (0, react_1.useCallback)(() => setItemsList(new RecordList_1.RecordList()), []);
    const getRooms = (0, ui_contexts_1.useEndpoint)('GET', '/v1/rooms.autocomplete.channelAndPrivate.withPagination');
    (0, useComponentDidUpdate_1.useComponentDidUpdate)(() => {
        options && reload();
    }, [options, reload]);
    const fetchData = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        const { items: rooms, total } = yield getRooms({
            selector: JSON.stringify({ name: options.text || '' }),
            offset: start,
            count: start + end,
            sort: JSON.stringify({ name: 1 }),
        });
        const items = rooms.map((room) => {
            var _a, _b;
            return ({
                _id: room._id,
                _updatedAt: new Date(room._updatedAt),
                label: (_a = room.name) !== null && _a !== void 0 ? _a : '',
                value: (_b = room.name) !== null && _b !== void 0 ? _b : '',
            });
        });
        return {
            items,
            itemCount: total,
        };
    }), [getRooms, options.text]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableRecordList_1.useScrollableRecordList)(itemsList, fetchData, 25);
    return {
        reload,
        itemsList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useRoomsList = useRoomsList;
