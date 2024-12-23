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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const livechatDepartmentStub = {
    findOneById: sinon_1.default.stub(),
    addDepartmentToUnit: sinon_1.default.stub(),
    removeDepartmentFromUnit: sinon_1.default.stub(),
};
const livechatUnitStub = {
    findOneById: sinon_1.default.stub(),
    decrementDepartmentsCount: sinon_1.default.stub(),
    incrementDepartmentsCount: sinon_1.default.stub(),
};
const hasAnyRoleStub = sinon_1.default.stub();
const getUnitsFromUserStub = sinon_1.default.stub();
const { manageDepartmentUnit } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../app/livechat-enterprise/server/hooks/manageDepartmentUnit.ts', {
    '../methods/getUnitsFromUserRoles': {
        getUnitsFromUser: getUnitsFromUserStub,
    },
    '../../../../../app/authorization/server/functions/hasRole': {
        hasAnyRoleAsync: hasAnyRoleStub,
    },
    '@rocket.chat/models': {
        LivechatDepartment: livechatDepartmentStub,
        LivechatUnit: livechatUnitStub,
    },
});
(0, mocha_1.describe)('hooks/manageDepartmentUnit', () => {
    beforeEach(() => {
        livechatDepartmentStub.findOneById.reset();
        livechatDepartmentStub.addDepartmentToUnit.reset();
        livechatDepartmentStub.removeDepartmentFromUnit.reset();
        livechatUnitStub.findOneById.reset();
        livechatUnitStub.decrementDepartmentsCount.reset();
        livechatUnitStub.incrementDepartmentsCount.reset();
        hasAnyRoleStub.reset();
    });
    (0, mocha_1.it)('should not perform any operation when an invalid department is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatDepartmentStub.findOneById.resolves(null);
        hasAnyRoleStub.resolves(true);
        getUnitsFromUserStub.resolves(['unit-id']);
        yield manageDepartmentUnit({ userId: 'user-id', departmentId: 'department-id', unitId: 'unit-id' });
        (0, chai_1.expect)(livechatDepartmentStub.addDepartmentToUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatDepartmentStub.removeDepartmentFromUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.decrementDepartmentsCount.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.incrementDepartmentsCount.notCalled).to.be.true;
    }));
    (0, mocha_1.it)('should not perform any operation if the provided department is already in unit', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatDepartmentStub.findOneById.resolves({ _id: 'department-id', ancestors: ['unit-id'], parentId: 'unit-id' });
        hasAnyRoleStub.resolves(true);
        getUnitsFromUserStub.resolves(['unit-id']);
        yield manageDepartmentUnit({ userId: 'user-id', departmentId: 'department-id', unitId: 'unit-id' });
        (0, chai_1.expect)(livechatDepartmentStub.addDepartmentToUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatDepartmentStub.removeDepartmentFromUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.decrementDepartmentsCount.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.incrementDepartmentsCount.notCalled).to.be.true;
    }));
    (0, mocha_1.it)("should not perform any operation if user is a monitor and can't manage new unit", () => __awaiter(void 0, void 0, void 0, function* () {
        livechatDepartmentStub.findOneById.resolves({ _id: 'department-id', ancestors: ['unit-id'], parentId: 'unit-id' });
        hasAnyRoleStub.resolves(false);
        getUnitsFromUserStub.resolves(['unit-id']);
        yield manageDepartmentUnit({ userId: 'user-id', departmentId: 'department-id', unitId: 'new-unit-id' });
        (0, chai_1.expect)(livechatDepartmentStub.addDepartmentToUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatDepartmentStub.removeDepartmentFromUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.decrementDepartmentsCount.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.incrementDepartmentsCount.notCalled).to.be.true;
    }));
    (0, mocha_1.it)("should not perform any operation if user is a monitor and can't manage current unit", () => __awaiter(void 0, void 0, void 0, function* () {
        livechatDepartmentStub.findOneById.resolves({ _id: 'department-id', ancestors: ['unit-id'], parentId: 'unit-id' });
        hasAnyRoleStub.resolves(false);
        getUnitsFromUserStub.resolves(['new-unit-id']);
        yield manageDepartmentUnit({ userId: 'user-id', departmentId: 'department-id', unitId: 'new-unit-id' });
        (0, chai_1.expect)(livechatDepartmentStub.addDepartmentToUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatDepartmentStub.removeDepartmentFromUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.decrementDepartmentsCount.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.incrementDepartmentsCount.notCalled).to.be.true;
    }));
    (0, mocha_1.it)('should not perform any operation if user is an admin/manager but an invalid unit is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatDepartmentStub.findOneById.resolves({ _id: 'department-id', ancestors: ['unit-id'], parentId: 'unit-id' });
        livechatUnitStub.findOneById.resolves(undefined);
        hasAnyRoleStub.resolves(true);
        getUnitsFromUserStub.resolves(undefined);
        yield manageDepartmentUnit({ userId: 'user-id', departmentId: 'department-id', unitId: 'new-unit-id' });
        (0, chai_1.expect)(livechatDepartmentStub.addDepartmentToUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatDepartmentStub.removeDepartmentFromUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.decrementDepartmentsCount.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.incrementDepartmentsCount.notCalled).to.be.true;
    }));
    (0, mocha_1.it)('should remove department from its current unit if user is an admin/manager', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatDepartmentStub.findOneById.resolves({ _id: 'department-id', ancestors: ['unit-id'], parentId: 'unit-id' });
        hasAnyRoleStub.resolves(true);
        getUnitsFromUserStub.resolves(undefined);
        yield manageDepartmentUnit({ userId: 'user-id', departmentId: 'department-id', unitId: undefined });
        (0, chai_1.expect)(livechatDepartmentStub.addDepartmentToUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.incrementDepartmentsCount.notCalled).to.be.true;
        (0, chai_1.expect)(livechatDepartmentStub.removeDepartmentFromUnit.calledOnceWith('department-id')).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.decrementDepartmentsCount.calledOnceWith('unit-id')).to.be.true;
    }));
    (0, mocha_1.it)('should add department to a unit if user is an admin/manager', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatDepartmentStub.findOneById.resolves({ _id: 'department-id' });
        livechatUnitStub.findOneById.resolves({ _id: 'unit-id' });
        hasAnyRoleStub.resolves(true);
        getUnitsFromUserStub.resolves(undefined);
        yield manageDepartmentUnit({ userId: 'user-id', departmentId: 'department-id', unitId: 'unit-id' });
        (0, chai_1.expect)(livechatDepartmentStub.addDepartmentToUnit.calledOnceWith('department-id', 'unit-id', ['unit-id'])).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.incrementDepartmentsCount.calledOnceWith('unit-id')).to.be.true;
        (0, chai_1.expect)(livechatDepartmentStub.removeDepartmentFromUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.decrementDepartmentsCount.notCalled).to.be.true;
    }));
    (0, mocha_1.it)('should move department to a new unit if user is an admin/manager', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatDepartmentStub.findOneById.resolves({ _id: 'department-id', ancestors: ['unit-id'], parentId: 'unit-id' });
        livechatUnitStub.findOneById.resolves({ _id: 'new-unit-id' });
        hasAnyRoleStub.resolves(true);
        getUnitsFromUserStub.resolves(undefined);
        yield manageDepartmentUnit({ userId: 'user-id', departmentId: 'department-id', unitId: 'new-unit-id' });
        (0, chai_1.expect)(livechatDepartmentStub.addDepartmentToUnit.calledOnceWith('department-id', 'new-unit-id', ['new-unit-id'])).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.incrementDepartmentsCount.calledOnceWith('new-unit-id')).to.be.true;
        (0, chai_1.expect)(livechatDepartmentStub.removeDepartmentFromUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.decrementDepartmentsCount.calledOnceWith('unit-id')).to.be.true;
    }));
    (0, mocha_1.it)('should remove department from its current unit if user is a monitor that supervises the current unit', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatDepartmentStub.findOneById.resolves({ _id: 'department-id', ancestors: ['unit-id'], parentId: 'unit-id' });
        hasAnyRoleStub.resolves(false);
        getUnitsFromUserStub.resolves(['unit-id']);
        yield manageDepartmentUnit({ userId: 'user-id', departmentId: 'department-id', unitId: undefined });
        (0, chai_1.expect)(livechatDepartmentStub.addDepartmentToUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.incrementDepartmentsCount.notCalled).to.be.true;
        (0, chai_1.expect)(livechatDepartmentStub.removeDepartmentFromUnit.calledOnceWith('department-id')).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.decrementDepartmentsCount.calledOnceWith('unit-id')).to.be.true;
    }));
    (0, mocha_1.it)('should add department to a unit if user is a monitor that supervises the new unit', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatDepartmentStub.findOneById.resolves({ _id: 'department-id' });
        livechatUnitStub.findOneById.resolves({ _id: 'unit-id' });
        hasAnyRoleStub.resolves(false);
        getUnitsFromUserStub.resolves(['unit-id']);
        yield manageDepartmentUnit({ userId: 'user-id', departmentId: 'department-id', unitId: 'unit-id' });
        (0, chai_1.expect)(livechatDepartmentStub.addDepartmentToUnit.calledOnceWith('department-id', 'unit-id', ['unit-id'])).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.incrementDepartmentsCount.calledOnceWith('unit-id')).to.be.true;
        (0, chai_1.expect)(livechatDepartmentStub.removeDepartmentFromUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.decrementDepartmentsCount.notCalled).to.be.true;
    }));
    (0, mocha_1.it)('should move department to a new unit if user is a monitor that supervises the current and new units', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatDepartmentStub.findOneById.resolves({ _id: 'department-id', ancestors: ['unit-id'], parentId: 'unit-id' });
        livechatUnitStub.findOneById.resolves({ _id: 'unit-id' });
        hasAnyRoleStub.resolves(false);
        getUnitsFromUserStub.resolves(['unit-id', 'new-unit-id']);
        yield manageDepartmentUnit({ userId: 'user-id', departmentId: 'department-id', unitId: 'new-unit-id' });
        (0, chai_1.expect)(livechatDepartmentStub.addDepartmentToUnit.calledOnceWith('department-id', 'new-unit-id', ['new-unit-id'])).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.incrementDepartmentsCount.calledOnceWith('new-unit-id')).to.be.true;
        (0, chai_1.expect)(livechatDepartmentStub.removeDepartmentFromUnit.notCalled).to.be.true;
        (0, chai_1.expect)(livechatUnitStub.decrementDepartmentsCount.calledOnceWith('unit-id')).to.be.true;
    }));
});
