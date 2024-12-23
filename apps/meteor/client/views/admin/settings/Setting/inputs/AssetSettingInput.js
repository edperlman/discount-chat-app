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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const random_1 = require("@rocket.chat/random");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
require("./AssetSettingInput.styles.css");
function AssetSettingInput({ _id, label, value, asset, required, disabled, fileConstraints }) {
    var _a;
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setAsset = (0, ui_contexts_1.useUpload)('/v1/assets.setAsset');
    const unsetAsset = (0, ui_contexts_1.useEndpoint)('POST', '/v1/assets.unsetAsset');
    const isDataTransferEvent = (event) => Boolean('dataTransfer' in event && event.dataTransfer.files);
    const handleUpload = (event) => {
        let { files } = event.target;
        if (!files || files.length === 0) {
            if (isDataTransferEvent(event)) {
                files = event.dataTransfer.files;
            }
        }
        Object.values(files !== null && files !== void 0 ? files : []).forEach((blob) => __awaiter(this, void 0, void 0, function* () {
            dispatchToastMessage({ type: 'info', message: t('Uploading_file') });
            const fileData = new FormData();
            fileData.append('asset', blob, blob.name);
            fileData.append('assetName', asset);
            try {
                yield setAsset(fileData);
            }
            catch (e) {
                dispatchToastMessage({ type: 'error', message: e });
            }
        }));
    };
    const handleDeleteButtonClick = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield unsetAsset({ assetName: asset });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: _id, title: _id, required: required, children: label }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsxs)("div", { className: 'settings-file-preview', children: [(value === null || value === void 0 ? void 0 : value.url) ? ((0, jsx_runtime_1.jsx)("div", { className: 'preview', style: { backgroundImage: `url(${value.url}?_dc=${random_1.Random.id()})` }, role: 'img', "aria-label": t('Asset_preview') })) : ((0, jsx_runtime_1.jsx)("div", { className: 'preview no-file background-transparent-light secondary-font-color', children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { size: 'x16', name: 'upload' }) })), (0, jsx_runtime_1.jsx)("div", { className: 'action', children: (value === null || value === void 0 ? void 0 : value.url) ? ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'trash', disabled: disabled, onClick: handleDeleteButtonClick, children: t('Delete') })) : ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: 'relative', className: `rcx-button rcx-button--primary ${disabled ? 'is-disabled' : ''}`, children: [t('Select_file'), (0, jsx_runtime_1.jsx)("input", { className: 'asset-setting-input__input', type: 'file', accept: `.${(_a = fileConstraints === null || fileConstraints === void 0 ? void 0 : fileConstraints.extensions) === null || _a === void 0 ? void 0 : _a.join(', .')}`, onChange: handleUpload, disabled: disabled })] })) })] }) })] }));
}
exports.default = AssetSettingInput;
