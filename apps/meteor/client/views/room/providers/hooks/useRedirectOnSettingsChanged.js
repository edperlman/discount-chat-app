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
exports.useRedirectOnSettingsChanged = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../../app/ui-utils/client");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const routeNameToRoomTypeMap = {
    channel: 'c',
    group: 'p',
    direct: 'd',
    live: 'l',
};
const useRedirectOnSettingsChanged = (subscription) => {
    const router = (0, ui_contexts_1.useRouter)();
    const subExists = !!subscription;
    (0, react_1.useEffect)(() => {
        if (!subExists) {
            return;
        }
        const redirect = () => __awaiter(void 0, void 0, void 0, function* () {
            const routeConfig = roomCoordinator_1.roomCoordinator.getRoomDirectives(subscription.t).config.route;
            const channelName = router.getRouteParameters().name;
            const routeName = router.getRouteName();
            if (!(routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.path) || !routeName || !channelName) {
                return;
            }
            if (routeConfig.name === routeName && channelName === subscription.name) {
                return;
            }
            const routeRoomType = routeNameToRoomTypeMap[routeName];
            if (routeRoomType) {
                yield client_1.LegacyRoomManager.close(routeRoomType + routeName);
            }
            router.navigate({
                pattern: routeConfig.path,
                params: Object.assign(Object.assign({}, router.getRouteParameters()), { name: subscription.name }),
                search: router.getSearchParameters(),
            });
        });
        redirect();
    }, [subscription === null || subscription === void 0 ? void 0 : subscription.t, subscription === null || subscription === void 0 ? void 0 : subscription.name, router, subExists]);
};
exports.useRedirectOnSettingsChanged = useRedirectOnSettingsChanged;
