"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emitter_1 = require("@rocket.chat/emitter");
const dompurify_1 = __importDefault(require("dompurify"));
const SDKClient_1 = require("../../../../../app/utils/client/lib/SDKClient");
const OmnichannelRoomIconManager = new (class extends emitter_1.Emitter {
    constructor() {
        super();
        this.icons = new Map();
    }
    get(appId, icon) {
        if (!appId || !icon) {
            return;
        }
        if (this.icons.has(`${appId}-${icon}`)) {
            return `${appId}-${icon}`;
        }
        // TODO: update the apps icons to send JSON instead of a string. This will allow us to use APIClient.get()
        SDKClient_1.sdk.rest
            .send(`/apps/public/${appId}/get-sidebar-icon?icon=${icon}`, 'GET')
            .then((response) => {
            response.text().then((text) => {
                this.icons.set(`${appId}-${icon}`, dompurify_1.default.sanitize(text, {
                    FORBID_ATTR: ['id'],
                    NAMESPACE: 'http://www.w3.org/2000/svg',
                    USE_PROFILES: { svg: true, svgFilters: true },
                })
                    .replace(`<svg`, `<symbol id="${appId}-${icon}"`)
                    .replace(`</svg>`, '</symbol>'));
                this.emit('change');
                this.emit(`${appId}-${icon}`);
            });
        })
            .catch((error) => {
            console.error('error from get-sidebar-icon', error);
        });
    }
})();
exports.default = OmnichannelRoomIconManager;
