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
exports.useDepartmentsByUnitsList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useScrollableRecordList_1 = require("../../hooks/lists/useScrollableRecordList");
const useComponentDidUpdate_1 = require("../../hooks/useComponentDidUpdate");
const RecordList_1 = require("../../lib/lists/RecordList");
const useDepartmentsByUnitsList = (options) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const [itemsList, setItemsList] = (0, react_1.useState)(() => new RecordList_1.RecordList());
    const reload = (0, react_1.useCallback)(() => setItemsList(new RecordList_1.RecordList()), []);
    const getDepartments = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/units/:unitId/departments/available', { unitId: options.unitId || 'none' });
    (0, useComponentDidUpdate_1.useComponentDidUpdate)(() => {
        options && reload();
    }, [options, reload]);
    const fetchData = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        const { departments, total } = yield getDepartments({
            text: options.filter,
            offset: start,
            count: end + start,
        });
        return {
            items: departments.map((_a) => {
                var { _id, name, _updatedAt } = _a, department = __rest(_a, ["_id", "name", "_updatedAt"]);
                return Object.assign(Object.assign({}, department), { _id, name: department.archived ? `${name} [${t('Archived')}]` : name, label: name, value: _id });
            }),
            itemCount: total,
        };
    }), [getDepartments, options.filter, t]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableRecordList_1.useScrollableRecordList)(itemsList, fetchData, 25);
    return {
        reload,
        itemsList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useDepartmentsByUnitsList = useDepartmentsByUnitsList;
