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
exports.useCannedResponseFilterOptions = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useCannedResponseFilterOptions = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getDepartments = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/department');
    const defaultOptions = (0, react_1.useMemo)(() => [
        ['all', t('All')],
        ['global', t('Public')],
        ['user', t('Private')],
    ], [t]);
    const [options, setOptions] = (0, react_1.useState)(defaultOptions);
    (0, react_1.useEffect)(() => {
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            const { departments } = yield getDepartments({ text: '' });
            const newOptions = departments.map((department) => [department._id, department.name]);
            setOptions(defaultOptions.concat(newOptions));
        });
        fetchData();
    }, [defaultOptions, getDepartments]);
    return options;
};
exports.useCannedResponseFilterOptions = useCannedResponseFilterOptions;
