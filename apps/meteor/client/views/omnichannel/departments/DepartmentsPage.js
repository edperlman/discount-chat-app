"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const DepartmentsTable_1 = __importDefault(require("./DepartmentsTable"));
const EditDepartmentWithData_1 = __importDefault(require("./EditDepartmentWithData"));
const NewDepartment_1 = __importDefault(require("./NewDepartment"));
const Page_1 = require("../../../components/Page");
const DepartmentsPage = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const departmentsRoute = (0, ui_contexts_1.useRoute)('omnichannel-departments');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    const handleTabClick = (0, fuselage_hooks_1.useMutableCallback)((tab) => departmentsRoute.push({
        context: tab,
    }));
    const onAddNew = (0, fuselage_hooks_1.useMutableCallback)(() => departmentsRoute.push({
        context: 'new',
    }));
    if (context === 'new') {
        return (0, jsx_runtime_1.jsx)(NewDepartment_1.default, { id: id });
    }
    if (context === 'edit') {
        return (0, jsx_runtime_1.jsx)(EditDepartmentWithData_1.default, { id: id, title: t('Edit_Department') });
    }
    return ((0, jsx_runtime_1.jsx)(Page_1.Page, { flexDirection: 'row', children: (0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Departments'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onAddNew, children: t('Create_department') }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: !context, onClick: () => handleTabClick(undefined), children: t('All') }, 'departments'), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: context === 'archived', onClick: () => handleTabClick('archived'), children: t('Archived') }, 'archived')] }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(DepartmentsTable_1.default, { archived: context === 'archived' }) })] }) }));
};
exports.default = DepartmentsPage;
