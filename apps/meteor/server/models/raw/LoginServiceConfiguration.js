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
exports.LoginServiceConfigurationRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class LoginServiceConfigurationRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'meteor_accounts_loginServiceConfiguration', trash, {
            preventSetUpdatedAt: true,
            collectionNameResolver(name) {
                return name;
            },
        });
    }
    createOrUpdateService(serviceName, serviceData) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = serviceName.toLowerCase();
            const existing = yield this.findOne({ service });
            if (!existing) {
                const insertResult = yield this.insertOne(Object.assign({ service }, serviceData));
                return insertResult.insertedId;
            }
            if (Object.keys(serviceData).length > 0) {
                yield this.updateOne({
                    _id: existing._id,
                }, {
                    $set: serviceData,
                });
            }
            return existing._id;
        });
    }
    removeService(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteOne({ _id });
        });
    }
    findOneByService(serviceName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ service: serviceName.toLowerCase() }, options);
        });
    }
}
exports.LoginServiceConfigurationRaw = LoginServiceConfigurationRaw;
