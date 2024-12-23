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
const server_1 = require("../../../../../app/api/server");
const getPaginationItems_1 = require("../../../../../app/api/server/helpers/getPaginationItems");
const Department_1 = require("../lib/Department");
const LivechatEnterprise_1 = require("../lib/LivechatEnterprise");
const units_1 = require("./lib/units");
server_1.API.v1.addRoute('livechat/units/:unitId/monitors', { authRequired: true, permissionsRequired: ['manage-livechat-monitors'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { unitId } = this.urlParams;
            if (!unitId) {
                return server_1.API.v1.failure('The "unitId" parameter is required');
            }
            return server_1.API.v1.success({
                monitors: yield (0, units_1.findUnitMonitors)({
                    unitId,
                }),
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/units', { authRequired: true, permissionsRequired: ['manage-livechat-units'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(params);
            const { sort } = yield this.parseJsonQuery();
            const { text } = this.queryParams;
            return server_1.API.v1.success(yield (0, units_1.findUnits)({
                text,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            }));
        });
    },
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { unitData, unitMonitors, unitDepartments } = this.bodyParams;
            return server_1.API.v1.success(yield LivechatEnterprise_1.LivechatEnterprise.saveUnit(null, unitData, unitMonitors, unitDepartments));
        });
    },
});
server_1.API.v1.addRoute('livechat/units/:id', { authRequired: true, permissionsRequired: ['manage-livechat-units'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = this.urlParams;
            const unit = yield (0, units_1.findUnitById)({
                unitId: id,
            });
            return server_1.API.v1.success(unit);
        });
    },
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { unitData, unitMonitors, unitDepartments } = this.bodyParams;
            const { id } = this.urlParams;
            return server_1.API.v1.success(yield LivechatEnterprise_1.LivechatEnterprise.saveUnit(id, unitData, unitMonitors, unitDepartments));
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = this.urlParams;
            return server_1.API.v1.success((yield LivechatEnterprise_1.LivechatEnterprise.removeUnit(id)).deletedCount);
        });
    },
});
server_1.API.v1.addRoute('livechat/units/:unitId/departments', { authRequired: true, permissionsRequired: ['manage-livechat-units'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { unitId } = this.urlParams;
            const { departments, total } = yield (0, Department_1.findAllDepartmentsByUnit)(unitId, offset, count);
            return server_1.API.v1.success({
                departments,
                count: departments.length,
                offset,
                total,
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/units/:unitId/departments/available', { authRequired: true, permissionsRequired: ['manage-livechat-units'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { unitId } = this.urlParams;
            const { text, onlyMyDepartments } = this.queryParams;
            const { departments, total } = yield (0, Department_1.findAllDepartmentsAvailable)(this.userId, unitId, offset, count, text, onlyMyDepartments === 'true');
            return server_1.API.v1.success({
                departments,
                count: departments.length,
                offset,
                total,
            });
        });
    },
});
