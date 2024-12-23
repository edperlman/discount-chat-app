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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useImagesList = void 0;
const base64_1 = require("@rocket.chat/base64");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const rocketchat_e2e_1 = require("../../../../../app/e2e/client/rocketchat.e2e");
const useScrollableRecordList_1 = require("../../../../hooks/lists/useScrollableRecordList");
const useComponentDidUpdate_1 = require("../../../../hooks/useComponentDidUpdate");
const ImagesList_1 = require("../../../../lib/lists/ImagesList");
const useImagesList = (options) => {
    const [filesList, setFilesList] = (0, react_1.useState)(() => new ImagesList_1.ImagesList(options));
    const reload = (0, react_1.useCallback)(() => setFilesList(new ImagesList_1.ImagesList(options)), [options]);
    (0, useComponentDidUpdate_1.useComponentDidUpdate)(() => {
        options && reload();
    }, [options, reload]);
    (0, react_1.useEffect)(() => {
        if (filesList.options !== options) {
            filesList.updateFilters(options);
        }
    }, [filesList, options]);
    const apiEndPoint = '/v1/rooms.images';
    const getFiles = (0, ui_contexts_1.useEndpoint)('GET', apiEndPoint);
    const fetchMessages = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const { files, total } = yield getFiles({
            roomId: options.roomId,
            startingFromId: options.startingFromId,
            offset: start,
            count: end,
        });
        const items = files.map((file) => (Object.assign(Object.assign({}, file), { uploadedAt: file.uploadedAt ? new Date(file.uploadedAt) : undefined, modifiedAt: file.modifiedAt ? new Date(file.modifiedAt) : undefined })));
        try {
            for (var _d = true, items_1 = __asyncValues(items), items_1_1; items_1_1 = yield items_1.next(), _a = items_1_1.done, !_a; _d = true) {
                _c = items_1_1.value;
                _d = false;
                const file = _c;
                if (file.rid && file.content) {
                    const e2eRoom = yield rocketchat_e2e_1.e2e.getInstanceByRoomId(file.rid);
                    if (e2eRoom === null || e2eRoom === void 0 ? void 0 : e2eRoom.shouldConvertReceivedMessages()) {
                        const decrypted = yield rocketchat_e2e_1.e2e.decryptFileContent(file);
                        const key = base64_1.Base64.encode(JSON.stringify(Object.assign(Object.assign({}, decrypted.encryption), { name: String.fromCharCode(...new TextEncoder().encode(decrypted.name)), type: decrypted.type })));
                        decrypted.path = `/file-decrypt${decrypted.path}?key=${key}`;
                        Object.assign(file, decrypted);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = items_1.return)) yield _b.call(items_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return {
            items,
            itemCount: total,
        };
    }), [getFiles, options.roomId, options.startingFromId]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableRecordList_1.useScrollableRecordList)(filesList, fetchMessages, 5);
    return {
        reload,
        filesList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useImagesList = useImagesList;
