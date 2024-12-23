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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVideoConfList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const VideoConfRecordList_1 = require("./VideoConfRecordList");
const useScrollableRecordList_1 = require("../../../../../hooks/lists/useScrollableRecordList");
const useComponentDidUpdate_1 = require("../../../../../hooks/useComponentDidUpdate");
const useVideoConfList = (options) => {
    const getVideoConfs = (0, ui_contexts_1.useEndpoint)('GET', '/v1/video-conference.list');
    const [videoConfList, setVideoConfList] = (0, react_1.useState)(() => new VideoConfRecordList_1.VideoConfRecordList());
    const reload = (0, react_1.useCallback)(() => setVideoConfList(new VideoConfRecordList_1.VideoConfRecordList()), []);
    (0, useComponentDidUpdate_1.useComponentDidUpdate)(() => {
        options && reload();
    }, [options, reload]);
    const fetchData = (0, react_1.useCallback)((_start, _end) => __awaiter(void 0, void 0, void 0, function* () {
        const { data, total } = yield getVideoConfs({
            roomId: options.roomId,
        });
        return {
            items: data.map((videoConf) => (Object.assign(Object.assign({}, videoConf), { _updatedAt: new Date(videoConf._updatedAt), createdAt: new Date(videoConf.createdAt), endedAt: videoConf.endedAt ? new Date(videoConf.endedAt) : undefined }))),
            itemCount: total,
        };
    }), [getVideoConfs, options]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableRecordList_1.useScrollableRecordList)(videoConfList, fetchData);
    return {
        reload,
        videoConfList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useVideoConfList = useVideoConfList;
