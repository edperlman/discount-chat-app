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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const lib_1 = require("./lib");
const Contextualbar_1 = require("../../../components/Contextualbar");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const useSingleFileInput_1 = require("../../../hooks/useSingleFileInput");
function EditSound(_a) {
    var { close, onChange, data } = _a, props = __rest(_a, ["close", "onChange", "data"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { _id, name: previousName } = data || {};
    const previousSound = (0, react_1.useMemo)(() => data || {}, [data]);
    const [name, setName] = (0, react_1.useState)(() => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.name) !== null && _a !== void 0 ? _a : ''; });
    const [sound, setSound] = (0, react_1.useState)(() => data);
    (0, react_1.useEffect)(() => {
        setName(previousName || '');
        setSound(previousSound || '');
    }, [previousName, previousSound, _id]);
    const deleteCustomSound = (0, ui_contexts_1.useMethod)('deleteCustomSound');
    const uploadCustomSound = (0, ui_contexts_1.useMethod)('uploadCustomSound');
    const insertOrUpdateSound = (0, ui_contexts_1.useMethod)('insertOrUpdateSound');
    const handleChangeFile = (0, react_1.useCallback)((soundFile) => {
        setSound(soundFile);
    }, []);
    const hasUnsavedChanges = (0, react_1.useMemo)(() => previousName !== name || previousSound !== sound, [name, previousName, previousSound, sound]);
    const saveAction = (0, react_1.useCallback)((sound) => __awaiter(this, void 0, void 0, function* () {
        const soundData = (0, lib_1.createSoundData)(sound, name, { previousName, previousSound, _id, extension: sound.extension });
        const validation = (0, lib_1.validate)(soundData, sound);
        if (validation.length === 0) {
            let soundId;
            try {
                soundId = yield insertOrUpdateSound(soundData);
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
                return;
            }
            soundData._id = soundId;
            soundData.random = Math.round(Math.random() * 1000);
            if (sound && sound !== previousSound) {
                dispatchToastMessage({ type: 'success', message: t('Uploading_file') });
                const reader = new FileReader();
                reader.readAsBinaryString(sound);
                reader.onloadend = () => {
                    try {
                        uploadCustomSound(reader.result, sound.type, Object.assign(Object.assign({}, soundData), { _id: soundId }));
                        return dispatchToastMessage({ type: 'success', message: t('File_uploaded') });
                    }
                    catch (error) {
                        dispatchToastMessage({ type: 'error', message: error });
                    }
                };
            }
        }
        validation.forEach((invalidFieldName) => dispatchToastMessage({
            type: 'error',
            message: t('Required_field', { field: t(invalidFieldName) }),
        }));
    }), [_id, dispatchToastMessage, insertOrUpdateSound, name, previousName, previousSound, t, uploadCustomSound]);
    const handleSave = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        saveAction(sound);
        onChange();
    }), [saveAction, sound, onChange]);
    const handleDeleteButtonClick = (0, react_1.useCallback)(() => {
        const handleDelete = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield deleteCustomSound(_id);
                dispatchToastMessage({ type: 'success', message: t('Custom_Sound_Has_Been_Deleted') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
                close === null || close === void 0 ? void 0 : close();
                onChange();
            }
        });
        const handleCancel = () => setModal(null);
        setModal(() => ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: handleDelete, onCancel: handleCancel, onClose: handleCancel, confirmText: t('Delete'), children: t('Custom_Sound_Delete_Warning') })));
    }, [_id, close, deleteCustomSound, dispatchToastMessage, onChange, setModal, t]);
    const [clickUpload] = (0, useSingleFileInput_1.useSingleFileInput)(handleChangeFile, 'audio/mp3');
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { value: name, onChange: (e) => setName(e.currentTarget.value), placeholder: t('Name') }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { alignSelf: 'stretch', children: t('Sound_File_mp3') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', mbs: 'none', alignItems: 'center', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { secondary: true, small: true, icon: 'upload', onClick: clickUpload }), (sound === null || sound === void 0 ? void 0 : sound.name) || 'none'] }) })] })] })), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarFooter, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: close, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleSave, disabled: !hasUnsavedChanges, children: t('Save') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'trash', danger: true, onClick: handleDeleteButtonClick, children: t('Delete') }) }) })] })] }));
}
exports.default = EditSound;
