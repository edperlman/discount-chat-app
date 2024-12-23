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
exports.useCannedResponseList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useScrollableRecordList_1 = require("../../hooks/lists/useScrollableRecordList");
const useComponentDidUpdate_1 = require("../../hooks/useComponentDidUpdate");
const CannedResponseList_1 = require("../../lib/lists/CannedResponseList");
const useCannedResponseList = (options) => {
    const [cannedList, setCannedList] = (0, react_1.useState)(() => new CannedResponseList_1.CannedResponseList(options));
    const reload = (0, react_1.useCallback)(() => setCannedList(new CannedResponseList_1.CannedResponseList(options)), [options]);
    (0, useComponentDidUpdate_1.useComponentDidUpdate)(() => {
        options && reload();
    }, [options, reload]);
    (0, react_1.useEffect)(() => {
        if (cannedList.options !== options) {
            cannedList.updateFilters(options);
        }
    }, [cannedList, options]);
    const getCannedResponses = (0, ui_contexts_1.useEndpoint)('GET', '/v1/canned-responses');
    const getDepartments = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/department');
    const fetchData = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        const { cannedResponses, total } = yield getCannedResponses(Object.assign(Object.assign(Object.assign(Object.assign({}, (options.filter && { text: options.filter })), (options.type && ['global', 'user'].find((option) => option === options.type) && { scope: options.type })), (options.type &&
            !['global', 'user', 'all'].find((option) => option === options.type) && {
            scope: 'department',
            departmentId: options.type,
        })), { offset: start, count: end + start }));
        const { departments } = yield getDepartments({ text: '' });
        return {
            items: cannedResponses.map((cannedResponse) => {
                if (cannedResponse.departmentId) {
                    departments.forEach((department) => {
                        if (cannedResponse.departmentId === department._id) {
                            cannedResponse.departmentName = department.name;
                        }
                    });
                }
                cannedResponse._updatedAt = new Date(cannedResponse._updatedAt);
                cannedResponse._createdAt = new Date(cannedResponse._createdAt);
                return cannedResponse;
            }),
            itemCount: total,
        };
    }), [getCannedResponses, getDepartments, options.filter, options.type]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableRecordList_1.useScrollableRecordList)(cannedList, fetchData);
    return {
        reload,
        cannedList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useCannedResponseList = useCannedResponseList;
