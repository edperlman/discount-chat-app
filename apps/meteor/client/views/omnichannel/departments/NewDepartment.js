"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const EditDepartment_1 = __importDefault(require("./EditDepartment"));
const EnterpriseDepartmentsModal_1 = __importDefault(require("../../../components/Omnichannel/modals/EnterpriseDepartmentsModal"));
const PageSkeleton_1 = __importDefault(require("../../../components/PageSkeleton"));
const NewDepartment = ({ id }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const getDepartmentCreationAvailable = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/department/isDepartmentCreationAvailable');
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['getDepartments'], () => getDepartmentCreationAvailable(), {
        onSuccess: (data) => {
            if (data.isDepartmentCreationAvailable === false) {
                setModal((0, jsx_runtime_1.jsx)(EnterpriseDepartmentsModal_1.default, { closeModal: () => setModal(null) }));
            }
        },
    });
    if (isError) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: t('Unavailable') });
    }
    if (!data || isLoading || !data.isDepartmentCreationAvailable) {
        return (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(EditDepartment_1.default, { id: id, title: t('New_Department') });
};
exports.default = NewDepartment;
