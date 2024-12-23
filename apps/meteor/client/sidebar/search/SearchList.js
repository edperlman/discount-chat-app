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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_virtuoso_1 = require("react-virtuoso");
const tinykeys_1 = __importDefault(require("tinykeys"));
const Row_1 = __importDefault(require("./Row"));
const CustomScrollbars_1 = require("../../components/CustomScrollbars");
const getConfig_1 = require("../../lib/utils/getConfig");
const useAvatarTemplate_1 = require("../hooks/useAvatarTemplate");
const usePreventDefault_1 = require("../hooks/usePreventDefault");
const useTemplateByViewMode_1 = require("../hooks/useTemplateByViewMode");
const mobileCheck = function () {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera || '');
    return check;
};
const shortcut = (() => {
    var _a;
    if (((_a = navigator.userAgentData) === null || _a === void 0 ? void 0 : _a.mobile) || mobileCheck()) {
        return '';
    }
    if (window.navigator.platform.toLowerCase().includes('mac')) {
        return '(\u2318+K)';
    }
    return '(Ctrl+K)';
})();
const LIMIT = parseInt(String((0, getConfig_1.getConfig)('Sidebar_Search_Spotlight_LIMIT', 20)));
const options = {
    sort: {
        lm: -1,
        name: 1,
    },
    limit: LIMIT,
};
const useSearchItems = (filterText) => {
    const [, mention, name] = (0, react_1.useMemo)(() => filterText.match(/(@|#)?(.*)/i) || [], [filterText]);
    const query = (0, react_1.useMemo)(() => {
        const filterRegex = new RegExp((0, string_helpers_1.escapeRegExp)(name), 'i');
        return Object.assign({ $or: [{ name: filterRegex }, { fname: filterRegex }] }, (mention && {
            t: mention === '@' ? 'd' : { $ne: 'd' },
        }));
    }, [name, mention]);
    const localRooms = (0, ui_contexts_1.useUserSubscriptions)(query, options);
    const usernamesFromClient = [...localRooms === null || localRooms === void 0 ? void 0 : localRooms.map(({ t, name }) => (t === 'd' ? name : null))].filter(Boolean);
    const searchForChannels = mention === '#';
    const searchForDMs = mention === '@';
    const type = (0, react_1.useMemo)(() => {
        if (searchForChannels) {
            return { users: false, rooms: true, includeFederatedRooms: true };
        }
        if (searchForDMs) {
            return { users: true, rooms: false };
        }
        return { users: true, rooms: true, includeFederatedRooms: true };
    }, [searchForChannels, searchForDMs]);
    const getSpotlight = (0, ui_contexts_1.useMethod)('spotlight');
    return (0, react_query_1.useQuery)(['sidebar/search/spotlight', name, usernamesFromClient, type, localRooms.map(({ _id, name }) => _id + name)], () => __awaiter(void 0, void 0, void 0, function* () {
        if (localRooms.length === LIMIT) {
            return localRooms;
        }
        const spotlight = yield getSpotlight(name, usernamesFromClient, type);
        const filterUsersUnique = ({ _id }, index, arr) => index === arr.findIndex((user) => _id === user._id);
        const roomFilter = (room) => !localRooms.find((item) => {
            var _a;
            return (room.t === 'd' && room.uids && room.uids.length > 1 && ((_a = room.uids) === null || _a === void 0 ? void 0 : _a.includes(item._id))) ||
                [item.rid, item._id].includes(room._id);
        });
        const usersFilter = (user) => !localRooms.find((room) => { var _a; return room.t === 'd' && room.uids && ((_a = room.uids) === null || _a === void 0 ? void 0 : _a.length) === 2 && room.uids.includes(user._id); });
        const userMap = (user) => ({
            _id: user._id,
            t: 'd',
            name: user.username,
            fname: user.name,
            avatarETag: user.avatarETag,
        });
        const resultsFromServer = [];
        resultsFromServer.push(...spotlight.users.filter(filterUsersUnique).filter(usersFilter).map(userMap));
        resultsFromServer.push(...spotlight.rooms.filter(roomFilter));
        const exact = resultsFromServer === null || resultsFromServer === void 0 ? void 0 : resultsFromServer.filter((item) => [item.name, item.fname].includes(name));
        return Array.from(new Set([...exact, ...localRooms, ...resultsFromServer]));
    }), {
        staleTime: 60000,
        keepPreviousData: true,
        placeholderData: localRooms,
    });
};
const useInput = (initial) => {
    const [value, setValue] = (0, react_1.useState)(initial);
    const onChange = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        setValue(e.currentTarget.value);
    });
    return { value, onChange, setValue };
};
const toggleSelectionState = (next, current, input) => {
    input === null || input === void 0 ? void 0 : input.setAttribute('aria-activedescendant', next.id);
    next.setAttribute('aria-selected', 'true');
    next.classList.add('rcx-sidebar-item--selected');
    if (current) {
        current.removeAttribute('aria-selected');
        current.classList.remove('rcx-sidebar-item--selected');
    }
};
const SearchList = (0, react_1.forwardRef)(function SearchList({ onClose }, ref) {
    const listId = (0, fuselage_hooks_1.useUniqueId)();
    const t = (0, ui_contexts_1.useTranslation)();
    const _a = useInput(''), { setValue: setFilterValue } = _a, filter = __rest(_a, ["setValue"]);
    const cursorRef = (0, react_1.useRef)(null);
    const autofocus = (0, fuselage_hooks_1.useMergedRefs)((0, fuselage_hooks_1.useAutoFocus)(), cursorRef);
    const listRef = (0, react_1.useRef)(null);
    const boxRef = (0, react_1.useRef)(null);
    const selectedElement = (0, react_1.useRef)(null);
    const itemIndexRef = (0, react_1.useRef)(0);
    const sidebarViewMode = (0, ui_contexts_1.useUserPreference)('sidebarViewMode');
    const useRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name');
    const sideBarItemTemplate = (0, useTemplateByViewMode_1.useTemplateByViewMode)();
    const avatarTemplate = (0, useAvatarTemplate_1.useAvatarTemplate)();
    const extended = sidebarViewMode === 'extended';
    const filterText = (0, fuselage_hooks_1.useDebouncedValue)(filter.value, 100);
    const placeholder = [t('Search'), shortcut].filter(Boolean).join(' ');
    const { data: items = [], isLoading } = useSearchItems(filterText);
    const itemData = (0, react_1.useMemo)(() => ({
        items,
        t,
        SideBarItemTemplate: sideBarItemTemplate,
        avatarTemplate,
        useRealName,
        extended,
        sidebarViewMode,
    }), [avatarTemplate, extended, items, useRealName, sideBarItemTemplate, sidebarViewMode, t]);
    const changeSelection = (0, fuselage_hooks_1.useMutableCallback)((dir) => {
        var _a, _b, _c, _d;
        let nextSelectedElement = null;
        if (dir === 'up') {
            const potentialElement = (_b = (_a = selectedElement.current) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.previousSibling;
            if (potentialElement) {
                nextSelectedElement = potentialElement.querySelector('a');
            }
        }
        else {
            const potentialElement = (_d = (_c = selectedElement.current) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.nextSibling;
            if (potentialElement) {
                nextSelectedElement = potentialElement.querySelector('a');
            }
        }
        if (nextSelectedElement) {
            toggleSelectionState(nextSelectedElement, selectedElement.current || undefined, (cursorRef === null || cursorRef === void 0 ? void 0 : cursorRef.current) || undefined);
            return nextSelectedElement;
        }
        return selectedElement.current;
    });
    const resetCursor = (0, fuselage_hooks_1.useMutableCallback)(() => {
        setTimeout(() => {
            var _a, _b;
            itemIndexRef.current = 0;
            (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndex({ index: itemIndexRef.current });
            selectedElement.current = (_b = boxRef.current) === null || _b === void 0 ? void 0 : _b.querySelector('a.rcx-sidebar-item');
            if (selectedElement.current) {
                toggleSelectionState(selectedElement.current, undefined, (cursorRef === null || cursorRef === void 0 ? void 0 : cursorRef.current) || undefined);
            }
        }, 0);
    });
    (0, usePreventDefault_1.usePreventDefault)(boxRef);
    (0, react_1.useEffect)(() => {
        resetCursor();
    });
    (0, react_1.useEffect)(() => {
        resetCursor();
    }, [filterText, resetCursor]);
    (0, react_1.useEffect)(() => {
        if (!(cursorRef === null || cursorRef === void 0 ? void 0 : cursorRef.current)) {
            return;
        }
        return (0, tinykeys_1.default)(cursorRef === null || cursorRef === void 0 ? void 0 : cursorRef.current, {
            Escape: (event) => {
                event.preventDefault();
                setFilterValue((value) => {
                    if (!value) {
                        onClose();
                    }
                    resetCursor();
                    return '';
                });
            },
            Tab: onClose,
            ArrowUp: () => {
                var _a;
                const currentElement = changeSelection('up');
                itemIndexRef.current = Math.max(itemIndexRef.current - 1, 0);
                (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndex({ index: itemIndexRef.current });
                selectedElement.current = currentElement;
            },
            ArrowDown: () => {
                var _a;
                const currentElement = changeSelection('down');
                itemIndexRef.current = Math.min(itemIndexRef.current + 1, items.length + 1);
                (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndex({ index: itemIndexRef.current });
                selectedElement.current = currentElement;
            },
            Enter: (event) => {
                event.preventDefault();
                if (selectedElement.current && items.length > 0) {
                    selectedElement.current.click();
                }
                else {
                    onClose();
                }
            },
        });
    }, [cursorRef, changeSelection, items.length, onClose, resetCursor, setFilterValue]);
    const handleClick = (e) => {
        var _a;
        if (e.target instanceof Element && [e.target.tagName, (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.tagName].includes('BUTTON')) {
            return;
        }
        return onClose();
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: 'absolute', "rcx-sidebar": true, h: 'full', display: 'flex', flexDirection: 'column', zIndex: 99, w: 'full', className: (0, css_in_js_1.css) `
				left: 0;
				top: 0;
			`, ref: ref, role: 'search', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Section, Object.assign({}, { flexShrink: 0 }, { is: 'form', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 'x12', w: 'full', children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ "aria-owns": listId, "data-qa": 'sidebar-search-input', ref: autofocus }, filter, { placeholder: placeholder, role: 'searchbox', addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'cross', size: 'x20', onClick: onClose }) })) }) })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { ref: boxRef, role: 'listbox', id: listId, tabIndex: -1, flexShrink: 1, h: 'full', w: 'full', "data-qa": 'sidebar-search-result', "aria-live": 'polite', "aria-atomic": 'true', "aria-busy": isLoading, onClick: handleClick, children: (0, jsx_runtime_1.jsx)(react_virtuoso_1.Virtuoso, { style: { height: '100%', width: '100%' }, totalCount: items.length, data: items, components: { Scroller: CustomScrollbars_1.VirtuosoScrollbars }, computeItemKey: (_, room) => room._id, itemContent: (_, data) => (0, jsx_runtime_1.jsx)(Row_1.default, { data: itemData, item: data }), ref: listRef }) })] }));
});
exports.default = SearchList;
