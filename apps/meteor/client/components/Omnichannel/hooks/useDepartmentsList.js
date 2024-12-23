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
exports.useDepartmentsList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useScrollableRecordList_1 = require("../../../hooks/lists/useScrollableRecordList");
const useComponentDidUpdate_1 = require("../../../hooks/useComponentDidUpdate");
const RecordList_1 = require("../../../lib/lists/RecordList");
const normalizeDepartments_1 = require("../utils/normalizeDepartments");
const useDepartmentsList = (options) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const [itemsList, setItemsList] = (0, react_1.useState)(() => new RecordList_1.RecordList());
    const reload = (0, react_1.useCallback)(() => setItemsList(new RecordList_1.RecordList()), []);
    const getDepartments = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/department');
    const getDepartment = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/department/:_id', { _id: (_a = options.selectedDepartment) !== null && _a !== void 0 ? _a : '' });
    (0, useComponentDidUpdate_1.useComponentDidUpdate)(() => {
        options && reload();
    }, [options, reload]);
    const fetchData = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { departments, total } = yield getDepartments({
            onlyMyDepartments: `${!!options.onlyMyDepartments}`,
            text: options.filter,
            offset: start,
            count: end + start,
            sort: `{ "name": 1 }`,
            excludeDepartmentId: options.excludeDepartmentId,
            enabled: options.enabled ? 'true' : 'false',
            showArchived: options.showArchived ? 'true' : 'false',
        });
        const items = departments
            .filter((department) => {
            if (options.departmentId && department._id === options.departmentId) {
                return false;
            }
            return true;
        })
            .map((_a) => {
            var { _id, name } = _a, department = __rest(_a, ["_id", "name"]);
            return ({
                _id,
                label: department.archived ? `${name} [${t('Archived')}]` : name,
                value: _id,
            });
        });
        const normalizedItems = yield (0, normalizeDepartments_1.normalizeDepartments)(items, (_a = options.selectedDepartment) !== null && _a !== void 0 ? _a : '', getDepartment);
        options.haveAll &&
            normalizedItems.unshift({
                _id: '',
                label: t('All'),
                value: 'all',
            });
        options.haveNone &&
            normalizedItems.unshift({
                _id: '',
                label: t('None'),
                value: '',
            });
        return {
            items: normalizedItems,
            itemCount: options.departmentId ? total - 1 : total,
        };
    }), [
        getDepartments,
        options.onlyMyDepartments,
        options.filter,
        options.excludeDepartmentId,
        options.enabled,
        options.showArchived,
        options.selectedDepartment,
        options.haveAll,
        options.haveNone,
        options.departmentId,
        getDepartment,
        t,
    ]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableRecordList_1.useScrollableRecordList)(itemsList, fetchData, 25);
    return {
        reload,
        itemsList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useDepartmentsList = useDepartmentsList;
