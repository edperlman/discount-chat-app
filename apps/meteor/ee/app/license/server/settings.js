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
const server_1 = require("../../../../app/settings/server");
// The proper name for this group is Premium, but we can't change it because it's already in use and we will break the settings
// TODO: Keep this until next major updates
await server_1.settingsRegistry.addGroup('Enterprise', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.section('Enterprise', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('Enterprise_License', '', {
                    type: 'string',
                    i18nLabel: 'Premium_License',
                    alert: 'Premium_License_alert',
                });
                yield this.add('Enterprise_License_Data', '', {
                    type: 'string',
                    hidden: true,
                    public: false,
                });
                yield this.add('Enterprise_License_Status', '', {
                    readonly: true,
                    type: 'string',
                    i18nLabel: 'Status',
                });
            });
        });
        yield this.add('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days', -1, {
            type: 'int',
            readonly: true,
            public: true,
        });
    });
});
