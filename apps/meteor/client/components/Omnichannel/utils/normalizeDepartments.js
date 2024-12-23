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
exports.normalizeDepartments = void 0;
const normalizeDepartments = (departments, selectedDepartment, getDepartment) => __awaiter(void 0, void 0, void 0, function* () {
    const isSelectedDepartmentAlreadyOnList = () => departments.some((department) => department._id === selectedDepartment);
    if (!selectedDepartment || selectedDepartment === 'all' || isSelectedDepartmentAlreadyOnList()) {
        return departments;
    }
    try {
        const { department: missingDepartment } = yield getDepartment({});
        return missingDepartment
            ? [...departments, { _id: missingDepartment._id, label: missingDepartment.name, value: missingDepartment._id }]
            : departments;
    }
    catch (_a) {
        return departments;
    }
});
exports.normalizeDepartments = normalizeDepartments;
