"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnablePopupPreview = void 0;
const useEnablePopupPreview = (filter, popup) => popup && !popup.preview && ((popup === null || popup === void 0 ? void 0 : popup.triggerLength) ? typeof filter === 'string' && popup.triggerLength - 1 < filter.length : true);
exports.useEnablePopupPreview = useEnablePopupPreview;
