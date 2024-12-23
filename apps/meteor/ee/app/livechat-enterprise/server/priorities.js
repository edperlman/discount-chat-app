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
exports.createDefaultPriorities = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const defaultPriorities = [
    {
        i18n: 'Lowest',
        sortItem: core_typings_1.LivechatPriorityWeight.LOWEST,
        dirty: false,
    },
    {
        i18n: 'Low',
        sortItem: core_typings_1.LivechatPriorityWeight.LOW,
        dirty: false,
    },
    {
        i18n: 'Medium',
        sortItem: core_typings_1.LivechatPriorityWeight.MEDIUM,
        dirty: false,
    },
    {
        i18n: 'High',
        sortItem: core_typings_1.LivechatPriorityWeight.HIGH,
        dirty: false,
    },
    {
        i18n: 'Highest',
        sortItem: core_typings_1.LivechatPriorityWeight.HIGHEST,
        dirty: false,
    },
];
const createDefaultPriorities = () => __awaiter(void 0, void 0, void 0, function* () {
    const priorities = yield models_1.LivechatPriority.col.countDocuments({});
    if (!priorities) {
        yield models_1.LivechatPriority.insertMany(defaultPriorities);
    }
});
exports.createDefaultPriorities = createDefaultPriorities;
