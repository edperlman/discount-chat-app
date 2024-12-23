"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ChannelDeletionTableRow_1 = __importDefault(require("./ChannelDeletionTableRow"));
const GenericTable_1 = require("../../../../../../components/GenericTable");
const useSort_1 = require("../../../../../../components/GenericTable/hooks/useSort");
const ChannelDeletionTable = ({ rooms, onChangeRoomSelection, selectedRooms, onToggleAllRooms }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { sortBy, sortDirection, setSort } = (0, useSort_1.useSort)('name');
    const selectedRoomsLength = Object.values(selectedRooms).filter(Boolean).length;
    const getSortedChannels = () => {
        if (rooms) {
            const sortedRooms = [...rooms];
            if (sortBy === 'name') {
                sortedRooms.sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0));
            }
            if (sortBy === 'usersCount') {
                sortedRooms.sort((a, b) => a.usersCount - b.usersCount);
            }
            if (sortDirection === 'desc') {
                return sortedRooms === null || sortedRooms === void 0 ? void 0 : sortedRooms.reverse();
            }
            return sortedRooms;
        }
    };
    const sortedRooms = getSortedChannels();
    const checked = rooms.length === selectedRoomsLength;
    const indeterminate = rooms.length > selectedRoomsLength && selectedRoomsLength > 0;
    const headers = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableHeaderCell, { sort: 'name', onClick: setSort, direction: sortDirection, active: sortBy === 'name', children: [(0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { indeterminate: indeterminate, checked: checked, onChange: onToggleAllRooms }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 8, children: t('Channel_name') })] }, 'name'), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeaderCell, { sort: 'usersCount', onClick: setSort, direction: sortDirection, active: sortBy === 'usersCount', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { width: '100%', textAlign: 'end', children: t('Members') }) }, 'usersCount')] }));
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', height: 'x200', mbs: 24, children: (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableBody, { children: sortedRooms === null || sortedRooms === void 0 ? void 0 : sortedRooms.map((room) => ((0, jsx_runtime_1.jsx)(ChannelDeletionTableRow_1.default, { room: room, onChange: onChangeRoomSelection, selected: !!selectedRooms[room._id] }, room._id))) })] }) }));
};
exports.default = ChannelDeletionTable;
