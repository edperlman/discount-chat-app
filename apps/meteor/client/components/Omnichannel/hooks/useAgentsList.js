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
exports.useAgentsList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useScrollableRecordList_1 = require("../../../hooks/lists/useScrollableRecordList");
const useComponentDidUpdate_1 = require("../../../hooks/useComponentDidUpdate");
const RecordList_1 = require("../../../lib/lists/RecordList");
const useAgentsList = (options) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [itemsList, setItemsList] = (0, react_1.useState)(() => new RecordList_1.RecordList());
    const reload = (0, react_1.useCallback)(() => setItemsList(new RecordList_1.RecordList()), []);
    const getAgents = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/users/agent');
    const { text, onlyAvailable = false, showIdleAgents = true, excludeId, haveAll, haveNoAgentsSelectedOption } = options;
    (0, useComponentDidUpdate_1.useComponentDidUpdate)(() => {
        options && reload();
    }, [options, reload]);
    const fetchData = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        const { users: agents, total } = yield getAgents(Object.assign(Object.assign(Object.assign({}, (text && { text })), (excludeId && { excludeId })), { showIdleAgents,
            onlyAvailable, offset: start, count: end + start, sort: `{ "name": 1 }` }));
        const items = agents.map((agent) => {
            const agentOption = {
                _updatedAt: new Date(agent._updatedAt),
                label: `${agent.name || agent._id} (@${agent.username})`,
                value: agent._id,
                _id: agent._id,
            };
            return agentOption;
        });
        haveAll &&
            items.unshift({
                label: t('All'),
                value: 'all',
                _updatedAt: new Date(),
                _id: 'all',
            });
        haveNoAgentsSelectedOption &&
            items.unshift({
                label: t('Empty_no_agent_selected'),
                value: 'no-agent-selected',
                _updatedAt: new Date(),
                _id: 'no-agent-selected',
            });
        return {
            items,
            itemCount: total + 1,
        };
    }), [excludeId, getAgents, haveAll, haveNoAgentsSelectedOption, onlyAvailable, showIdleAgents, t, text]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableRecordList_1.useScrollableRecordList)(itemsList, fetchData, 25);
    return {
        reload,
        itemsList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useAgentsList = useAgentsList;
