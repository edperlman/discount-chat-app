"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
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
exports.PersistenceAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const metadata_1 = require("../../../src/definition/metadata");
const accessors_1 = require("../../../src/server/accessors");
let PersistenceAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _usePersistenceAccessor_decorators;
    return _a = class PersistenceAccessorTestFixture {
            constructor() {
                this.mockAppId = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.mockAppId = 'testing-app';
                this.data = { hello: 'world' };
                const theData = this.data;
                this.mockPersisBridge = {
                    doCreate(data, appId) {
                        return Promise.resolve('id');
                    },
                    doCreateWithAssociations(data, assocs, appId) {
                        return Promise.resolve('id2');
                    },
                    doUpdate(id, data, upsert, appId) {
                        return Promise.resolve('id3');
                    },
                    doRemove(id, appId) {
                        return Promise.resolve(theData);
                    },
                    doRemoveByAssociations(assocs, appId) {
                        return Promise.resolve([theData]);
                    },
                    doUpdateByAssociations(associations, data, upsert, appId) {
                        return Promise.resolve('id4');
                    },
                };
                this.mockAssoc = new metadata_1.RocketChatAssociationRecord(metadata_1.RocketChatAssociationModel.USER, 'fake-id');
            }
            usePersistenceAccessor() {
                return __awaiter(this, void 0, void 0, function* () {
                    (0, alsatian_1.Expect)(() => new accessors_1.Persistence(this.mockPersisBridge, this.mockAppId)).not.toThrow();
                    const sp1 = (0, alsatian_1.SpyOn)(this.mockPersisBridge, 'doCreate');
                    const sp2 = (0, alsatian_1.SpyOn)(this.mockPersisBridge, 'doCreateWithAssociations');
                    const sp3 = (0, alsatian_1.SpyOn)(this.mockPersisBridge, 'doUpdate');
                    const sp4 = (0, alsatian_1.SpyOn)(this.mockPersisBridge, 'doRemove');
                    const sp5 = (0, alsatian_1.SpyOn)(this.mockPersisBridge, 'doRemoveByAssociations');
                    const sp6 = (0, alsatian_1.SpyOn)(this.mockPersisBridge, 'doUpdateByAssociations');
                    const ps = new accessors_1.Persistence(this.mockPersisBridge, this.mockAppId);
                    (0, alsatian_1.Expect)(yield ps.create(this.data)).toBe('id');
                    (0, alsatian_1.Expect)(this.mockPersisBridge.doCreate).toHaveBeenCalledWith(this.data, this.mockAppId);
                    (0, alsatian_1.Expect)(yield ps.createWithAssociation(this.data, this.mockAssoc)).toBe('id2');
                    (0, alsatian_1.Expect)(yield ps.createWithAssociations(this.data, [this.mockAssoc])).toBe('id2');
                    (0, alsatian_1.Expect)(this.mockPersisBridge.doCreateWithAssociations).toHaveBeenCalled().exactly(2);
                    (0, alsatian_1.Expect)(yield ps.update('id', this.data)).toBe('id3');
                    (0, alsatian_1.Expect)(this.mockPersisBridge.doUpdate).toHaveBeenCalledWith('id', this.data, false, this.mockAppId);
                    (0, alsatian_1.Expect)(yield ps.remove('id')).toEqual(this.data);
                    (0, alsatian_1.Expect)(this.mockPersisBridge.doRemove).toHaveBeenCalledWith('id', this.mockAppId);
                    (0, alsatian_1.Expect)(yield ps.removeByAssociation(this.mockAssoc)).toBeDefined();
                    (0, alsatian_1.Expect)(yield ps.removeByAssociations([this.mockAssoc])).toBeDefined();
                    (0, alsatian_1.Expect)(this.mockPersisBridge.doRemoveByAssociations).toHaveBeenCalled().exactly(2);
                    (0, alsatian_1.Expect)(yield ps.updateByAssociation(this.mockAssoc, this.data)).toBeDefined();
                    (0, alsatian_1.Expect)(yield ps.updateByAssociations([this.mockAssoc], this.data)).toBeDefined();
                    (0, alsatian_1.Expect)(this.mockPersisBridge.doUpdateByAssociations).toHaveBeenCalled().exactly(2);
                    sp1.restore();
                    sp2.restore();
                    sp3.restore();
                    sp4.restore();
                    sp5.restore();
                    sp6.restore();
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _usePersistenceAccessor_decorators = [(0, alsatian_1.AsyncTest)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _usePersistenceAccessor_decorators, { kind: "method", name: "usePersistenceAccessor", static: false, private: false, access: { has: obj => "usePersistenceAccessor" in obj, get: obj => obj.usePersistenceAccessor }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PersistenceAccessorTestFixture = PersistenceAccessorTestFixture;
