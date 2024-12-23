"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRecordList = void 0;
const react_1 = require("react");
const useRecordList = (recordList) => {
    const [state, setState] = (0, react_1.useState)(() => ({
        phase: recordList.phase,
        items: recordList.items,
        itemCount: recordList.itemCount,
        error: undefined,
    }));
    (0, react_1.useEffect)(() => {
        const disconnectMutatingEvent = recordList.on('mutating', () => {
            setState(() => ({
                phase: recordList.phase,
                items: recordList.items,
                itemCount: recordList.itemCount,
                error: undefined,
            }));
        });
        const disconnectMutatedEvent = recordList.on('mutated', () => {
            setState((prevState) => ({
                phase: recordList.phase,
                items: recordList.items,
                itemCount: recordList.itemCount,
                error: prevState.error,
            }));
        });
        const disconnectClearedEvent = recordList.on('cleared', () => {
            setState(() => ({
                phase: recordList.phase,
                items: recordList.items,
                itemCount: recordList.itemCount,
                error: undefined,
            }));
        });
        const disconnectErroredEvent = recordList.on('errored', (error) => {
            setState((state) => (Object.assign(Object.assign({}, state), { error })));
        });
        return () => {
            disconnectMutatingEvent();
            disconnectMutatedEvent();
            disconnectClearedEvent();
            disconnectErroredEvent();
        };
    }, [recordList]);
    return state;
};
exports.useRecordList = useRecordList;
