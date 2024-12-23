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
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const airGappedRestrictionsWrapper_1 = require("../../../../../app/license/server/airGappedRestrictionsWrapper");
let restrictionFlag = true;
const airgappedModule = {
    get restricted() {
        return restrictionFlag;
    },
};
proxyquire_1.default.noCallThru().load('../../../../server/patches/airGappedRestrictionsWrapper.ts', {
    '@rocket.chat/license': {
        AirGappedRestriction: airgappedModule,
    },
    '../../../app/license/server/airGappedRestrictionsWrapper': {
        applyAirGappedRestrictionsValidation: airGappedRestrictionsWrapper_1.applyAirGappedRestrictionsValidation,
    },
});
describe('#airGappedRestrictionsWrapper()', () => {
    it('should throw an error when the workspace is restricted', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, chai_1.expect)((0, airGappedRestrictionsWrapper_1.applyAirGappedRestrictionsValidation)(sinon_1.default.stub())).to.be.rejectedWith('restricted-workspace');
    }));
    it('should NOT throw an error when the workspace is not restricted', () => __awaiter(void 0, void 0, void 0, function* () {
        restrictionFlag = false;
        const spy = sinon_1.default.stub();
        yield (0, chai_1.expect)((0, airGappedRestrictionsWrapper_1.applyAirGappedRestrictionsValidation)(spy)).to.eventually.equal(undefined);
        (0, chai_1.expect)(spy.calledOnce).to.be.true;
    }));
});
