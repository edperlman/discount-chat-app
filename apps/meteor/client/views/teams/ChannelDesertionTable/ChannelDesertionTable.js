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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ChannelDesertionTableRow_1 = __importDefault(require("./ChannelDesertionTableRow"));
const GenericTable_1 = require("../../../components/GenericTable");
const useSort_1 = require("../../../components/GenericTable/hooks/useSort");
const ChannelDesertionTable = ({ rooms, eligibleRoomsLength, onChangeRoomSelection, selectedRooms, onToggleAllRooms, lastOwnerWarning, }) => {
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('name');
    const { t } = (0, react_i18next_1.useTranslation)();
    const selectedRoomsLength = Object.values(selectedRooms).filter(Boolean).length;
    const checked = eligibleRoomsLength === selectedRoomsLength;
    const indeterminate = eligibleRoomsLength && eligibleRoomsLength > selectedRoomsLength ? selectedRoomsLength > 0 : false;
    const results = (0, react_1.useMemo)(() => {
        if (!rooms) {
            return [];
        }
        const direction = sortDirection === 'asc' ? 1 : -1;
        return rooms.sort((a, b) => { var _a, _b, _c; 
        // eslint-disable-next-line no-nested-ternary
        return a[sortBy] && b[sortBy] ? ((_c = (_a = a[sortBy]) === null || _a === void 0 ? void 0 : _a.localeCompare((_b = b[sortBy]) !== null && _b !== void 0 ? _b : '')) !== null && _c !== void 0 ? _c : 1) * direction : direction; });
    }, [rooms, sortBy, sortDirection]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', height: 'x200', mbs: 24, children: (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { fixed: false, children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableHeader, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableHeaderCell, { sort: 'name', onClick: setSort, direction: sortDirection, active: sortBy === 'name', children: [(0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { indeterminate: indeterminate, checked: checked, onChange: onToggleAllRooms }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 8, children: t('Channel_name') })] }, 'name'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { sort: 'ts', onClick: setSort, direction: sortDirection, active: sortBy === 'ts', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { width: '100%', textAlign: 'end', children: t('Joined_at') }) }, 'ts')] }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: results === null || results === void 0 ? void 0 : results.map((room, key) => ((0, jsx_runtime_1.jsx)(ChannelDesertionTableRow_1.default, { room: room, onChange: onChangeRoomSelection, selected: '_id' in room && room._id ? !!selectedRooms[room._id] : false, lastOwnerWarning: lastOwnerWarning }, key))) })] }) }));
};
exports.default = ChannelDesertionTable;
