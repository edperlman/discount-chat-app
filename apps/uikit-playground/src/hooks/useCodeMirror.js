"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCodeMirror;
const state_1 = require("@codemirror/state");
const codemirror_1 = require("codemirror");
const react_1 = require("react");
function useCodeMirror(extensions, doc) {
    const view = (0, react_1.useRef)();
    const [element, setElement] = (0, react_1.useState)();
    const [changes, setChanges] = (0, react_1.useState)({
        value: '[]',
        isDispatch: true,
        cursor: 0,
    });
    const editor = (0, react_1.useCallback)((node) => {
        if (!node)
            return;
        setElement(node);
    }, []);
    const updateListener = codemirror_1.EditorView.updateListener.of((update) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (update.docChanged) {
            setChanges({
                value: ((_b = (_a = view.current) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.doc.toString()) || '',
                // @ts-expect-error Property 'annotations' does not exist on type 'Transaction'. Did you mean 'annotation'?
                isDispatch: ((_d = (_c = update === null || update === void 0 ? void 0 : update.transactions[0]) === null || _c === void 0 ? void 0 : _c.annotations) === null || _d === void 0 ? void 0 : _d.length) === 1 || false,
                cursor: ((_h = (_g = (_f = (_e = view.current) === null || _e === void 0 ? void 0 : _e.state) === null || _f === void 0 ? void 0 : _f.selection) === null || _g === void 0 ? void 0 : _g.main) === null || _h === void 0 ? void 0 : _h.head) || 0,
            });
        }
    });
    const setValue = (value, { from, to, cursor, }) => {
        var _a;
        try {
            (_a = view.current) === null || _a === void 0 ? void 0 : _a.dispatch({
                changes: {
                    from: from || 0,
                    to: to || view.current.state.doc.length,
                    insert: value || '',
                },
                selection: { anchor: cursor || 0 },
            });
        }
        catch (e) {
            // do nothing;
        }
    };
    (0, react_1.useEffect)(() => {
        if (!element)
            return;
        view.current = new codemirror_1.EditorView({
            state: state_1.EditorState.create({
                doc: doc || '',
                extensions: [updateListener, ...(extensions || [])],
            }),
            parent: element,
        });
        return () => { var _a; return (_a = view.current) === null || _a === void 0 ? void 0 : _a.destroy(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [element]);
    return { editor, changes, setValue };
}
