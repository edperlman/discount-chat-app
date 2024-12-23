"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const roomCoordinator_1 = require("../../lib/rooms/roomCoordinator");
const DefaultParentRoomField = ({ defaultParentRoom }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const query = (0, react_1.useMemo)(() => ({
        roomId: defaultParentRoom,
    }), [defaultParentRoom]);
    const roomsInfoEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/rooms.info');
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['defaultParentRoomInfo', query], () => __awaiter(void 0, void 0, void 0, function* () { return roomsInfoEndpoint(query); }), {
        refetchOnWindowFocus: false,
    });
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: 'full' });
    }
    if (!(data === null || data === void 0 ? void 0 : data.room) || isError) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: t('Error') });
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { defaultValue: roomCoordinator_1.roomCoordinator.getRoomName(data.room.t, {
            _id: data.room._id,
            fname: data.room.fname,
            name: data.room.name,
            prid: data.room.prid,
        }), disabled: true }));
};
exports.default = DefaultParentRoomField;
