"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const codePrettier_1 = __importDefault(require("../utils/codePrettier"));
const json5_1 = __importDefault(require("json5"));
// Todo: needs to make it more strict
function isILayoutblock(obj) {
    return obj && typeof obj === 'object' && 'surface' in obj && 'blocks' in obj;
}
const useFormatCodeMirrorValue = (callback, changes) => {
    (0, react_1.useEffect)(() => {
        if (changes === null || changes === void 0 ? void 0 : changes.isDispatch)
            return;
        try {
            const parsedCode = json5_1.default.parse(changes.value);
            if (!isILayoutblock(parsedCode))
                throw new Error('Please enter a valid LayoutBlock');
            (0, codePrettier_1.default)(changes.value, changes.cursor || 0).then((prettierCode) => {
                callback(parsedCode, prettierCode);
            });
        }
        catch (e) {
            // do nothing
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changes]);
};
exports.default = useFormatCodeMirrorValue;
