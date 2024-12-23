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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const initialRoomTypeFilterStructure = [
    {
        id: 'filter_by_room',
        text: 'Filter_by_room',
        isGroupTitle: true,
    },
    {
        id: 'd',
        text: 'Direct_Message',
        checked: false,
    },
    {
        id: 'discussions',
        text: 'Discussions',
        checked: false,
    },
    {
        id: 'l',
        text: 'Omnichannel',
        checked: false,
    },
    {
        id: 'p',
        text: 'Private_Channels',
        checked: false,
    },
    {
        id: 'c',
        text: 'Public_Channels',
        checked: false,
    },
    {
        id: 'teams',
        text: 'Teams',
        checked: false,
    },
];
const RoomsTableFilters = ({ setFilters }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [text, setText] = (0, react_1.useState)('');
    const [roomTypeSelectedOptions, setRoomTypeSelectedOptions] = (0, react_1.useState)([]);
    const roomTypeFilterStructure = (0, react_1.useMemo)(() => {
        return initialRoomTypeFilterStructure.map((option) => (Object.assign(Object.assign({}, option), { checked: roomTypeSelectedOptions.some((selectedOption) => selectedOption.id === option.id) })));
    }, [roomTypeSelectedOptions]);
    const handleSearchTextChange = (0, react_1.useCallback)((event) => {
        const text = event.currentTarget.value;
        setFilters({ searchText: text, types: roomTypeSelectedOptions });
        setText(text);
    }, [roomTypeSelectedOptions, setFilters]);
    const handleRoomTypeChange = (0, react_1.useCallback)((options) => {
        setFilters({ searchText: text, types: options });
        setRoomTypeSelectedOptions(options);
    }, [text, setFilters]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'form', onSubmit: (0, react_1.useCallback)((e) => e.preventDefault(), []), mb: 'x8', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { minWidth: 'x224', display: 'flex', m: 'x4', flexGrow: 2, children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { name: 'search-rooms', alignItems: 'center', placeholder: t('Search_rooms'), addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x20' }), onChange: handleSearchTextChange, value: text }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { minWidth: 'x224', m: 'x4', children: (0, jsx_runtime_1.jsx)(ui_client_1.MultiSelectCustom, { dropdownOptions: roomTypeFilterStructure, defaultTitle: 'All_rooms', selectedOptionsTitle: 'Rooms', setSelectedOptions: handleRoomTypeChange, selectedOptions: roomTypeSelectedOptions }) })] }));
};
exports.default = RoomsTableFilters;
