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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Skeleton_1 = require("./Skeleton");
const useLivechatTags_1 = require("./hooks/useLivechatTags");
const additionalForms_1 = require("../../views/omnichannel/additionalForms");
const Tags = ({ tags = [], handler, error, tagRequired, department }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data: tagsResult, isInitialLoading } = (0, useLivechatTags_1.useLivechatTags)({
        department,
        viewAll: !department,
    });
    const customTags = (0, react_1.useMemo)(() => {
        return tags.filter((tag) => !(tagsResult === null || tagsResult === void 0 ? void 0 : tagsResult.tags.find((rtag) => rtag.name === tag)));
    }, [tags, tagsResult === null || tagsResult === void 0 ? void 0 : tagsResult.tags]);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const [tagValue, handleTagValue] = (0, react_1.useState)('');
    const paginatedTagValue = (0, react_1.useMemo)(() => tags.map((tag) => ({ label: tag, value: tag })), [tags]);
    const removeTag = (tagToRemove) => {
        if (!tags)
            return;
        handler(tags.filter((tag) => tag !== tagToRemove));
    };
    const handleTagTextSubmit = (0, fuselage_hooks_1.useMutableCallback)(() => {
        if (!tags) {
            return;
        }
        if (!tagValue || tagValue.trim() === '') {
            dispatchToastMessage({ type: 'error', message: t('Enter_a_tag') });
            handleTagValue('');
            return;
        }
        if (tags.includes(tagValue)) {
            dispatchToastMessage({ type: 'error', message: t('Tag_already_exists') });
            return;
        }
        handler([...tags, tagValue]);
        handleTagValue('');
    });
    if (isInitialLoading) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {});
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: tagRequired, mb: 4, children: t('Tags') }), (tagsResult === null || tagsResult === void 0 ? void 0 : tagsResult.tags) && (tagsResult === null || tagsResult === void 0 ? void 0 : tagsResult.tags.length) ? ((0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(additionalForms_1.CurrentChatTags, { value: paginatedTagValue, handler: (tags) => {
                        handler(tags.map((tag) => tag.label));
                    }, department: department, viewAll: !department }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { error: error, value: tagValue, onChange: ({ currentTarget }) => handleTagValue(currentTarget.value), flexGrow: 1, placeholder: t('Enter_a_tag') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: !tagValue, mis: 8, title: t('Add'), onClick: handleTagTextSubmit, children: t('Add') })] }) })), customTags.length > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { justifyContent: 'flex-start', children: customTags === null || customTags === void 0 ? void 0 : customTags.map((tag, i) => ((0, jsx_runtime_1.jsx)(fuselage_1.Chip, { onClick: () => removeTag(tag), mie: 8, children: tag }, i))) }))] }));
};
exports.default = Tags;
