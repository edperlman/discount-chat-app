"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Content_1 = __importDefault(require("./Content"));
const Header_1 = __importDefault(require("./Header"));
const ListItem_1 = __importDefault(require("./ListItem"));
const Sidebar_1 = __importDefault(require("./Sidebar"));
const SidebarGenericItem_1 = __importDefault(require("./SidebarGenericItem"));
const SidebarItemsAssembler_1 = __importDefault(require("./SidebarItemsAssembler"));
const SidebarNavigationItem_1 = __importDefault(require("./SidebarNavigationItem"));
exports.default = Object.assign(Sidebar_1.default, {
    Content: Content_1.default,
    Header: Header_1.default,
    GenericItem: SidebarGenericItem_1.default,
    NavigationItem: SidebarNavigationItem_1.default,
    ItemsAssembler: SidebarItemsAssembler_1.default,
    ListItem: ListItem_1.default,
});
