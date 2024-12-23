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
exports.useMonitorsList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useScrollableRecordList_1 = require("../../hooks/lists/useScrollableRecordList");
const useComponentDidUpdate_1 = require("../../hooks/useComponentDidUpdate");
const RecordList_1 = require("../../lib/lists/RecordList");
const useMonitorsList = (options) => {
    const [itemsList, setItemsList] = (0, react_1.useState)(() => new RecordList_1.RecordList());
    const reload = (0, react_1.useCallback)(() => setItemsList(new RecordList_1.RecordList()), []);
    const getMonitors = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/monitors');
    (0, useComponentDidUpdate_1.useComponentDidUpdate)(() => {
        options && reload();
    }, [options, reload]);
    const fetchData = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        const { monitors, total } = yield getMonitors({
            text: options.filter,
            offset: start,
            count: end + start,
            sort: JSON.stringify({ username: 1 }),
        });
        return {
            items: monitors.map((members) => (Object.assign(Object.assign({}, members), { label: members.username, value: members._id }))),
            itemCount: total,
        };
    }), [getMonitors, options.filter]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableRecordList_1.useScrollableRecordList)(itemsList, fetchData, 25);
    return {
        reload,
        itemsList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useMonitorsList = useMonitorsList;
