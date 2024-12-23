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
const mock_providers_1 = require("@rocket.chat/mock-providers");
const react_1 = require("@testing-library/react");
const useDepartmentsList_1 = require("./useDepartmentsList");
const initialDepartmentsListMock = Array.from(Array(25)).map((_, index) => {
    return {
        _id: `${index}`,
        name: `test_department_${index}`,
        enabled: true,
        email: `test${index}@email.com`,
        showOnRegistration: false,
        showOnOfflineForm: false,
        type: 'd',
        _updatedAt: '2024-09-26T20:05:31.330Z',
        offlineMessageChannelName: '',
        numAgents: 0,
        ancestors: undefined,
        parentId: undefined,
    };
});
it('should not fetch and add selected department if it is already in the departments list on first fetch', () => __awaiter(void 0, void 0, void 0, function* () {
    const selectedDepartmentMappedToOption = {
        _id: '5',
        label: 'test_department_5',
        value: '5',
    };
    const getDepartmentByIdCallback = jest.fn();
    const { result } = (0, react_1.renderHook)(() => (0, useDepartmentsList_1.useDepartmentsList)({
        filter: '',
        onlyMyDepartments: true,
        haveAll: true,
        showArchived: true,
        selectedDepartment: '5',
    }), {
        legacyRoot: true,
        wrapper: (0, mock_providers_1.mockAppRoot)()
            .withEndpoint('GET', '/v1/livechat/department', () => ({
            count: 25,
            offset: 0,
            total: 25,
            departments: initialDepartmentsListMock,
        }))
            .withEndpoint('GET', `/v1/livechat/department/:_id`, getDepartmentByIdCallback)
            .build(),
    });
    expect(getDepartmentByIdCallback).not.toHaveBeenCalled();
    yield (0, react_1.waitFor)(() => expect(result.current.itemsList.items).toContainEqual(selectedDepartmentMappedToOption));
    // The expected length is 26 because the hook will add the 'All' item on run time
    yield (0, react_1.waitFor)(() => expect(result.current.itemsList.items.length).toBe(26));
}));
it('should fetch and add selected department if it is not part of departments list on first fetch', () => __awaiter(void 0, void 0, void 0, function* () {
    const missingDepartmentRawMock = {
        _id: '56f5be8bcf8cd67f9e9bcfdc',
        name: 'test_department_25',
        enabled: true,
        email: 'test25@email.com',
        showOnRegistration: false,
        showOnOfflineForm: false,
        type: 'd',
        _updatedAt: '2024-09-26T20:05:31.330Z',
        offlineMessageChannelName: '',
        numAgents: 0,
        ancestors: undefined,
        parentId: undefined,
    };
    const missingDepartmentMappedToOption = {
        _id: '56f5be8bcf8cd67f9e9bcfdc',
        label: 'test_department_25',
        value: '56f5be8bcf8cd67f9e9bcfdc',
    };
    const { result } = (0, react_1.renderHook)(() => (0, useDepartmentsList_1.useDepartmentsList)({
        filter: '',
        onlyMyDepartments: true,
        haveAll: true,
        showArchived: true,
        selectedDepartment: '56f5be8bcf8cd67f9e9bcfdc',
    }), {
        legacyRoot: true,
        wrapper: (0, mock_providers_1.mockAppRoot)()
            .withEndpoint('GET', '/v1/livechat/department', () => ({
            count: 25,
            offset: 0,
            total: 25,
            departments: initialDepartmentsListMock,
        }))
            .withEndpoint('GET', `/v1/livechat/department/:_id`, () => ({
            department: missingDepartmentRawMock,
        }))
            .build(),
    });
    yield (0, react_1.waitFor)(() => expect(result.current.itemsList.items).toContainEqual(missingDepartmentMappedToOption));
    // The expected length is 27 because the hook will add the 'All' item and the missing department on run time
    yield (0, react_1.waitFor)(() => expect(result.current.itemsList.items.length).toBe(27));
}));
