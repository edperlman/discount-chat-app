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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
// TODO: review inner logic
const PrepareChannels = ({ channels, channelsCount, setChannels }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [current, setCurrent] = (0, react_1.useState)(0);
    const [itemsPerPage, setItemsPerPage] = (0, react_1.useState)(25);
    const showingResultsLabel = (0, react_1.useCallback)(({ count, current, itemsPerPage }) => t('Showing_results_of', { postProcess: 'sprintf', sprintf: [current + 1, Math.min(current + itemsPerPage, count), count] }), [t]);
    const itemsPerPageLabel = (0, react_1.useCallback)(() => t('Items_per_page:'), [t]);
    if (!channels.length) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Table, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableHead, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { width: 'x36', children: (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: channelsCount > 0, indeterminate: channelsCount > 0 && channelsCount !== channels.length, onChange: () => {
                                            setChannels((channels) => {
                                                const hasCheckedArchivedChannels = channels.some(({ is_archived, do_import }) => is_archived && do_import);
                                                const isChecking = channelsCount === 0;
                                                if (isChecking) {
                                                    return channels.map((channel) => (Object.assign(Object.assign({}, channel), { do_import: true })));
                                                }
                                                if (hasCheckedArchivedChannels) {
                                                    return channels.map((channel) => (channel.is_archived ? Object.assign(Object.assign({}, channel), { do_import: false }) : channel));
                                                }
                                                return channels.map((channel) => (Object.assign(Object.assign({}, channel), { do_import: false })));
                                            });
                                        } }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { is: 'th', align: 'end' })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableBody, { children: channels.slice(current, current + itemsPerPage).map((channel) => ((0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { width: 'x36', children: (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: channel.do_import, onChange: (event) => {
                                            const { checked } = event.currentTarget;
                                            setChannels((channels) => channels.map((_channel) => (_channel === channel ? Object.assign(Object.assign({}, _channel), { do_import: checked }) : _channel)));
                                        } }) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: channel.name }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { align: 'end', children: channel.is_archived && (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: 'danger', children: t('Importer_Archived') }) })] }, channel.channel_id))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Pagination, { current: current, itemsPerPage: itemsPerPage, itemsPerPageLabel: itemsPerPageLabel, showingResultsLabel: showingResultsLabel, count: channels.length || 0, onSetItemsPerPage: setItemsPerPage, onSetCurrent: setCurrent })] }));
};
exports.default = PrepareChannels;
