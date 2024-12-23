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
exports.createMobileSettings = void 0;
const server_1 = require("../../app/settings/server");
const createMobileSettings = () => server_1.settingsRegistry.addGroup('Mobile', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('Allow_Save_Media_to_Gallery', true, {
            type: 'boolean',
            public: true,
        });
        yield this.section('Screen_Lock', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Force_Screen_Lock', false, {
                    type: 'boolean',
                    i18nDescription: 'Force_Screen_Lock_description',
                    public: true,
                });
                yield this.add('Force_Screen_Lock_After', 1800, {
                    type: 'int',
                    i18nDescription: 'Force_Screen_Lock_After_description',
                    enableQuery: { _id: 'Force_Screen_Lock', value: true },
                    public: true,
                });
            });
        });
    });
});
exports.createMobileSettings = createMobileSettings;
